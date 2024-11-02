from src.system.models import SystemNames
from src.system.schemas import SystemSchema
from src.uow import IUnitOfWork


class SystemService:

    @classmethod
    async def get_system_by_name(cls, uow: IUnitOfWork, name: SystemNames) -> SystemSchema:
        async with uow:
            return await uow.system.get_by_name(name)
