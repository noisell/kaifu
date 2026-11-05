import json

from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, CallbackQuery

from bot.config import SITE_URL, EFFECT_IDS
from src.lottery.service import LotteryService

router = Router()

@router.message(Command('start'))
async def start(message: Message, state: FSMContext):
    await state.clear()
    await message.answer(
            text="<b>Добро пожаловать в Demos!</b>",
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text=f"Open App", web_app=WebAppInfo(url=SITE_URL))]
            ]),
        )
    # text = (f"<b>Привет, {message.from_user.first_name}!</b>\n\n"
    #         f"Добро пожаловать в <b>KAIFU</b> — уникальную игру с реальными выигрышами! 🎉\n\n"
    #         f"Теперь ты — участник захватывающего мира KAIFU! 💎 Соревнуйся с друзьями, выполняй задания, выигрывай золотые монеты и обменивай их на TON! 🚀 Собирай команду, увеличивай свой доход и борись за джекпот! 🏆\n\n"
    #         f"Готов испытать удачу и заработать? 🎯 Начни прямо сейчас и почувствуй драйв от первых побед! 🥇")
    # text_en = (f"<b>Hi, {message.from_user.first_name}!</b>\n\n"
    #            "Welcome to <b>KAIFU</b> — a unique game with real winnings! 🎉\n\n"
    #            "Now you are a participant in the exciting world of KAIFU! Compete with your friends, complete tasks, win gold coins and exchange them for a TON! 🚀 Assemble a team, increase your income and fight for the jackpot! 🏆\n\n"
    #            "Are you ready to try your luck and earn money? 🎯 Start right now and feel the drive from the first victories! 🥇")
    # if message.from_user.language_code == "ru":
    #     await message.answer(
    #         text=text,
    #         message_effect_id=EFFECT_IDS[2],
    #         reply_markup=InlineKeyboardMarkup(inline_keyboard=[
    #             [InlineKeyboardButton(text=f"⚡ Играть ⚡", web_app=WebAppInfo(url=SITE_URL))],
    #             [InlineKeyboardButton(url="https://t.me/kaifugame", text="📢 Канал")],
    #             [InlineKeyboardButton(text="💰 Как заработать на игре?", callback_data="how")]
    #         ]),
    #     )
    # else:
    #     await message.answer(
    #         text=text_en,
    #         message_effect_id=EFFECT_IDS[2],
    #         reply_markup=InlineKeyboardMarkup(inline_keyboard=[
    #             [InlineKeyboardButton(text=f"⚡ Play ⚡", web_app=WebAppInfo(url=SITE_URL))],
    #             [InlineKeyboardButton(url="https://t.me/kaifugame", text="📢 Channel")],
    #             [InlineKeyboardButton(text="💰 How to play and earn money", callback_data="how")]
    #         ]),
    #     )


@router.message(F.successful_payment)
async def successful_payment(message: Message):
    payment = message.successful_payment
    payload: dict[str, int] = json.loads(payment.invoice_payload)
    print(payload)
    await LotteryService().buy_ticket_for_stars(user_id=payload.get('user_id'), price_stars=payload.get('price'), count=payload.get('count'))

@router.callback_query(F.data == "how")
async def how(callback: CallbackQuery):
    await callback.message.edit_text(
        text="<b>Как играть и зарабатывать в KAIFU?</b>\n\n"
             "<b>🎟️ Купи билет</b>\n"
             "Получай шанс выигрывать каждый день в течение 30 дней.\n\n"
             "<b>🤝 Команда</b>\n"
             "Приглашай друзей и получай 20% от их билетов и выигрышей.\n\n"
             "<b>💰 Выигрывай и обменивай</b>\n"
             "Все награды можно мгновенно обменять на <b>TON.</b>\n\n"
             "<b>🎯 Миссии</b>\n"
             "Выполняй задания и увеличивай свой шанс на победу.\n\n"
             "🎉 <b>Готов к большим победам? Присоединяйся к KAIFU!</b> 🚀\n\n",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="🔝 Назад", callback_data="start_inline")]]),
    )


@router.callback_query(F.data == "start_inline")
async def start_inline(callback: CallbackQuery):
    text = (f"<b>Привет, {callback.from_user.first_name}!</b>\n\n"
            f"Добро пожаловать в <b>KAIFU</b> — уникальную игру с реальными выигрышами! 🎉\n\n"
            f"Теперь ты — участник захватывающего мира KAIFU! 💎 Соревнуйся с друзьями, выполняй задания, выигрывай золотые монеты и обменивай их на TON! 🚀 Собирай команду, увеличивай свой доход и борись за джекпот! 🏆\n\n"
            f"Готов испытать удачу и заработать? 🎯 Начни прямо сейчас и почувствуй драйв от первых побед! 🥇")
    text_en = (f"<b>Hi, {callback.from_user.first_name}!</b>\n\n"
               "Welcome to <b>KAIFU</b> — a unique game with real winnings! 🎉\n\n"
               "Now you are a participant in the exciting world of KAIFU! Compete with your friends, complete tasks, win gold coins and exchange them for a TON! 🚀 Assemble a team, increase your income and fight for the jackpot! 🏆\n\n"
               "Are you ready to try your luck and earn money? 🎯 Start right now and feel the drive from the first victories! 🥇")
    if callback.from_user.language_code == "ru":
        await callback.message.edit_text(
            text=text,
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text=f"⚡ Играть ⚡", web_app=WebAppInfo(url=SITE_URL))],
                [InlineKeyboardButton(url="https://t.me/kaifugame", text="📢 Канал")],
                [InlineKeyboardButton(text="💰 Как заработать на игре?", callback_data="how")]
            ]),
        )
    else:
        await callback.message.edit_text(
            text=text_en,
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text=f"⚡ Play ⚡", web_app=WebAppInfo(url=SITE_URL))],
                [InlineKeyboardButton(url="https://t.me/kaifugame", text="📢 Channel")],
                [InlineKeyboardButton(text="💰 How to play and earn money", callback_data="how")]
            ]),
        )