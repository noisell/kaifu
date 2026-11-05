import ssl
import aiohttp

from src.user.config import CHANNEL_ID, CHECK_SUB_URL

async def check_sub_telegram(user_id: int):
    params = {"chat_id": CHANNEL_ID, "user_id": user_id}
    context = ssl.create_default_context()

    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=context)) as session:
        try:
            async with session.get(CHECK_SUB_URL, params=params) as response:
                result = await response.json()
                result = result.get("result")
                if result and result.get("status") != "left" and result.get("status") != "kicked":
                    return True
                return False
        except Exception as e:
            print(e)
            return False