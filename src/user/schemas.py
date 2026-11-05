from enum import Enum
from datetime import datetime

from pydantic import BaseModel, Field

from src.lottery.schemas import PurchaseHistorySchema


class UserAddSchema(BaseModel):
    id: int = Field(description="User id", title="")
    username: str | None = Field(description="Username", max_length=256, title="")
    referrer_id: int | None = Field(None, description="Referrer ID", title="")
    avatar: str | None = Field(description="User avatar url", title="")


class UserSchema(UserAddSchema):
    gold_coins: int = Field(description="Count gold coins", title="")
    silver_coins: int = Field(description="Count silver coins", title="")
    banned: bool = Field(description="Is the user blocked?", title="")
    created_at: datetime | None = Field(None, description="Created at", title="")


class UserUpdateAvatarSchema(BaseModel):
    avatar: str | None = Field(description="User avatar url", title="")


class TaskSchema(BaseModel):
    user_id: int = Field(description="User id", title="")
    sub_tg: bool = Field(description="Subscribe Tg?", title="")
    sub_x: bool = Field(description="Subscribe X?", title="")
    sub_yt: bool = Field(description="Subscribe YT?", title="")
    sub_inst: bool = Field(description="Subscribe Inst?", title="")

class Channels(Enum):
    x = "x"
    youtube = "youtube"
    instagram = "instagram"

class CheckSub(BaseModel):
    channel: Channels = Field(description="Channel", title="")


class FriendSchema(BaseModel):
    username: str | None = Field(description="Username", max_length=256, title="")
    avatar: str | None = Field(description="User avatar url", title="")
    gold_coins: int = Field(description="Count gold coins", title="")


class UserFullSchema(UserSchema):
    task: TaskSchema
    purchases: list[PurchaseHistorySchema]
