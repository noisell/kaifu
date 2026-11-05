from typing import Annotated

from fastapi import APIRouter, Depends, Body, File, UploadFile, Form, Path
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT

from src.dependencies import responses, UOWDepends, get_current_user
from src.schemas import TokenPayload
from src.system.schemas import HistoryActionSchema, HistoryMoneyCreateSchema
from src.user.schemas import UserSchema, UserAddSchema, UserUpdateAvatarSchema, TaskSchema, CheckSub, FriendSchema
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


@router.get(path="/task", name="Get tasks completed", responses=responses(401))
async def get_tasks(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> TaskSchema:
    return await UserService().get_task_completed(uow=uow, user_id=user.user_id)


@router.post(path="/task/telegram", name="Check Sub Telegram", responses=responses(401))
async def check_sub_telegram(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> bool:
    return await UserService().check_sub_telegram(uow=uow, user_id=user.user_id)

@router.post(path="/task/other", name="Check Sub Other", responses=responses(401))
async def check_sub_other(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)], data: CheckSub = Body()) -> bool:
    return await UserService().check_sub_other(uow=uow, user_id=user.user_id, data=data)


@router.get(path="/friends", name="Get friends", responses=responses(401))
async def get_friends(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> list[FriendSchema]:
    return await UserService().get_friends(uow=uow, user_id=user.user_id)

@router.get(path="/history", name="Get history", responses=responses(401))
async def get_history_action(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> list[HistoryActionSchema]:
    return await UserService().get_history_action(uow=uow, user_id=user.user_id)

@router.post(path="/history", name="Update history", responses=responses(401))
async def update_history(
        uow: UOWDepends,
        user: Annotated[TokenPayload, Depends(get_current_user)],
        data: HistoryMoneyCreateSchema
) -> None:
    return await UserService().update_history(uow=uow, user_id=user.user_id, data=data)


@router.post("/post/media/upload/{uuid_post}/{file_type}")
async def upload_form(
    uuid_post: str = Path(),
    file_type: str = Path(),
    file: UploadFile = File(description="Файл для загрузки"),
):
    print("==== START FormData ====")
    print("uuidPost", uuid_post)
    print("fileType", file_type)
    print("File:", file)
    print("Uploaded File:", file.filename)
    print("File Type:", file.content_type)
    print("==== END FormData ====")
    content = await file.read()
    print("File content:", content[:100], "...")  # Print first 100 chars
    return {"message": "FormData received and printed to console"}