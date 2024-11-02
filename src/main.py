from fastapi import FastAPI
from src.user.router import router as user_router
from src.auth.router import router as auth_router
app = FastAPI(
    title="KAIFU",
    version="0.1"
)

app.include_router(auth_router)
app.include_router(user_router)