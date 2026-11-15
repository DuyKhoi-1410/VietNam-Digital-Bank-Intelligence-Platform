import json
import sys
import os
sys.path.insert(0, os.path.abspath("."))
from app.db.bigquery import bigquery_service

# 1. Audit 1: Bank Version Totals and Denominators
sql_v1 = """
SELECT 
  Bank,
  COUNT(DISTINCT App_Version) as distinct_versions,
  SUM(Rating_Frequency) as bank_versioned_reviews
FROM `aiinbusinessgroup3.summary_tables.rating_analysis`
GROUP BY Bank
ORDER BY bank_versioned_reviews DESC
"""
rows_v1 = bigquery_service.execute_query(sql_v1)
total_versioned = sum(r['bank_versioned_reviews'] for r in rows_v1)
print("=== AUDIT 1: Bank Versioned Review Totals ===")
for r in rows_v1:
    print(f"  {r['Bank']}: {r['bank_versioned_reviews']} reviews, {r['distinct_versions']} versions")
print(f"Total across all 7 banks: {total_versioned} (Matches 16,017: {total_versioned == 16017})")

# 2. Compare with all_reviews null App_Version rate per bank
sql_v1_nulls = """
SELECT 
  Bank,
  COUNT(*) as total_in_all_reviews,
  COUNTIF(App_Version IS NOT NULL) as non_null_versions,
  COUNTIF(App_Version IS NULL) as null_versions,
  ROUND(COUNTIF(App_Version IS NULL) * 100.0 / COUNT(*), 2) as null_pct
FROM `aiinbusinessgroup3.bank_reviews.all_reviews`
GROUP BY Bank
ORDER BY total_in_all_reviews DESC
"""
rows_v1_nulls = bigquery_service.execute_query(sql_v1_nulls)
print("\n=== AUDIT 1: all_reviews App_Version Missingness per Bank ===")
for r in rows_v1_nulls:
    print(f"  {r['Bank']}: Total={r['total_in_all_reviews']}, Non-Null={r['non_null_versions']}, Null={r['null_versions']} ({r['null_pct']}%)")

# 3. Audit 2: Aspect filtering - check if reviews have multiple sub-sentences in aspect_reviews
sql_v2_mult = """
SELECT 
  review_id,
  Aspect,
  COUNT(*) as sub_sentence_count
FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews`
GROUP BY review_id, Aspect
HAVING sub_sentence_count > 1
LIMIT 5
"""
rows_v2_mult = bigquery_service.execute_query(sql_v2_mult)
print("\n=== AUDIT 2: Reviews with Multiple Sub-Sentences for the SAME Aspect ===")
for r in rows_v2_mult:
    print(f"  Review ID {r['review_id']} has {r['sub_sentence_count']} sub-sentences for aspect '{r['Aspect']}'")

# Check total unique reviews that mention 'Bảo mật & Đăng nhập'
sql_v2_distinct_aspect = """
SELECT 
  COUNT(DISTINCT review_id) as distinct_reviews_in_aspect_reviews
FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews`
WHERE Aspect = 'Bảo mật & Đăng nhập'
"""
rows_v2_dist = bigquery_service.execute_query(sql_v2_distinct_aspect)
print(f"Distinct reviews with 'Bảo mật & Đăng nhập': {rows_v2_dist[0]['distinct_reviews_in_aspect_reviews']}")

# Check total sub-sentences in aspect_reviews for 'Bảo mật & Đăng nhập'
sql_v2_sub_aspect = """
SELECT 
  COUNT(*) as total_sub_sentences
FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews`
WHERE Aspect = 'Bảo mật & Đăng nhập'
"""
rows_v2_sub = bigquery_service.execute_query(sql_v2_sub_aspect)
print(f"Total sub-sentences with 'Bảo mật & Đăng nhập': {rows_v2_sub[0]['total_sub_sentences']}")

# 4. Audit 3: Reconcile 19,303 distinct vs 19,308 overview occurrences
sql_v3_distinct = """
SELECT 
  COUNT(*) as raw_total_rows,
  COUNT(DISTINCT ID) as unique_deduplicated_ids
FROM `aiinbusinessgroup3.bank_reviews.all_reviews`
"""
rows_v3_dist = bigquery_service.execute_query(sql_v3_distinct)
print("\n=== AUDIT 3: 19,303 vs 19,308 Reconciliation ===")
print(f"all_reviews Total Rows: {rows_v3_dist[0]['raw_total_rows']}")
print(f"all_reviews Distinct IDs: {rows_v3_dist[0]['unique_deduplicated_ids']}")

