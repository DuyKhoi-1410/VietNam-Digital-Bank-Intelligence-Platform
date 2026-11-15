from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.api.deps import get_benchmark_service
from app.schemas.benchmark import (
    AspectBenchmarkResponse,
    BenchmarkMatrixResponse,
    RatingBenchmarkResponse,
)
from app.services.benchmark_service import BenchmarkService

router = APIRouter(prefix="/benchmark", tags=["Module 3: Competitive Benchmark"])


@router.get(
    "/matrix",
    response_model=BenchmarkMatrixResponse,
    summary="Multi-Bank Head-to-Head Benchmark Matrix",
    description="Compares 2–4 selected banks (or all 7 banks) on average ratings, review volume, sentiment ratios, and empirical strengths/weaknesses."
)
async def get_benchmark_matrix(
    banks: Optional[List[str]] = Query(None, description="List of bank names to compare (defaults to all 7 banks)"),
    service: BenchmarkService = Depends(get_benchmark_service)
) -> BenchmarkMatrixResponse:
    return service.get_benchmark_matrix(bank_names=banks)


@router.get(
    "/aspects",
    response_model=AspectBenchmarkResponse,
    summary="Cross-Bank Aspect Performance Comparison",
    description="Compares Net Sentiment Scores and sub-sentence volumes across all 7 banking aspects for the selected institutions."
)
async def get_aspect_benchmark(
    banks: Optional[List[str]] = Query(None, description="Optional bank filter list"),
    service: BenchmarkService = Depends(get_benchmark_service)
) -> AspectBenchmarkResponse:
    return service.get_aspect_benchmark(bank_names=banks)


@router.get(
    "/ratings",
    response_model=RatingBenchmarkResponse,
    summary="1★ to 5★ Star Rating Distribution Benchmark",
    description="Returns percentage distributions of 1-star through 5-star ratings for each bank."
)
async def get_rating_benchmark(
    banks: Optional[List[str]] = Query(None, description="Optional bank filter list"),
    service: BenchmarkService = Depends(get_benchmark_service)
) -> RatingBenchmarkResponse:
    return service.get_rating_benchmark(bank_names=banks)
