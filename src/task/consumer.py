import asyncio
from aio_pika import connect_robust, abc

from src.lottery.service import LotteryService
from src.task.config import AIO_PIKA_HOST, AIO_PIKA_PORT


async def process_message(message: abc.AbstractIncomingMessage) -> None:
    async with message.process():
        await LotteryService().daily_lottery()

async def main():
    connection = await connect_robust(host=AIO_PIKA_HOST, port=int(AIO_PIKA_PORT))
    async with connection:
        channel = await connection.channel()
        queue = await channel.declare_queue("messages")

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                await process_message(message)


if __name__ == "__main__":
    asyncio.run(main())
