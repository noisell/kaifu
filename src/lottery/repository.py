from sqlalchemy import select, update, func
from sqlalchemy.orm import selectinload

from src.admin.schemas import DailyWinnersSchema, DailyReferralWinnersSchema
from src.lottery.models import DailyPricePool, Ticket, Bank, CounterLot, TicketType, PurchaseHistory, TicketWon, WinType
from src.lottery.schemas import DailyPricePoolSchema, TicketSchema, BankSchema, CounterLotSchema, PurchaseHistorySchema, \
    TicketWonSchema, TicketWonSimpleSchema, TicketWonActionSchema, UserWinnerSchema, TicketWinnerSchema
from src.repository import SQLAlchemyRepository
from datetime import datetime, UTC, timedelta, date


class PricePoolRepository(SQLAlchemyRepository[DailyPricePool, DailyPricePoolSchema]):
    model = DailyPricePool
    schema = DailyPricePoolSchema

    async def get_price_pool(self) -> DailyPricePoolSchema | None:
        date_now = datetime.now(UTC).replace(tzinfo=None).date()
        query = select(self.model).filter(self.model.date == date_now)
        query_result = await self.session.execute(query)
        result = query_result.scalar_one_or_none()
        if not result:
            return
        return DailyPricePoolSchema(count_gold=result.count_gold, count_silver=result.count_silver, date=result.date)

    async def check_dates(self, dates: list[datetime]) -> list[date]:
        query = select(self.model.date).where(self.model.date.in_(dates))
        query_data = await self.session.execute(query)
        query_result = query_data.scalars().all()
        return [i.date() for i in query_result]

    async def update_price_pool(self, dates: list[datetime], count_gold: float, count_silver: float) -> None:
        stmt = update(self.model).where(self.model.date.in_(dates)).values(count_gold=self.model.count_gold + count_gold, count_silver=self.model.count_silver + count_silver)
        await self.session.execute(stmt)


class TicketRepository(SQLAlchemyRepository[Ticket, TicketSchema]):
    model = Ticket
    schema = TicketSchema

    async def check_number(self, lot: int, number: int) -> bool:
        query = select(self.model).where(self.model.lot == lot, self.model.number == number)
        query_result = await self.session.execute(query)
        result = query_result.scalar_one_or_none()
        return True if not result else False

    async def get_all_numbers(self) -> dict[int, list[int]]:
        query = select(self.model).where(self.model.type == TicketType.gold.value)
        query_data = await self.session.execute(query)
        tickets = query_data.scalars().all()
        result: dict[int, list[int]] = {}
        for ticket in tickets:
            if result.get(ticket.lot) is None:
                result[ticket.lot] = [ticket.number]
            else:
                result[ticket.lot].append(ticket.number)
        return result

    async def get_all_tickets(self, user_id: int) -> list[TicketSchema]:
        query = select(self.model).where(
            self.model.user_id == user_id,
            self.model.created_at <= (datetime.now(UTC).replace(tzinfo=None) + timedelta(days=30))
        ).order_by(self.model.created_at.desc())
        query_data = await self.session.execute(query)
        tickets = query_data.scalars().all()
        return [TicketSchema.model_validate(ticket, from_attributes=True) for ticket in tickets]

    async def get_all_for_stats(self, active: bool) -> list[TicketSchema]:
        if active:
            query = select(self.model).where(self.model.active == True).order_by(self.model.created_at.asc())
        else:
            query = select(self.model).order_by(self.model.created_at.asc())
        query_result = await self.session.execute(query)
        result = query_result.scalars().all()
        return [TicketSchema.model_validate(res, from_attributes=True) for res in result]

    async def get_count_user_tickets(self, ticket_type: TicketType) -> int:
        query = select(func.count(self.model.id)).where(self.model.type == ticket_type.value, self.model.active == True)
        query_data = await self.session.execute(query)
        query_result = query_data.scalar()
        return int(query_result) if query_result else 0

    async def get_all_active(self, ticket_type: TicketType) -> list[UserWinnerSchema]:
        query = select(self.model).where(
            self.model.active == True,
            self.model.number != None,
            self.model.type == ticket_type.value,
            self.model.created_at <= (datetime.now(UTC).replace(tzinfo=None) + timedelta(days=30))
        )
        query_data = await self.session.execute(query)
        tickets = query_data.scalars().all()
        return [UserWinnerSchema.model_validate(ticket, from_attributes=True) for ticket in tickets]

    async def get_all_silver_for_date(self) -> list[int]:
        query = select(self.model.user_id).where(
            self.model.created_at <= (datetime.now(UTC).replace(tzinfo=None) + timedelta(days=30)),
            self.model.type == TicketType.silver.value
        )
        query_data = await self.session.execute(query)
        tickets = query_data.scalars().all()
        return list(set(tickets)) if tickets else []

    async def change_all_silver_to_not_active(self) -> None:
        stmt = update(self.model).where(self.model.type == TicketType.silver.value).values(active=False)
        await self.session.execute(stmt)

    async def get_by_number(self, number: int, ticket_type: TicketType) -> list[TicketWinnerSchema]:
        query = select(self.model).where(self.model.number == number, self.model.active == True, self.model.type == ticket_type.value)
        query_data = await self.session.execute(query)
        winners = query_data.scalars().all()
        return [TicketWinnerSchema.model_validate(winner, from_attributes=True) for winner in winners]


