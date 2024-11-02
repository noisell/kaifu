from abc import ABC, abstractmethod
from typing import Type

from pydantic import BaseModel
from sqlalchemy import insert, select, update, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession


class AbstractRepository(ABC):
    @abstractmethod
    async def add(self, data: dict):
        raise NotImplementedError

    @abstractmethod
    async def add_and_return_id(self, data: dict):
        raise NotImplementedError

    @abstractmethod
    async def get_by_id(self, item_id: int):
        raise NotImplementedError

    @abstractmethod
    async def update(self, item_id: int, **kwargs):
        raise NotImplementedError

    @abstractmethod
    async def delete(self, item_id: int):
        raise NotImplementedError


class SQLAlchemyRepository(AbstractRepository, ABC):
    model = None
    schema: Type[BaseModel] | None = None

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_and_return_id(self, data: dict) -> int | bool:
        stmt = insert(self.model).values(**data).returning(self.model.id)
        try:
            print(data)
            res = await self.session.execute(stmt)
            return res.scalar_one()
        except IntegrityError:
            return False

    async def add(self, data: dict) -> bool:
        stmt = insert(self.model).values(**data)
        try:
            await self.session.execute(stmt)
            return True
        except IntegrityError:
            return False

    async def get_by_id(self, item_id: int) -> Type[schema]:
        query = select(self.model).where(item_id == self.model.id)
        try:
            query_result = await self.session.execute(query)
        except IntegrityError:
            return False
        result = query_result.scalar_one_or_none()
        return self.schema.model_validate(result, from_attributes=True)

    async def update(self, item_id: int, **kwargs) -> bool:
        stmt = update(self.model).where(item_id == self.model.id).values(**kwargs)
        try:
            await self.session.execute(stmt)
            return True
        except IntegrityError:
            return False

    async def delete(self, item_id: int) -> bool:
        stmt = delete(self.model).where(item_id == self.model.id)
        try:
            await self.session.execute(stmt)
            return True
        except IntegrityError:
            return False

