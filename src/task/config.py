import os
from dotenv import load_dotenv

load_dotenv()

AIO_PIKA_HOST = os.getenv('AIO_PIKA_HOST')
AIO_PIKA_PORT = os.getenv('AIO_PIKA_PORT')
REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')