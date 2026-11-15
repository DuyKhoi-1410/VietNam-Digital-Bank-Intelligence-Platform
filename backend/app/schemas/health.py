from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class ServiceStatus(str, Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"


class BigQueryHealth(BaseModel):
    connected: bool = Field(..., description="Whether BigQuery ping succeeded")
    project_id: str = Field(..., description="Target Google Cloud Project ID")
    location: str = Field(..., description="BigQuery region location (e.g. asia-southeast1)")
    auth_method: str = Field(..., description="Authentication mode: Service Account Key File or ADC")
    latency_ms: float = Field(..., description="Query ping round-trip latency in milliseconds")
    accessible_datasets: List[str] = Field(default_factory=list, description="List of accessible datasets")
    server_time: Optional[str] = Field(default=None, description="Current BigQuery timestamp")
    error: Optional[str] = Field(default=None, description="Error message if connection failed")


class HealthResponse(BaseModel):
    status: ServiceStatus = Field(..., description="Overall service status")
    app_name: str = Field(..., description="Application Name")
    app_version: str = Field(..., description="Application Version")
    environment: str = Field(..., description="Environment (development, production, etc.)")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC report timestamp")
    bigquery: BigQueryHealth = Field(..., description="BigQuery database health metrics")


class LivenessResponse(BaseModel):
    status: str = Field(default="ok")
    uptime_check: bool = Field(default=True)
