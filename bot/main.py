import asyncio
import logging

from aiogram import Dispatcher
from bot.config import bot
from bot.handlers.home import router as home_router


async def main():
    dp = Dispatcher()
    dp.include_router(home_router)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass