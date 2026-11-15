# FINAL MILESTONE 2 DATA-INTEGRITY & SQL LOGIC AUDIT REPORT
**Project:** Vietnam Digital Banking Intelligence (VDBI)  
**Execution Date:** November 15, 2026  
**Audited Target:** Milestone 2 Backend API Endpoints & Services  
**GCP BigQuery Project:** `aiinbusinessgroup3` (Location: `asia-southeast1`)  
**Status:** COMPLETE — ALL AUDITS PASSED (22/22 Integration Tests Passed, 100% Zero Mock Compliant)

---

## 1. Executive Summary & Policy Compliance

### 1.1 Strict Zero Mock Data Policy Review
A comprehensive static code analysis and AST inspection was conducted across the entire backend repository using `backend/scripts/audit_zero_mock.py`.
- **Total Python Source Files Audited:** 36 files across `app/api/v1/`, `app/services/`, `app/schemas/`, `app/db/`, `app/core/`, and `tests/`.
- **Hardcoded / Synthetic Mock Dictionaries or Arrays:** 0 found.
- **Faker or Synthetic Data Generators:** 0 found.
- **Mock Service Classes:** 0 found.
- **Compliance Score:** **100% COMPLIANT**.

Every single business metric, bank score, sentiment breakdown, aspect mention count, app version distribution, and review text presented through the API is dynamically retrieved via the official Google Cloud BigQuery Python SDK (`google-cloud-bigquery >= 3.25.0`) executing parameterized queries against production datasets `bank_reviews`, `analysis_sentiment_long_reviews`, and `summary_tables`.

### 1.2 Boundary & Integrity Confirmation
- **BigQuery Modification Check:** Confirmed. **ZERO** BigQuery datasets, tables, rows, or schemas were altered or modified. All operations strictly adhere to read-only queries with DML/DDL statement blocking in `BigQueryService.execute_query()`.
- **Milestone 3 (Frontend) Boundary Check:** Confirmed. **NO** frontend files, Next.js components, pages, styling, or scaffolding have been created. Implementation remains strictly halted at Milestone 2 pending user review and approval.

---

## 2. Audit 1: App Version Denominator Correctness

### 2.1 Problem Statement & Risk
In the dataset, 16,017 reviews possess a non-null `App_Version` attribute. If an individual bank's version adoption share is calculated using 16,017 as the denominator, the percentages would be artificially depressed (e.g. MB Bank having ~5,094 versioned reviews would incorrectly show ~31% instead of summing to 100% across its versions). Furthermore, unversioned reviews (`App_Version IS NULL`) must not distort versioned release performance.

### 2.2 BigQuery Ground-Truth Data
Executing BigQuery query against `summary_tables.rating_analysis`:
```sql
SELECT 
  Bank, 
  SUM(total_reviews) as bank_versioned_sum,
  COUNT(DISTINCT App_Version) as distinct_versions
FROM `aiinbusinessgroup3.summary_tables.rating_analysis`
GROUP BY Bank
ORDER BY bank_versioned_sum DESC;
```
**Empirical Query Results:**
| Bank Name | Bank Versioned Reviews (Denominator) | Distinct Versions Analyzed |
| :--- | :--- | :--- |
| **BIDV SmartBanking** | 6,786 | 5 |
| **MB Bank** | 5,094 | 8 |
| **VCB Digibank** | 2,286 | 8 |
| **VietinBank iPay** | 949 | 9 |
| **TPBank Mobile** | 564 | 6 |
| **Liobank** | 179 | 5 |
| **TNEX** | 159 | 5 |
| **TOTAL MARKET-WIDE** | **16,017** | **46 bank-version pairs** |

Unversioned reviews in `bank_reviews.all_reviews`:
- Total reviews in baseline: **19,303** unique.
- Non-null `App_Version` reviews: **16,017** (82.98%).
- Null / Unspecified `App_Version`: **3,286** unique reviews (3,302 raw rows, exactly 17.02% of all raw review rows).

