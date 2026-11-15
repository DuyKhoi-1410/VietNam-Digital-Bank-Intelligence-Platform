from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import logger
from app.db.bigquery import bigquery_service, BigQueryError, BigQueryQueryError
from app.api.v1.health import router as health_router
from app.api.v1.market import router as market_router
from app.api.v1.banks import router as banks_router
from app.api.v1.benchmark import router as benchmark_router
from app.api.v1.reviews import router as reviews_router
from app.api.v1.reports import router as reports_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager: initial diagnostics and shutdown cleanup."""
    logger.info("Starting %s (v%s) in [%s] mode...", settings.APP_NAME, settings.APP_VERSION, settings.ENVIRONMENT)
    
    # Run initial connection diagnostics
    try:
        check = bigquery_service.check_connection()
        if check["connected"]:
            logger.info(
                "Successfully connected to BigQuery project [%s] in [%s] via [%s] (Latency: %s ms, Datasets: %s)",
                check["project_id"],
                check["location"],
                check["auth_method"],
                check["latency_ms"],
                check["accessible_datasets"]
            )
        else:
            logger.warning(
                "BigQuery connection is not ready at startup: %s. Requests requiring database will return 503.",
                check["error"]
            )
    except Exception as exc:
        logger.error("Unexpected error during startup BigQuery check: %s", str(exc))

    yield

    logger.info("Shutting down %s...", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Production-grade FastAPI backend for the Vietnam Digital Banking Intelligence platform. "
        "Queries live Google Play Store review analysis data from Google Cloud BigQuery with strict Zero Mock Data enforcement."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Global Exception Handlers
@app.exception_handler(BigQueryError)
async def bigquery_exception_handler(request: Request, exc: BigQueryError):
    logger.error("BigQuery operation failed for path %s: %s", request.url.path, str(exc))
    return JSONResponse(
        status_code=status.HTTP_502_BAD_GATEWAY,
        content={
            "error": "BigQueryExecutionError",
            "message": str(exc),
            "path": request.url.path,
            "zero_mock_notice": "BigQuery is the sole source of truth. No mock data is served."
        }
    )

# Include Routers
# Health check mounted at root /health and /api/v1/health
app.include_router(health_router, prefix="", tags=["Health & Diagnostics"])
app.include_router(health_router, prefix=settings.API_V1_PREFIX, tags=["Health & Diagnostics"])

# Business Modules mounted under /api/v1
app.include_router(market_router, prefix=settings.API_V1_PREFIX)
app.include_router(banks_router, prefix=settings.API_V1_PREFIX)
app.include_router(benchmark_router, prefix=settings.API_V1_PREFIX)
app.include_router(reviews_router, prefix=settings.API_V1_PREFIX)
app.include_router(reports_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
async def root():
    """Root info endpoint providing service metadata and documentation links."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "health_check": f"{settings.API_V1_PREFIX}/health",
        "modules": {
            "module_1_market_overview": f"{settings.API_V1_PREFIX}/market/overview",
            "module_2_bank_insights": f"{settings.API_V1_PREFIX}/banks",
            "module_3_competitive_benchmark": f"{settings.API_V1_PREFIX}/benchmark/matrix",
            "module_4_review_explorer": f"{settings.API_V1_PREFIX}/reviews/search",
            "module_5_reports_export": f"{settings.API_V1_PREFIX}/reports/summary-tables"
        }
    }
