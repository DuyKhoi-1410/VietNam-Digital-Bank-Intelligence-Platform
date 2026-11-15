from fastapi import APIRouter, Depends
from app.api.deps import get_market_service
from app.schemas.market import (
    MarketAspectsResponse,
    MarketOverviewResponse,
    MarketTrendsResponse,
)
from app.services.market_service import MarketService

router = APIRouter(prefix="/market", tags=["Module 1: Market Overview"])


@router.get(
    "/overview",
    response_model=MarketOverviewResponse,
    summary="Market-Wide KPIs & Sentiment Baseline",
    description="Returns aggregate market metrics including baseline unique reviews (19,303), summary occurrences (19,308), average rating, and macro sentiment share."
)
async def get_market_overview(
    service: MarketService = Depends(get_market_service)
) -> MarketOverviewResponse:
    return service.get_market_overview()


@router.get(
    "/trends",
    response_model=MarketTrendsResponse,
    summary="Monthly Market Rating & Volume Trends",
    description="Returns monthly chronological rating and review volume trajectories across July–November 2026."
)
async def get_market_trends(
    service: MarketService = Depends(get_market_service)
) -> MarketTrendsResponse:
    return service.get_market_trends()


@router.get(
    "/aspects",
    response_model=MarketAspectsResponse,
    summary="Market-Wide Genuine ABSA & Friction Pain Points",
    description="Returns aspect volume, Net Sentiment Scores, and identified market pain points derived from 13,864 sub-sentences across 8,666 detailed reviews."
)
async def get_market_aspects(
    service: MarketService = Depends(get_market_service)
) -> MarketAspectsResponse:
    return service.get_market_aspects()
