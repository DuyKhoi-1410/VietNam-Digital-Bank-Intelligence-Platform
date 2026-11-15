import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.db.bigquery import bigquery_service


@pytest.fixture(scope="session")
def bq_service():
    """Provides the live BigQuery service instance."""
    return bigquery_service


@pytest.fixture(scope="module")
def client():
    """Standard TestClient for FastAPI (synchronous, robust, and fast)."""
    with TestClient(app) as test_client:
        yield test_client
