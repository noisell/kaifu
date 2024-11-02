from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.uow import IUnitOfWork
from src.user.schemas import UserAddSchema, UserSchema


# noinspection PyArgumentList
class UserService:

    @classmethod
    async def create_user(cls, uow: IUnitOfWork, data: UserAddSchema) -> UserSchema:
        async with uow:
            new_user = await uow.user.add(data.model_dump())
            if not new_user:
                raise HTTPException(
                    status_code=HTTP_400_BAD_REQUEST,
                    detail="Such a user already exists"
                )
            await uow.commit()
        return UserSchema(**data.model_dump(), avatar=None, gold_coins=0, silver_coins=0, banned=False, created_at=None)

    @classmethod
    async def get_user_by_id(cls, uow: IUnitOfWork, user_id: int) -> UserSchema:
        async with uow:
            result = await uow.user.get_by_id(user_id)
            if not result:
                raise HTTPException(
                    status_code=HTTP_404_NOT_FOUND,
                    detail="Such a user has not been found"
                )
            return result


    @classmethod
    async def update_avatar(cls, uow: IUnitOfWork, user_id: int, avatar: str) -> None:
        async with uow:
            await uow.user.update(user_id, avatar=avatar)