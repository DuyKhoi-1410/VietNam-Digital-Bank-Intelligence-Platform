from typing import Any, Dict, List, Optional
from google.cloud import bigquery

from app.core.cache import get_cached_result, make_cache_key, set_cached_result
from app.db.bigquery import BigQueryService
from app.schemas.benchmark import (
    AspectBenchmarkCell,
    AspectBenchmarkRow,
    AspectBenchmarkResponse,
    BankComparisonEntry,
    BenchmarkGapInsight,
    BenchmarkMatrixResponse,
    RatingBenchmarkResponse,
    RatingDistributionEntry,
)


class BenchmarkService:
    def __init__(self, bq_service: BigQueryService):
        self.bq = bq_service

    def get_benchmark_matrix(self, bank_names: Optional[List[str]] = None) -> BenchmarkMatrixResponse:
        cache_key = make_cache_key("benchmark:matrix", {"banks": sorted(bank_names) if bank_names else "all"})
        cached = get_cached_result(cache_key)
        if cached:
            return BenchmarkMatrixResponse(**cached)

        # 1. Overview metrics per bank
        sql_overview = """
        SELECT 
          Bank,
          ROUND(AVG(Average_Rating), 2) AS avg_rating,
          SUM(Positive_Reviews + Neutral_Reviews + Negative_Reviews) AS total_reviews,
          SUM(Positive_Reviews) AS total_pos,
          SUM(Neutral_Reviews) AS total_neu,
          SUM(Negative_Reviews) AS total_neg
        FROM `aiinbusinessgroup3.summary_tables.overview`
        GROUP BY Bank
        ORDER BY avg_rating DESC
        """
        overview_rows = self.bq.execute_query(sql_overview)

        # 2. Aspect Net Sentiment Scores per bank to derive empirical strengths and weaknesses
        sql_aspects = """
        SELECT 
          Bank,
          Aspect,
          SUM(Sub_Sentence_Frequency) AS total_sub,
          SUM(CASE WHEN UPPER(Sentiment) = 'POSITIVE' THEN Sub_Sentence_Frequency ELSE 0 END) AS pos_sub,
          SUM(CASE WHEN UPPER(Sentiment) = 'NEGATIVE' THEN Sub_Sentence_Frequency ELSE 0 END) AS neg_sub
        FROM `aiinbusinessgroup3.summary_tables.aspect_analysis`
        GROUP BY Bank, Aspect
        """
        aspect_rows = self.bq.execute_query(sql_aspects)

        bank_aspect_map: Dict[str, List[Dict[str, Any]]] = {}
        for r in aspect_rows:
            b = str(r["Bank"])
            tot = int(r["total_sub"])
            pos = int(r["pos_sub"])
            neg = int(r["neg_sub"])
            nss = round(((pos - neg) * 100.0 / tot), 2) if tot > 0 else 0.0
            if b not in bank_aspect_map:
                bank_aspect_map[b] = []
            bank_aspect_map[b].append({"aspect": str(r["Aspect"]), "nss": nss, "total": tot})

        # Filter by selected banks if requested
        filter_set = set(bank_names) if bank_names else None
        matrix_entries: List[BankComparisonEntry] = []

        for r in overview_rows:
            b = str(r["Bank"])
            if filter_set and b not in filter_set:
                continue

            tot_rev = int(r["total_reviews"])
            pos = int(r["total_pos"])
            neu = int(r["total_neu"])
            neg = int(r["total_neg"])
            pos_pct = round((pos * 100.0 / tot_rev), 2) if tot_rev > 0 else 0.0
            neu_pct = round((neu * 100.0 / tot_rev), 2) if tot_rev > 0 else 0.0
            neg_pct = round((neg * 100.0 / tot_rev), 2) if tot_rev > 0 else 0.0

            aspects = bank_aspect_map.get(b, [])
            if aspects:
                best_aspect = max(aspects, key=lambda x: x["nss"])
                weakest_aspect = min(aspects, key=lambda x: x["nss"])
                strength_name = best_aspect["aspect"]
                strength_nss = best_aspect["nss"]
                weakness_name = weakest_aspect["aspect"]
                weakness_nss = weakest_aspect["nss"]
            else:
                strength_name, strength_nss = "N/A", 0.0
                weakness_name, weakness_nss = "N/A", 0.0

            matrix_entries.append(
                BankComparisonEntry(
                    bank_name=b,
                    total_reviews=tot_rev,
                    average_rating=float(r["avg_rating"]),
                    positive_pct=pos_pct,
                    neutral_pct=neu_pct,
                    negative_pct=neg_pct,
                    top_strength_aspect=strength_name,
                    top_strength_nss=strength_nss,
                    top_weakness_aspect=weakness_name,
                    top_weakness_nss=weakness_nss
                )
            )

        # Derive empirical key gaps
        key_gaps: List[BenchmarkGapInsight] = []
        if len(matrix_entries) >= 2:
            sorted_by_rating = sorted(matrix_entries, key=lambda x: x.average_rating, reverse=True)
            leader_r = sorted_by_rating[0]
            laggard_r = sorted_by_rating[-1]
            gap_rating = round(leader_r.average_rating - laggard_r.average_rating, 2)
            key_gaps.append(
                BenchmarkGapInsight(
                    metric_name="Average App Rating Gap",
                    leader_bank=leader_r.bank_name,
                    leader_value=leader_r.average_rating,
                    laggard_bank=laggard_r.bank_name,
                    laggard_value=laggard_r.average_rating,
                    gap_value=gap_rating,
                    description=f"{leader_r.bank_name} leads {laggard_r.bank_name} by a rating delta of {gap_rating} stars."
                )
            )

            sorted_by_pos = sorted(matrix_entries, key=lambda x: x.positive_pct, reverse=True)
            leader_p = sorted_by_pos[0]
            laggard_p = sorted_by_pos[-1]
            gap_pos = round(leader_p.positive_pct - laggard_p.positive_pct, 2)
            key_gaps.append(
                BenchmarkGapInsight(
                    metric_name="Positive Sentiment Share Gap",
                    leader_bank=leader_p.bank_name,
                    leader_value=leader_p.positive_pct,
                    laggard_bank=laggard_p.bank_name,
                    laggard_value=laggard_p.positive_pct,
                    gap_value=gap_pos,
                    description=f"{leader_p.bank_name} has a {gap_pos}% higher positive review ratio than {laggard_p.bank_name}."
                )
            )

        resp = BenchmarkMatrixResponse(
            selected_banks=[e.bank_name for e in matrix_entries],
            matrix=matrix_entries,
            key_gaps=key_gaps
        )
        set_cached_result(cache_key, resp.model_dump())
        return resp

    def get_aspect_benchmark(self, bank_names: Optional[List[str]] = None) -> AspectBenchmarkResponse:
        cache_key = make_cache_key("benchmark:aspects", {"banks": sorted(bank_names) if bank_names else "all"})
        cached = get_cached_result(cache_key)
        if cached:
            return AspectBenchmarkResponse(**cached)

        sql = """
        SELECT 
          Aspect,
          Bank,
          SUM(Sub_Sentence_Frequency) AS total_sub,
          SUM(CASE WHEN UPPER(Sentiment) = 'POSITIVE' THEN Sub_Sentence_Frequency ELSE 0 END) AS pos_sub,
          SUM(CASE WHEN UPPER(Sentiment) = 'NEGATIVE' THEN Sub_Sentence_Frequency ELSE 0 END) AS neg_sub
        FROM `aiinbusinessgroup3.summary_tables.aspect_analysis`
        GROUP BY Aspect, Bank
        ORDER BY Aspect ASC, total_sub DESC
        """
        rows = self.bq.execute_query(sql)

        filter_set = set(bank_names) if bank_names else None
        aspect_grouped: Dict[str, List[AspectBenchmarkCell]] = {}
        aspect_totals: Dict[str, Dict[str, int]] = {}

        for r in rows:
            asp = str(r["Aspect"])
            b = str(r["Bank"])
            tot = int(r["total_sub"])
            pos = int(r["pos_sub"])
            neg = int(r["neg_sub"])
            nss = round(((pos - neg) * 100.0 / tot), 2) if tot > 0 else 0.0

            if asp not in aspect_totals:
                aspect_totals[asp] = {"pos": 0, "neg": 0, "tot": 0}
            aspect_totals[asp]["pos"] += pos
            aspect_totals[asp]["neg"] += neg
            aspect_totals[asp]["tot"] += tot

            if filter_set and b not in filter_set:
                continue

            if asp not in aspect_grouped:
                aspect_grouped[asp] = []
            aspect_grouped[asp].append(
                AspectBenchmarkCell(
                    bank_name=b,
                    sub_sentence_count=tot,
                    net_sentiment_score=nss,
                    positive_count=pos,
                    negative_count=neg
                )
            )

        benchmark_rows = []
        for asp, cells in aspect_grouped.items():
            tot_data = aspect_totals.get(asp, {"pos": 0, "neg": 0, "tot": 0})
            m_tot = tot_data["tot"]
            m_nss = round(((tot_data["pos"] - tot_data["neg"]) * 100.0 / m_tot), 2) if m_tot > 0 else 0.0
            benchmark_rows.append(
                AspectBenchmarkRow(
                    aspect_name=asp,
                    market_average_nss=m_nss,
                    bank_scores=cells
                )
            )

        resp = AspectBenchmarkResponse(aspect_matrix=benchmark_rows)
        set_cached_result(cache_key, resp.model_dump())
        return resp

    def get_rating_benchmark(self, bank_names: Optional[List[str]] = None) -> RatingBenchmarkResponse:
        cache_key = make_cache_key("benchmark:ratings", {"banks": sorted(bank_names) if bank_names else "all"})
        cached = get_cached_result(cache_key)
        if cached:
            return RatingBenchmarkResponse(**cached)

        sql = """
        SELECT 
          Bank,
          Rating,
          SUM(Rating_Frequency) AS freq
        FROM `aiinbusinessgroup3.summary_tables.rating_analysis`
        GROUP BY Bank, Rating
        ORDER BY Bank ASC, Rating ASC
        """
        rows = self.bq.execute_query(sql)

        filter_set = set(bank_names) if bank_names else None
        bank_ratings: Dict[str, Dict[int, int]] = {}

        for r in rows:
            b = str(r["Bank"])
            if filter_set and b not in filter_set:
                continue
            rating = int(r["Rating"])
            freq = int(r["freq"])
            if b not in bank_ratings:
                bank_ratings[b] = {i: 0 for i in range(1, 6)}
            bank_ratings[b][rating] += freq

        entries = []
        for b, dist in bank_ratings.items():
            tot = sum(dist.values())
            entries.append(
                RatingDistributionEntry(
                    bank_name=b,
                    total_rated_reviews=tot,
                    star_1_pct=round((dist[1] * 100.0 / tot), 2) if tot > 0 else 0.0,
                    star_2_pct=round((dist[2] * 100.0 / tot), 2) if tot > 0 else 0.0,
                    star_3_pct=round((dist[3] * 100.0 / tot), 2) if tot > 0 else 0.0,
                    star_4_pct=round((dist[4] * 100.0 / tot), 2) if tot > 0 else 0.0,
                    star_5_pct=round((dist[5] * 100.0 / tot), 2) if tot > 0 else 0.0,
                )
            )

        resp = RatingBenchmarkResponse(rating_distributions=entries)
        set_cached_result(cache_key, resp.model_dump())
        return resp
