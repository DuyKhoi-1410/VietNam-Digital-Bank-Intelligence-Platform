import pytest
from app.db.bigquery import BigQueryService, BigQueryQueryError
from google.cloud import bigquery


def test_root_endpoint(client):
    """Verifies root endpoint metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "version" in data
    assert data["docs_url"] == "/docs"


def test_liveness_endpoint(client):
    """Verifies lightweight liveness probe."""
    response = client.get("/health/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["uptime_check"] is True


def test_health_bigquery_connectivity(client):
    """Verifies that the /health endpoint connects to real BigQuery and verifies datasets."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "healthy"
    assert data["app_name"] == "Vietnam Digital Banking Intelligence API"
    
    bq = data["bigquery"]
    assert bq["connected"] is True
    assert bq["project_id"] == "aiinbusinessgroup3"
    assert bq["location"] == "asia-southeast1"
    assert bq["latency_ms"] > 0
    
    # Assert verified datasets from data discovery
    datasets = set(bq["accessible_datasets"])
    assert "summary_tables" in datasets
    assert "bank_reviews" in datasets
    assert "analysis_sentiment_long_reviews" in datasets


def test_bigquery_read_only_enforcement(bq_service: BigQueryService):
    """Asserts that queries with write/DDL/DML tokens are strictly blocked."""
    forbidden_queries = [
        "INSERT INTO `aiinbusinessgroup3.bank_reviews.all_reviews` VALUES ('1')",
        "UPDATE `aiinbusinessgroup3.summary_tables.overview` SET Positive_Reviews = 0",
        "DROP TABLE `aiinbusinessgroup3.summary_tables.overview`",
        "DELETE FROM `aiinbusinessgroup3.bank_reviews.all_reviews` WHERE 1=1",
        "CREATE TABLE `aiinbusinessgroup3.test` (id INT64)",
        "ALTER TABLE `aiinbusinessgroup3.summary_tables.overview` DROP COLUMN Bank",
        "TRUNCATE TABLE `aiinbusinessgroup3.summary_tables.overview`",
    ]
    for sql in forbidden_queries:
        with pytest.raises(BigQueryQueryError) as exc_info:
            bq_service.execute_query(sql)
        assert "Write operations are strictly prohibited" in str(exc_info.value)


def test_bigquery_real_parameterized_query(bq_service: BigQueryService):
    """
    Executes a real parameterized read-only query on summary_tables.overview
    and asserts against verified real ground-truth data (7 banks).
    """
    query = """
    SELECT 
      Bank,
      COUNT(*) as month_records,
      ROUND(AVG(Average_Rating), 2) as overall_avg_rating
    FROM `aiinbusinessgroup3.summary_tables.overview`
    WHERE Bank = @target_bank
    GROUP BY Bank
    """
    params = [
        bigquery.ScalarQueryParameter("target_bank", "STRING", "BIDV SmartBanking")
    ]
    
    rows = bq_service.execute_query(query, parameters=params)
    assert len(rows) == 1
    row = rows[0]
    assert row["Bank"] == "BIDV SmartBanking"
    assert row["month_records"] == 5  # Verified 5 months in data discovery
    assert row["overall_avg_rating"] > 0
