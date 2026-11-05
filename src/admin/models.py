from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base


class Admin(Base):
    __tablename__ = 'admin'
    id: Mapped[int] = mapped_column(BigInteger, ForeignKey('user.id'), primary_key=True, autoincrement=False)
    level: Mapped[int] = mapped_column(server_default='1')
    password: Mapped[str]
    salt: Mapped[str]