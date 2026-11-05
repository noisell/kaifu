import json

from aiogram import Router
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, LabeledPrice

from bot.config import ADMIN_URL, bot, SITE_URL, EFFECT_IDS

router = Router()

async def create_admin(user_id: int, login: str | int, password: str):
    message = ("👑 <b>Вам выдан доступ к админ панели</b>\n\n"
               f"Ваш логин: <code>{login}</code>\n"
               f"Ваш пароль: <code>{password}</code>\n\n"
               f"Ссылка для входа - {ADMIN_URL}")
    try:
        await bot.send_message(chat_id=user_id, text=message)
        return True
    except Exception as e:
        return f"Ошибка: {e}"


async def activate_ticket(user_id: int):
    message = ("<b>Don't miss the chance to win today! 🕓</b>\n\n"
               f"Activate your Silver Ticket right now and participate in the drawing. Each activated ticket is a step closer to your winnings. 🎟\n\n"
               f"Act while you have time! 🚀")
    try:
        await bot.send_message(
            chat_id=user_id,
            text=message,
            message_effect_id=EFFECT_IDS[0],
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(
                    text=f"⚡ Play ⚡",
                    web_app=WebAppInfo(url=SITE_URL)
                )]
            ]),
        )
        return True
    except:
        return False


async def create_invoice_link(user_id: int, price: int, lang: str, count: int):
    return await bot.create_invoice_link(
        title=f"{'Золотой билет' if count == 1 else f'{count} Золотых {'билета' if count < 5 else 'билетов'}'}" if lang == "ru" else f"{'Gold ticket' if count == 1 else f'{count} Gold tickets'}",
        description="Покупая билет вы получаете право на участие в розыгрышах и возможность выиграть JACKPOT!" if lang == "ru" else f"By buying a ticket, you get the right to participate in sweepstakes and the opportunity to win a JACKPOT!",
        payload=json.dumps({"user_id": user_id, "price": price, "count": count}),
        currency="XTR",
        prices=[LabeledPrice(label="1", amount=price * count)],
    )


async def referrer_win(user_id: int, username: str | None):
    try:
        return await bot.send_message(
            chat_id=user_id,
            message_effect_id=EFFECT_IDS[3],
            text=f"<b>🔥 Wow! Your friend just won! 🔥</b>\n\n"
                 "And you won with him! 🎁✨\n"
                 "Invite more friends and get even more bonuses! 🥳",
            reply_markup = InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(
                    text=f"⚡ Play ⚡",
                    web_app=WebAppInfo(url=SITE_URL)
                )]
            ]),
        )
    except:
        return


async def user_win(user_id: int):
    try:
        return await bot.send_message(
            chat_id=user_id,
            message_effect_id=EFFECT_IDS[3],
            text="<b>🎉 Hooray, this is your victory! 🎉</b>\n\n"
                 "You have become the winner — your prize is already waiting for you!\n"
                 "Do not delay, collect your winnings right now. Keep playing and win again! 🚀💰",
            reply_markup = InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(
                    text=f"⚡ Play ⚡",
                    web_app=WebAppInfo(url=SITE_URL)
                )]
            ]),
        )
    except:
        return


async def user_win_silver(user_id: int):
    try:
        return await bot.send_message(
            chat_id=user_id,
            message_effect_id=EFFECT_IDS[3],
            text="<b>Your Silver Ticket won! 🎉</b>\n\n"
                 "Your prize is ready. Don’t wait — claim it now!\n\n"
                 "✨ Get a <b>Gold Ticket</b> and win <b>10x more!</b>",
            reply_markup = InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(
                    text=f"⚡ Play ⚡",
                    web_app=WebAppInfo(url=SITE_URL)
                )]
            ]),
        )
    except:
        return


async def send_admin_mess(count: int | float, course_gold: float):
    try:
        return await bot.send_message(
            chat_id=141354062,
            text=f"✅ <b>Прошел ежедневный розыгрыш!</b> "
                 f"К прибыли компании прибавилось <b>{int(count)}</b> GOLD ≈ <b>{round(count * course_gold, 2)}</b> TON",
        )
    except:
        return


async def send_admin_mess_fail(error: str):
    try:
        return await bot.send_message(
            chat_id=844642570,
            text=f"❗️ <b>Ежедневный розыгрыш не прошел!</b>\n\n"
                 f"<b>Причина:</b> {error}",
        )
    except:
        return


