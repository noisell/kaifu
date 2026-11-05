import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv('BOT_TOKEN')
CHANNEL_ID = os.getenv('CHANNEL_ID')
CHECK_SUB_URL = f"https://api.telegram.org/bot{BOT_TOKEN}/getChatMember"