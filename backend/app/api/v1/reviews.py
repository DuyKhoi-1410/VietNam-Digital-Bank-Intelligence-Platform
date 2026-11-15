from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.api.deps import get_review_service
from app.schemas.reviews import (
    FilterOptionsResponse,
    PaginatedReviewsResponse,
    ReviewDetailResponse,
)
from app.services.review_service import ReviewService

router = APIRouter(prefix="/reviews", tags=["Module 4: Review Explorer"])


@router.get(
    "/search",
    response_model=PaginatedReviewsResponse,
    summary="Paginated Search with Validated Deduplication",
    description="Queries the master review repository using the validated window deduplication rule (19,303 unique baseline reviews). Supports full multi-criteria filtering."
)
async def search_reviews(
    bank: Optional[str] = Query(None, description="Filter by bank name"),
    start_date: Optional[date] = Query(None, description="Filter reviews on or after date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="Filter reviews on or before date (YYYY-MM-DD)"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Filter by exact star rating (1 to 5)"),
    sentiment: Optional[str] = Query(None, description="Filter by sentiment: 'POSITIVE', 'NEGATIVE', 'NEUTRAL'"),
    aspect: Optional[str] = Query(None, description="Filter by genuine ABSA category (joins aspect_reviews)"),
    app_version: Optional[str] = Query(None, description="Filter by app version or 'Not specified'"),
    keyword: Optional[str] = Query(None, description="Search keyword in review comment text"),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(20, ge=1, le=100, description="Page size (max 100)"),
    service: ReviewService = Depends(get_review_service)
) -> PaginatedReviewsResponse:
    return service.search_reviews(
        bank=bank,
        start_date=start_date,
        end_date=end_date,
        rating=rating,
        sentiment=sentiment,
        aspect=aspect,
        app_version=app_version,
        keyword=keyword,
        page=page,
        page_size=page_size
    )


@router.get(
    "/filters/options",
    response_model=FilterOptionsResponse,
    summary="Filter Dropdown Options & Boundaries",
    description="Returns available filter options populated directly from BigQuery (verified banks, aspects, versions, date bounds)."
)
async def get_filter_options(
    service: ReviewService = Depends(get_review_service)
) -> FilterOptionsResponse:
    return service.get_filter_options()


@router.get(
    "/{review_id}",
    response_model=ReviewDetailResponse,
    summary="Single Review Details & ABSA Sub-Sentences",
    description="Retrieves a single deduplicated review and, if it is a detailed review (>= 4 words), includes its sub-sentence aspect breakdowns."
)
async def get_review_detail(
    review_id: str,
    service: ReviewService = Depends(get_review_service)
) -> ReviewDetailResponse:
    return service.get_review_detail(review_id)
