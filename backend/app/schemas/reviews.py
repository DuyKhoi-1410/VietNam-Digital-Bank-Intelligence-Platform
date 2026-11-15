from datetime import date
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SentimentProbabilities(BaseModel):
    positive: float = Field(..., description="Model probability for positive sentiment (0.0 - 1.0)")
    neutral: float = Field(..., description="Model probability for neutral sentiment (0.0 - 1.0)")
    negative: float = Field(..., description="Model probability for negative sentiment (0.0 - 1.0)")


class ReviewItem(BaseModel):
    id: str = Field(..., description="Unique review identifier (e.g. BIDV_016690)")
    bank: str = Field(..., description="Banking application name")
    user: str = Field(..., description="Reviewer display name")
    rating: int = Field(..., description="Star rating (1 to 5)")
    time: str = Field(..., description="ISO 8601 UTC timestamp")
    comment: str = Field(..., description="Original raw review text")
    clean_comment: Optional[str] = Field(None, description="Preprocessed clean comment")
    word_count: int = Field(..., description="Word count")
    likes: int = Field(0, description="Thumbs-up count on Google Play")
    app_version: str = Field("Not specified", description="Recorded app version or 'Not specified'")
    sentiment_label: str = Field(..., description="POSITIVE, NEGATIVE, or NEUTRAL")
    probabilities: SentimentProbabilities = Field(..., description="Sentiment confidence scores")
    is_long_review: bool = Field(..., description="Whether Word_Count >= 4 (qualifies for ABSA)")


class PaginatedReviewsResponse(BaseModel):
    page: int = Field(..., description="Current page index (1-indexed)")
    page_size: int = Field(..., description="Number of reviews requested per page")
    total_items: int = Field(..., description="Total reviews matching the applied filters")
    total_pages: int = Field(..., description="Total pages available")
    unique_baseline: int = Field(
        19303,
        description="Expected total unique reviews across the entire database under validated deduplication rule"
    )
    reviews: List[ReviewItem] = Field(..., description="List of deduplicated review records")


class ReviewSubSentenceDetail(BaseModel):
    sub_id: str = Field(..., description="Unique sub-sentence identifier")
    sub_sentence: str = Field(..., description="Sub-sentence text clause")
    aspect: str = Field(..., description="Assigned ABSA aspect")
    sentiment: str = Field(..., description="Sentiment for this sub-sentence")


class ReviewDetailResponse(BaseModel):
    review: ReviewItem = Field(..., description="Master review record")
    sub_sentences: List[ReviewSubSentenceDetail] = Field(
        default_factory=list,
        description="Decomposed ABSA sub-sentences (available for long reviews >= 4 words)"
    )
    absa_notice: str = Field(
        "Sub-sentence aspect breakdowns are available for detailed reviews (>= 4 words). Short reviews are evaluated at review-level only.",
        description="Exploration guide"
    )


class FilterOptionsResponse(BaseModel):
    banks: List[str] = Field(..., description="List of 7 banking applications")
    ratings: List[int] = Field([1, 2, 3, 4, 5], description="Available star ratings")
    sentiments: List[str] = Field(["POSITIVE", "NEUTRAL", "NEGATIVE"], description="Normalized sentiment labels")
    genuine_aspects: List[str] = Field(..., description="7 genuine ABSA aspects")
    app_versions: List[str] = Field(..., description="Distinct app versions including 'Not specified'")
    min_date: date = Field(..., description="Earliest recorded review date")
    max_date: date = Field(..., description="Latest recorded review date")
