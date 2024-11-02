from sqlalchemy import select

from src.repository import SQLAlchemyRepository
from src.system.models import System, SystemNames
from src.system.schemas import SystemSchema


class SystemRepository(SQLAlchemyRepository):
    model = System

    async def get_by_name(self, name: SystemNames) -> SystemSchema:
        query = select(self.model).where(self.model.name == name.value)
        query_result = await self.session.execute(query)
        result = query_result.scalar_one()
        return SystemSchema.model_validate(result, from_attributes=True)