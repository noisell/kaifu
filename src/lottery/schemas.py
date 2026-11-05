from datetime import datetime

from pydantic import BaseModel, Field

from src.lottery.models import TicketType, WinType


class DailyPricePoolSchema(BaseModel):
    count_gold: float
    count_silver: float
    date: datetime


class PricePoolSchema(BaseModel):
    today: int
    jackpot: int


class BankSchema(BaseModel):
    id: int
    jackpot_gold: float
    today_gold: float
    jackpot_silver: float
    today_silver: float
    system: float


class CounterLotSchema(BaseModel):
    lot: int
    type: TicketType
    count: int


class TicketSchemaAdd(BaseModel):
    type: TicketType
    count: int | None = 1


class TicketSchema(TicketSchemaAdd):
    id: int
    user_id: int
    lot: int
    number: int | None
    price: int
    active: bool
    updated_at: datetime
    created_at: datetime


class UserAddSchema2(BaseModel):
    id: int = Field(description="User id", title="")
    username: str | None = Field(description="Username", max_length=256, title="")
    referrer_id: int | None = Field(None, description="Referrer ID", title="")
    avatar: str | None = Field(description="User avatar url", title="")


class UserSchema2(UserAddSchema2):
    gold_coins: int = Field(description="Count gold coins", title="")
    silver_coins: int = Field(description="Count silver coins", title="")
    banned: bool = Field(description="Is the user blocked?", title="")
    created_at: datetime | None = Field(None, description="Created at", title="")


class TicketWinnerSchema(TicketSchema):
    user: UserSchema2


class JackpotPlaySchema(BaseModel):
    number: int
    data: TicketWinnerSchema | None


class TicketAddResponseSchema(BaseModel):
    id: int
    type: TicketType
    lot: int
    number: int | None


class PriceTicketSchema(BaseModel):
    price: int


class PurchaseHistorySchema(BaseModel):
    id: int
    user_id: int
    ticket_price: int
    count: int
    jackpot_gold: float
    jackpot_silver: float
    today_gold: float
    today_silver: float
    system: float
    referrer: int
    created_at: datetime


class ActivateTicketSchema(BaseModel):
    id: int

class SetNumberTicketSchema(ActivateTicketSchema):
    number: int | None

class SetNumberTicketResponseSchema(BaseModel):
    lot: int
    number: int


class TicketWonSchema(BaseModel):
    id: int
    ticket_id: int
    user_id: int
    type: WinType
    amount: int
    received: bool
    created_at: datetime


class TicketWonSimpleSchema(BaseModel):
    id: int
    ticket_id: int
    amount: int


class TicketWonReceivedSchema(BaseModel):
    id: int


class TicketWonActionSchema(BaseModel):
    amount: int
    type: WinType
    created_at: datetime


class UserWinnerSchema(BaseModel):
    id: int
    user_id: int
    price: int


class PaymentStarsSchema(BaseModel):
    count: int
    lang: str