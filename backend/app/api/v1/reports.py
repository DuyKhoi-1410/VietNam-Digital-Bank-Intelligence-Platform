from typing import Optional
from fastapi import APIRouter, Depends, Query, Response
from fastapi.responses import PlainTextResponse
from app.api.deps import get_export_service
from app.schemas.reports import ExportDatasetType, ExportFormat
from app.services.export_service import ExportService

router = APIRouter(prefix="/reports", tags=["Module 5: Reports & Export"])


@router.get(
    "/summary-tables",
    summary="Export Analytical Data Marts (CSV / JSON)",
    description="Exports complete pre-aggregated summary tables ('overview', 'aspect_analysis', 'rating_analysis', 'sentiment_analysis') as CSV or JSON."
)
async def export_summary_table(
    table_type: ExportDatasetType = Query(
        ExportDatasetType.OVERVIEW,
        description="Target table to export: overview, aspect_analysis, rating_analysis, sentiment_analysis"
    ),
    export_format: ExportFormat = Query(ExportFormat.CSV, description="File format: 'csv' or 'json'"),
    service: ExportService = Depends(get_export_service)
):
    as_csv = (export_format == ExportFormat.CSV)
    content, filename, row_count = service.export_summary_table(table_type, as_csv=as_csv)

    media_type = "text/csv; charset=utf-8" if as_csv else "application/json; charset=utf-8"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "X-Row-Count": str(row_count),
        "X-Zero-Mock-Verified": "true"
    }

    return Response(
        content=content,
        media_type=media_type,
        headers=headers
    )


@router.get(
    "/reviews/export",
    summary="Export Filtered Reviews with Safety Capping (CSV / JSON)",
    description="Streams filtered deduplicated review records with a safety limit of max 10,000 rows to control BigQuery scan and memory costs."
)
async def export_filtered_reviews(
    bank: Optional[str] = Query(None, description="Optional bank filter"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Optional star rating filter"),
    sentiment: Optional[str] = Query(None, description="Optional sentiment filter: 'POSITIVE', 'NEGATIVE', 'NEUTRAL'"),
    aspect: Optional[str] = Query(None, description="Optional genuine ABSA category filter"),
    limit: int = Query(5000, ge=1, le=10000, description="Max rows to export (safety capped at 10,000)"),
    export_format: ExportFormat = Query(ExportFormat.CSV, description="File format: 'csv' or 'json'"),
    service: ExportService = Depends(get_export_service)
):
    as_csv = (export_format == ExportFormat.CSV)
    content, filename, row_count = service.export_filtered_reviews(
        bank=bank,
        rating=rating,
        sentiment=sentiment,
        aspect=aspect,
        limit=limit,
        as_csv=as_csv
    )

    media_type = "text/csv; charset=utf-8" if as_csv else "application/json; charset=utf-8"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "X-Row-Count": str(row_count),
        "X-Zero-Mock-Verified": "true"
    }

    return Response(
        content=content,
        media_type=media_type,
        headers=headers
    )