### 2.3 Code Audit in `backend/app/services/bank_service.py`
Inspection of `get_bank_version_performance(bank_name)` lines 112–155 confirms:
```python
# Bank-specific denominator calculation:
bank_total_versioned = sum(r["total_reviews"] for r in rows)

# Calculation of version share:
version_share_pct = round((row["total_reviews"] / bank_total_versioned) * 100, 2) if bank_total_versioned > 0 else 0.0
```
- **Denominator Used for Shares:** Exactly `bank_total_versioned` (the sum of reviews for that specific bank with non-null `App_Version`).
- **Sum of Version Shares:** Exactly **100.0%** for each bank.
- **Market Denominator Usage:** The 16,017 figure is exposed strictly as reference metadata (`market_versioned_denominator: 16017`) and is **never** used in the denominator of any bank's version distribution.
- **Handling of Nulls:** The upstream BigQuery summary table `rating_analysis` naturally indexes only versioned reviews. For individual review searches, `ReviewService` and `ExportService` project `COALESCE(r.App_Version, 'Not specified')`, allowing users to explicitly inspect and filter for unversioned reviews without contaminating version release curves.

### 2.4 API Response Verification (`GET /api/v1/banks/MB%20Bank/versions`)
```json
{
  "bank_name": "MB Bank",
  "bank_total_versioned_reviews": 5094,
  "market_versioned_denominator": 16017,
  "versions": [
    {
      "app_version": "v10.0.1",
      "total_reviews": 1152,
      "avg_rating": 3.73,
      "version_share_pct": 22.62,
      "rating_distribution": {"star_1": 298, "star_2": 66, "star_3": 89, "star_4": 105, "star_5": 594}
    },
    {
      "app_version": "v10.1.0",
      "total_reviews": 841,
      "avg_rating": 3.96,
      "version_share_pct": 16.51,
      "rating_distribution": {"star_1": 180, "star_2": 39, "star_3": 55, "star_4": 74, "star_5": 493}
    }
  ]
}
```
*Sum of `version_share_pct` across all MB Bank versions equals exactly 100.00%.*

---

## 3. Audit 2: Aspect Filtering & Duplicate Prevention

### 3.1 Problem Statement & Risk
In `analysis_sentiment_long_reviews.aspect_reviews`, long reviews (≥ 4 words) are segmented into sub-sentences, with each sub-sentence classified into one of 7 genuine aspects. Consequently, a single review ID frequently appears multiple times for the same aspect or across multiple aspects. E.g.:
- `VCB_000829` has **7 sub-sentences** for `Bảo mật & Đăng nhập`.
- `VCB_001342` has **3 sub-sentences** for `Bảo mật & Đăng nhập`.
- `MB_005387` has **3 sub-sentences** for `Bảo mật & Đăng nhập`.

If a query joins `aspect_reviews` via standard relational join without strict deduplication, the result set will multiply rows for the same review, artificially inflating search result counts and export datasets.

### 3.2 SQL Logic & Fix Implemented
To guarantee O(1) row cardinality per physical review, `ReviewService.search_reviews` and `ExportService.export_filtered_reviews` were audited and standardized to use an explicit `EXISTS` correlated subquery rather than an expanding join:

```sql
-- Parameterized Aspect Filter Logic in Review Explorer & Exports
WHERE 
  -- Other criteria (e.g. Bank = @bank, Rating = @rating, etc.)
  AND EXISTS (
    SELECT 1 
    FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews` a 
    WHERE a.review_id = r.ID 
      AND a.Aspect = @aspect
  )
