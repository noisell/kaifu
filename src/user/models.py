from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base, str256, time


class User(Base):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=False)
    username: Mapped[str256 | None]
    avatar: Mapped[str | None] = mapped_column(server_default=None)
    gold_coins: Mapped[int] = mapped_column(BigInteger, server_default='0')
    silver_coins: Mapped[int] = mapped_column(BigInteger, server_default='0')
    referrer_id: Mapped[int | None] = mapped_column(ForeignKey('user.id'), server_default=None)
    banned: Mapped[bool] = mapped_column(server_default='false')
    created_at: Mapped[time]

    tickets: Mapped[list["Ticket"]] = relationship(back_populates="user")
    tickets_won: Mapped[list["TicketWon"]] = relationship(back_populates="user")
    task: Mapped["Task"] = relationship(back_populates="user")
    purchases: Mapped[list["PurchaseHistory"]] = relationship(back_populates="user")


class Task(Base):
    __tablename__ = 'task'
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("user.id"), primary_key=True)
    sub_tg: Mapped[bool] = mapped_column(server_default="false")
    sub_x: Mapped[bool] = mapped_column(server_default="false")
    sub_yt: Mapped[bool] = mapped_column(server_default="false")
    sub_inst: Mapped[bool] = mapped_column(server_default="false")

    user: Mapped["User"] = relationship(back_populates="task")