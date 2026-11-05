import random
import pickle
from datetime import datetime, UTC
from decimal import Decimal

from fastapi import HTTPException
from starlette import status

from bot.handlers.system import activate_ticket, create_invoice_link, referrer_win, user_win, send_admin_mess, \
    user_win_silver, send_admin_mess_fail
from src.lottery.models import TicketType, WinType
from src.lottery.schemas import PricePoolSchema, TicketSchemaAdd, PriceTicketSchema, TicketSchema, \
    SetNumberTicketResponseSchema, BankSchema, TicketWonSimpleSchema, UserWinnerSchema, DailyPricePoolSchema, \
    TicketWinnerSchema, JackpotPlaySchema
from src.redis_manager import redis_manager
from src.system.models import SystemNames
from src.uow import UnitOfWork
from src.utils import split_and_add, get_next_30_days


class LotteryService:

    @classmethod
    async def get_price_pool(cls, uow: UnitOfWork) -> PricePoolSchema:
        async with uow:
            today = await uow.price_pool.get_price_pool()
            bank = await uow.bank.get_by_id(1)
            today_value = int(today.count_gold + today.count_silver) if today else 0
            jackpot_value = int(bank.jackpot_gold + bank.jackpot_silver)
            return PricePoolSchema(today=today_value if today_value > 550000 else 550000, jackpot=jackpot_value if jackpot_value > 8250000 else 8250000)

    @classmethod
    async def check_balance_user(cls, uow: UnitOfWork, user_id: int, gold: bool = False, count: int = 1) -> bool | tuple[bool, int]:
        async with uow:
            user = await uow.user.get_by_id(user_id)
            if gold:
                price = await uow.system.get_by_name(SystemNames.price_gold_ticket)
                if (int(price.value) * count) > user.gold_coins:
                    return False
            else:
                price = await uow.system.get_by_name(SystemNames.price_silver_ticket)
                if (int(price.value) * count) > user.silver_coins:
                    return False
            return True, int(price.value)

    @classmethod
    async def booking_tickets(cls, uow: UnitOfWork, ticket_type: TicketType, count: int) -> dict[int, list[int]] | int:
        async with uow:
            success, counter_lot = await uow.counter_lot.get_last_date(ticket_type)
            if success:
                lot, last_number = counter_lot.lot, counter_lot.count
            else:
                lot, last_number = counter_lot.lot + 1, 0
                await uow.counter_lot.add({"lot": lot, "type": ticket_type, "count": 0})
            if ticket_type == TicketType.gold:
                await uow.commit()
                return lot
            if 999999 - last_number >= count:
                await uow.counter_lot.update_count(lot=lot, ticket_type=ticket_type, value=count)
                await uow.commit()
                return {lot: [last_number + i for i in range(1, count + 1)]}
            else:
                result = {lot: []}
                for _ in range(1, count + 1):
                    if 999999 - last_number >= 1:
                        last_number += 1
                        result[lot].append(last_number)
                        await uow.counter_lot.update_count(lot=lot, ticket_type=ticket_type)
                    else:
                        lot, last_number = lot + 1, 1
                        await uow.counter_lot.add({"lot": lot, "type": ticket_type, "count": 0})
                        await uow.counter_lot.update_count(lot=lot, ticket_type=ticket_type)
                        result[lot] = [1]
                await uow.commit()
                return result

    @classmethod
    async def change_bank(cls, uow: UnitOfWork, user_id: int, price: int, count: int):
        amount = price * count
        async with uow:
            jackpot_gold = amount * 0.1
            today_gold = amount * 0.2

            jackpot_silver = amount * 0.01
            today_silver = amount * 0.02

            referrer = amount * 0.2

            system = amount * 0.305

            user = await uow.user.get_by_id(user_id)
            if user.referrer_id is not None:
                referrer_value, new_system = split_and_add(str(referrer), str(system))
                system = new_system
                await uow.user.update_balance(user_id=user.referrer_id, value=referrer_value, gold=True)
            else:
                system = float(Decimal(str(system)) + Decimal(str(referrer)))
                referrer_value = 0

            await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=jackpot_gold, today_gold=today_gold, jackpot_silver=jackpot_silver, today_silver=today_silver, system=system))
            await uow.purchase_history.add(
                {
                    "user_id": user_id,
                    "ticket_price": price,
                    "count": count,
                    "jackpot_gold": jackpot_gold,
                    "jackpot_silver": jackpot_silver,
                    "today_gold": today_gold,
                    "today_silver": today_silver,
                    "system": system,
                    "referrer": referrer_value,
                }
            )
            # Получить списком даты на месяц вперед по UTC.
            days = get_next_30_days()
            # Обновить или создать новые записи с этими датами.
            update_dates = await uow.price_pool.check_dates(days)
            if update_dates:
                await uow.price_pool.update_price_pool(dates=update_dates, count_gold=today_gold / 30, count_silver=today_silver / 30)
            insert_dates = list(set(days) - set(update_dates))
            for date in insert_dates:
                await uow.price_pool.add({"date": date, "count_gold": today_gold / 30, "count_silver": today_silver / 30})

            await uow.commit()

    @classmethod
    async def change_redis_numbers(cls, lot: int, numbers: list[int]) -> None:
        redis_numbers = redis_manager.get_one("numbers", lot)
        if not redis_numbers:
            redis_manager.add_one("numbers", lot, pickle.dumps(numbers))
        else:
            redis_manager.add_one("numbers", lot, pickle.dumps(pickle.loads(redis_numbers) + numbers))

    @classmethod
    async def buy_ticket(cls, uow: UnitOfWork, user_id: int, data: TicketSchemaAdd) -> PriceTicketSchema:
        enough_funds = await cls.check_balance_user(uow=uow, user_id=user_id, gold=True if data.type == TicketType.gold else False, count=data.count)
        if enough_funds is False:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient funds")
        price: int = enough_funds[1]
        tickets = await cls.booking_tickets(uow=uow, ticket_type=data.type, count=data.count)
        async with uow:
            if data.type == TicketType.silver:
                for lot, numbers in tickets.items():
                    for number in numbers:
                        await uow.ticket.add({
                            "user_id": user_id,
                            "type": data.type,
                            "lot": lot,
                            "number": number,
                            "price": price
                        })
                await uow.user.update_balance(user_id=user_id, value=-(price * data.count))
            else:
                await uow.ticket.add({
                    "user_id": user_id,
                    "type": data.type,
                    "lot": tickets,
                    "number": None,
                    "price": price,
                    "active": True,
                    "count": data.count
                })
                await uow.user.update_balance(user_id=user_id, value=-(price * data.count), gold=True)
            await uow.commit()
        if data.type == TicketType.gold:
            await cls.change_bank(uow=uow, user_id=user_id, price=price, count=data.count)
        return PriceTicketSchema(price=price * data.count)

    @classmethod
    async def buy_ticket_for_stars(cls, user_id: int, price_stars: int, count: int):
        async with UnitOfWork() as uow:
            success, counter_lot = await uow.counter_lot.get_last_date(TicketType.gold)
            if success:
                lot, last_number = counter_lot.lot, counter_lot.count
            else:
                lot, last_number = counter_lot.lot + 1, 0
                await uow.counter_lot.add({"lot": lot, "type": TicketType.gold, "count": 0})
            course_stars = await uow.system.get_by_name(SystemNames.course_stars)
            price = price_stars / float(course_stars.value) # Сколько голды выходит по курсу

            await uow.ticket.add({
                "user_id": user_id,
                "type": TicketType.gold,
                "lot": lot,
                "number": None,
                "price": price,
                "active": True,
                "count": count
            })
            amount = price * count

            jackpot_gold = amount * 0.1
            jackpot_silver = amount * 0.05
            system = amount * 0.2
            today_gold = amount * 0.2
            today_silver = amount * 0.05
            referrer = amount * 0.2
            user = await uow.user.get_by_id(user_id)
            if user.referrer_id is not None:
                referrer_value, new_system = split_and_add(str(referrer), str(system))
                await uow.user.update_balance(user_id=user.referrer_id, value=referrer_value, gold=True)
            else:
                referrer_value = 0

            await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=jackpot_gold, today_gold=today_gold, jackpot_silver=jackpot_silver, today_silver=today_silver, system=0))
            count_stars = await uow.system.get_by_name(SystemNames.stars)
            await uow.system.update_data(name=SystemNames.stars, value=str(int(count_stars.value) + price_stars * count))
            await uow.purchase_history.add(
                {
                    "user_id": user_id,
                    "ticket_price": price,
                    "count": count,
                    "jackpot_gold": jackpot_gold,
                    "jackpot_silver": jackpot_silver,
                    "today_gold": today_gold,
                    "today_silver": today_silver,
                    "system": 0,
                    "referrer": referrer_value,
                }
            )
            days = get_next_30_days()
            # Обновить или создать новые записи с этими датами.
            update_dates = await uow.price_pool.check_dates(days)
            if update_dates:
                await uow.price_pool.update_price_pool(dates=update_dates, count_gold=today_gold / 30, count_silver=today_silver / 30)
            insert_dates = list(set(days) - set(update_dates))
            for date in insert_dates:
                await uow.price_pool.add({"date": date, "count_gold": today_gold / 30, "count_silver": today_silver / 30})
            await uow.commit()


    @classmethod
    def get_numbers(cls, lot: int) -> list[int]:
        numbers = redis_manager.get("numbers")
        numbers = {int(key): pickle.loads(value) for key, value in numbers.items()}
        current_lot = numbers.get(lot)
        return current_lot if current_lot else []

    @classmethod
    async def add_all_numbers_redis(cls) -> None:
        async with UnitOfWork() as uow:
            data = await uow.ticket.get_all_numbers()
        if data:
            data = {key: pickle.dumps(value) for key, value in data.items()}
            redis_manager.add("numbers", data)

    @classmethod
    async def get_all_tickets(cls, uow: UnitOfWork, user_id: int) -> list[TicketSchema]:
        async with uow:
            return await uow.ticket.get_all_tickets(user_id=user_id)

    @classmethod
    async def activate_silver_ticket(cls, uow: UnitOfWork, ticket_id: int) -> None:
        async with uow:
            await uow.ticket.update(item_id=ticket_id, active=True)
            await uow.commit()

    @classmethod
    def get_active_lot_and_allowed_numbers(cls, lot: int) -> tuple[int, list[int]]:
        allowed_numbers = set(range(1, 1000000)) - set(cls.get_numbers(lot=lot))
        if not allowed_numbers:
            return cls.get_active_lot_and_allowed_numbers(lot + 1)
        else:
            return lot, list(allowed_numbers)

    @classmethod
    async def set_number_ticket(cls, uow: UnitOfWork, ticket_id: int, new_number: int | None) -> SetNumberTicketResponseSchema:
        async with uow:
            ticket = await uow.ticket.get_by_id(item_id=ticket_id)
            lot, allowed_numbers = cls.get_active_lot_and_allowed_numbers(lot=ticket.lot)
            lot_exist = await uow.counter_lot.check_exist_lot(lot=lot)
            if not lot_exist:
                await uow.counter_lot.add({"lot": lot, "type": TicketType.gold, "count": 0})
                await uow.ticket.update(item_id=ticket_id, lot=lot)
            else:
                if ticket.lot != lot:
                    await uow.ticket.update(item_id=ticket_id, lot=lot)

            if not new_number:
                new_number = random.choice(allowed_numbers)
                await uow.ticket.update(item_id=ticket_id, number=new_number)
            else:
                if new_number in allowed_numbers:
                    await uow.ticket.update(item_id=ticket_id, number=new_number)
                else:
                    raise HTTPException(status_code=404, detail="No numbers")

            await cls.change_redis_numbers(lot, [new_number])
            await uow.counter_lot.update_count(lot=lot, ticket_type=TicketType.gold)
            await uow.commit()
            return SetNumberTicketResponseSchema(lot=lot, number=new_number)

    @classmethod
    async def check_number_in_use(cls, uow: UnitOfWork, ticket_id: int, number: int) -> bool:
        async with uow:
            ticket = await uow.ticket.get_by_id(item_id=ticket_id)
            lot, allowed_numbers = cls.get_active_lot_and_allowed_numbers(lot=ticket.lot)
            if ticket.lot == lot and number in allowed_numbers:
                return True
            else:
                return False

    @classmethod
    async def get_count_active_win(cls, uow: UnitOfWork, user_id: int) -> int:
        async with uow:
            return await uow.ticket_won.get_count_active_win(user_id=user_id)

    @classmethod
    async def get_tickets_won(cls, uow: UnitOfWork, user_id: int) -> list[TicketWonSimpleSchema]:
        async with uow:
            return await uow.ticket_won.get_tickets_won(user_id=user_id)

    @classmethod
    async def received_ticket_won(cls, uow: UnitOfWork, ticket_id: int) -> None:
        async with uow:
            tickets_won = await uow.ticket_won.get_tickets_won_by_ticket_id(ticket_id=ticket_id)
            if not tickets_won:
                return
            user_id = tickets_won[0].user_id
            amount = 0
            for ticket in tickets_won:
                if not ticket.received:
                    amount += ticket.amount
                    await uow.ticket_won.update(item_id=ticket.id, received=True)
            await uow.user.update_balance(user_id=user_id, value=int(amount), gold=True)
            await uow.commit()

    @classmethod
    def adjust_counts(cls, count_first: int, count_second: int, count_third: int, count_users: int):
        total_count = count_first + count_second + count_third

        if total_count <= count_users:
            return count_first, count_second, count_third

        # Рассчитываем коэффициент коррекции
        correction_factor = count_users / total_count

        # Применяем коэффициент коррекции к каждому значению, округляем до целого
        adjusted_first = int(round(count_first * correction_factor))
        adjusted_second = int(round(count_second * correction_factor))
        adjusted_third = int(round(count_third * correction_factor))

        # Проверка на то, что после округления сумма не меньше count_users.
        # Если сумма меньше, то увеличиваем наибольшее значение
        adjusted_total = adjusted_first + adjusted_second + adjusted_third
        if adjusted_total < count_users:
            diff = count_users - adjusted_total
            max_index = max(range(3), key=[adjusted_first, adjusted_second, adjusted_third].__getitem__)
            if max_index == 0:
                adjusted_first += diff
            elif max_index == 1:
                adjusted_second += diff
            else:
                adjusted_third += diff

        return adjusted_first, adjusted_second, adjusted_third

    @classmethod
    async def change_all_silver_ticket_to_not_active_and_send_notification(cls):
        async with UnitOfWork() as uow:
            list_users_ids = await uow.ticket.get_all_silver_for_date()
            await uow.ticket.change_all_silver_to_not_active()
            await uow.commit()

        for user_id in list_users_ids:
            await activate_ticket(user_id=user_id)

    @classmethod
    async def daily_lottery(cls, ticket_type: TicketType = TicketType.gold, count_profit_system: int | float = 0):
        try:
            list_names = ["count_first", "count_second", "count_third", "percent_first", "percent_second", "percent_third"]
            invest_names = ["investment_silver", "investment_gold"]

            lottery_data: dict[SystemNames, int] = dict()
            invest_gold, invest_silver = 0, 0
            async with UnitOfWork() as uow:
                system = await uow.system.get_all()
                pool = await uow.price_pool.get_price_pool()
                users = await uow.ticket.get_all_active(ticket_type=ticket_type)
                if not pool:
                    pool = DailyPricePoolSchema(count_gold=0, count_silver=0, date=datetime.now(UTC).replace(tzinfo=None, hour=0, minute=0, second=0, microsecond=0))
                    invest_gold, invest_silver = 500000, 50000

                if not users:
                    if ticket_type == TicketType.gold:
                        await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=0, today_gold=-pool.count_gold, jackpot_silver=0, today_silver=0, system=pool.count_gold))
                        await uow.commit()
                        await cls.daily_lottery(ticket_type=TicketType.silver, count_profit_system=count_profit_system)
                        return
                    else:
                        await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=0, today_gold=0, jackpot_silver=0, today_silver=-pool.count_silver, system=pool.count_silver))
                        await uow.commit()
                        return
                await uow.commit()
            async with UnitOfWork() as uow:
                for i in system:
                    if i.name.value in list_names:
                        lottery_data[i.name] = int(i.value)
                    elif i.name.value == invest_names[0] and ticket_type == TicketType.silver:
                        value = float(i.value)
                        need_money = 50000 - pool.count_silver
                        if 0 < need_money <= value:
                            invest_silver = need_money
                            await uow.system.update_data(name=SystemNames.investment_silver, value=str(value - need_money))
                    elif i.name.value == invest_names[1] and ticket_type == TicketType.gold:
                        value = float(i.value)
                        need_money = 500000 - pool.count_gold
                        if 0 < need_money <= value:
                            invest_gold = need_money
                            await uow.system.update_data(name=SystemNames.investment_gold, value=str(value - need_money))
                await uow.commit()
            pool = DailyPricePoolSchema(count_gold=pool.count_gold + invest_gold, count_silver=pool.count_silver + invest_silver, date=datetime.now(UTC).replace(tzinfo=None, hour=0, minute=0, second=0, microsecond=0))

            count_first, count_second, count_third = lottery_data[SystemNames.count_first], lottery_data[SystemNames.count_second], lottery_data[SystemNames.count_third]

            random.shuffle(users)
            first: list[UserWinnerSchema] = []
            second: list[UserWinnerSchema] = []
            third: list[UserWinnerSchema] = []

            for user_winner in users:
                if len(third) < count_third:
                    third.append(user_winner)
                elif len(second) < count_second:
                    second.append(user_winner)
                elif len(first) < count_first:
                    first.append(user_winner)
                else:
                    break
            send_mess_ref: dict[int, bool] = {}
            async with UnitOfWork() as uow:
                async def ref_payment(user_id: int, amount_win: float, ticket_id: int, send_mess: dict[int, bool]) -> tuple[float | int, dict[int, bool]]:
                    if amount_win < 1:
                        await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=0, today_gold=0, jackpot_silver=0, today_silver=0, system=amount_win))
                        return amount_win, send_mess

                    user = await uow.user.get_by_id(user_id)
                    referrer_amount_to_system: int | float = 0
                    if user.referrer_id and int(amount_win * 0.2) >= 1:
                        referrer_one = await uow.user.get_by_id(item_id=user.referrer_id)
                        await uow.user.update_balance(user_id=user.referrer_id, value=int(amount_win * 0.2), gold=True)
                        await uow.ticket_won.add({
                            "ticket_id": ticket_id,
                            "user_id": user.referrer_id,
                            "type": WinType.referrer,
                            "amount": int(amount_win * 0.2),
                            "received": True
                        })
                        if user.referrer_id not in send_mess_ref:
                            await referrer_win(user.referrer_id, user.username)
                            send_mess[user.referrer_id] = True
                        if referrer_one.referrer_id and int(amount_win * 0.15) >= 1:
                            referrer_two = await uow.user.get_by_id(item_id=referrer_one.referrer_id)
                            await uow.user.update_balance(user_id=referrer_one.referrer_id, value=int(amount_win * 0.15), gold=True)
                            await uow.ticket_won.add({
                                "ticket_id": ticket_id,
                                "user_id": referrer_one.referrer_id,
                                "type": WinType.referrer,
                                "amount": int(amount_win * 0.15),
                                "received": True
                            })
                            if referrer_one.referrer_id not in send_mess_ref:
                                await referrer_win(referrer_one.referrer_id, user.username)
                                send_mess[referrer_one.referrer_id] = True
                            if referrer_two.referrer_id and int(amount_win * 0.1) >= 1:
                                referrer_three = await uow.user.get_by_id(item_id=referrer_two.referrer_id)
                                await uow.user.update_balance(user_id=referrer_two.referrer_id, value=int(amount_win * 0.1), gold=True)
                                await uow.ticket_won.add({
                                    "ticket_id": ticket_id,
                                    "user_id": referrer_two.referrer_id,
                                    "type": WinType.referrer,
                                    "amount": int(amount_win * 0.1),
                                    "received": True
                                })
                                if referrer_two.referrer_id not in send_mess_ref:
                                    await referrer_win(referrer_two.referrer_id, user.username)
                                    send_mess[referrer_two.referrer_id] = True
                                if referrer_three.referrer_id and int(amount_win * 0.05) >= 1:
                                    await uow.user.update_balance(user_id=referrer_three.referrer_id, value=int(amount_win * 0.05), gold=True)
                                    await uow.ticket_won.add({
                                        "ticket_id": ticket_id,
                                        "user_id": referrer_three.referrer_id,
                                        "type": WinType.referrer,
                                        "amount": int(amount_win * 0.05),
                                        "received": True
                                    })
                                    if referrer_three.referrer_id not in send_mess_ref:
                                        await referrer_win(referrer_three.referrer_id, user.username)
                                        send_mess[referrer_three.referrer_id] = True
                                else:
                                    referrer_amount_to_system = amount_win * 0.05
                            else:
                                referrer_amount_to_system = amount_win * 0.15
                        else:
                            referrer_amount_to_system = amount_win * 0.3
                    else:
                        referrer_amount_to_system = amount_win * 0.5
                    if referrer_amount_to_system != 0:
                        await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=0, today_gold=0, jackpot_silver=0, today_silver=0, system=referrer_amount_to_system))
                    return referrer_amount_to_system, send_mess

                if ticket_type == TicketType.gold:
                    course_gold = 0.0001  # Заглушка для зоны видимости
                    count = pool.count_gold
                    if count <= 1:
                        await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=0, today_gold=-(count - invest_gold), jackpot_silver=0, today_silver=0, system=(count - invest_gold)))
                        return await uow.commit()
                    await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=0, today_gold=-(count - invest_gold), jackpot_silver=0, today_silver=0, system=0))
                else:
                    course = await uow.system.get_by_name(SystemNames.course)
                    course_gold = float(course.value)
                    count = pool.count_silver
                    if count <= 1:
                        await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=0, today_gold=0, jackpot_silver=0, today_silver=-(count - invest_silver), system=(count - invest_silver)))
                        return await uow.commit()
                    await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=0, today_gold=0, jackpot_silver=0, today_silver=-(count - invest_silver), system=0))

                async def calculate_win(percent: float, count_winners: int, list_winners: list[UserWinnerSchema], send_mess: dict[int, bool]) -> tuple[int | float, list[int], dict[int, bool]]:
                    count_profit_system_for_referrals: int | float = 0
                    list_users_ids = []
                    amount = (count / 100 * percent) / count_winners
                    for user in list_winners:
                        await uow.ticket_won.add({
                            "ticket_id": user.id,
                            "user_id": user.user_id,
                            "type": WinType.daily,
                            "amount": int(amount),
                        })
                        list_users_ids.append(user.user_id)
                        count_profit_system_for_referrals_, send_mess = await ref_payment(user_id=user.user_id, amount_win=amount, ticket_id=user.id, send_mess=send_mess)
                        count_profit_system_for_referrals += count_profit_system_for_referrals_
                    return count_profit_system_for_referrals, list_users_ids, send_mess

                async def system_win(percent: float, count_winners: int, fact_count_winners: int) -> int | float:
                    amount = ((count / 100 * percent) / count_winners) * fact_count_winners # Такую сумму суммарно получили победители
                    system_win_amount = count - amount  # Остаток, который уходит в систему
                    if system_win_amount > 0:
                        await uow.bank.update_bank(bank=BankSchema(id=1, jackpot_gold=0, today_gold=0, jackpot_silver=0, today_silver=0, system=system_win_amount))
                        return system_win_amount
                    return 0

                profit_first, profit_second, profit_third = 0, 0, 0
                list_users_first, list_users_second, list_users_third = [], [], []

                profit_third, list_users_third, send_mess_ref = await calculate_win(percent=lottery_data[SystemNames.percent_third], count_winners=count_third, list_winners=third, send_mess=send_mess_ref)
                if len(third) == count_third:
                    profit_second, list_users_second, send_mess_ref = await calculate_win(percent=lottery_data[SystemNames.percent_second], count_winners=count_second, list_winners=second, send_mess=send_mess_ref)
                else:
                    profit_third += await system_win(percent=lottery_data[SystemNames.percent_third], count_winners=count_third, fact_count_winners=len(third))
                if len(second) == count_second:
                    profit_first, list_users_first, send_mess_ref = await calculate_win(percent=lottery_data[SystemNames.percent_first], count_winners=count_first, list_winners=first, send_mess=send_mess_ref)
                else:
                    profit_second += await system_win(percent=lottery_data[SystemNames.percent_second], count_winners=count_second, fact_count_winners=len(second))
                if len(first) < count_first:
                    profit_first += await system_win(percent=lottery_data[SystemNames.percent_first], count_winners=count_first, fact_count_winners=len(first))

                await uow.commit()
            count_profit_system += profit_first + profit_second + profit_third
            list_users = list(set(list_users_first + list_users_second + list_users_third))

            if ticket_type == TicketType.gold:
                for i in list_users:
                    await user_win(i)
                await cls.daily_lottery(ticket_type=TicketType.silver, count_profit_system=count_profit_system)
            else:
                for i in list_users:
                    await user_win_silver(i)
                # Отправляем сообщение админу
                await send_admin_mess(count=count_profit_system, course_gold=course_gold)
                await cls.change_all_silver_ticket_to_not_active_and_send_notification()
        except Exception as e:
            await send_admin_mess_fail(f"{e}")


    @classmethod
    async def get_invoice(cls, uow: UnitOfWork, user_id: int, count: int, lang: str) -> str:
        async with uow:
            price = await uow.system.get_by_name(SystemNames.price_gold_ticket_stars)
        return await create_invoice_link(user_id=user_id, price=int(price.value), count=count, lang=lang)

    @classmethod
    async def jackpot_amount(cls, uow: UnitOfWork) -> float:
        async with uow:
            bank: BankSchema = await uow.bank.get_by_id(item_id=1)
            # invest_gold = await uow.system.get_by_name(SystemNames.investment_gold_jackpot)
            # invest_silver = await uow.system.get_by_name(SystemNames.investment_silver_jackpot)
            # amount_gold =  bank.jackpot_gold + float(invest_gold.value)
            # amount_silver =  bank.jackpot_silver + float(invest_silver.value)
            return bank.jackpot_gold + bank.jackpot_silver


    @classmethod
    async def play_jackpot(cls, uow: UnitOfWork) -> JackpotPlaySchema:
        number_win = random.randint(1, 999999)
        async with uow:
            winner: list[TicketWinnerSchema] = await uow.ticket.get_by_number(number=number_win)
            if not winner:
                return JackpotPlaySchema(number=number_win, data=None)

        amount = await cls.jackpot_amount(uow=uow)





