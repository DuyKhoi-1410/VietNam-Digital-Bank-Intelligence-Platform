from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field


class SentimentDistribution(BaseModel):
    positive_count: int = Field(..., description="Total positive reviews")
    neutral_count: int = Field(..., description="Total neutral reviews")
    negative_count: int = Field(..., description="Total negative reviews")
    positive_pct: float = Field(..., description="Percentage of positive reviews (0-100)")
    neutral_pct: float = Field(..., description="Percentage of neutral reviews (0-100)")
    negative_pct: float = Field(..., description="Percentage of negative reviews (0-100)")


class MonthlyMarketTrend(BaseModel):
    review_month: date = Field(..., description="First day of the calendar month (YYYY-MM-01)")
    average_rating: float = Field(..., description="Market average star rating for the month")
    review_volume: int = Field(..., description="Total review occurrences recorded in the month")
    positive_reviews: int = Field(..., description="Positive review count")
    neutral_reviews: int = Field(..., description="Neutral review count")
    negative_reviews: int = Field(..., description="Negative review count")


class AspectMetric(BaseModel):
    aspect_name: str = Field(..., description="One of 7 verified banking aspects")
    sub_sentence_count: int = Field(..., description="Total sub-sentences classified under this aspect")
    distinct_reviews_count: int = Field(..., description="Distinct long reviews mentioning this aspect")
    positive_count: int = Field(..., description="Positive sub-sentence count")
    neutral_count: int = Field(..., description="Neutral sub-sentence count")
    negative_count: int = Field(..., description="Negative sub-sentence count")
    net_sentiment_score: float = Field(
        ...,
        description="Net Sentiment Score: ((Positive - Negative) / Total) * 100, bounded between -100 and +100"
    )


class MarketPainPoint(BaseModel):
    aspect_name: str = Field(..., description="Aspect presenting significant user friction")
    negative_sub_sentences: int = Field(..., description="Volume of negative sub-sentence complaints")
    negative_share_pct: float = Field(..., description="Percentage of this aspect's mentions that are negative")
    net_sentiment_score: float = Field(..., description="Net Sentiment Score for this aspect")
    primary_complaint_driver: str = Field(..., description="Key friction category description")


class MarketOverviewResponse(BaseModel):
    unique_baseline_reviews: int = Field(
        19303,
        description="Verified unique review count in bank_reviews.all_reviews after deduplicating 93 emoji tokenization overlap pairs"
    )
    total_overview_occurrences: int = Field(
        19308,
        description="Total review occurrences in summary_tables.overview (19,303 unique + 5 cross-sentiment duplicates)"
    )
    market_average_rating: float = Field(..., description="Overall market average star rating across all 7 banks")
    sentiment_distribution: SentimentDistribution = Field(..., description="Macro sentiment breakdown")
    total_banks_tracked: int = Field(7, description="Number of digital banking apps in scope")
    date_range: str = Field("2026-07-01 to 2026-11-01", description="Verified calendar month range")
    absa_disclosure: str = Field(
        "Aspect-Based Sentiment Analysis is strictly evaluated on 8,666 detailed reviews (>= 4 words) segmented into 13,864 sub-sentences across 7 core categories. The 10,730 short reviews (<= 3 words) are excluded from genuine aspect metrics.",
        description="Mandatory methodological disclosure"
    )


class MarketTrendsResponse(BaseModel):
    date_range: str = Field(..., description="Evaluation time range")
    monthly_trends: List[MonthlyMarketTrend] = Field(..., description="Chronological monthly market trajectories")


class MarketAspectsResponse(BaseModel):
    total_sub_sentences: int = Field(13864, description="Total verified ABSA sub-sentences")
    total_detailed_reviews: int = Field(8666, description="Total detailed long reviews evaluated")
    aspects: List[AspectMetric] = Field(..., description="All 7 aspects sorted by sub-sentence volume")
    pain_points: List[MarketPainPoint] = Field(..., description="Key market friction areas ranked by complaint volume")
