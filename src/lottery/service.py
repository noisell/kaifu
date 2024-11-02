from src.lottery.schemas import PricePoolSchema
from src.uow import UnitOfWork


class LotteryService:

    @classmethod
    async def get_price_pool(cls, uow: UnitOfWork) -> PricePoolSchema | None:
        async with uow:
            return await uow.price_pool.get_price_pool()