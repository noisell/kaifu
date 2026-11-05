from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.lottery.schemas import TicketWonActionSchema
from src.system.models import HistoryType
from src.system.schemas import HistoryActionSchema, HistoryMoneySimpleSchema, HistoryMoneyCreateSchema
from src.uow import IUnitOfWork, UnitOfWork
from src.user.schemas import UserAddSchema, UserSchema, TaskSchema, CheckSub, Channels, FriendSchema
from src.user.utils import check_sub_telegram


# noinspection PyArgumentList
class UserService:

    @classmethod
    async def create_user(cls, uow: IUnitOfWork, data: UserAddSchema) -> UserSchema:
        referrer_id = None
        async with uow:
            if data.referrer_id:
                referrer = await uow.user.get_by_id(data.referrer_id)
                if referrer:
                    referrer_id = referrer.id
                    count_referrals = await uow.user.get_count_referrals(referrer_id)
                    if count_referrals < 3:
                        await uow.user.update_balance(user_id=referrer_id, value=1000)
            data_dict = data.model_dump()
            data_dict['referrer_id'] = referrer_id
            new_user = await uow.user.add(data_dict)
            if not new_user:
                raise HTTPException(
                    status_code=HTTP_400_BAD_REQUEST,
                    detail="Such a user already exists"
                )
            await uow.task.add({"user_id": data.id})
            await uow.commit()
        return UserSchema(**data.model_dump(), gold_coins=0, silver_coins=0, banned=False, created_at=None)

    @classmethod
    async def get_user_by_id(cls, uow: IUnitOfWork, user_id: int) -> UserSchema:
        async with uow:
            result = await uow.user.get_by_id(user_id)
            if not result:
                raise HTTPException(
                    status_code=HTTP_404_NOT_FOUND,
                    detail="Such a user has not been found"
                )
            return result


    @classmethod
    async def update_avatar(cls, uow: IUnitOfWork, user_id: int, avatar: str) -> None:
        async with uow:
            await uow.user.update(user_id, avatar=avatar)
            await uow.commit()

    @classmethod
    async def get_task_completed(cls, uow: IUnitOfWork, user_id: int) -> TaskSchema:
        async with uow:
            return await uow.task.get_by_id(user_id, for_user_id=True)

    @classmethod
    async def check_sub_telegram(cls, uow: IUnitOfWork, user_id: int) -> bool:
        async with uow:
            user_subscribed = await check_sub_telegram(user_id)
            if user_subscribed:
                await uow.task.update(item_id=user_id, for_user_id=True, sub_tg=True)
                await uow.user.update_balance(user_id=user_id, value=1000)
                await uow.commit()
                return True
            else:
                return False

    @classmethod
    async def check_sub_other(cls, uow: IUnitOfWork, user_id: int, data: CheckSub) -> bool:
        async with uow:
            if data.channel == Channels.x:
                await uow.task.update(item_id=user_id, for_user_id=True, sub_x=True)
            elif data.channel == Channels.instagram:
                await uow.task.update(item_id=user_id, for_user_id=True, sub_inst=True)
            else:
                await uow.task.update(item_id=user_id, for_user_id=True, sub_yt=True)
            await uow.user.update_balance(user_id=user_id, value=1000)
            await uow.commit()
            return True

    @classmethod
    async def get_friends(cls, uow: IUnitOfWork, user_id: int) -> list[FriendSchema]:
        async with uow:
            return await uow.user.get_friends(user_id)

    @classmethod
    async def merge_and_sort_history(cls, money_history: list[HistoryMoneySimpleSchema], win_history: list[TicketWonActionSchema]) -> list[HistoryActionSchema]:
        merged_history = []

        for item in money_history:
            merged_history.append(
                HistoryActionSchema(
                    type=item.type,
                    gold=item.gold,
                    amount=item.amount,
                    created_at=item.created_at,
                )
            )
        for item in win_history:
            merged_history.append(
                HistoryActionSchema(
                    type=item.type,
                    gold=item.amount,
                    amount=None,
                    created_at=item.created_at,
                )
            )

        merged_history.sort(key=lambda x: x.created_at, reverse=True)

        return merged_history

    @classmethod
    async def get_history_action(cls, uow: UnitOfWork, user_id: int) -> list[HistoryActionSchema]:
        async with uow:
            history_money = await uow.history_money.get_all_for_user(user_id)
            history_ticket_won = await uow.ticket_won.get_history_ticket_won(user_id)
            return await cls.merge_and_sort_history(history_money, history_ticket_won)

    @classmethod
    async def update_history(cls, uow: UnitOfWork, user_id: int, data: HistoryMoneyCreateSchema):
        data_dict = data.model_dump()
        data_dict['user_id'] = user_id
        async with uow:
            if data.type == HistoryType.top_up:
                await uow.user.update_balance(user_id=user_id, value=data.gold, gold=True)
            else:
                user = await uow.user.get_by_id(item_id=user_id)
                if user.gold_coins >= data.gold:
                    await uow.user.update_balance(user_id=user_id, value=-data.gold, gold=True)
                else:
                    return HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Insufficient funds")
            await uow.history_money.add(data_dict)
            await uow.commit()
