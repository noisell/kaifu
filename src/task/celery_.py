from celery import Celery
from celery.schedules import crontab
from src.task.config import REDIS_HOST, REDIS_PORT

celery = Celery('tasks', broker=f'redis://{REDIS_HOST}:{REDIS_PORT}/0')


celery.conf.beat_schedule = {
  'my_periodic_task': {
    'task': 'src.task.tasks.daily_lottery_producer',
    'schedule': crontab(hour='17', minute='00'),
    'args': (),
    'kwargs': {}
  }
}
celery.conf.timezone = 'UTC'
celery.conf.enable_utc = True
celery.conf.imports = ('src.task.tasks',)


# celery -A src.task.celery_:celery worker -B
# celery -A src.task.celery_:celery worker -l INFO