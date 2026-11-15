from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class BankComparisonEntry(BaseModel):
    bank_name: str = Field(..., description="Banking application name")
    total_reviews: int = Field(..., description="Total review count in summary tables")
    average_rating: float = Field(..., description="Overall average star rating")
    positive_pct: float = Field(..., description="Percentage of positive reviews")
    neutral_pct: float = Field(..., description="Percentage of neutral reviews")
    negative_pct: float = Field(..., description="Percentage of negative reviews")
    top_strength_aspect: str = Field(
        ...,
        description="Aspect with highest Net Sentiment Score for this bank (derived from aspect_analysis)"
    )
    top_strength_nss: float = Field(..., description="Net Sentiment Score of top aspect")
    top_weakness_aspect: str = Field(
        ...,
        description="Aspect with lowest Net Sentiment Score for this bank (derived from aspect_analysis)"
    )
    top_weakness_nss: float = Field(..., description="Net Sentiment Score of weakest aspect")


class AspectBenchmarkCell(BaseModel):
    bank_name: str = Field(..., description="Banking application name")
    sub_sentence_count: int = Field(..., description="Total sub-sentences for this aspect")
    net_sentiment_score: float = Field(..., description="Net Sentiment Score for this bank on this aspect")
    positive_count: int = Field(..., description="Positive sub-sentence count")
    negative_count: int = Field(..., description="Negative sub-sentence count")


class AspectBenchmarkRow(BaseModel):
    aspect_name: str = Field(..., description="One of 7 verified banking aspects")
    market_average_nss: float = Field(..., description="Market-wide average Net Sentiment Score for this aspect")
    bank_scores: List[AspectBenchmarkCell] = Field(..., description="Scores for each evaluated bank")


class RatingDistributionEntry(BaseModel):
    bank_name: str = Field(..., description="Banking application name")
    total_rated_reviews: int = Field(..., description="Total reviews with star ratings")
    star_1_pct: float = Field(..., description="Percentage of 1-star ratings")
    star_2_pct: float = Field(..., description="Percentage of 2-star ratings")
    star_3_pct: float = Field(..., description="Percentage of 3-star ratings")
    star_4_pct: float = Field(..., description="Percentage of 4-star ratings")
    star_5_pct: float = Field(..., description="Percentage of 5-star ratings")


class BenchmarkGapInsight(BaseModel):
    metric_name: str = Field(..., description="Name of the evaluated benchmark metric")
    leader_bank: str = Field(..., description="Bank leading this metric")
    leader_value: float = Field(..., description="Value achieved by the leader")
    laggard_bank: str = Field(..., description="Bank trailing in this metric")
    laggard_value: float = Field(..., description="Value of the trailing bank")
    gap_value: float = Field(..., description="Difference between leader and laggard")
    description: str = Field(..., description="Empirical summary of the gap")


class BenchmarkMatrixResponse(BaseModel):
    selected_banks: List[str] = Field(..., description="List of banks compared")
    matrix: List[BankComparisonEntry] = Field(..., description="Side-by-side benchmark entries")
    key_gaps: List[BenchmarkGapInsight] = Field(..., description="Empirical benchmark gaps derived from metrics")
    absa_disclosure: str = Field(
        "Strengths and weaknesses are derived strictly from genuine ABSA data in summary_tables.aspect_analysis.",
        description="Disclosure notice"
    )


class AspectBenchmarkResponse(BaseModel):
    aspect_matrix: List[AspectBenchmarkRow] = Field(..., description="Aspect-by-aspect matrix across banks")


class RatingBenchmarkResponse(BaseModel):
    rating_distributions: List[RatingDistributionEntry] = Field(
        ...,
        description="100% normalized 1 to 5 star distributions per bank"
    )
