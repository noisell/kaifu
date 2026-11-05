from enum import Enum

from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base, intPK, time

class HistoryType(Enum):
    top_up = "top_up"
    withdraw = "withdraw"


class SystemNames(Enum):
    course = "course"
    course_stars = "course_stars"
    price_gold_ticket = "price_gold_ticket"
    price_gold_ticket_stars = "price_gold_ticket_stars"
    price_silver_ticket = "price_silver_ticket"
    wallet = "wallet"
    today = "today"
    stars = "stars"

    count_first = "count_first"
    percent_first = "percent_first"
    count_second = "count_second"
    percent_second = "percent_second"
    count_third = "count_third"
    percent_third = "percent_third"

    investment_silver = "investment_silver"
    investment_gold = "investment_gold"
    investment_gold_jackpot = "investment_gold_jackpot"
    investment_silver_jackpot = "investment_silver_jackpot"



class System(Base):
    __tablename__ = 'system'
    name: Mapped[SystemNames] = mapped_column(primary_key=True, autoincrement=False)
    value: Mapped[str]


class HistoryMoney(Base):
    __tablename__ = 'history_money'
    id: Mapped[intPK]
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey('user.id'))
    type: Mapped[HistoryType]
    amount: Mapped[float]
    gold: Mapped[int] = mapped_column(BigInteger)
    user_wallet: Mapped[str]
    system_wallet: Mapped[str | None]
    created_at: Mapped[time]