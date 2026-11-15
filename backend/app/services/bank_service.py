from typing import Any, Dict, List, Optional
from google.cloud import bigquery

from app.core.cache import get_cached_result, make_cache_key, set_cached_result
from app.db.bigquery import BigQueryService, BigQueryQueryError
from app.schemas.banks import (
    BankAspectScore,
    BankAspectsResponse,
    BankListItem,
    BankQuotesResponse,
    BankScorecard,
    BankVersionsResponse,
    VerbatimQuote,
    VersionPerformanceItem,
)


class BankService:
    def __init__(self, bq_service: BigQueryService):
        self.bq = bq_service

    def list_banks(self) -> List[BankListItem]:
        cache_key = make_cache_key("banks:list")
        cached = get_cached_result(cache_key)
        if cached:
            return [BankListItem(**item) for item in cached]

        sql = """
        SELECT 
          Bank,
          SUM(Positive_Reviews + Neutral_Reviews + Negative_Reviews) AS total_reviews,
          ROUND(AVG(Average_Rating), 2) AS average_rating,
          ROUND(SUM(Positive_Reviews) * 100.0 / SUM(Positive_Reviews + Neutral_Reviews + Negative_Reviews), 2) AS positive_ratio
        FROM `aiinbusinessgroup3.summary_tables.overview`
        GROUP BY Bank
        ORDER BY total_reviews DESC
        """
        rows = self.bq.execute_query(sql)
        items = []
        for r in rows:
            items.append(
                BankListItem(
                    bank_name=r["Bank"],
                    total_reviews=int(r["total_reviews"]),
                    average_rating=float(r["average_rating"]),
                    positive_ratio=float(r["positive_ratio"])
                )
            )
        set_cached_result(cache_key, [item.model_dump() for item in items])
        return items

    def get_bank_scorecard(self, bank_name: str) -> BankScorecard:
        cache_key = make_cache_key("banks:scorecard", {"bank": bank_name})
        cached = get_cached_result(cache_key)
        if cached:
            return BankScorecard(**cached)

        # 1. Overview aggregates and monthly trend
        sql_overview = """
        SELECT 
          Review_Month,
          Average_Rating,
          Positive_Reviews,
          Neutral_Reviews,
          Negative_Reviews,
          (Positive_Reviews + Neutral_Reviews + Negative_Reviews) as total_volume
        FROM `aiinbusinessgroup3.summary_tables.overview`
        WHERE Bank = @bank_name
        ORDER BY Review_Month ASC
        """
        params = [bigquery.ScalarQueryParameter("bank_name", "STRING", bank_name)]
        overview_rows = self.bq.execute_query(sql_overview, parameters=params)

        if not overview_rows:
            raise BigQueryQueryError(f"No records found for bank '{bank_name}'. Verified banks include 7 institutions.")

        total_pos = sum(int(r["Positive_Reviews"]) for r in overview_rows)
        total_neu = sum(int(r["Neutral_Reviews"]) for r in overview_rows)
        total_neg = sum(int(r["Negative_Reviews"]) for r in overview_rows)
        total_rev = total_pos + total_neu + total_neg
        overall_avg = round(sum(float(r["Average_Rating"]) for r in overview_rows) / len(overview_rows), 2)

        pos_pct = round((total_pos * 100.0 / total_rev), 2) if total_rev > 0 else 0.0
        neu_pct = round((total_neu * 100.0 / total_rev), 2) if total_rev > 0 else 0.0
        neg_pct = round((total_neg * 100.0 / total_rev), 2) if total_rev > 0 else 0.0

        monthly_ratings = []
        for r in overview_rows:
            monthly_ratings.append({
                "month": str(r["Review_Month"]),
                "average_rating": float(r["Average_Rating"]),
                "review_volume": int(r["total_volume"]),
                "positive": int(r["Positive_Reviews"]),
                "neutral": int(r["Neutral_Reviews"]),
                "negative": int(r["Negative_Reviews"])
            })

        # 2. Star ratings distribution from rating_analysis
        sql_ratings = """
        SELECT 
          Rating,
          SUM(Rating_Frequency) as freq
        FROM `aiinbusinessgroup3.summary_tables.rating_analysis`
        WHERE Bank = @bank_name
        GROUP BY Rating
        ORDER BY Rating ASC
        """
        rating_rows = self.bq.execute_query(sql_ratings, parameters=params)
        star_dict = {f"star_{i}": 0 for i in range(1, 6)}
        for r in rating_rows:
            star_dict[f"star_{int(r['Rating'])}"] = int(r["freq"])

        scorecard = BankScorecard(
            bank_name=bank_name,
            overall_average_rating=overall_avg,
            total_reviews=total_rev,
            star_rating_breakdown=star_dict,
            sentiment_counts={"positive": total_pos, "neutral": total_neu, "negative": total_neg},
            sentiment_percentages={"positive": pos_pct, "neutral": neu_pct, "negative": neg_pct},
            monthly_ratings=monthly_ratings
        )
        set_cached_result(cache_key, scorecard.model_dump())
        return scorecard

    def get_bank_aspects(self, bank_name: str) -> BankAspectsResponse:
        cache_key = make_cache_key("banks:aspects", {"bank": bank_name})
        cached = get_cached_result(cache_key)
        if cached:
            return BankAspectsResponse(**cached)

        sql = """
        SELECT 
          Aspect,
          SUM(Sub_Sentence_Frequency) as sub_sentence_count,
          SUM(Aspect_Review_Frequency) as distinct_review_count,
          SUM(CASE WHEN UPPER(Sentiment) = 'POSITIVE' THEN Sub_Sentence_Frequency ELSE 0 END) as pos_count,
          SUM(CASE WHEN UPPER(Sentiment) = 'NEUTRAL' THEN Sub_Sentence_Frequency ELSE 0 END) as neu_count,
          SUM(CASE WHEN UPPER(Sentiment) = 'NEGATIVE' THEN Sub_Sentence_Frequency ELSE 0 END) as neg_count
        FROM `aiinbusinessgroup3.summary_tables.aspect_analysis`
        WHERE Bank = @bank_name
        GROUP BY Aspect
        ORDER BY sub_sentence_count DESC
        """
        params = [bigquery.ScalarQueryParameter("bank_name", "STRING", bank_name)]
        rows = self.bq.execute_query(sql, parameters=params)

        total_bank_sub = sum(int(r["sub_sentence_count"]) for r in rows)

        aspect_scores = []
        for r in rows:
            sub_cnt = int(r["sub_sentence_count"])
            pos = int(r["pos_count"])
            neu = int(r["neu_count"])
            neg = int(r["neg_count"])
            nss = round(((pos - neg) * 100.0 / sub_cnt), 2) if sub_cnt > 0 else 0.0
            share = round((sub_cnt * 100.0 / total_bank_sub), 2) if total_bank_sub > 0 else 0.0

            aspect_scores.append(
                BankAspectScore(
                    aspect_name=str(r["Aspect"]),
                    sub_sentence_count=sub_cnt,
                    distinct_review_count=int(r["distinct_review_count"]),
                    positive_count=pos,
                    neutral_count=neu,
                    negative_count=neg,
                    net_sentiment_score=nss,
                    aspect_share_pct=share
                )
            )

        resp = BankAspectsResponse(
            bank_name=bank_name,
            bank_total_sub_sentences=total_bank_sub,
            aspects=aspect_scores
        )
        set_cached_result(cache_key, resp.model_dump())
        return resp

    def get_bank_versions(self, bank_name: str) -> BankVersionsResponse:
        cache_key = make_cache_key("banks:versions", {"bank": bank_name})
        cached = get_cached_result(cache_key)
        if cached:
            return BankVersionsResponse(**cached)

        sql = """
        SELECT 
          App_Version,
          Rating,
          SUM(Rating_Frequency) as freq
        FROM `aiinbusinessgroup3.summary_tables.rating_analysis`
        WHERE Bank = @bank_name
        GROUP BY App_Version, Rating
        ORDER BY App_Version ASC, Rating ASC
        """
        params = [bigquery.ScalarQueryParameter("bank_name", "STRING", bank_name)]
        rows = self.bq.execute_query(sql, parameters=params)

        # Aggregate by App_Version
        version_data: Dict[str, Dict[str, Any]] = {}
        for r in rows:
            ver = str(r["App_Version"])
            rating = int(r["Rating"])
            freq = int(r["freq"])
            if ver not in version_data:
                version_data[ver] = {"stars": {f"star_{i}": 0 for i in range(1, 6)}, "total": 0, "rating_sum": 0}
            version_data[ver]["stars"][f"star_{rating}"] += freq
            version_data[ver]["total"] += freq
            version_data[ver]["rating_sum"] += (rating * freq)

        bank_total_versioned = sum(v["total"] for v in version_data.values())

        version_items = []
        for ver, data in version_data.items():
            tot = data["total"]
            avg = round(data["rating_sum"] / tot, 2) if tot > 0 else 0.0
            share = round((tot * 100.0 / bank_total_versioned), 2) if bank_total_versioned > 0 else 0.0
            version_items.append(
                VersionPerformanceItem(
                    app_version=ver,
                    review_count=tot,
                    version_share_pct=share,
                    star_breakdown=data["stars"],
                    average_rating=avg
                )
            )

        # Sort versions by review volume descending
        version_items.sort(key=lambda x: x.review_count, reverse=True)

        resp = BankVersionsResponse(
            bank_name=bank_name,
            total_versioned_reviews=bank_total_versioned,
            market_versioned_denominator=16017,
            versions=version_items
        )
        set_cached_result(cache_key, resp.model_dump())
        return resp

    def get_bank_quotes(
        self,
        bank_name: str,
        aspect: Optional[str] = None,
        sentiment: Optional[str] = None,
        limit: int = 20
    ) -> BankQuotesResponse:
        capped_limit = min(max(1, limit), 100)
        
        # Build parameterized query
        conditions = ["Bank = @bank_name"]
        params = [
            bigquery.ScalarQueryParameter("bank_name", "STRING", bank_name),
            bigquery.ScalarQueryParameter("limit_num", "INT64", capped_limit)
        ]

        if aspect:
            conditions.append("Aspect = @aspect")
            params.append(bigquery.ScalarQueryParameter("aspect", "STRING", aspect))

        if sentiment:
            conditions.append("UPPER(Sentiment) = @sentiment")
            params.append(bigquery.ScalarQueryParameter("sentiment", "STRING", sentiment.strip().upper()))

        where_clause = " AND ".join(conditions)
        sql = f"""
        SELECT 
          sub_id,
          review_id,
          User,
          CAST(Rating AS INT64) as rating,
          Sub_sentence,
          Aspect,
          UPPER(Sentiment) as sentiment
        FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews`
        WHERE {where_clause}
        LIMIT @limit_num
        """
        rows = self.bq.execute_query(sql, parameters=params)

        quotes = []
        for r in rows:
            quotes.append(
                VerbatimQuote(
                    sub_id=str(r["sub_id"]),
                    review_id=str(r["review_id"]),
                    user=str(r["User"]),
                    rating=int(r["rating"]) if r.get("rating") is not None else 1,
                    sub_sentence=str(r["Sub_sentence"]),
                    aspect=str(r["Aspect"]),
                    sentiment=str(r["sentiment"])
                )
            )

        return BankQuotesResponse(
            bank_name=bank_name,
            aspect=aspect or "Tất cả khía cạnh",
            sentiment_filter=sentiment,
            total_returned=len(quotes),
            quotes=quotes
        )
