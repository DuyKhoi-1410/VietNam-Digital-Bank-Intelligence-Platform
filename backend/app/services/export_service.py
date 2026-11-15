import csv
from datetime import datetime
import io
from typing import Any, Dict, Generator, List, Optional
from google.cloud import bigquery

from app.db.bigquery import BigQueryService, BigQueryQueryError
from app.schemas.reports import ExportDatasetType


class ExportService:
    def __init__(self, bq_service: BigQueryService):
        self.bq = bq_service

    def export_summary_table(
        self,
        dataset_type: ExportDatasetType,
        as_csv: bool = True
    ) -> tuple[str, str, int]:
        """
        Exports analytical data mart tables from summary_tables.
        Returns: (content_str, filename, row_count)
        """
        valid_tables = {
            ExportDatasetType.OVERVIEW: "overview",
            ExportDatasetType.ASPECT_ANALYSIS: "aspect_analysis",
            ExportDatasetType.RATING_ANALYSIS: "rating_analysis",
            ExportDatasetType.SENTIMENT_ANALYSIS: "sentiment_analysis"
        }

        table_name = valid_tables.get(dataset_type)
        if not table_name:
            raise BigQueryQueryError(f"Dataset type '{dataset_type}' is not an exportable summary table.")

        sql = f"SELECT * FROM `aiinbusinessgroup3.summary_tables.{table_name}`"
        rows = self.bq.execute_query(sql)

        timestamp_str = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        if as_csv:
            filename = f"vdbi_{table_name}_{timestamp_str}.csv"
            output = io.StringIO()
            if rows:
                headers = list(rows[0].keys())
                writer = csv.DictWriter(output, fieldnames=headers)
                writer.writeheader()
                writer.writerows(rows)
            return output.getvalue(), filename, len(rows)
        else:
            import json
            filename = f"vdbi_{table_name}_{timestamp_str}.json"
            return json.dumps(rows, indent=2, ensure_ascii=False), filename, len(rows)

    def export_filtered_reviews(
        self,
        bank: Optional[str] = None,
        rating: Optional[int] = None,
        sentiment: Optional[str] = None,
        aspect: Optional[str] = None,
        limit: int = 5000,
        as_csv: bool = True
    ) -> tuple[str, str, int]:
        """
        Exports deduplicated filtered reviews with strict row safety limits (max 10,000).
        Returns: (content_str, filename, row_count)
        """
        capped_limit = min(max(1, limit), 10000)

        conditions = ["1=1"]
        params: List[bigquery.ScalarQueryParameter] = [
            bigquery.ScalarQueryParameter("limit_num", "INT64", capped_limit)
        ]

        if bank:
            conditions.append("r.Bank = @bank")
            params.append(bigquery.ScalarQueryParameter("bank", "STRING", bank))

        if rating:
            conditions.append("r.Rating = @rating")
            params.append(bigquery.ScalarQueryParameter("rating", "INT64", rating))

        if sentiment:
            conditions.append("UPPER(r.Sentiment_Label) = @sentiment")
            params.append(bigquery.ScalarQueryParameter("sentiment", "STRING", sentiment.strip().upper()))

        if aspect:
            conditions.append(
                "EXISTS (SELECT 1 FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews` a WHERE a.review_id = r.ID AND a.Aspect = @aspect)"
            )
            params.append(bigquery.ScalarQueryParameter("aspect", "STRING", aspect.strip()))

        where_clause = " AND ".join(conditions)

        sql = f"""
        WITH deduplicated AS (
          SELECT 
            r.ID, r.Bank, r.User, r.Rating, r.Time, r.Comment, r.Likes,
            COALESCE(r.App_Version, 'Not specified') AS App_Version,
            r.Word_Count, r.Sentiment_Label,
            r.Prob_POSITIVE, r.Prob_NEGATIVE, r.Prob_NEUTRAL,
            ROW_NUMBER() OVER(PARTITION BY r.ID ORDER BY r.Word_Count ASC, r.Time DESC) as rn
          FROM `aiinbusinessgroup3.bank_reviews.all_reviews` r
          WHERE {where_clause}
        )
        SELECT 
          ID, Bank, User, Rating, Time, Comment, Likes, App_Version, Word_Count, Sentiment_Label,
          Prob_POSITIVE, Prob_NEGATIVE, Prob_NEUTRAL
        FROM deduplicated
        WHERE rn = 1
        ORDER BY Time DESC
        LIMIT @limit_num
        """
        rows = self.bq.execute_query(sql, parameters=params)

        timestamp_str = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        if as_csv:
            filename = f"vdbi_filtered_reviews_{timestamp_str}.csv"
            output = io.StringIO()
            if rows:
                headers = list(rows[0].keys())
                writer = csv.DictWriter(output, fieldnames=headers)
                writer.writeheader()
                writer.writerows(rows)
            return output.getvalue(), filename, len(rows)
        else:
            import json
            filename = f"vdbi_filtered_reviews_{timestamp_str}.json"
            return json.dumps(rows, indent=2, ensure_ascii=False), filename, len(rows)
