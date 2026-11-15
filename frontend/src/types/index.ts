// TypeScript models mirroring backend Pydantic schemas 1:1

// Health
export type ServiceStatus = "healthy" | "degraded" | "unhealthy";

export interface BigQueryHealth {
  connected: boolean;
  project_id: string;
  location: string;
  auth_method: string;
  latency_ms: number;
  accessible_datasets: string[];
  server_time: string | null;
  error: string | null;
}

export interface HealthResponse {
  status: ServiceStatus;
  app_name: string;
  app_version: string;
  environment: string;
  timestamp: string;
  bigquery: BigQueryHealth;
}

// Market Overview
export interface SentimentDistribution {
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
}

export interface MonthlyMarketTrend {
  review_month: string;
  average_rating: number;
  review_volume: number;
  positive_reviews: number;
  neutral_reviews: number;
  negative_reviews: number;
}

export interface AspectMetric {
  aspect_name: string;
  sub_sentence_count: number;
  distinct_reviews_count: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  net_sentiment_score: number;
}

export interface MarketPainPoint {
  aspect_name: string;
  negative_sub_sentences: number;
  negative_share_pct: number;
  net_sentiment_score: number;
  primary_complaint_driver: string;
}

export interface MarketOverviewResponse {
  unique_baseline_reviews: number;
  total_overview_occurrences: number;
  market_average_rating: number;
  sentiment_distribution: SentimentDistribution;
  total_banks_tracked: number;
  date_range: string;
  absa_disclosure: string;
}

export interface MarketTrendsResponse {
  date_range: string;
  monthly_trends: MonthlyMarketTrend[];
}

export interface MarketAspectsResponse {
  total_sub_sentences: number;
  total_detailed_reviews: number;
  aspects: AspectMetric[];
  pain_points: MarketPainPoint[];
}

// Bank Insights
export interface BankListItem {
  bank_name: string;
  total_reviews: number;
  average_rating: number;
  positive_ratio: number;
}

export interface BankScorecard {
  bank_name: string;
  overall_average_rating: number;
  total_reviews: number;
  star_rating_breakdown: Record<string, number>;
  sentiment_counts: Record<string, number>;
  sentiment_percentages: Record<string, number>;
  monthly_ratings: Array<{
    month: string;
    average_rating: number;
    review_count: number;
    positive: number;
    neutral: number;
    negative: number;
  }>;
  data_completeness: string;
}

export interface BankAspectScore {
  aspect_name: string;
  sub_sentence_count: number;
  distinct_review_count: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  net_sentiment_score: number;
  aspect_share_pct: number;
}

export interface BankAspectsResponse {
  bank_name: string;
  bank_total_sub_sentences: number;
  aspects: BankAspectScore[];
  absa_disclosure: string;
}

export interface VersionPerformanceItem {
  app_version: string;
  review_count: number;
  version_share_pct: number;
  star_breakdown: Record<string, number>;
  average_rating: number;
}

export interface BankVersionsResponse {
  bank_name: string;
  total_versioned_reviews: number;
  market_versioned_denominator: number;
  observational_disclaimer: string;
  versions: VersionPerformanceItem[];
}

export interface VerbatimQuote {
  sub_id: string;
  review_id: string;
  user: string;
  rating: number;
  sub_sentence: string;
  aspect: string;
  sentiment: string;
}

export interface BankQuotesResponse {
  bank_name: string;
  aspect: string | null;
  sentiment: string | null;
  count: number;
  quotes: VerbatimQuote[];
}

// Competitive Benchmark
export interface BankComparisonEntry {
  bank_name: string;
  total_reviews: number;
  average_rating: number;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
  top_strength_aspect: string;
  top_strength_nss: number;
  top_weakness_aspect: string;
  top_weakness_nss: number;
}

export interface AspectBenchmarkCell {
  bank_name: string;
  sub_sentence_count: number;
  net_sentiment_score: number;
  positive_count: number;
  negative_count: number;
}

export interface AspectBenchmarkRow {
  aspect_name: string;
  market_average_nss: number;
  bank_scores: AspectBenchmarkCell[];
}

export interface RatingDistributionEntry {
  bank_name: string;
  total_rated_reviews: number;
  star_1_pct: number;
  star_2_pct: number;
  star_3_pct: number;
  star_4_pct: number;
  star_5_pct: number;
}

export interface BenchmarkGapInsight {
  metric_name: string;
  leader_bank: string;
  leader_value: number;
  laggard_bank: string;
  laggard_value: number;
  gap_value: number;
  description: string;
}

export interface BenchmarkMatrixResponse {
  selected_banks: string[];
  matrix: BankComparisonEntry[];
  key_gaps: BenchmarkGapInsight[];
  absa_disclosure: string;
}

export interface AspectBenchmarkResponse {
  aspect_matrix: AspectBenchmarkRow[];
}

export interface RatingBenchmarkResponse {
  rating_distributions: RatingDistributionEntry[];
}

// Review Explorer
export interface SentimentProbabilities {
  positive: number;
  neutral: number;
  negative: number;
}

export interface ReviewItem {
  id: string;
  bank: string;
  user: string;
  rating: number;
  time: string;
  comment: string;
  clean_comment: string | null;
  word_count: number;
  likes: number;
  app_version: string;
  sentiment_label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  probabilities: SentimentProbabilities;
  is_long_review: boolean;
}

export interface PaginatedReviewsResponse {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  unique_baseline: number;
  reviews: ReviewItem[];
}

export interface ReviewSubSentenceDetail {
  sub_id: string;
  sub_sentence: string;
  aspect: string;
  sentiment: string;
}

export interface ReviewDetailResponse {
  review: ReviewItem;
  sub_sentences: ReviewSubSentenceDetail[];
  absa_notice: string;
}

export interface FilterOptionsResponse {
  banks: string[];
  ratings: number[];
  sentiments: string[];
  genuine_aspects: string[];
  app_versions: string[];
  min_date: string;
  max_date: string;
}

// Reports & Export
export type ExportDatasetType =
  | "overview"
  | "aspect_analysis"
  | "rating_analysis"
  | "sentiment_analysis"
  | "filtered_reviews";

export type ExportFormat = "csv" | "json";
