from fastapi import APIRouter, Depends
from sqlalchemy.sql.annotation import Annotated

from src.dependencies import responses, UOWDepends, get_current_user
from src.schemas import TokenPayload
from src.system.models import SystemNames
from src.system.schemas import SystemSchema
from src.system.service import SystemService

router = APIRouter(
    prefix="/system",
    tags=["System"]
)

@router.get(path="/data", name="Get course and prices")
async def get_course_kaifu(uow: UOWDepends):
    return await SystemService().get_system_by_names(uow=uow)

@router.get(path="/value", name="Get system value by id")
async def get_system_value_by_id(uow: UOWDepends, name: SystemNames) -> SystemSchema:
    return await SystemService().get_system_by_name(uow=uow, name=name)