```
Combined with the validated deduplication window:
```sql
ROW_NUMBER() OVER(PARTITION BY r.ID ORDER BY r.Word_Count ASC, r.Time DESC) as rn
...
WHERE rn = 1
```

### 3.3 Empirical BigQuery & API Count Comparison
We ran test queries directly in BigQuery and compared them against the FastAPI response:

| Filter Configuration | BigQuery `COUNT(DISTINCT review_id)` | API Total Matching (`total_items`) | Duplicate Rows Detected in Payload |
| :--- | :--- | :--- | :--- |
| **All Baseline Reviews** (No filters) | **19,303** | **19,303** | **0** |
| **Aspect:** `Bảo mật & Đăng nhập` | **1,618** | **1,618** | **0** |
| **Aspect:** `Giao dịch & Chuyển tiền` | **1,725** | **1,725** | **0** |
| **Multi-Filter:** `Bank='MB Bank'` AND `Rating=1` AND `Sentiment='NEGATIVE'` AND `Aspect='Bảo mật & Đăng nhập'` | **254** | **254** | **0** |

### 3.4 Multi-Sentence Sub-ID Verification
For review `VCB_000829`, querying `GET /api/v1/reviews/VCB_000829` returns:
- Review ID: `VCB_000829` (appears exactly once in parent object).
- Sub-sentences in `sub_sentences` array: exactly 7 distinct sub-sentences with their respective sentiment probabilities and aspects.
- Search result on `/api/v1/reviews/search?aspect=Bảo mật & Đăng nhập`: `VCB_000829` appears exactly once.

---

## 4. Audit 3: 19,303 vs 19,308 Review Count Reconciliation

### 4.1 Detailed Reconciliation Breakdown

```mermaid
flowchart TD
    A["Raw Reviews in all_reviews<br/>(19,396 rows)"] --> B["Deduplication Window Filter<br/>(ROW_NUMBER = 1)"]
    B --> C["93 Duplicate Rows Removed<br/>(Emoji Tokenization Splits)"]
    C --> D["True Unique Review Baseline<br/>(19,303 distinct IDs)"]
    
    A --> E["ETL Aggregation for summary_tables.overview"]
    E --> F["COUNT(DISTINCT CASE WHEN Sentiment='...' THEN ID END)"]
    F --> G["Positive: 12,508<br/>Neutral: 1,530<br/>Negative: 5,270"]
    G --> H["Sum Across Sentiments:<br/>19,308 occurrences"]
    
    D -. "+5 cross-classified tokenized IDs" .-> H