class BankRepository(SQLAlchemyRepository[Bank, BankSchema]):
    model = Bank
    schema = BankSchema

    async def update_bank(self, bank: BankSchema) -> None:
        stmt = update(self.model).where(self.model.id == 1).values(
            jackpot_gold=self.model.jackpot_gold + bank.jackpot_gold,
            jackpot_silver=self.model.jackpot_silver + bank.jackpot_silver,
            today_gold=self.model.today_gold + bank.today_gold,
            today_silver=self.model.today_silver + bank.today_silver,
            system=self.model.system + bank.system,
        )
        await self.session.execute(stmt)


class CounterLotRepository(SQLAlchemyRepository[CounterLot, CounterLotSchema]):
    model = CounterLot
    schema = CounterLotSchema

    async def get_last_date(self, ticket_type: TicketType) -> tuple[bool, CounterLotSchema]:
        query = select(self.model).where(self.model.type == ticket_type.value)
        query_result = await self.session.execute(query)
        counters = query_result.scalars().all()
        for counter in counters:
            if counter.count < 999999:
                return True, CounterLotSchema.model_validate(counter, from_attributes=True)
        return False, CounterLotSchema.model_validate(counters[-1], from_attributes=True)

    async def update_count(self, lot: int, ticket_type: TicketType, value: int = 1) -> None:
        stmt = update(self.model).where(self.model.lot == lot, self.model.type == ticket_type.value).values(count=self.model.count + value)
        await self.session.execute(stmt)

    async def check_exist_lot(self, lot: int) -> bool:
        query = select(self.model).where(self.model.lot == lot, self.model.type == TicketType.gold.value)
        query_result = await self.session.execute(query)
        result = query_result.scalar_one_or_none()
        return True if result is not None else False


class PurchaseHistoryRepository(SQLAlchemyRepository[PurchaseHistory, PurchaseHistorySchema]):
    model = PurchaseHistory
    schema = PurchaseHistorySchema


class TicketWonRepository(SQLAlchemyRepository[TicketWon, TicketWonSchema]):
    model = TicketWon
    schema = TicketWonSchema

    async def get_count_active_win(self, user_id: int) -> int:
        query = select(func.count(self.model.id)).where(
            self.model.user_id == user_id,
            self.model.received == False
        )
        query_data = await self.session.execute(query)
        result = query_data.scalar()
        return int(result) if result else 0

    async def get_tickets_won(self, user_id: int) -> list[TicketWonSimpleSchema]:
        query = select(self.model).where(self.model.user_id == user_id, self.model.received == False)
        query_data = await self.session.execute(query)
        tickets = query_data.scalars().all()
        return [TicketWonSimpleSchema.model_validate(ticket, from_attributes=True) for ticket in tickets]

    async def get_history_ticket_won(self, user_id: int) -> list[TicketWonActionSchema]:
        query = select(self.model).where(self.model.user_id == user_id, self.model.received == True)
        query_data = await self.session.execute(query)
        tickets = query_data.scalars().all()
        return [TicketWonActionSchema.model_validate(ticket, from_attributes=True) for ticket in tickets]

    async def get_tickets_won_by_ticket_id(self, ticket_id: int) -> list[TicketWonSchema]:
        query = select(self.model).where(self.model.ticket_id == ticket_id)
        query_data = await self.session.execute(query)
        tickets = query_data.scalars().all()
        return [TicketWonSchema.model_validate(ticket, from_attributes=True) for ticket in tickets]

    async def get_daily_data_amounts(self) -> list[int]:
        query = select(self.model.amount).where(
            self.model.type == WinType.daily.value,
            self.model.created_at >= (datetime.now(UTC).replace(tzinfo=None, hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1 if datetime.now(UTC).replace(tzinfo=None).hour < 17 else 0))
        )
        query_data = await self.session.execute(query)
        query_result = query_data.scalars().all()
        return list(query_result)

    async def get_daily_winners(self):
        query = select(self.model).where(
            self.model.type == WinType.daily.value,
            self.model.created_at >= (datetime.now(UTC).replace(tzinfo=None, hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1 if datetime.now(UTC).replace(tzinfo=None).hour < 17 else 0))
        ).options(selectinload(self.model.user), selectinload(self.model.ticket))
        query_data = await self.session.execute(query)
        query_result = query_data.scalars().all()
        return [DailyWinnersSchema.model_validate(i, from_attributes=True) for i in query_result]


    async def get_tickets_won_referrals(self, ticket_id: int) -> list[DailyReferralWinnersSchema]:
        query = select(self.model).where(
            self.model.ticket_id == ticket_id,
            self.model.type == WinType.referrer.value,
            self.model.created_at >= (datetime.now(UTC).replace(tzinfo=None, hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1 if datetime.now(UTC).replace(tzinfo=None).hour < 17 else 0))

        ).options(selectinload(self.model.user))
        query_data = await self.session.execute(query)
        tickets = query_data.scalars().all()
        return [DailyReferralWinnersSchema.model_validate({"amount": ticket.amount, "username": ticket.user.username}, from_attributes=True) for ticket in tickets]






