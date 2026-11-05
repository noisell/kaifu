from datetime import datetime
from pydantic import BaseModel, Field

from src.lottery.models import WinType
from src.system.models import SystemNames, HistoryType


class SystemSchema(BaseModel):
    name: SystemNames = Field(description="The name of the system.", title="")
    value: str = Field(description="The value of the system.", title="")


class HistoryMoneyCreateSchema(BaseModel):
    type: HistoryType
    amount: float
    gold: int
    user_wallet: str
    system_wallet: str | None

class HistoryMoneySchema(BaseModel):
    id: int
    user_id: int
    type: HistoryType
    amount: float
    gold: int
    user_wallet: str
    system_wallet: str | None
    created_at: datetime


class HistoryMoneySimpleSchema(BaseModel):
    type: HistoryType
    amount: float
    gold: int
    created_at: datetime


class HistoryActionSchema(BaseModel):
    type: HistoryType | WinType
    gold: int
    amount: float | None
    created_at: datetime
