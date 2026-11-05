import os

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from dotenv import load_dotenv

load_dotenv()

# BOT_TOKEN = os.getenv('BOT_TOKEN')
BOT_TOKEN = "REMOVED_SECRET"
SITE_URL = os.getenv('SITE_URL')
ADMIN_URL = os.getenv('ADMIN_URL')

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode="HTML"))
dp = Dispatcher()


EFFECT_IDS: list[str] = [
    "5104841245755180586",  # 🔥
    "5107584321108051014",  # 👍
    "5159385139981059251",  # ❤️
    "5046509860389126442",  # 🎉
]