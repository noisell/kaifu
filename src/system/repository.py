from sqlalchemy import select, or_, update

from src.repository import SQLAlchemyRepository
from src.system.models import System, SystemNames, HistoryMoney
from src.system.schemas import SystemSchema, HistoryMoneySchema, HistoryMoneySimpleSchema


class SystemRepository(SQLAlchemyRepository[System, SystemSchema]):
    model = System
    schema = SystemSchema

    async def get_by_name(self, name: SystemNames) -> SystemSchema:
        query = select(self.model).where(self.model.name == name.value)
        query_result = await self.session.execute(query)
        result = query_result.scalar_one()
        return SystemSchema.model_validate(result, from_attributes=True)

    async def get_data(self) -> list[SystemSchema]:
        query = select(self.model).where(or_(
            self.model.name == SystemNames.course,self.model.name == SystemNames.price_gold_ticket, self.model.name == SystemNames.price_silver_ticket))
        query_result = await self.session.execute(query)
        result = query_result.scalars().all()
        return [SystemSchema.model_validate(i, from_attributes=True) for i in result]

    async def update_data(self, name: SystemNames, value: str) -> None:
        stmt = update(self.model).where(self.model.name == name).values(value=value)
        await self.session.execute(stmt)


class HistoryMoneyRepository(SQLAlchemyRepository[HistoryMoney, HistoryMoneySchema]):
    model = HistoryMoney
    schema = HistoryMoneySchema

    async def get_all_for_user(self, user_id: int) -> list[HistoryMoneySimpleSchema]:
        query = select(self.model).where(self.model.user_id == user_id).order_by(self.model.created_at.desc())
        query_result = await self.session.execute(query)
        history = query_result.scalars().all()
        return [HistoryMoneySimpleSchema.model_validate(h, from_attributes=True) for h in history]
