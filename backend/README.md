# Vietnam Digital Banking Intelligence — Backend API

Production-grade FastAPI backend for the **Vietnam Digital Banking Intelligence** platform. Connects directly to Google Cloud BigQuery (`aiinbusinessgroup3`, location: `asia-southeast1`) using the official Python client library under a strict **Zero Mock Data Policy**.

---

## Architecture & Features

* **Framework:** FastAPI with asynchronous ASGI execution (`uvicorn`).
* **BigQuery Integration:** Official `google-cloud-bigquery` library with connection pooling and caching.
* **Dual Authentication:**
  * **Local Development:** Service Account JSON Key File (`GOOGLE_APPLICATION_CREDENTIALS`).
  * **Production / Cloud Run:** Google Application Default Credentials (ADC) / Workload Identity.
* **Strict Read-Only Guard:** Automatically intercepts and blocks queries containing DDL/DML tokens (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `CREATE`, `ALTER`, `TRUNCATE`, `MERGE`).
* **Zero Mock Data Policy:** 100% of data returned across all 5 modules is retrieved directly from BigQuery. Never returns fake, synthetic, or fallback data.
* **Security & Sanitization:** Structured logging with automatic credential redaction (tokens, private keys).
* **Caching & Cost Optimization:** In-memory `TTLCache` (1-hour TTL) for pre-aggregated analytical data marts.

---

## Implemented Modules & API Endpoints

### Health & Diagnostics
* `GET /health` or `/api/v1/health`: Comprehensive BigQuery connectivity audit, latency probe, and dataset enumeration.
* `GET /health/live`: Fast container liveness check.
* `GET /health/ready`: Dependency readiness check.

### Module 1: Market Overview (`/api/v1/market`)
* `GET /api/v1/market/overview`: Returns baseline unique reviews (19,303), summary occurrences (19,308), average rating, and macro sentiment share.
* `GET /api/v1/market/trends`: Monthly rating and volume trajectories across July–November 2026.
* `GET /api/v1/market/aspects`: 7 verified ABSA aspects, Net Sentiment Scores, and ranked market pain points (evaluated across 13,864 sub-sentences from 8,666 detailed reviews).

### Module 2: Bank Insights (`/api/v1/banks`)
* `GET /api/v1/banks`: Lists the 7 tracked digital banking apps with review volume and average rating.
* `GET /api/v1/banks/{bank_name}/scorecard`: Individual bank scorecard separating 1-5 star ratings from NLP sentiment (Positive, Neutral, Negative).
* `GET /api/v1/banks/{bank_name}/aspects`: Aspect performance and Net Sentiment Scores for a specific bank across 7 categories.
* `GET /api/v1/banks/{bank_name}/versions`: App version build rating performance grounded in the 16,017 versioned denominator with observational disclosure.
* `GET /api/v1/banks/{bank_name}/quotes`: Verbatim customer feedback snippets from `aspect_reviews` filtered by bank, aspect, and sentiment.

### Module 3: Competitive Benchmark (`/api/v1/benchmark`)
* `GET /api/v1/benchmark/matrix`: Side-by-side comparison matrix of 2–4 selected banks (or all 7 banks) with derived strengths, weaknesses, and performance gaps.
* `GET /api/v1/benchmark/aspects`: Cross-bank aspect comparison matrix.
* `GET /api/v1/benchmark/ratings`: 100% normalized 1★ to 5★ rating distributions per bank.

### Module 4: Review Explorer (`/api/v1/reviews`)
* `GET /api/v1/reviews/search`: Paginated search implementing the validated deduplication window rule (`ROW_NUMBER() OVER(PARTITION BY ID ORDER BY Word_Count ASC, Time DESC)`), returning exactly 19,303 unique baseline reviews. Supports bank, date, rating, sentiment, genuine aspect, app version, and keyword filters.
* `GET /api/v1/reviews/filters/options`: Returns available dropdown filter options populated directly from BigQuery.
* `GET /api/v1/reviews/{review_id}`: Single review detail view with sentence-level ABSA breakdown for detailed reviews.

### Module 5: Reports & Export (`/api/v1/reports`)
* `GET /api/v1/reports/summary-tables`: Exports analytical summary data marts (`overview`, `aspect_analysis`, `rating_analysis`, `sentiment_analysis`) as CSV or JSON.
* `GET /api/v1/reports/reviews/export`: Streams deduplicated filtered reviews as CSV with a safety capping limit of max 10,000 rows.

---

## Directory Structure

```
backend/
├── .env.example              # Environment variables template
├── .env                      # Active local environment configuration (gitignored)
├── pyproject.toml            # Project specification
├── requirements.txt          # Python dependencies
├── README.md                 # Setup, API reference, and operations guide
├── app/
│   ├── main.py               # FastAPI entrypoint, middleware, router assembly
│   ├── core/
│   │   ├── config.py         # Pydantic Settings configuration
│   │   ├── logging.py        # Structured logging with credential sanitizer
│   │   └── cache.py          # In-memory TTLCache with key hashing
│   ├── db/
│   │   └── bigquery.py       # BigQueryService (read-only client & parameterized executor)
│   ├── api/
│   │   ├── deps.py           # Dependency injection providers for all services
│   │   └── v1/
│   │       ├── health.py     # Health, liveness, and readiness endpoints
│   │       ├── market.py     # Module 1: Market Overview endpoints
│   │       ├── banks.py      # Module 2: Bank Insights endpoints
│   │       ├── benchmark.py  # Module 3: Competitive Benchmark endpoints
│   │       ├── reviews.py    # Module 4: Review Explorer endpoints
│   │       └── reports.py    # Module 5: Reports & Export endpoints
│   ├── schemas/
│   │   ├── health.py         # Health check schemas
│   │   ├── market.py         # Market Overview schemas
│   │   ├── banks.py          # Bank Insights schemas
│   │   ├── benchmark.py      # Competitive Benchmark schemas
│   │   ├── reviews.py        # Review Explorer schemas
│   │   └── reports.py        # Reports & Export schemas
│   └── services/
│       ├── market_service.py # Market Overview queries & logic
│       ├── bank_service.py   # Bank Insights queries & logic
│       ├── benchmark_service.py # Competitive Benchmark queries & gaps
│       ├── review_service.py # Deduplicated review search & detail queries
│       └── export_service.py # Safe CSV/JSON export generation
├── scripts/
│   └── audit_zero_mock.py    # Automated Zero Mock Data policy auditor
└── tests/
    ├── conftest.py           # Pytest fixtures & test client
    ├── test_health_bigquery.py # Health & BigQuery connectivity tests
    └── test_modules_integration.py # 21 comprehensive integration tests for all 5 modules
```

---

## Running the Server Locally

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```
Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser for the full interactive OpenAPI/Swagger explorer.

---

## Running the Automated Test Suite

Run the complete 21 integration tests against BigQuery:
```bash
cd backend
uv run --no-project --python 3.11 --with-requirements requirements.txt python -m pytest tests/ -v
```
All 21 tests execute live read-only queries asserting verified ground truth metrics.
