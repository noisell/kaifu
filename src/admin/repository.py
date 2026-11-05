from sqlalchemy import select, delete

from src.admin.models import Admin
from src.admin.schemas import AdminScheme, SimpleTrueAdminScheme
from src.repository import SQLAlchemyRepository


class AdminRepository(SQLAlchemyRepository[Admin, AdminScheme]):
    model = Admin
    scheme = AdminScheme

    async def get_info(self, user_id: int) -> AdminScheme | None:
        query = select(self.model).where(self.model.id == user_id)
        query_data = await self.session.execute(query)
        admin = query_data.scalar()
        return AdminScheme.model_validate(admin, from_attributes=True) if admin else None

    async def get_all(self) -> list[SimpleTrueAdminScheme]:
        query = select(self.model)
        query_data = await self.session.execute(query)
        admins = query_data.scalars().all()
        return [SimpleTrueAdminScheme.model_validate(admin, from_attributes=True) for admin in admins]

    async def delete_admin(self, user_id: int) -> None:
        stmt = delete(self.model).where(self.model.id == user_id)
        await self.session.execute(stmt)