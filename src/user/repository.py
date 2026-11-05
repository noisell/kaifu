from sqlalchemy import update, select, func
from sqlalchemy.orm import selectinload

from src.repository import SQLAlchemyRepository
from src.user.models import User, Task
from src.user.schemas import UserSchema, TaskSchema, FriendSchema, UserFullSchema


class UserRepository(SQLAlchemyRepository[User, UserSchema]):
    model = User
    schema = UserSchema

    async def update_balance(self, user_id: int, value: int, gold: bool = False, replace: bool = False):
        stmt = update(self.model).where(self.model.id == user_id)
        if gold:
            stmt = stmt.values(gold_coins=value if replace else self.model.gold_coins + value)
        else:
            stmt = stmt.values(silver_coins=value if replace else self.model.silver_coins + value)
        await self.session.execute(stmt)

    async def get_friends(self, user_id: int) -> list[FriendSchema]:
        query = select(self.model).where(self.model.referrer_id == user_id)
        query_data = await self.session.execute(query)
        friends = query_data.scalars().all()
        return [FriendSchema.model_validate(friend, from_attributes=True) for friend in friends]

    async def get_all_users(self) -> list[UserFullSchema]:
        query = select(self.model).options(
            selectinload(self.model.task), selectinload(self.model.purchases)
        ).order_by(self.model.created_at.asc())
        query_data = await self.session.execute(query)
        users = query_data.scalars().all()
        return [UserFullSchema.model_validate(user, from_attributes=True) for user in users]


    async def get_count_referrals(self, referrer_id: int) -> int:
        query = select(self.model.id).where(self.model.referrer_id == referrer_id)
        query_data = await self.session.execute(query)
        result = query_data.scalars().all()
        return len(result)


class TaskRepository(SQLAlchemyRepository[Task, TaskSchema]):
    model = Task
    schema = TaskSchema