import os

from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv('BOT_TOKEN')
SITE_URL = os.getenv('SITE_URL')
ADMIN_URL = os.getenv('ADMIN_URL')
bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode="HTML"))