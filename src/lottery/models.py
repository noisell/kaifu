from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base


class PricePool(Base):
    __tablename__ = 'price_pool'
    date: Mapped[datetime] = mapped_column(primary_key=True, autoincrement=False)
    today_count_coins: Mapped[int]
    jackpot_count_coins: Mapped[int]
    count_participants: Mapped[int] = mapped_column(server_default='1')