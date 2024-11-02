from fastapi import APIRouter, Depends
from sqlalchemy.sql.annotation import Annotated

from src.dependencies import responses, UOWDepends, get_current_user
from src.schemas import TokenPayload
from src.system.models import SystemNames
from src.system.service import SystemService

router = APIRouter(
    prefix="/system",
    tags=["System"]
)

@router.get(path="/course", name="Course KAIFU", responses=responses(401))
async def get_course_kaifu(uow: UOWDepends, _: Annotated[TokenPayload, Depends(get_current_user)]):
    return await SystemService().get_system_by_name(uow=uow, name=SystemNames.course)

