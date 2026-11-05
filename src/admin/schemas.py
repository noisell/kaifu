from enum import Enum

from pydantic import BaseModel, Field

from src.lottery.schemas import TicketSchema
from src.user.schemas import UserSchema


class AdminScheme(BaseModel):
    id: int = Field(description="id", title="")
    level: int = Field(description="Уровень", title="")
    password: str = Field(description="Пароль", title="")
    salt: str = Field(description="Соль", title="")


class SimpleAdminScheme(BaseModel):
    user_id: int = Field(description="id в Telegram", title="")
    level: int = Field(description="Уровень. Число от 1 до 3. 1 - оператор, 2 - старший, 3 - владелец.", title="")


class SimpleTrueAdminScheme(BaseModel):
    id: int = Field(description="id в Telegram", title="")
    level: int = Field(description="Уровень. Число от 1 до 3. 1 - оператор, 2 - старший, 3 - владелец.", title="")


class StatusScheme(BaseModel):
    success: bool = Field(description="Успешно?", title="")


class ChangeUserSchema(BaseModel):
    id: int
    gold_coins: int
    silver_coins: int
    banned: bool


class BankTypeSchema(Enum):
    jackpot_gold = "jackpot_gold"
    today_gold = "today_gold"
    jackpot_silver = "jackpot_silver"
    today_silver = "today_silver"
    system = "system"


class ChangeBankSchema(BaseModel):
    type: BankTypeSchema
    value: float

class DataMoneyStatsSchema(BaseModel):
    name: str
    profit: float

class MoneyStatsSchema(BaseModel):
    today: float
    mouth: float
    all: float
    data: list[DataMoneyStatsSchema]


class TypeStatsSchema(BaseModel):
    all: float
    today: float

class DataStatsSchema(BaseModel):
    name: str
    count: float


class UserStatsSchema(BaseModel):
    all: TypeStatsSchema
    top_up: TypeStatsSchema
    completed_task: int
    ref: TypeStatsSchema
    banned: int
    not_active: int
    data: list[DataStatsSchema]


class TicketStatsSchema(BaseModel):
    gold: TypeStatsSchema
    silver: TypeStatsSchema
    data: list[DataStatsSchema]


class JackpotTypeSchema(BaseModel):
    pool: float
    users: int


class ChangeSystemWalletSchema(BaseModel):
    id: int
    system_wallet: str


class PlayJackpot(BaseModel):
    amount: int


class DailyAmountSchema(BaseModel):
    amount: int
    count: int


class DailyWinnersSchema(BaseModel):
    amount: int
    user: UserSchema
    ticket: TicketSchema


class DailyReferralWinnersSchema(BaseModel):
    amount: int
    username: str | None


class WinnersFullSchema(DailyWinnersSchema):
    referrals: list[DailyReferralWinnersSchema]


