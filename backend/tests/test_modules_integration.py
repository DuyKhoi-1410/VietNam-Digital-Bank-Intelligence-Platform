import pytest
from fastapi.testclient import TestClient


def test_market_overview_endpoint(client: TestClient):
    """Module 1: Verifies market overview metrics and reconciled counts."""
    response = client.get("/api/v1/market/overview")
    assert response.status_code == 200
    data = response.json()

    assert data["unique_baseline_reviews"] == 19303
    assert data["total_overview_occurrences"] == 19308
    assert data["total_banks_tracked"] == 7
    assert data["market_average_rating"] > 0
    assert "absa_disclosure" in data

    sentiment = data["sentiment_distribution"]
    assert sentiment["positive_count"] == 12508
    assert sentiment["neutral_count"] == 1530
    assert sentiment["negative_count"] == 5270
    assert round(sentiment["positive_pct"] + sentiment["neutral_pct"] + sentiment["negative_pct"]) == 100


def test_market_trends_endpoint(client: TestClient):
    """Module 1: Verifies 5-month market trajectories."""
    response = client.get("/api/v1/market/trends")
    assert response.status_code == 200
    data = response.json()

    months = data["monthly_trends"]
    assert len(months) == 5  # 2026-07 to 2026-11
    total_volume = sum(m["review_volume"] for m in months)
    assert total_volume == 19308


def test_market_aspects_endpoint(client: TestClient):
    """Module 1: Verifies genuine ABSA breakdown and pain points."""
    response = client.get("/api/v1/market/aspects")
    assert response.status_code == 200
    data = response.json()

    assert data["total_sub_sentences"] == 13864
    assert data["total_detailed_reviews"] == 8666

    aspects = data["aspects"]
    assert len(aspects) == 7
    aspect_names = {a["aspect_name"] for a in aspects}
    assert "Bảo mật & Đăng nhập" in aspect_names
    assert "Giao dịch & Chuyển tiền" in aspect_names
    assert "Hệ thống & Hiệu năng" in aspect_names

    # Assert pain points identified
    assert len(data["pain_points"]) > 0


def test_bank_list_endpoint(client: TestClient):
    """Module 2: Verifies listing of all 7 tracked banks."""
    response = client.get("/api/v1/banks")
    assert response.status_code == 200
    banks = response.json()

    assert len(banks) == 7
    bank_names = {b["bank_name"] for b in banks}
    expected = {
        "BIDV SmartBanking", "Liobank", "MB Bank", "TNEX",
        "TPBank Mobile", "VCB Digibank", "VietinBank iPay"
    }
    assert bank_names == expected


def test_bank_scorecard_endpoint(client: TestClient):
    """Module 2: Verifies bank scorecard separating rating and sentiment."""
    response = client.get("/api/v1/banks/BIDV SmartBanking/scorecard")
    assert response.status_code == 200
    data = response.json()

    assert data["bank_name"] == "BIDV SmartBanking"
    assert data["overall_average_rating"] > 0
    assert data["total_reviews"] > 0

    # Assert rating and sentiment are separated
    stars = data["star_rating_breakdown"]
    assert "star_1" in stars and "star_5" in stars
    sent = data["sentiment_counts"]
    assert "positive" in sent and "negative" in sent


def test_bank_aspects_endpoint(client: TestClient):
    """Module 2: Verifies bank aspect scores across 7 dimensions."""
    response = client.get("/api/v1/banks/MB Bank/aspects")
    assert response.status_code == 200
    data = response.json()

    assert data["bank_name"] == "MB Bank"
    assert data["bank_total_sub_sentences"] > 0
    assert len(data["aspects"]) == 7


def test_bank_versions_endpoint(client: TestClient):
    """Module 2: Verifies app versions and the 16,017 denominator."""
    response = client.get("/api/v1/banks/VCB Digibank/versions")
    assert response.status_code == 200
    data = response.json()

    assert data["bank_name"] == "VCB Digibank"
    assert data["market_versioned_denominator"] == 16017
    assert "observational_disclaimer" in data
    assert len(data["versions"]) > 0


def test_bank_verbatim_quotes_endpoint(client: TestClient):
    """Module 2: Verifies original review evidence quotes from aspect_reviews."""
    response = client.get(
        "/api/v1/banks/MB Bank/quotes",
        params={"aspect": "Bảo mật & Đăng nhập", "sentiment": "NEGATIVE", "limit": 5}
    )
    assert response.status_code == 200
    data = response.json()

    assert data["bank_name"] == "MB Bank"
    assert data["aspect"] == "Bảo mật & Đăng nhập"
    assert len(data["quotes"]) > 0
    q = data["quotes"][0]
    assert "sub_id" in q and "review_id" in q and "sub_sentence" in q
    assert q["sentiment"] == "NEGATIVE"


def test_benchmark_matrix_endpoint(client: TestClient):
    """Module 3: Verifies multi-bank comparison matrix and gaps."""
    # Compare all 7 banks
    response = client.get("/api/v1/benchmark/matrix")
    assert response.status_code == 200
    data = response.json()

    assert len(data["matrix"]) == 7
    assert len(data["key_gaps"]) >= 2

    # Compare selected 2 banks
    sel_resp = client.get("/api/v1/benchmark/matrix", params={"banks": ["BIDV SmartBanking", "MB Bank"]})
    assert sel_resp.status_code == 200
    sel_data = sel_resp.json()
    assert len(sel_data["matrix"]) == 2


