from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base, str256, time


class User(Base):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=False)
    username: Mapped[str256]
    avatar: Mapped[str | None] = mapped_column(server_default=None)
    gold_coins: Mapped[int] = mapped_column(BigInteger, server_default='0')
    silver_coins: Mapped[int] = mapped_column(BigInteger, server_default='0')
    referrer_id: Mapped[int | None] = mapped_column(ForeignKey('user.id'), server_default=None)
    banned: Mapped[bool] = mapped_column(server_default='false')
    created_at: Mapped[time]