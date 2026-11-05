from src.system.models import SystemNames
from src.system.schemas import SystemSchema
from src.uow import UnitOfWork


class SystemService:

    @classmethod
    async def get_system_by_name(cls, uow: UnitOfWork, name: SystemNames) -> SystemSchema:
        async with uow:
            return await uow.system.get_by_name(name)

    @classmethod
    async def get_system_by_names(cls, uow: UnitOfWork) -> list[SystemSchema]:
        async with uow:
            return await uow.system.get_data()


