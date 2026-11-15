import os
from typing import List, Optional, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator


class Settings(BaseSettings):
    # Application Settings
    ENVIRONMENT: str = Field(default="development", description="Environment: development, staging, production")
    DEBUG: bool = Field(default=False, description="Enable debug mode")
    APP_NAME: str = Field(default="Vietnam Digital Banking Intelligence API")
    APP_VERSION: str = Field(default="0.1.0")
    API_V1_PREFIX: str = Field(default="/api/v1")

    # Google Cloud BigQuery Settings
    GOOGLE_CLOUD_PROJECT: str = Field(
        default="aiinbusinessgroup3",
        description="GCP Project ID housing BigQuery datasets"
    )
    BIGQUERY_LOCATION: str = Field(
        default="asia-southeast1",
        description="BigQuery dataset region (Singapore)"
    )
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = Field(
        default=None,
        description="Path to Service Account JSON key (optional; if unset, ADC is used)"
    )

    # CORS Allowed Origins
    CORS_ORIGINS: Union[str, List[str]] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"],
        description="Allowed CORS origin URLs"
    )

    # Operational Parameters
    BIGQUERY_QUERY_TIMEOUT_SECONDS: int = Field(default=30, description="Max query execution timeout")
    CACHE_TTL_SECONDS: int = Field(default=3600, description="Cache retention duration for summary tables")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("CORS_ORIGINS", mode="after")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            v_str = v.strip()
            if v_str == "*":
                return ["*"]
            import json
            try:
                parsed = json.loads(v_str)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                pass
            return [i.strip() for i in v_str.split(",") if i.strip()]
        return v

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"


settings = Settings()
