from aiogram import Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

from bot.config import SITE_URL

router = Router()

@router.message(Command('start'))
async def start(message: Message, state: FSMContext):
    await state.clear()
    await message.answer(
        text="Welcome to KAIFU!",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(
                text="⚡️Start",
                web_app=WebAppInfo(url=SITE_URL)
            )]
        ])
    )