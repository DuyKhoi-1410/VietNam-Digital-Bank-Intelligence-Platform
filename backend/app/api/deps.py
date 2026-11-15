from fastapi import Depends
from app.db.bigquery import BigQueryService, bigquery_service
from app.services.market_service import MarketService
from app.services.bank_service import BankService
from app.services.benchmark_service import BenchmarkService
from app.services.review_service import ReviewService
from app.services.export_service import ExportService


def get_bigquery_service() -> BigQueryService:
    """Dependency provider returning the BigQuery service singleton."""
    return bigquery_service


def get_market_service(bq: BigQueryService = Depends(get_bigquery_service)) -> MarketService:
    return MarketService(bq)


def get_bank_service(bq: BigQueryService = Depends(get_bigquery_service)) -> BankService:
    return BankService(bq)


def get_benchmark_service(bq: BigQueryService = Depends(get_bigquery_service)) -> BenchmarkService:
    return BenchmarkService(bq)


def get_review_service(bq: BigQueryService = Depends(get_bigquery_service)) -> ReviewService:
    return ReviewService(bq)


def get_export_service(bq: BigQueryService = Depends(get_bigquery_service)) -> ExportService:
    return ExportService(bq)
