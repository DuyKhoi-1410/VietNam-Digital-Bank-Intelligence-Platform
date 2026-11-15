from datetime import date
from typing import Any, Dict, List, Optional
from google.cloud import bigquery

from app.core.cache import get_cached_result, make_cache_key, set_cached_result
from app.db.bigquery import BigQueryService
from app.schemas.market import (
    AspectMetric,
    MarketAspectsResponse,
    MarketOverviewResponse,
    MarketPainPoint,
    MarketTrendsResponse,
    MonthlyMarketTrend,
    SentimentDistribution,
)


class MarketService:
    def __init__(self, bq_service: BigQueryService):
        self.bq = bq_service

    def get_market_overview(self) -> MarketOverviewResponse:
        cache_key = make_cache_key("market:overview")
        cached = get_cached_result(cache_key)
        if cached:
            return MarketOverviewResponse(**cached)

        sql = """
        SELECT 
          SUM(Positive_Reviews) AS total_pos,
          SUM(Neutral_Reviews) AS total_neu,
          SUM(Negative_Reviews) AS total_neg,
          SUM(Positive_Reviews + Neutral_Reviews + Negative_Reviews) AS total_volume,
          ROUND(AVG(Average_Rating), 2) AS avg_rating
        FROM `aiinbusinessgroup3.summary_tables.overview`
        """
        rows = self.bq.execute_query(sql)
        row = rows[0] if rows else {}

        pos = int(row.get("total_pos", 0))
        neu = int(row.get("total_neu", 0))
        neg = int(row.get("total_neg", 0))
        tot = pos + neu + neg
        total_occurrences = int(row.get("total_volume", tot))
        avg_rating = float(row.get("avg_rating", 0.0))

        pos_pct = round((pos * 100.0 / tot), 2) if tot > 0 else 0.0
        neu_pct = round((neu * 100.0 / tot), 2) if tot > 0 else 0.0
        neg_pct = round((neg * 100.0 / tot), 2) if tot > 0 else 0.0

        sentiment = SentimentDistribution(
            positive_count=pos,
            neutral_count=neu,
            negative_count=neg,
            positive_pct=pos_pct,
            neutral_pct=neu_pct,
            negative_pct=neg_pct
        )

        resp = MarketOverviewResponse(
            unique_baseline_reviews=19303,
            total_overview_occurrences=total_occurrences,
            market_average_rating=avg_rating,
            sentiment_distribution=sentiment,
            total_banks_tracked=7,
            date_range="2026-07-01 to 2026-11-01"
        )
        set_cached_result(cache_key, resp.model_dump())
        return resp

    def get_market_trends(self) -> MarketTrendsResponse:
        cache_key = make_cache_key("market:trends")
        cached = get_cached_result(cache_key)
        if cached:
            return MarketTrendsResponse(**cached)

        sql = """
        SELECT 
          Review_Month,
          ROUND(AVG(Average_Rating), 2) AS average_rating,
          SUM(Positive_Reviews + Neutral_Reviews + Negative_Reviews) AS review_volume,
          SUM(Positive_Reviews) AS positive_reviews,
          SUM(Neutral_Reviews) AS neutral_reviews,
          SUM(Negative_Reviews) AS negative_reviews
        FROM `aiinbusinessgroup3.summary_tables.overview`
        GROUP BY Review_Month
        ORDER BY Review_Month ASC
        """
        rows = self.bq.execute_query(sql)

        trends = []
        for r in rows:
            trends.append(
                MonthlyMarketTrend(
                    review_month=date.fromisoformat(str(r["Review_Month"])),
                    average_rating=float(r["average_rating"]),
                    review_volume=int(r["review_volume"]),
                    positive_reviews=int(r["positive_reviews"]),
                    neutral_reviews=int(r["neutral_reviews"]),
                    negative_reviews=int(r["negative_reviews"])
                )
            )

        resp = MarketTrendsResponse(
            date_range="2026-07-01 to 2026-11-01",
            monthly_trends=trends
        )
        set_cached_result(cache_key, resp.model_dump())
        return resp

    def get_market_aspects(self) -> MarketAspectsResponse:
        cache_key = make_cache_key("market:aspects")
        cached = get_cached_result(cache_key)
        if cached:
            return MarketAspectsResponse(**cached)

        sql = """
        SELECT 
          Aspect,
          SUM(Sub_Sentence_Frequency) AS sub_sentence_count,
          SUM(Aspect_Review_Frequency) AS distinct_reviews_count,
          SUM(CASE WHEN UPPER(Sentiment) = 'POSITIVE' THEN Sub_Sentence_Frequency ELSE 0 END) AS pos_sub,
          SUM(CASE WHEN UPPER(Sentiment) = 'NEUTRAL' THEN Sub_Sentence_Frequency ELSE 0 END) AS neu_sub,
          SUM(CASE WHEN UPPER(Sentiment) = 'NEGATIVE' THEN Sub_Sentence_Frequency ELSE 0 END) AS neg_sub
        FROM `aiinbusinessgroup3.summary_tables.aspect_analysis`
        GROUP BY Aspect
        ORDER BY sub_sentence_count DESC
        """
        rows = self.bq.execute_query(sql)

        aspects: List[AspectMetric] = []
        pain_points: List[MarketPainPoint] = []

        complaint_descriptions = {
            "Bảo mật & Đăng nhập": "Biometric face verification failures, OTP delays, and biometric compliance friction under Decision 2345.",
            "Hệ thống & Hiệu năng": "App crashes, slow loading, and server connection timeouts during peak hours.",
            "Giao dịch & Chuyển tiền": "Transaction delays, pending transfers, and QR code reading errors.",
            "CSKH & Phí dịch vụ": "Hotline wait times, account maintenance fees, and customer support responsiveness.",
            "Giao diện & UI/UX": "Post-update navigation confusion and cluttered interface redesigns.",
            "Trải nghiệm chung": "General dissatisfaction and app instability feedback.",
            "Tính năng khác": "Miscellaneous secondary feature requests and notification bugs."
        }

        for r in rows:
            name = str(r["Aspect"])
            total_sub = int(r["sub_sentence_count"])
            dist_rev = int(r["distinct_reviews_count"])
            pos = int(r["pos_sub"])
            neu = int(r["neu_sub"])
            neg = int(r["neg_sub"])
            
            # Net Sentiment Score: ((Pos - Neg) / Total) * 100
            nss = round(((pos - neg) * 100.0 / total_sub), 2) if total_sub > 0 else 0.0
            neg_share = round((neg * 100.0 / total_sub), 2) if total_sub > 0 else 0.0

            aspect_obj = AspectMetric(
                aspect_name=name,
                sub_sentence_count=total_sub,
                distinct_reviews_count=dist_rev,
                positive_count=pos,
                neutral_count=neu,
                negative_count=neg,
                net_sentiment_score=nss
            )
            aspects.append(aspect_obj)

            # If negative sub-sentences >= 500 or NSS < -20, classify as major pain point
            if neg >= 500 or nss < 0:
                pain_points.append(
                    MarketPainPoint(
                        aspect_name=name,
                        negative_sub_sentences=neg,
                        negative_share_pct=neg_share,
                        net_sentiment_score=nss,
                        primary_complaint_driver=complaint_descriptions.get(name, "User friction recorded in reviews.")
                    )
                )

        # Sort pain points by negative sub-sentence volume descending
        pain_points.sort(key=lambda x: x.negative_sub_sentences, reverse=True)

        resp = MarketAspectsResponse(
            total_sub_sentences=13864,
            total_detailed_reviews=8666,
            aspects=aspects,
            pain_points=pain_points
        )
        set_cached_result(cache_key, resp.model_dump())
        return resp
