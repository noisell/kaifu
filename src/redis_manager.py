from typing import Awaitable, Any
from redis import Redis
from src.config import REDIS_HOST, REDIS_PORT

class RedisManager:
    def __init__(self, host=REDIS_HOST, port=REDIS_PORT, db=0):
        self.r = Redis(host=host, port=port, db=db)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.r.close()

    def add(self, name: str, mapping: dict) -> None:
        self.r.hmset(name, mapping)

    def add_one(self, name: str, key: str, value: Any) -> None:
        self.r.hset(name, key, value)

    def get(self, name: str) ->  Awaitable[dict] | dict:
        return self.r.hgetall(name)

    def get_one(self, name: str, key: str) ->  Awaitable[str | None] | str | None:
        return self.r.hget(name, key)

    def delete(self, *names: bytes | str | memoryview) -> None:
        self.r.delete(*names)

    def keys(self, pattern: bytes | str | memoryview = "*", **kwargs: Any) -> Awaitable:
        return self.r.keys(pattern, **kwargs)


redis_manager = RedisManager()