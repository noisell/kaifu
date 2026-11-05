from abc import ABC, abstractmethod
from typing import Type

from src.admin.repository import AdminRepository
from src.database import session_factory
from src.lottery.repository import PricePoolRepository, BankRepository, TicketRepository, CounterLotRepository, \
    PurchaseHistoryRepository, TicketWonRepository
from src.system.repository import SystemRepository, HistoryMoneyRepository
from src.user.repository import UserRepository, TaskRepository


class IUnitOfWork(ABC):

    user: Type[UserRepository]
    task: Type[TaskRepository]
    system: Type[SystemRepository]
    price_pool = Type[PricePoolRepository]
    ticket = Type[TicketRepository]
    bank = Type[BankRepository]
    counter_lot = Type[CounterLotRepository]
    purchase_history = Type[PurchaseHistoryRepository]
    ticket_won = Type[TicketWonRepository]
    history_money = Type[HistoryMoneyRepository]
    admin = Type[AdminRepository]

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
        self.task = TaskRepository(self.session)
        self.system = SystemRepository(self.session)
        self.price_pool = PricePoolRepository(self.session)
        self.ticket = TicketRepository(self.session)
        self.bank = BankRepository(self.session)
        self.counter_lot = CounterLotRepository(self.session)
        self.purchase_history = PurchaseHistoryRepository(self.session)
        self.ticket_won = TicketWonRepository(self.session)
        self.history_money = HistoryMoneyRepository(self.session)
        self.admin = AdminRepository(self.session)

        return self

    async def __aexit__(self, *args):
        await self.rollback()
        await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()