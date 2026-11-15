import os
import time
from typing import Any, Dict, List, Optional
import google.auth
from google.cloud import bigquery
from google.oauth2 import service_account
from google.api_core.exceptions import GoogleAPICallError, RetryError

from app.core.config import settings
from app.core.logging import logger


class BigQueryError(Exception):
    """Base exception for BigQuery operations."""
    pass


class BigQueryConnectionError(BigQueryError):
    """Raised when connecting or authenticating to BigQuery fails."""
    pass


class BigQueryQueryError(BigQueryError):
    """Raised when query syntax or execution fails."""
    pass


class BigQueryService:
    """
    Server-side read-only BigQuery client service.
    
    Supports:
    - Service Account Key file (for local development or secured mounted volumes)
    - Google Application Default Credentials (ADC) / Workload Identity (for production GCP runtime)
    - Strict read-only parameterized execution
    - Dataset presence and latency health probing
    """

    FORBIDDEN_WRITE_KEYWORDS = (
        "INSERT ", "UPDATE ", "DELETE ", "DROP ",
        "CREATE ", "ALTER ", "TRUNCATE ", "MERGE "
    )

    def __init__(
        self,
        project_id: Optional[str] = None,
        location: Optional[str] = None,
        credentials_path: Optional[str] = None
    ):
        self.project_id = project_id or settings.GOOGLE_CLOUD_PROJECT
        self.location = location or settings.BIGQUERY_LOCATION
        self.credentials_path = credentials_path or settings.GOOGLE_APPLICATION_CREDENTIALS
        self._client: Optional[bigquery.Client] = None
        self._auth_method: str = "Uninitialized"

    def _initialize_client(self) -> bigquery.Client:
        """Initializes BigQuery client supporting either Key File or ADC."""
        if self._client is not None:
            return self._client

        try:
            # Mode 1: Explicit Service Account JSON Key File
            if self.credentials_path and os.path.exists(self.credentials_path):
                credentials = service_account.Credentials.from_service_account_file(
                    self.credentials_path
                )
                self._auth_method = "Service Account Key File"
                logger.info(
                    "Authenticating BigQuery client via Service Account key: %s (Client Email: %s)",
                    os.path.basename(self.credentials_path),
                    getattr(credentials, "service_account_email", "N/A")
                )
                self._client = bigquery.Client(
                    credentials=credentials,
                    project=self.project_id,
                    location=self.location
                )

            # Mode 2: Google Application Default Credentials (ADC) / Production Workload Identity
            else:
                credentials, resolved_project = google.auth.default()
                self._auth_method = "Application Default Credentials (ADC)"
                project = self.project_id or resolved_project
                logger.info(
                    "Authenticating BigQuery client via Application Default Credentials (ADC) for project: %s",
                    project
                )
                self._client = bigquery.Client(
                    credentials=credentials,
                    project=project,
                    location=self.location
                )

            return self._client

        except Exception as exc:
            self._auth_method = "Failed"
            logger.error("Failed to initialize Google Cloud BigQuery client: %s", str(exc))
            raise BigQueryConnectionError(f"Could not initialize BigQuery client: {str(exc)}") from exc

    @property
    def client(self) -> bigquery.Client:
        """Lazy-loaded BigQuery client instance."""
        if self._client is None:
            return self._initialize_client()
        return self._client

    @property
    def auth_method(self) -> str:
        """Returns the authentication method used by the client."""
        return self._auth_method

    def _assert_read_only(self, sql: str) -> None:
        """Enforces that queries are read-only (SELECT / WITH)."""
        stripped_upper = sql.strip().upper()
        for forbidden in self.FORBIDDEN_WRITE_KEYWORDS:
            if stripped_upper.startswith(forbidden) or f" {forbidden}" in stripped_upper:
                logger.error("Blocked disallowed DDL/DML execution attempt: %s", sql[:60])
                raise BigQueryQueryError(
                    f"Write operations are strictly prohibited. Query contained forbidden token '{forbidden.strip()}'."
                )

    def execute_query(
        self,
        query: str,
        parameters: Optional[List[bigquery.ScalarQueryParameter | bigquery.ArrayQueryParameter]] = None,
        timeout: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Executes a read-only parameterized SQL query on BigQuery.
        Returns a list of dictionary rows with serializable Python types.
        """
        self._assert_read_only(query)

        timeout_sec = timeout or settings.BIGQUERY_QUERY_TIMEOUT_SECONDS
        job_config = bigquery.QueryJobConfig(
            query_parameters=parameters or [],
            use_query_cache=True
        )

        start_time = time.perf_counter()
        try:
            query_job = self.client.query(
                query=query,
                job_config=job_config,
                location=self.location,
                timeout=timeout_sec
            )

            # Wait for results
            result_rows = query_job.result(timeout=timeout_sec)
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

            # Convert to list of dicts with JSON serializable formats
            output: List[Dict[str, Any]] = []
            for row in result_rows:
                row_dict = {}
                for key, val in row.items():
                    if hasattr(val, "isoformat"):
                        row_dict[key] = val.isoformat()
                    else:
                        row_dict[key] = val
                output.append(row_dict)

            logger.debug(
                "BigQuery query executed successfully in %s ms (Rows: %d, Bytes Billed: %s)",
                elapsed_ms,
                len(output),
                getattr(query_job, "total_bytes_billed", "N/A")
            )
            return output

        except GoogleAPICallError as exc:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error("BigQuery API error after %s ms: %s", elapsed_ms, str(exc))
            raise BigQueryQueryError(f"BigQuery execution failed: {exc.message}") from exc
        except RetryError as exc:
            logger.error("BigQuery query timed out after %s seconds: %s", timeout_sec, str(exc))
            raise BigQueryQueryError(f"BigQuery query timed out after {timeout_sec} seconds") from exc
        except Exception as exc:
            logger.error("Unexpected error during BigQuery execution: %s", str(exc))
            raise BigQueryQueryError(f"Unexpected query failure: {str(exc)}") from exc

    def check_connection(self) -> Dict[str, Any]:
        """
        Health check utility to verify BigQuery client connectivity,
        location, query latency, and accessible datasets.
        """
        start_time = time.perf_counter()
        try:
            # 1. Execute lightweight ping
            ping_query = "SELECT 1 as ping, CURRENT_TIMESTAMP() as server_time"
            ping_res = self.execute_query(ping_query, timeout=10)
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

            # 2. Inspect accessible datasets in region
            datasets = [d.dataset_id for d in self.client.list_datasets()]

            return {
                "connected": True,
                "project_id": self.project_id,
                "location": self.location,
                "auth_method": self.auth_method,
                "latency_ms": latency_ms,
                "accessible_datasets": datasets,
                "server_time": ping_res[0].get("server_time") if ping_res else None,
                "error": None
            }

        except Exception as exc:
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.warning("BigQuery connection check failed: %s", str(exc))
            return {
                "connected": False,
                "project_id": self.project_id,
                "location": self.location,
                "auth_method": self.auth_method,
                "latency_ms": latency_ms,
                "accessible_datasets": [],
                "server_time": None,
                "error": str(exc)
            }


# Singleton service instance
bigquery_service = BigQueryService()
