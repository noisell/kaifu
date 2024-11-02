from fastapi import APIRouter, Depends
from sqlalchemy.sql.annotation import Annotated

from src.dependencies import responses, UOWDepends, get_current_user
from src.lottery.schemas import PricePoolSchema
from src.lottery.service import LotteryService
from src.schemas import TokenPayload

router = APIRouter(
    prefix="/lottery",
    tags=["Lottery"],
)

@router.get(path="/pool", name="Get Price Pool", responses=responses(401))
async def get_price_pool(uow: UOWDepends, _: Annotated[TokenPayload, Depends(get_current_user)]) -> PricePoolSchema | None:
    return await LotteryService().get_price_pool(uow=uow)