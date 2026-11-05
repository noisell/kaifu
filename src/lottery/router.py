from fastapi import APIRouter, Depends, Body
from typing import Annotated

from src.dependencies import responses, UOWDepends, get_current_user
from src.lottery.schemas import PricePoolSchema, TicketSchemaAdd, PriceTicketSchema, TicketSchema, ActivateTicketSchema, \
    SetNumberTicketSchema, SetNumberTicketResponseSchema, TicketWonSimpleSchema, TicketWonReceivedSchema, \
    PaymentStarsSchema
from src.lottery.service import LotteryService
from src.schemas import TokenPayload

router = APIRouter(
    prefix="/lottery",
    tags=["Lottery"],
)

@router.get(path="/pool", name="Get Price Pool", responses=responses(401))
async def get_price_pool(
        uow: UOWDepends
) -> PricePoolSchema:
    return await LotteryService().get_price_pool(uow=uow)


@router.post(path="/ticket", name="Buy ticket", responses=responses({400: "Insufficient funds"}, 401))
async def buy_ticket(
        uow: UOWDepends,
        user: Annotated[TokenPayload, Depends(get_current_user)],
        data: TicketSchemaAdd
) -> PriceTicketSchema:
    return await LotteryService().buy_ticket(uow=uow, user_id=user.user_id, data=data)


@router.get(path="/tickets", name="Get all tickets", responses=responses(401))
async def get_all_tickets(
        uow: UOWDepends,
        user: Annotated[TokenPayload, Depends(get_current_user)],
) -> list[TicketSchema]:
    return await LotteryService().get_all_tickets(uow=uow, user_id=user.user_id)


@router.post(path="/ticket/activate", name="Activate Silver Ticket", responses=responses(401))
async def activate_silver_ticket(
        uow: UOWDepends,
        _: Annotated[TokenPayload, Depends(get_current_user)],
        ticket: ActivateTicketSchema
) -> None:
    await LotteryService().activate_silver_ticket(uow=uow, ticket_id=ticket.id)


@router.post(path="/ticket/number", name="Set number ticket", responses=responses(401, 404))
async def set_number_ticket(
        uow: UOWDepends,
        _: Annotated[TokenPayload, Depends(get_current_user)],
        data: SetNumberTicketSchema
) -> SetNumberTicketResponseSchema:
    return await LotteryService().set_number_ticket(uow=uow, ticket_id=data.id, new_number=data.number)


@router.get("/ticket/number/check", name="Check number ticket", responses=responses(401))
async def check_number_ticket(
        uow: UOWDepends,
        _: Annotated[TokenPayload, Depends(get_current_user)],
        ticket_id: int,
        number: int
) -> bool:
    return await LotteryService().check_number_in_use(uow=uow, ticket_id=ticket_id, number=number)


@router.get(path="/won/count", name="Get ticket won count", responses=responses(401))
async def get_count_active_win(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> int:
    return await LotteryService().get_count_active_win(uow=uow, user_id=user.user_id)


@router.get(path="/won/tickets", name="Get tickets won", responses=responses(401))
async def get_tickets_won(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> list[TicketWonSimpleSchema]:
    return await LotteryService().get_tickets_won(uow=uow, user_id=user.user_id)


@router.post(path="/won/received", name="Receive ticket won", responses=responses(401))
async def received_ticket_won(uow: UOWDepends, _: Annotated[TokenPayload, Depends(get_current_user)], ticket: TicketWonReceivedSchema) -> None:
    await LotteryService().received_ticket_won(uow=uow, ticket_id=ticket.id)

@router.get(path="/invoice", name="Get invoice", responses=responses(401))
async def get_invoice(
        uow: UOWDepends,
        user: Annotated[TokenPayload, Depends(get_current_user)],
        count: int,
        lang: str
) -> str:
    return await LotteryService().get_invoice(uow=uow, user_id=user.user_id, count=count, lang=lang)