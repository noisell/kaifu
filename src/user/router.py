from typing import Annotated

from fastapi import APIRouter, Depends
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT

from src.dependencies import responses, UOWDepends, get_current_user
from src.schemas import TokenPayload
from src.user.schemas import UserSchema, UserAddSchema, UserUpdateAvatarSchema
from src.user.service import UserService

router = APIRouter(
    prefix="/user",
    tags=["Users"]
)

@router.post(path="", name="Create User", status_code=HTTP_201_CREATED, responses=responses({400: "Such a user already exists"}, 401))
async def create_user(uow: UOWDepends, data: UserAddSchema) -> UserSchema:
    return await UserService().create_user(uow=uow, data=data)


@router.get(path="", name="Get by ID", responses=responses(401, {404: "Such a user has not been found"}))
async def get_user_by_id(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> UserSchema:
    return await UserService().get_user_by_id(uow=uow, user_id=user.user_id)


@router.patch(path="/avatar", name="Update avatar", status_code=HTTP_204_NO_CONTENT, responses=responses(401))
async def update_avatar(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)], data: UserUpdateAvatarSchema) -> None:
    await UserService().update_avatar(uow=uow, user_id=user.user_id, avatar=data.avatar)