sql_v3_overview = """
SELECT 
  SUM(Positive_Reviews) as pos,
  SUM(Neutral_Reviews) as neu,
  SUM(Negative_Reviews) as neg,
  SUM(Positive_Reviews + Neutral_Reviews + Negative_Reviews) as overview_sum
FROM `aiinbusinessgroup3.summary_tables.overview`
"""
rows_v3_ov = bigquery_service.execute_query(sql_v3_overview)
print(f"summary_tables.overview Sum: {rows_v3_ov[0]['overview_sum']} (Pos={rows_v3_ov[0]['pos']}, Neu={rows_v3_ov[0]['neu']}, Neg={rows_v3_ov[0]['neg']})")
import json
import sys
import os
sys.path.insert(0, os.path.abspath("."))
from app.db.bigquery import bigquery_service

# 1. Compare JOIN with DISTINCT vs WHERE EXISTS
sql_join = """
WITH deduplicated AS (
  SELECT 
    r.ID,
    ROW_NUMBER() OVER(PARTITION BY r.ID ORDER BY r.Word_Count ASC, r.Time DESC) as rn
  FROM `aiinbusinessgroup3.bank_reviews.all_reviews` r
  INNER JOIN (SELECT DISTINCT review_id FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews` WHERE Aspect = 'Bảo mật & Đăng nhập') a
    ON r.ID = a.review_id
)
SELECT COUNT(*) as cnt FROM deduplicated WHERE rn = 1
"""
res_join = bigquery_service.execute_query(sql_join)[0]['cnt']

sql_exists = """
WITH deduplicated AS (
  SELECT 
    r.ID,
    ROW_NUMBER() OVER(PARTITION BY r.ID ORDER BY r.Word_Count ASC, r.Time DESC) as rn
  FROM `aiinbusinessgroup3.bank_reviews.all_reviews` r
  WHERE EXISTS (
    SELECT 1 FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews` a 
    WHERE a.review_id = r.ID AND a.Aspect = 'Bảo mật & Đăng nhập'
  )
)
SELECT COUNT(*) as cnt FROM deduplicated WHERE rn = 1
"""
res_exists = bigquery_service.execute_query(sql_exists)[0]['cnt']

print("\n=== AUDIT 2: Join with DISTINCT vs WHERE EXISTS Comparison ===")
print("Join with SELECT DISTINCT count:", res_join)
print("WHERE EXISTS count:", res_exists)
print("Are they identical?", res_join == res_exists)

# 2. Check multi-condition filter combinations to ensure no inflation
sql_multi_filter = """
WITH deduplicated AS (
  SELECT 
    r.ID,
    ROW_NUMBER() OVER(PARTITION BY r.ID ORDER BY r.Word_Count ASC, r.Time DESC) as rn
  FROM `aiinbusinessgroup3.bank_reviews.all_reviews` r
  WHERE r.Bank = 'MB Bank'
    AND r.Rating = 1
    AND UPPER(r.Sentiment_Label) = 'NEGATIVE'
    AND EXISTS (
      SELECT 1 FROM `aiinbusinessgroup3.analysis_sentiment_long_reviews.aspect_reviews` a 
      WHERE a.review_id = r.ID AND a.Aspect = 'Bảo mật & Đăng nhập'
    )
)
SELECT COUNT(*) as cnt FROM deduplicated WHERE rn = 1
"""
res_multi = bigquery_service.execute_query(sql_multi_filter)[0]['cnt']
print(f"Multi-filter (MB Bank, Rating=1, NEGATIVE, Aspect='Bảo mật & Đăng nhập'): {res_multi} unique reviews")

# 3. Check unfiltered baseline
sql_unfiltered = """
WITH deduplicated AS (
  SELECT 
    r.ID,
    ROW_NUMBER() OVER(PARTITION BY r.ID ORDER BY r.Word_Count ASC, r.Time DESC) as rn
  FROM `aiinbusinessgroup3.bank_reviews.all_reviews` r
)
SELECT COUNT(*) as cnt FROM deduplicated WHERE rn = 1
"""
res_unfiltered = bigquery_service.execute_query(sql_unfiltered)[0]['cnt']
print(f"Unfiltered deduplicated baseline: {res_unfiltered} (Matches 19,303: {res_unfiltered == 19303})")