def test_benchmark_aspects_and_ratings(client: TestClient):
    """Module 3: Verifies aspect matrix and rating distributions."""
    resp_asp = client.get("/api/v1/benchmark/aspects")
    assert resp_asp.status_code == 200
    assert len(resp_asp.json()["aspect_matrix"]) == 7

    resp_rat = client.get("/api/v1/benchmark/ratings")
    assert resp_rat.status_code == 200
    assert len(resp_rat.json()["rating_distributions"]) == 7


def test_reviews_search_deduplication(client: TestClient):
    """Module 4: Verifies search returns exactly 19,303 unique baseline reviews."""
    response = client.get("/api/v1/reviews/search", params={"page": 1, "page_size": 10})
    assert response.status_code == 200
    data = response.json()

    assert data["unique_baseline"] == 19303
    assert data["total_items"] == 19303
    assert len(data["reviews"]) == 10
    r = data["reviews"][0]
    assert "id" in r and "bank" in r and "comment" in r and "probabilities" in r


def test_reviews_search_filters(client: TestClient):
    """Module 4: Verifies multi-criteria filtering."""
    # Filter by bank and rating
    response = client.get(
        "/api/v1/reviews/search",
        params={"bank": "Liobank", "rating": 5, "page": 1, "page_size": 5}
    )
    assert response.status_code == 200
    data = response.json()
    for item in data["reviews"]:
        assert item["bank"] == "Liobank"
        assert item["rating"] == 5

    # Filter by genuine aspect (joins aspect_reviews)
    asp_resp = client.get(
        "/api/v1/reviews/search",
        params={"aspect": "Giao dịch & Chuyển tiền", "page": 1, "page_size": 5}
    )
    assert asp_resp.status_code == 200
    asp_data = asp_resp.json()
    assert asp_data["total_items"] > 0


def test_aspect_filter_no_duplicate_rows(client: TestClient):
    """Audit 2: Verifies that reviews with multiple sub-sentences for the same aspect do not duplicate."""
    # From BigQuery validation, 'Bảo mật & Đăng nhập' has reviews like VCB_000829 with 7 sub-sentences
    # and VCB_001342 with 3 sub-sentences.
    # Total unique reviews across all banks with 'Bảo mật & Đăng nhập' is exactly 1,618.
    response = client.get(
        "/api/v1/reviews/search",
        params={"aspect": "Bảo mật & Đăng nhập", "page": 1, "page_size": 50}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_items"] == 1618

    # Ensure no duplicates in the returned page
    review_ids = [r["id"] for r in data["reviews"]]
    assert len(review_ids) == len(set(review_ids))

    # Also test multi-filter: MB Bank + Rating 1 + NEGATIVE + 'Bảo mật & Đăng nhập' = exactly 254 unique reviews
    mb_neg_resp = client.get(
        "/api/v1/reviews/search",
        params={
            "bank": "MB Bank",
            "rating": 1,
            "sentiment": "NEGATIVE",
            "aspect": "Bảo mật & Đăng nhập",
            "page": 1,
            "page_size": 50
        }
    )
    assert mb_neg_resp.status_code == 200
    mb_neg_data = mb_neg_resp.json()
    assert mb_neg_data["total_items"] == 254
    mb_ids = [r["id"] for r in mb_neg_data["reviews"]]
    assert len(mb_ids) == len(set(mb_ids))


def test_reviews_detail_endpoint(client: TestClient):
    """Module 4: Verifies single review lookup and ABSA sub-sentences."""
    # Find a long review ID
    search_resp = client.get("/api/v1/reviews/search", params={"page": 1, "page_size": 1})
    review_id = search_resp.json()["reviews"][0]["id"]

    detail_resp = client.get(f"/api/v1/reviews/{review_id}")
    assert detail_resp.status_code == 200
    detail = detail_resp.json()
    assert detail["review"]["id"] == review_id


def test_reviews_filter_options(client: TestClient):
    """Module 4: Verifies filter dropdown options."""
    response = client.get("/api/v1/reviews/filters/options")
    assert response.status_code == 200
    data = response.json()
    assert len(data["banks"]) == 7
    assert len(data["genuine_aspects"]) == 7
    assert "Not specified" in data["app_versions"]


def test_reports_export_summary(client: TestClient):
    """Module 5: Verifies summary table export (CSV & JSON)."""
    # CSV export
    csv_resp = client.get("/api/v1/reports/summary-tables", params={"table_type": "overview", "export_format": "csv"})
    assert csv_resp.status_code == 200
    assert "text/csv" in csv_resp.headers["content-type"]
    assert "Bank" in csv_resp.text
    assert int(csv_resp.headers["X-Row-Count"]) == 35

    # JSON export
    json_resp = client.get("/api/v1/reports/summary-tables", params={"table_type": "aspect_analysis", "export_format": "json"})
    assert json_resp.status_code == 200
    assert "application/json" in json_resp.headers["content-type"]
    assert int(json_resp.headers["X-Row-Count"]) == 589


def test_reports_export_filtered_reviews(client: TestClient):
    """Module 5: Verifies filtered reviews CSV export with safety capping."""
    response = client.get(
        "/api/v1/reports/reviews/export",
        params={"bank": "TNEX", "limit": 50, "export_format": "csv"}
    )
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert int(response.headers["X-Row-Count"]) > 0
    assert int(response.headers["X-Row-Count"]) <= 50
