from datetime import datetime
from enum import Enum

from sqlalchemy import BigInteger, ForeignKey, DateTime, func, Numeric
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base, intPK, time, updated_at


class TicketType(Enum):
    gold = 'gold'
    silver = 'silver'


class WinType(Enum):
    daily = "daily"
    jackpot = "jackpot"
    referrer = "referrer"


class DailyPricePool(Base):
    __tablename__ = 'daily_price_pool'
    date: Mapped[datetime] = mapped_column(DateTime, primary_key=True)
    count_gold: Mapped[float] = mapped_column(Numeric)
    count_silver: Mapped[float] = mapped_column(Numeric)


class Bank(Base):
    __tablename__ = 'bank'
    id: Mapped[intPK]
    jackpot_gold: Mapped[float] = mapped_column(Numeric)
    today_gold: Mapped[float] = mapped_column(Numeric)
    jackpot_silver: Mapped[float] = mapped_column(Numeric)
    today_silver: Mapped[float] = mapped_column(Numeric)
    system: Mapped[float] = mapped_column(Numeric)


class CounterLot(Base):
    __tablename__ = 'counter_lot'
    lot: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[TicketType] = mapped_column(primary_key=True)
    count: Mapped[int] = mapped_column(BigInteger, server_default="1")


class Ticket(Base):
    __tablename__ = 'ticket'
    id: Mapped[intPK]
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey('user.id'))
    type: Mapped[TicketType]
    lot: Mapped[int]
    number: Mapped[int | None] = mapped_column(BigInteger, server_default=None)
    count: Mapped[int] = mapped_column(server_default="1")
    price: Mapped[int]
    active: Mapped[bool] = mapped_column(server_default='false')
    updated_at: Mapped[updated_at]
    created_at: Mapped[time]

    user: Mapped["User"] = relationship(back_populates="tickets")
    tickets_won: Mapped[list["TicketWon"]] = relationship(back_populates="ticket")


class TicketWon(Base):
    __tablename__ = 'ticket_won'
    id: Mapped[intPK]
    ticket_id: Mapped[int] = mapped_column(BigInteger, ForeignKey('ticket.id'))
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey('user.id'))
    type: Mapped[WinType]
    amount: Mapped[int] = mapped_column(BigInteger)
    received: Mapped[bool] = mapped_column(server_default="false")
    created_at: Mapped[time]

    ticket: Mapped["Ticket"] = relationship(back_populates="tickets_won")
    user: Mapped["User"] = relationship(back_populates="tickets_won")


class PurchaseHistory(Base):
    __tablename__ = 'purchase_history'
    id: Mapped[intPK]
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey('user.id'))
    ticket_price: Mapped[int]
    count: Mapped[int]
    jackpot_gold: Mapped[float] = mapped_column(Numeric)
    jackpot_silver: Mapped[float] = mapped_column(Numeric)
    today_gold: Mapped[float] = mapped_column(Numeric)
    today_silver: Mapped[float] = mapped_column(Numeric)
    system: Mapped[float] = mapped_column(Numeric)
    referrer: Mapped[int] = mapped_column(BigInteger)
    created_at: Mapped[time]

    user: Mapped["User"] = relationship(back_populates="purchases")