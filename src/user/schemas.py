from datetime import datetime

from pydantic import BaseModel, Field


class UserAddSchema(BaseModel):
    id: int = Field(description="User id", title="")
    username: str | None = Field(description="Username", max_length=256, title="")
    referrer_id: int | None = Field(None, description="Referrer ID", title="")


class UserSchema(UserAddSchema):
    avatar: str | None = Field(description="User avatar url", title="")
    gold_coins: int = Field(description="Count gold coins", title="")
    silver_coins: int = Field(description="Count silver coins", title="")
    banned: bool = Field(description="Is the user blocked?", title="")
    created_at: datetime | None = Field(None, description="Created at", title="")


class UserUpdateAvatarSchema(BaseModel):
    avatar: str | None = Field(description="User avatar url", title="")