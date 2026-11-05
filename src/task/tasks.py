from celery import shared_task
# from src.task.celery_ import celery
from pika import ConnectionParameters, BlockingConnection

from src.task.config import AIO_PIKA_HOST, AIO_PIKA_PORT

connection_params = ConnectionParameters(host=AIO_PIKA_HOST, port=int(AIO_PIKA_PORT))

@shared_task
def daily_lottery_producer():
    print("Задача отправлена!")
    with BlockingConnection(connection_params) as connection:
        with connection.channel() as channel:
            channel.queue_declare(queue='messages')
            channel.basic_publish(
                exchange='',
                routing_key='messages',
                body="Task",
            )

