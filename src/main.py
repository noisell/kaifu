from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

from src.lottery.service import LotteryService
from src.user.router import router as user_router
from src.auth.router import router as auth_router
from src.system.router import router as system_router
from src.lottery.router import router as lottery_router
from src.admin.router import router as admin_router

from src.config import REDIS_HOST, REDIS_PORT


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    redis = aioredis.from_url(f"redis://{REDIS_HOST}:{REDIS_PORT}")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    await LotteryService().add_all_numbers_redis()
    yield


app = FastAPI(
    title="KAIFU",
    version="0.1",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["http://localhost:8000", "http://localhost:3000", "https://two-market.ru", "https://kaifugame.fun", "https://admin.kaifugame.fun"],
    allow_methods=["GET", "POST", "PATCH", "OPTIONS", "DELETE", "PUT"],
    allow_headers=['Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials', 'Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Cookie', 'Set-Cookie'],

)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(system_router)
app.include_router(lottery_router)
app.include_router(admin_router)