from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ExportDatasetType(str, Enum):
    OVERVIEW = "overview"
    ASPECT_ANALYSIS = "aspect_analysis"
    RATING_ANALYSIS = "rating_analysis"
    SENTIMENT_ANALYSIS = "sentiment_analysis"
    FILTERED_REVIEWS = "filtered_reviews"


class ExportFormat(str, Enum):
    CSV = "csv"
    JSON = "json"


class ExportMetadataResponse(BaseModel):
    dataset_type: ExportDatasetType = Field(..., description="Target BigQuery dataset table")
    format: ExportFormat = Field(..., description="Export data format")
    row_count: int = Field(..., description="Total rows included in the export")
    max_row_limit: int = Field(10000, description="Safety limit for raw review exports")
    source_table: str = Field(..., description="Originating BigQuery table")
    generated_at: str = Field(..., description="UTC ISO generation timestamp")
