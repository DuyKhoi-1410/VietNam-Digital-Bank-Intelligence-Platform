from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.api.deps import get_bank_service
from app.schemas.banks import (
    BankAspectsResponse,
    BankListItem,
    BankQuotesResponse,
    BankScorecard,
    BankVersionsResponse,
)
from app.services.bank_service import BankService

router = APIRouter(prefix="/banks", tags=["Module 2: Bank Insights"])


@router.get(
    "",
    response_model=List[BankListItem],
    summary="List Tracked Digital Banking Applications",
    description="Returns the 7 digital banking apps in scope with total reviews, average rating, and positive review percentage."
)
async def list_banks(
    service: BankService = Depends(get_bank_service)
) -> List[BankListItem]:
    return service.list_banks()


@router.get(
    "/{bank_name}/scorecard",
    response_model=BankScorecard,
    summary="Individual Bank KPI Scorecard",
    description="Returns bank-specific star ratings (1-5 stars) and NLP sentiment (Positive/Neutral/Negative) as separate, independent metrics."
)
async def get_bank_scorecard(
    bank_name: str,
    service: BankService = Depends(get_bank_service)
) -> BankScorecard:
    return service.get_bank_scorecard(bank_name)


@router.get(
    "/{bank_name}/aspects",
    response_model=BankAspectsResponse,
    summary="Bank Aspect Sentiment Scores (ABSA)",
    description="Returns Net Sentiment Scores, positive/negative sub-sentence counts, and aspect distribution for the specified bank across all 7 categories."
)
async def get_bank_aspects(
    bank_name: str,
    service: BankService = Depends(get_bank_service)
) -> BankAspectsResponse:
    return service.get_bank_aspects(bank_name)


@router.get(
    "/{bank_name}/versions",
    response_model=BankVersionsResponse,
    summary="Observational App Version Rating Breakdown",
    description="Returns rating performance by app version build. Versioned review totals are grounded in the 16,017 verified market versioned denominator."
)
async def get_bank_versions(
    bank_name: str,
    service: BankService = Depends(get_bank_service)
) -> BankVersionsResponse:
    return service.get_bank_versions(bank_name)


@router.get(
    "/{bank_name}/quotes",
    response_model=BankQuotesResponse,
    summary="Verbatim User Feedback Evidence",
    description="Returns original sub-sentence feedback snippets from detailed user reviews for a specific bank."
)
async def get_bank_quotes(
    bank_name: str,
    aspect: Optional[str] = Query(None, description="Optional target aspect"),
    sentiment: Optional[str] = Query(None, description="Optional sentiment filter: 'POSITIVE', 'NEGATIVE', 'NEUTRAL'"),
    limit: int = Query(20, ge=1, le=100, description="Max quotes to return (capped at 100)"),
    service: BankService = Depends(get_bank_service)
) -> BankQuotesResponse:
    return service.get_bank_quotes(bank_name, aspect=aspect, sentiment=sentiment, limit=limit)
