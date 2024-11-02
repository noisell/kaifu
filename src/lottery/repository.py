from sqlalchemy import select

from src.lottery.models import PricePool
from src.lottery.schemas import PricePoolSchema
from src.repository import SQLAlchemyRepository
from datetime import datetime, UTC


class PricePoolRepository(SQLAlchemyRepository):
    model = PricePool

    async def get_price_pool(self) -> PricePoolSchema | None:
        date_now = datetime.now(UTC).date()
        query = select(self.model).where(self.model.date == date_now)
        query_result = await self.session.execute(query)
        result = query_result.scalar_one_or_none()
        if not result:
            return
        return PricePoolSchema(today=result.today_count_coins, jackpot=result.jackpot_count_coins)