```

1. **Physical Review Count:**
   - Raw table `bank_reviews.all_reviews` has **19,396 rows**.
   - Inspecting duplicates by `ID` reveals **93 pairs** where the same Google Play review ID appears in both `raw_short_reviews` and `raw_long_reviews`.
   - Applying the deterministic deduplication rule (`ROW_NUMBER() OVER(PARTITION BY ID ORDER BY Word_Count ASC, Time DESC) = 1`) yields exactly **19,303 unique physical reviews**.
2. **Summary Table Overview Count:**
   - Summing `positive_reviews + neutral_reviews + negative_reviews` in `summary_tables.overview` across all 7 banks yields **19,308**.
   - Exactly **5 records** difference (`19,308 - 19,303 = 5`).
3. **Root Cause Analysis of the 5-Record Discrepancy:**
   - The 5 specific review IDs responsible for the delta are:
     1. `MB_004424`
     2. `MB_005945`
     3. `MB_006574`
     4. `VietinBank_009831`
     5. `VietinBank_010736`
   - In each of these 5 cases, the review contained emoji-only or mixed punctuation text that was cleaned differently between the short-review pipeline and the long-review pipeline. As a consequence, one row was classified as `NEUTRAL` and the duplicate row was classified as `POSITIVE` or `NEGATIVE`.
   - When `summary_tables.overview` executed `COUNT(DISTINCT CASE WHEN Sentiment_Label = '...' THEN ID END)`, these 5 IDs were distinct within each sentiment partition, resulting in them being counted in both columns.

### 4.2 Separation of Star Rating vs. NLP Sentiment
The platform strictly decouples user rating (1 to 5 stars) from NLP sentiment (Positive, Neutral, Negative):
- `/api/v1/market/overview` and `/api/v1/banks/{bank_name}/scorecard` present `avg_rating` (e.g. 4.12 stars) separately from `sentiment_distribution` (Positive 64.78%, Neutral 7.92%, Negative 27.29%).
- Discrepancy disclosure note is explicitly embedded in metadata:
  ```json
  "metrics": {
    "unique_baseline_reviews": 19303,
    "total_sentiment_occurrences": 19308,
    "reconciliation_note": "5 emoji-tokenized duplicate records were classified across two sentiment categories in upstream pipeline ETL."
  }
  ```

---

## 5. SQL Logic Audit by Service & Endpoint

| Endpoint | Service Method | Target BigQuery Tables | Deduplication & Query Technique |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/market/overview` | `MarketService.get_market_overview` | `summary_tables.overview` | Aggregates bank-level metrics; caches result for 1 hour. |
| `GET /api/v1/market/aspects` | `MarketService.get_market_aspects` | `summary_tables.aspect_analysis` | Filters `Total_Mentions > 0`, groups by genuine aspect name. |
| `GET /api/v1/banks/{name}/scorecard` | `BankService.get_bank_scorecard` | `summary_tables.overview` | Parameterized filter on `Bank = @bank_name`. |
| `GET /api/v1/banks/{name}/aspects` | `BankService.get_bank_aspects` | `summary_tables.aspect_analysis` | Parameterized bank filter; ranks aspect popularity and Net Sentiment Score (NSS). |
| `GET /api/v1/banks/{name}/versions` | `BankService.get_bank_version_performance` | `summary_tables.rating_analysis` | Groups by version; divides by bank-specific version sum (`bank_total_versioned`). |
| `GET /api/v1/banks/{name}/quotes` | `BankService.get_bank_verbatim_quotes` | `analysis_sentiment_long_reviews.aspect_reviews` | Joins sub-sentences with parameterized bank, aspect, and sentiment filters. |
| `GET /api/v1/benchmark/matrix` | `BenchmarkService.get_comparison_matrix` | `summary_tables.overview` | Supports dynamic subset filtering for 2 to 7 banks; calculates rating & sentiment gaps. |
| `GET /api/v1/reviews/search` | `ReviewService.search_reviews` | `bank_reviews.all_reviews`, `analysis_sentiment_long_reviews.aspect_reviews` | `ROW_NUMBER()` deduplication over `all_reviews`; `EXISTS` subquery for aspect filter. |
| `GET /api/v1/reviews/{id}` | `ReviewService.get_review_detail` | `bank_reviews.all_reviews`, `analysis_sentiment_long_reviews.aspect_reviews` | Parameterized lookup by review ID; secondary lookup for ABSA sub-sentences. |
| `GET /api/v1/reports/summary-tables` | `ExportService.export_summary_table` | `summary_tables.*` | Whitelist-validated table name; stream export to CSV or JSON. |
| `GET /api/v1/reports/reviews/export` | `ExportService.export_filtered_reviews` | `bank_reviews.all_reviews`, `analysis_sentiment_long_reviews.aspect_reviews` | Deduplicated query matching `ReviewService`; capped at `@limit_num <= 1000`. |

---

## 6. Discovered Defects & Minimal Fixes Applied

### Defect 1: Join Cardinality in Review Search and Export
- **Identified Risk:** Using `INNER JOIN (SELECT DISTINCT review_id ...)` for aspect filtering could cause unexpected planner behavior and join overhead on larger offsets.
- **Resolution:** Refactored both `ReviewService.search_reviews` and `ExportService.export_filtered_reviews` to use an explicit `WHERE EXISTS (SELECT 1 FROM aspect_reviews a WHERE a.review_id = r.ID AND a.Aspect = @aspect)` semi-join condition.
- **Outcome:** Clean execution plan in BigQuery, zero row duplication, and 100% consistent row counts between count queries and data fetch queries.

### Defect 2: Export Service Unused Aspect Join Clause
- **Identified Issue:** In `ExportService.export_filtered_reviews`, the aspect filter previously injected an `aspect_join` string into the `FROM` clause while other filters were in `where_clause`.
- **Resolution:** Consolidated the aspect condition into the main `conditions` list using the `EXISTS` clause, removing the separate join variable.

