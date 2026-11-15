from datetime import date
import math
from typing import Any, Dict, List, Optional
from google.cloud import bigquery

from app.core.cache import get_cached_result, make_cache_key, set_cached_result
from app.db.bigquery import BigQueryService, BigQueryQueryError
from app.schemas.reviews import (
    FilterOptionsResponse,
    PaginatedReviewsResponse,
    ReviewDetailResponse,
    ReviewItem,
    ReviewSubSentenceDetail,
    SentimentProbabilities,
)


class ReviewService:
    def __init__(self, bq_service: BigQueryService):
        self.bq = bq_service

    def search_reviews(
        self,
        bank: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        rating: Optional[int] = None,
        sentiment: Optional[str] = None,
        aspect: Optional[str] = None,
        app_version: Optional[str] = None,
        keyword: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> PaginatedReviewsResponse:
        current_page = max(1, page)
        limit = min(max(1, page_size), 100)
        offset = (current_page - 1) * limit

        # Base conditions and parameters
        conditions = ["1=1"]
        params: List[bigquery.ScalarQueryParameter] = []

        if bank:
            conditions.append("r.Bank = @bank")
            params.append(bigquery.ScalarQueryParameter("bank", "STRING", bank))

        if start_date:
            conditions.append("DATE(r.Time) >= @start_date")
            params.append(bigquery.ScalarQueryParameter("start_date", "DATE", start_date))

        if end_date:
            conditions.append("DATE(r.Time) <= @end_date")
            params.append(bigquery.ScalarQueryParameter("end_date", "DATE", end_date))

        if rating:
            conditions.append("r.Rating = @rating")
            params.append(bigquery.ScalarQueryParameter("rating", "INT64", rating))

        if sentiment:
            conditions.append("UPPER(r.Sentiment_Label) = @sentiment")
            params.append(bigquery.ScalarQueryParameter("sentiment", "STRING", sentiment.strip().upper()))

        if app_version:
            if app_version.strip().lower() in ("not specified", "null", "none"):
                conditions.append("r.App_Version IS NULL")
            else:
                conditions.append("r.App_Version = @app_version")
                params.append(bigquery.ScalarQueryParameter("app_version", "STRING", app_version))

        if keyword and keyword.strip():
            conditions.append("LOWER(r.Comment) LIKE CONCAT('%', LOWER(@keyword), '%')")
            params.append(bigquery.ScalarQueryParameter("keyword", "STRING", keyword.strip()))

        if aspect and aspect.strip():
            conditions.append(
                "EXISTS (SELECT 1 FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews` a WHERE a.review_id = r.ID AND a.Aspect = @aspect)"
            )
            params.append(bigquery.ScalarQueryParameter("aspect", "STRING", aspect.strip()))

        where_clause = " AND ".join(conditions)

        # 1. Count total matching reviews using validated deduplication window
        count_sql = f"""
        WITH deduplicated AS (
          SELECT 
            r.ID,
            ROW_NUMBER() OVER(PARTITION BY r.ID ORDER BY r.Word_Count ASC, r.Time DESC) as rn
          FROM `aiinbusinessgroup3.bank_reviews.all_reviews` r
          WHERE {where_clause}
        )
        SELECT COUNT(*) as total_count FROM deduplicated WHERE rn = 1
        """
        count_rows = self.bq.execute_query(count_sql, parameters=params)
        total_items = int(count_rows[0]["total_count"]) if count_rows else 0
        total_pages = math.ceil(total_items / limit) if total_items > 0 else 0

        # 2. Fetch paginated records
        fetch_params = list(params)
        fetch_params.append(bigquery.ScalarQueryParameter("limit_num", "INT64", limit))
        fetch_params.append(bigquery.ScalarQueryParameter("offset_num", "INT64", offset))

        data_sql = f"""
        WITH deduplicated AS (
          SELECT 
            r.ID, r.Bank, r.User, r.Rating, r.Time, r.Comment, r.Clean_Comment,
            r.Likes, r.App_Version, r.Word_Count, r.Sentiment_Label,
            r.Prob_POSITIVE, r.Prob_NEGATIVE, r.Prob_NEUTRAL,
            ROW_NUMBER() OVER(PARTITION BY r.ID ORDER BY r.Word_Count ASC, r.Time DESC) as rn
          FROM `aiinbusinessgroup3.bank_reviews.all_reviews` r
          WHERE {where_clause}
        )
        SELECT * EXCEPT(rn)
        FROM deduplicated
        WHERE rn = 1
        ORDER BY Time DESC
        LIMIT @limit_num OFFSET @offset_num
        """
        rows = self.bq.execute_query(data_sql, parameters=fetch_params)

        review_items: List[ReviewItem] = []
        for r in rows:
            wc = int(r["Word_Count"]) if r.get("Word_Count") is not None else 0
            review_items.append(
                ReviewItem(
                    id=str(r["ID"]),
                    bank=str(r["Bank"]),
                    user=str(r.get("User") or "Anonymous"),
                    rating=int(r["Rating"]),
                    time=str(r["Time"]),
                    comment=str(r["Comment"]),
                    clean_comment=str(r.get("Clean_Comment")) if r.get("Clean_Comment") is not None else None,
                    word_count=wc,
                    likes=int(r.get("Likes") or 0),
                    app_version=str(r["App_Version"]) if r.get("App_Version") is not None else "Not specified",
                    sentiment_label=str(r["Sentiment_Label"]).upper(),
                    probabilities=SentimentProbabilities(
                        positive=float(r.get("Prob_POSITIVE") or 0.0),
                        neutral=float(r.get("Prob_NEUTRAL") or 0.0),
                        negative=float(r.get("Prob_NEGATIVE") or 0.0)
                    ),
                    is_long_review=(wc >= 4)
                )
            )

        return PaginatedReviewsResponse(
            page=current_page,
            page_size=limit,
            total_items=total_items,
            total_pages=total_pages,
            unique_baseline=19303,
            reviews=review_items
        )

    def get_review_detail(self, review_id: str) -> ReviewDetailResponse:
        # 1. Fetch single deduplicated review
        sql_review = """
        WITH deduplicated AS (
          SELECT 
            ID, Bank, User, Rating, Time, Comment, Clean_Comment,
            Likes, App_Version, Word_Count, Sentiment_Label,
            Prob_POSITIVE, Prob_NEGATIVE, Prob_NEUTRAL,
            ROW_NUMBER() OVER(PARTITION BY ID ORDER BY Word_Count ASC, Time DESC) as rn
          FROM `aiinbusinessgroup3.bank_reviews.all_reviews`
          WHERE ID = @review_id
        )
        SELECT * EXCEPT(rn) FROM deduplicated WHERE rn = 1
        """
        params = [bigquery.ScalarQueryParameter("review_id", "STRING", review_id)]
        rows = self.bq.execute_query(sql_review, parameters=params)

        if not rows:
            raise BigQueryQueryError(f"Review with ID '{review_id}' was not found in bank_reviews.all_reviews.")

        r = rows[0]
        wc = int(r["Word_Count"]) if r.get("Word_Count") is not None else 0
        review_item = ReviewItem(
            id=str(r["ID"]),
            bank=str(r["Bank"]),
            user=str(r.get("User") or "Anonymous"),
            rating=int(r["Rating"]),
            time=str(r["Time"]),
            comment=str(r["Comment"]),
            clean_comment=str(r.get("Clean_Comment")) if r.get("Clean_Comment") is not None else None,
            word_count=wc,
            likes=int(r.get("Likes") or 0),
            app_version=str(r["App_Version"]) if r.get("App_Version") is not None else "Not specified",
            sentiment_label=str(r["Sentiment_Label"]).upper(),
            probabilities=SentimentProbabilities(
                positive=float(r.get("Prob_POSITIVE") or 0.0),
                neutral=float(r.get("Prob_NEUTRAL") or 0.0),
                negative=float(r.get("Prob_NEGATIVE") or 0.0)
            ),
            is_long_review=(wc >= 4)
        )

        # 2. Fetch ABSA sub-sentences if long review
        sub_sentences: List[ReviewSubSentenceDetail] = []
        if wc >= 4:
            sql_sub = """
            SELECT 
              sub_id, Sub_sentence, Aspect, UPPER(Sentiment) as sentiment
            FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews`
            WHERE review_id = @review_id
            ORDER BY sub_id ASC
            """
            sub_rows = self.bq.execute_query(sql_sub, parameters=params)
            for s in sub_rows:
                sub_sentences.append(
                    ReviewSubSentenceDetail(
                        sub_id=str(s["sub_id"]),
                        sub_sentence=str(s["Sub_sentence"]),
                        aspect=str(s["Aspect"]),
                        sentiment=str(s["sentiment"])
                    )
                )

        return ReviewDetailResponse(
            review=review_item,
            sub_sentences=sub_sentences
        )

    def get_filter_options(self) -> FilterOptionsResponse:
        cache_key = make_cache_key("reviews:filters")
        cached = get_cached_result(cache_key)
        if cached:
            return FilterOptionsResponse(**cached)

        # 1. Distinct banks
        banks = [
            r["Bank"] for r in self.bq.execute_query(
                "SELECT DISTINCT Bank FROM `aiinbusinessgroup3.summary_tables.overview` ORDER BY Bank ASC"
            )
        ]

        # 2. Distinct genuine aspects from summary_tables.aspect_analysis
        aspects = [
            r["Aspect"] for r in self.bq.execute_query(
                "SELECT DISTINCT Aspect FROM `aiinbusinessgroup3.summary_tables.aspect_analysis` WHERE Aspect IS NOT NULL ORDER BY Aspect ASC"
            )
        ]

        # 3. Distinct versions from rating_analysis
        versions_raw = [
            r["App_Version"] for r in self.bq.execute_query(
                "SELECT DISTINCT App_Version FROM `aiinbusinessgroup3.summary_tables.rating_analysis` WHERE App_Version IS NOT NULL ORDER BY App_Version DESC"
            )
        ]
        versions = ["Not specified"] + versions_raw

        # 4. Date range from all_reviews
        dates = self.bq.execute_query(
            "SELECT MIN(DATE(Time)) as min_date, MAX(DATE(Time)) as max_date FROM `aiinbusinessgroup3.bank_reviews.all_reviews`"
        )[0]

        resp = FilterOptionsResponse(
            banks=banks,
            ratings=[1, 2, 3, 4, 5],
            sentiments=["POSITIVE", "NEUTRAL", "NEGATIVE"],
            genuine_aspects=aspects,
            app_versions=versions,
            min_date=date.fromisoformat(str(dates["min_date"])),
            max_date=date.fromisoformat(str(dates["max_date"]))
        )
        set_cached_result(cache_key, resp.model_dump())
        return resp
