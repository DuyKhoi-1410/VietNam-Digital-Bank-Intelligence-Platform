from datetime import date
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class BankListItem(BaseModel):
    bank_name: str = Field(..., description="Official banking application name")
    total_reviews: int = Field(..., description="Total review volume in summary tables")
    average_rating: float = Field(..., description="Average star rating (1.0 - 5.0)")
    positive_ratio: float = Field(..., description="Percentage of reviews classified as positive (0-100)")


class BankScorecard(BaseModel):
    bank_name: str = Field(..., description="Banking application name")
    overall_average_rating: float = Field(..., description="Aggregate average rating across all months")
    total_reviews: int = Field(..., description="Total review occurrences tracked in summary_tables")
    # Separated Star Rating and NLP Sentiment Metrics
    star_rating_breakdown: Dict[str, int] = Field(
        ...,
        description="Rating counts for star_1, star_2, star_3, star_4, star_5"
    )
    sentiment_counts: Dict[str, int] = Field(
        ...,
        description="NLP sentiment counts for positive, neutral, negative"
    )
    sentiment_percentages: Dict[str, float] = Field(
        ...,
        description="NLP sentiment percentages for positive, neutral, negative (0-100)"
    )
    monthly_ratings: List[Dict[str, Any]] = Field(..., description="Rating and volume per month")
    data_completeness: str = Field("5 months tracked (2026-07 to 2026-11)", description="Observed duration")


class BankAspectScore(BaseModel):
    aspect_name: str = Field(..., description="Aspect name")
    sub_sentence_count: int = Field(..., description="Total sub-sentences for this bank & aspect")
    distinct_review_count: int = Field(..., description="Distinct long reviews contributing to this aspect")
    positive_count: int = Field(..., description="Positive sub-sentence count")
    neutral_count: int = Field(..., description="Neutral sub-sentence count")
    negative_count: int = Field(..., description="Negative sub-sentence count")
    net_sentiment_score: float = Field(..., description="Net Sentiment Score: ((Pos - Neg) / Total) * 100")
    aspect_share_pct: float = Field(..., description="Share of this bank's total sub-sentences")


class BankAspectsResponse(BaseModel):
    bank_name: str = Field(..., description="Banking application name")
    bank_total_sub_sentences: int = Field(..., description="Total ABSA sub-sentences for this bank")
    aspects: List[BankAspectScore] = Field(..., description="7 aspects ranked by sub-sentence count")
    absa_disclosure: str = Field(
        "Aspect metrics are derived strictly from detailed reviews (>= 4 words) decomposed into sub-sentences.",
        description="Methodological notice"
    )


class VersionPerformanceItem(BaseModel):
    app_version: str = Field(..., description="Release version string or 'Not specified'")
    review_count: int = Field(..., description="Reviews recorded for this version build")
    version_share_pct: float = Field(
        ...,
        description="Share of this bank's versioned reviews represented by this build"
    )
    star_breakdown: Dict[str, int] = Field(..., description="Counts for 1 to 5 stars")
    average_rating: float = Field(..., description="Average rating for this version")


class BankVersionsResponse(BaseModel):
    bank_name: str = Field(..., description="Banking application name")
    total_versioned_reviews: int = Field(
        ...,
        description="Reviews with valid App_Version recorded for this bank (denominator for versions)"
    )
    market_versioned_denominator: int = Field(
        16017,
        description="Market-wide total reviews with recorded App_Version across all 7 banks"
    )
    observational_disclaimer: str = Field(
        "Version analytics reflect observational tracking of user reviews submitted under each build. "
        "Before/after comparisons cannot establish software regression causality due to external shocks "
        "(e.g., Decree 2345 biometric authentication mandate), phased rollout schedules, and self-selection bias.",
        description="Non-causality statement"
    )
    versions: List[VersionPerformanceItem] = Field(..., description="App versions tracked for this bank")


class VerbatimQuote(BaseModel):
    sub_id: str = Field(..., description="Unique sub-sentence identifier")
    review_id: str = Field(..., description="Parent review ID linking to bank_reviews.all_reviews")
    user: str = Field(..., description="Reviewer display name")
    rating: int = Field(..., description="Star rating given by the user")
    sub_sentence: str = Field(..., description="Verbatim customer feedback snippet")
    aspect: str = Field(..., description="Assigned ABSA category")
    sentiment: str = Field(..., description="POSITIVE, NEGATIVE, or NEUTRAL")


class BankQuotesResponse(BaseModel):
    bank_name: str = Field(..., description="Banking application name")
    aspect: str = Field(..., description="Filtered aspect")
    sentiment_filter: Optional[str] = Field(None, description="Sentiment filter if applied")
    total_returned: int = Field(..., description="Number of quotes returned")
    quotes: List[VerbatimQuote] = Field(..., description="List of verbatim sub-sentence quotes")
