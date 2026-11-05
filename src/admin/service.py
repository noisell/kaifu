from datetime import datetime, UTC

from fastapi import HTTPException
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from bot.handlers.system import create_admin
from src.admin.schemas import SimpleAdminScheme, StatusScheme, ChangeUserSchema, BankTypeSchema, MoneyStatsSchema, \
    DataMoneyStatsSchema, UserStatsSchema, TypeStatsSchema, DataStatsSchema, TicketStatsSchema, JackpotTypeSchema, \
    ChangeSystemWalletSchema, DailyAmountSchema, WinnersFullSchema
from src.auth.service import generate_password
from src.lottery.models import TicketType
from src.lottery.schemas import TicketSchema, TicketWonSchema, BankSchema, DailyPricePoolSchema
from src.system.models import HistoryType, SystemNames
from src.system.schemas import HistoryMoneySchema, SystemSchema
from src.uow import UnitOfWork
from src.user.schemas import UserSchema, UserFullSchema


class AdminService:

    @classmethod
    async def get_users(cls, uow: UnitOfWork) -> list[UserSchema]:
        async with uow:
            return await uow.user.get_all()

    @classmethod
    async def create_admin(cls, uow: UnitOfWork, data: SimpleAdminScheme) -> StatusScheme:
        async with uow:
            user = await uow.user.get_by_id(item_id=data.user_id)
            if not user:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Пользователь не найден")
            password, salt, hashed_password = generate_password()
            send = await create_admin(user_id=data.user_id, login=data.user_id, password=password)
            if send is not True:
                raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"Пользователь заблокировал бота. {send}")
            await uow.admin.add({"id": data.user_id, "level": data.level, "password": hashed_password, "salt": salt})
            await uow.commit()
        return StatusScheme(success=True)

    @classmethod
    async def change_user(cls, uow: UnitOfWork, data: ChangeUserSchema) -> None:
        data_dict = data.model_dump()
        del data_dict['id']
        async with uow:
            await uow.user.update(item_id=data.id, **data_dict)
            await uow.commit()

    @classmethod
    async def change_system(cls, uow: UnitOfWork, data: SystemSchema) -> None:
        async with uow:
            await uow.system.update_data(name=data.name, value=data.value)
            await uow.commit()

    @classmethod
    async def get_history_money(cls, uow: UnitOfWork) -> list[HistoryMoneySchema]:
        async with uow:
            return await uow.history_money.get_all()

    @classmethod
    async def change_money(cls, uow: UnitOfWork, data: ChangeSystemWalletSchema) -> None:
        async with uow:
            item: HistoryMoneySchema = await uow.history_money.get_by_id(item_id=data.id)
            if data.system_wallet == "-1":
                await uow.history_money.update(item_id=data.id, system_wallet=data.system_wallet, gold=0)
                await uow.user.update_balance(user_id=item.user_id, value=item.gold, gold=True)
            else:
                await uow.history_money.update(item_id=data.id, system_wallet=data.system_wallet, gold=-item.gold)
            await uow.commit()


    @classmethod
    async def get_tickets(cls, uow: UnitOfWork) -> list[TicketSchema]:
        async with uow:
            return await uow.ticket.get_all()

    @classmethod
    async def get_wins(cls, uow: UnitOfWork) -> list[TicketWonSchema]:
        async with uow:
            return await uow.ticket_won.get_all()

    @classmethod
    async def get_jackpot(cls, uow: UnitOfWork, jackpot_type: str) -> JackpotTypeSchema:
        async with uow:
            bank = await uow.bank.get_by_id(item_id=1)
            if jackpot_type == "gold":
                jackpot = bank.jackpot_gold
                users = await uow.ticket.get_count_user_tickets(TicketType.gold)
            else:
                jackpot = bank.jackpot_silver
                users = await uow.ticket.get_count_user_tickets(TicketType.silver)
            return JackpotTypeSchema(pool=jackpot, users=users)

    @classmethod
    async def get_system(cls, uow: UnitOfWork) -> list[SystemSchema]:
        async with uow:
            return await uow.system.get_all()

    @classmethod
    async def get_bank(cls, uow: UnitOfWork) -> BankSchema:
        async with uow:
            result: BankSchema = await uow.bank.get_by_id(1)
            course = await uow.system.get_by_name(name=SystemNames.course)
            bank_system_ton = result.system * float(course.value)
            return BankSchema(id=result.id, jackpot_gold=result.jackpot_gold, today_gold=result.today_gold, jackpot_silver=result.jackpot_silver, today_silver=result.today_silver, system=bank_system_ton)


    @classmethod
    async def change_bank(cls, uow: UnitOfWork, bank_type: BankTypeSchema, new_value: float) -> None:
        async with uow:
            if bank_type == BankTypeSchema.jackpot_gold:
                await uow.bank.update(item_id=1, jackpot_gold=new_value)
            elif bank_type == BankTypeSchema.jackpot_silver:
                await uow.bank.update(item_id=1, jackpot_silver=new_value)
            elif bank_type == BankTypeSchema.today_gold:
                await uow.bank.update(item_id=1, today_gold=new_value)
            elif bank_type == BankTypeSchema.today_silver:
                await uow.bank.update(item_id=1, today_silver=new_value)
            else:
                course = await uow.system.get_by_name(name=SystemNames.course)
                await uow.bank.update(item_id=1, system=new_value / float(course.value))
            await uow.commit()

    @classmethod
    async def get_money_stats(cls, uow: UnitOfWork) -> MoneyStatsSchema:
        async with uow:
            history: list[HistoryMoneySchema] = await uow.history_money.get_all(sort=True)
            today_profit = 0.0
            month_profit = 0.0
            all_profit = 0.0
            daily_data = {}

            today = datetime.now(UTC).replace(tzinfo=None).date()
            month_start = today.replace(month=1)

            for item in history:
                if item.type != HistoryType.top_up:
                    continue
                all_profit += item.amount
                date = item.created_at.date()
                if date == today:
                    today_profit += item.amount
                if date >= month_start:
                    month_profit += item.amount
                day_str = date.strftime('%d.%m')
                daily_data[day_str] = daily_data.get(day_str, 0.0) + item.amount

            data_list = [DataMoneyStatsSchema(name=day, profit=profit) for day, profit in daily_data.items()]

            return MoneyStatsSchema(
                today=today_profit,
                mouth=month_profit,
                all=all_profit,
                data=data_list,
            )

    @classmethod
    async def get_user_stats(cls, uow: UnitOfWork) -> UserStatsSchema:
        async with uow:
            users: list[UserFullSchema] = await uow.user.get_all_users()
            today = datetime.now(UTC).replace(tzinfo=None).date()

            all_ = {"all": 0, "today": 0}
            top_up = {"all": 0, "today": 0}
            completed_task = 0
            banned = 0
            ref = {"all": 0, "today": 0}
            not_active = 0
            daily_data = {}

            for user in users:
                all_["all"] += 1
                date = user.created_at.date()

                if user.referrer_id:
                    ref["all"] += 1

                if user.banned:
                    banned += 1

                if user.task.sub_tg and user.task.sub_x and user.task.sub_yt:
                    completed_task += 1
                else:
                    if not user.purchases:
                        not_active += 1

                if user.purchases:
                    top_up["all"] += 1

                for purchase in user.purchases:
                    if purchase.created_at.date() == today:
                        top_up["today"] += 1

                if date == today:
                    all_["today"] += 1
                    ref["today"] += 1

                day_str = date.strftime('%d.%m')
                daily_data[day_str] = daily_data.get(day_str, 0) + 1

            data_list = [DataStatsSchema(name=day, count=count) for day, count in daily_data.items()]

            return UserStatsSchema(
                all=TypeStatsSchema.model_validate(all_),
                top_up=TypeStatsSchema.model_validate(top_up),
                completed_task=completed_task,
                ref=TypeStatsSchema.model_validate(ref),
                banned=banned,
                not_active=not_active,
                data=data_list,
            )

    @classmethod
    async def get_stats_ticket(cls, uow: UnitOfWork, active: bool) -> TicketStatsSchema:
        async with uow:
            tickets: list[TicketSchema] = await uow.ticket.get_all_for_stats(active=active)
            today = datetime.now(UTC).replace(tzinfo=None).date()

            gold = {"all": 0, "today": 0}
            silver = {"all": 0, "today": 0}
            daily_data = {}

            for ticket in tickets:
                date = ticket.created_at.date()
                if ticket.type == TicketType.gold:
                    gold["all"] += 1
                    if date == today:
                        gold["today"] += 1
                    day_str = date.strftime('%d.%m')
                    daily_data[day_str] = daily_data.get(day_str, 0) + 1
                else:
                    silver["all"] += 1
                    if date == today:
                        silver["today"] += 1

            data_list = [DataStatsSchema(name=day, count=count) for day, count in daily_data.items()]

            return TicketStatsSchema(
                gold=TypeStatsSchema.model_validate(gold),
                silver=TypeStatsSchema.model_validate(silver),
                data=data_list,
            )

    @classmethod
    async def get_daily_amounts(cls, uow: UnitOfWork) -> list[DailyAmountSchema]:
        async with uow:
            one_percent = 550000 / 100
            systems = await uow.system.get_all()

            count_first, percent_first, count_second, percent_second, count_third, percent_third = 0, 0, 0, 0, 0, 0

            for system in systems:
                if system.name == SystemNames.count_first:
                    count_first = int(system.value)
                elif system.name == SystemNames.count_second:
                    count_second = int(system.value)
                elif system.name == SystemNames.count_third:
                    count_third = int(system.value)
                elif system.name == SystemNames.percent_first:
                    percent_first = int(system.value)
                elif system.name == SystemNames.percent_second:
                    percent_second = int(system.value)
                elif system.name == SystemNames.percent_third:
                    percent_third = int(system.value)
            return [
                DailyAmountSchema(amount=int(one_percent * percent_first), count=count_first),
                DailyAmountSchema(amount=int(one_percent * percent_second), count=count_second),
                DailyAmountSchema(amount=int(one_percent * percent_third), count=count_third),
            ]

    @classmethod
    async def get_daily_winners(cls, uow: UnitOfWork) -> list[WinnersFullSchema]:
        async with uow:
            winners = await uow.ticket_won.get_daily_winners()
            result: list[WinnersFullSchema] = []
            for winner in winners:
                referrals = await uow.ticket_won.get_tickets_won_referrals(winner.ticket.id)
                result.append(WinnersFullSchema.model_validate({**winner.model_dump(), "referrals": referrals}))
            return result
