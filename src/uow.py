from abc import ABC, abstractmethod
from typing import Type

from src.database import session_factory
from src.lottery.repository import PricePoolRepository
from src.system.repository import SystemRepository
from src.user.repository import UserRepository


class IUnitOfWork(ABC):

    user: Type[UserRepository]
    system: Type[SystemRepository]
    price_pool = Type[PricePoolRepository]

    @abstractmethod
    def __init__(self):
        ...

    @abstractmethod
    async def __aenter__(self):
        ...

    @abstractmethod
    async def __aexit__(self, *args):
        ...

    @abstractmethod
    async def commit(self):
        ...

    @abstractmethod
    async def rollback(self):
        ...


class UnitOfWork:
    def __init__(self):
        self.session_factory = session_factory

    async def __aenter__(self):
        self.session = self.session_factory()
        self.user = UserRepository(self.session)
        self.system = SystemRepository(self.session)
        self.price_pool = PricePoolRepository(self.session)
        return self

    async def __aexit__(self, *args):
        await self.rollback()
        await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()