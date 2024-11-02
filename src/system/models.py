from enum import Enum

from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base, intPK

class SystemNames(Enum):
    course = "course"
    price_gold_ticket = "price_gold_ticket"
    price_silver_ticket = "price_silver_ticket"

class System(Base):
    __tablename__ = 'system'
    name: Mapped[SystemNames] = mapped_column(primary_key=True, autoincrement=False)
    value: Mapped[str]