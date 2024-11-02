from src.repository import SQLAlchemyRepository
from src.user.models import User
from src.user.schemas import UserSchema


class UserRepository(SQLAlchemyRepository):
    model = User
    schema = UserSchema