### Defect 3: Verification Test Gap
- **Identified Gap:** The integration test suite did not explicitly assert that reviews with multiple sub-sentences for the same aspect (such as `VCB_000829`) return exactly 1 item in the search results.
- **Resolution:** Added `test_aspect_filter_no_duplicate_rows` to `backend/tests/test_modules_integration.py` which validates both general aspect search and deep multi-filtered search against exact BigQuery counts.

---

## 7. Automated Test Suite Results

Full integration test execution against live Google Cloud BigQuery:
```text
============================= test session starts =============================
platform win32 -- Python 3.11.18, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Duy Khoi\DUE\NĂM 2\AI IN BUSINESS\Project_AI_In_Biz\backend
configfile: pyproject.toml
collected 22 items

tests/test_health_bigquery.py::test_root_endpoint PASSED                 [  4%]
tests/test_health_bigquery.py::test_liveness_endpoint PASSED             [  9%]
tests/test_health_bigquery.py::test_health_bigquery_connectivity PASSED  [ 13%]
tests/test_health_bigquery.py::test_bigquery_read_only_enforcement PASSED [ 18%]
tests/test_health_bigquery.py::test_bigquery_real_parameterized_query PASSED [ 22%]
tests/test_modules_integration.py::test_market_overview_endpoint PASSED  [ 27%]
tests/test_modules_integration.py::test_market_trends_endpoint PASSED    [ 31%]
tests/test_modules_integration.py::test_market_aspects_endpoint PASSED   [ 36%]
tests/test_modules_integration.py::test_bank_list_endpoint PASSED        [ 40%]
tests/test_modules_integration.py::test_bank_scorecard_endpoint PASSED   [ 45%]
tests/test_modules_integration.py::test_bank_aspects_endpoint PASSED     [ 50%]
tests/test_modules_integration.py::test_bank_versions_endpoint PASSED    [ 54%]
tests/test_modules_integration.py::test_bank_verbatim_quotes_endpoint PASSED [ 59%]
tests/test_modules_integration.py::test_benchmark_matrix_endpoint PASSED [ 63%]
tests/test_modules_integration.py::test_benchmark_aspects_and_ratings PASSED [ 68%]
tests/test_modules_integration.py::test_reviews_search_deduplication PASSED [ 72%]
tests/test_modules_integration.py::test_reviews_search_filters PASSED    [ 77%]
tests/test_modules_integration.py::test_aspect_filter_no_duplicate_rows PASSED [ 81%]
tests/test_modules_integration.py::test_reviews_detail_endpoint PASSED   [ 86%]
tests/test_modules_integration.py::test_reviews_filter_options PASSED    [ 90%]
tests/test_modules_integration.py::test_reports_export_summary PASSED    [ 95%]
tests/test_modules_integration.py::test_reports_export_filtered_reviews PASSED [100%]

======================= 22 passed, 1 warning in 26.92s ========================
```

---

## 8. Milestone 2 Completion Sign-Off & Status

| Audit Item | Status | Verification Detail |
| :--- | :--- | :--- |
| **Zero Mock Data Policy** | **PASSED** | 36 files audited; 0 mock data instances; 100% live BigQuery queries. |
| **Audit 1: App Version Denominators** | **PASSED** | Each bank's versions normalize strictly to `bank_total_versioned` (summing to 100%). Market-wide 16,017 is reference metadata only. |
| **Audit 2: Aspect Filter Deduplication** | **PASSED** | `EXISTS` semi-join strictly enforces 1 row per physical review, regardless of multi-subsentence counts (e.g. `VCB_000829`). |
| **Audit 3: 19,303 vs 19,308 Reconciliation** | **PASSED** | True baseline is 19,303 unique reviews. The 5-record difference is documented as cross-classified emoji duplicates in upstream ETL. |
| **All 5 Modules API Integration** | **PASSED** | 22/22 integration tests passing in 26.92s with live BigQuery connectivity. |
| **Read-Only / No Mutation Policy** | **PASSED** | BigQuery dataset state unchanged; read-only query checks active. |
| **Milestone 3 Non-Execution Boundary** | **PASSED** | Zero frontend code created. Awaiting explicit user approval. |
