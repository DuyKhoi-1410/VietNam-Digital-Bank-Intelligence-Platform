from fastapi import APIRouter, Depends, status, Response
from app.api.deps import get_bigquery_service
from app.core.config import settings
from app.db.bigquery import BigQueryService
from app.schemas.health import HealthResponse, LivenessResponse, ServiceStatus, BigQueryHealth

router = APIRouter(tags=["Health & Diagnostics"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Comprehensive Health & BigQuery Connectivity Check",
    description="Tests backend application health, authenticates to Google Cloud, pings BigQuery, and enumerates datasets in asia-southeast1."
)
async def check_health(
    response: Response,
    bq: BigQueryService = Depends(get_bigquery_service)
) -> HealthResponse:
    bq_check = bq.check_connection()

    if bq_check["connected"]:
        # Verify that the expected verified datasets exist
        expected_datasets = {"summary_tables", "bank_reviews", "analysis_sentiment_long_reviews"}
        found_datasets = set(bq_check["accessible_datasets"])
        if expected_datasets.issubset(found_datasets):
            overall_status = ServiceStatus.HEALTHY
        else:
            overall_status = ServiceStatus.DEGRADED
    else:
        overall_status = ServiceStatus.UNHEALTHY
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return HealthResponse(
        status=overall_status,
        app_name=settings.APP_NAME,
        app_version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        bigquery=BigQueryHealth(**bq_check)
    )


@router.get(
    "/health/live",
    response_model=LivenessResponse,
    summary="Application Liveness Probe",
    description="Lightweight check returning 200 OK if the FastAPI process is responsive."
)
async def liveness() -> LivenessResponse:
    return LivenessResponse(status="ok", uptime_check=True)


@router.get(
    "/health/ready",
    summary="Application Readiness Probe",
    description="Returns 200 OK only if BigQuery database connectivity is established."
)
async def readiness(
    response: Response,
    bq: BigQueryService = Depends(get_bigquery_service)
):
    bq_check = bq.check_connection()
    if not bq_check["connected"]:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {"ready": False, "error": bq_check["error"]}
    return {"ready": True, "location": bq_check["location"], "latency_ms": bq_check["latency_ms"]}
