from datetime import datetime, UTC
from typing import Annotated

from fastapi import APIRouter, Depends, Body
from starlette.status import HTTP_201_CREATED

from src import uow
from src.admin.schemas import StatusScheme, SimpleAdminScheme, ChangeUserSchema, ChangeBankSchema, MoneyStatsSchema, \
    UserStatsSchema, TicketStatsSchema, ChangeSystemWalletSchema, PlayJackpot, DailyAmountSchema, WinnersFullSchema
from src.admin.service import AdminService
from src.dependencies import responses, UOWDepends, AdminLevelChecker
from src.lottery.schemas import TicketSchema, TicketWonSchema, BankSchema, JackpotPlaySchema
from src.lottery.service import LotteryService
from src.schemas import AdminPayload
from src.system.schemas import HistoryMoneySchema, SystemSchema
from src.user.schemas import UserSchema

router = APIRouter(
    prefix="/admin",
    tags=["Admins"]
)

@router.post(path="", name="Создание администратора (3)", status_code=HTTP_201_CREATED, responses=responses(400, 401, 403, 404))
async def create_admin(
        uow: UOWDepends,
        _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))],
        data: SimpleAdminScheme = Body()
) -> StatusScheme:
    return await AdminService().create_admin(uow=uow, data=data)

@router.get(path="/user", name="Get users", responses=responses(401))
async def get_users(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[UserSchema]:
    return await AdminService().get_users(uow=uow)


@router.patch(path="/user", name="Change user", responses=responses(401))
async def change_user(
        uow: UOWDepends,
        _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))],
        data: ChangeUserSchema
) -> None:
    await AdminService().change_user(uow=uow, data=data)


@router.get(path="/money", name="Get history moneys", responses=responses(401))
async def get_history_money(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[HistoryMoneySchema]:
    return await AdminService().get_history_money(uow=uow)


@router.patch(path="/money", name="Change money", responses=responses(401))
async def change_money(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: ChangeSystemWalletSchema) -> None:
    await AdminService().change_money(uow=uow, data=data)


@router.get(path="/lottery/tickets", name="Get tickets", responses=responses(401))
async def get_tickets(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[TicketSchema]:
    return await AdminService().get_tickets(uow=uow)


@router.get(path="/lottery/wins", name="Get wins", responses=responses(401))
async def get_wins(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[TicketWonSchema]:
    return await AdminService().get_wins(uow=uow)


@router.get(path="/system", name="Get system datas", responses=responses(401))
async def get_system(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[SystemSchema]:
    return await AdminService().get_system(uow=uow)


@router.patch(path="/system", name="Change system", responses=responses(401))
async def change_system(
        uow: UOWDepends,
        _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))],
        data: SystemSchema
) -> None:
    await AdminService().change_system(uow=uow, data=data)


@router.get(path="/bank", name="Get system datas", responses=responses(401))
async def get_bank(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> BankSchema:
    return await AdminService().get_bank(uow=uow)


@router.patch(path="/bank", name="Change bank", responses=responses(401))
async def get_bank(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: ChangeBankSchema) -> None:
    await AdminService().change_bank(uow=uow, bank_type=data.type, new_value=data.value)


@router.get(path="/stats/money", name="Get money stats", responses=responses(401))
async def get_money_stats(
        uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]
) -> MoneyStatsSchema:
    return await AdminService().get_money_stats(uow=uow)


@router.get(path="/stats/user", name="Get user stats", responses=responses(401))
async def get_user_stats(
        uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]
) -> UserStatsSchema:
    return await AdminService().get_user_stats(uow=uow)


@router.get(path="/stats/tickets", name="Get tickets stats", responses=responses(401))
async def get_tickets_stats(
        uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]
) -> TicketStatsSchema:
    return await AdminService().get_stats_ticket(uow=uow, active=False)


@router.get(path="/stats/tickets/active", name="Get tickets active stats", responses=responses(401))
async def get_tickets_active_stats(
        uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]
) -> TicketStatsSchema:
    return await AdminService().get_stats_ticket(uow=uow, active=True)


@router.post(path="/lottery/jackpot", name="Play jackpot", responses=responses(401))
async def jackpot(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> JackpotPlaySchema:
    return await LotteryService.play_jackpot(uow=uow)


@router.get(path="/lottery/jackpot/amount", name="Jackpot amount", responses=responses(401))
async def jackpot_amount(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> float:
    return await LotteryService.jackpot_amount(uow=uow)


@router.get(path="/lottery/daily", name="Get daily amounts", responses=responses(401))
async def get_daily_amounts(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[DailyAmountSchema]:
    return await AdminService().get_daily_amounts(uow=uow)


@router.get(path="/lottery/winners/daily", name="Get daily winners", responses=responses(401))
async def get_daily_amounts(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[WinnersFullSchema]:
    return await AdminService().get_daily_winners(uow=uow)