# Разработка и запуск KAIFU

Здесь я описал, как подготовить окружение и запустить компоненты моего проекта. Результаты выполненных мной проверок и известные ограничения я собрал в [техническом статусе](STATUS.md).

## Что потребуется

| Компонент | Назначение |
| --- | --- |
| Python 3.12 | API, бот и фоновые процессы; код использует синтаксис f-строк Python 3.12 |
| PostgreSQL | Основная база данных; проверена версия 16 |
| Redis | Кеш, номера билетов, Celery broker; проверена версия 6 |
| Node.js / npm | Оба frontend-приложения; сборки проверены на Node.js 24.22.1 |
| RabbitMQ | Очередь ежедневного розыгрыша; нужен для фонового контура |
| Тестовый Telegram-бот | Вход через Telegram, invoice и уведомления |

Публичная версия историческая. Сначала ознакомьтесь с [STATUS.md](STATUS.md): миграция не полностью соответствует моделям, seed-команды для всей экономики нет. Ниже — подготовка окружения и запуск процессов, а не гарантия работы всех продуктовых сценариев.

## 1. Backend-зависимости

Из корня репозитория:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m pip check
```

Ссылка на изменяемый aiogram-архив удалена в восстановленном backend: теперь полная установка проходит. `python-multipart` нужен для зарегистрированного upload-маршрута.

## 2. Локальные сервисы

Если нет своих экземпляров, можно использовать Docker. Убедитесь, что имена и порты свободны; команды создают новые контейнеры. Не используйте production-базу.

```bash
docker run -d --name kaifu-postgres \
  -e POSTGRES_USER=kaifu -e POSTGRES_PASSWORD=kaifu-local-dev \
  -e POSTGRES_DB=kaifu \
  -p 127.0.0.1:5432:5432 \
  -v kaifu-postgres-data:/var/lib/postgresql/data postgres:16

docker run -d --name kaifu-redis -p 127.0.0.1:6380:6379 redis:6
```

Проверки готовности:

```bash
docker exec kaifu-postgres pg_isready -U kaifu -d kaifu
docker exec kaifu-redis redis-cli ping
```

Для фонового контура дополнительно:

```bash
docker run -d --name kaifu-rabbitmq -p 127.0.0.1:5672:5672 rabbitmq:3
docker exec kaifu-rabbitmq rabbitmq-diagnostics -q ping
```

Последний контейнер и обработка очереди в ходе этой проверки я не запускал. Библиотеки подключения используют настройки RabbitMQ по умолчанию; для своего брокера потребуется согласовать учётные данные и доступ. Пример предназначен для изолированного локального окружения.

Существующие контейнеры запускаются через `docker start <имя>`. PostgreSQL сохраняет данные в named volume; удаление контейнера не удаляет этот volume.

## 3. Настройки и ключи

Создайте `.env` по `.env.example`, не перезаписывая свой существующий файл. Для PostgreSQL из примера задайте `DB_PASS=kaifu-local-dev`. Заполните Redis и RabbitMQ адресами выше. `BOT_TOKEN` нужен уже при импорте backend, поскольку сервисы используют Telegram-бота. Для проверки без Telegram можно использовать синтаксически допустимый локальный placeholder, но внешние Telegram-сценарии с ним работать не будут.

Не используйте опубликованные ранее токены и ключи: их нужно заменить. `.env-prod` удалён из текущего дерева; Compose всё ещё ожидает этот локальный файл. Для Compose создайте его самостоятельно с нужными адресами контейнеров и внешних сервисов. Секреты в Git не добавляйте.

Сгенерируйте локальные значения:

```bash
python - <<'PY'
import secrets
from cryptography.fernet import Fernet
print('PRIVATE_KEY_PASSWORD=' + secrets.token_urlsafe(32))
print('TOKEN_KEY=' + Fernet.generate_key().decode())
print('ADMIN_KEY=' + Fernet.generate_key().decode())
PY
```

Перенесите их в `.env`. Это новые локальные ключи. Пароль приватного RSA-ключа должен совпадать с `PRIVATE_KEY_PASSWORD`.

Генерация RSA, только если своих файлов ещё нет:

```bash
(
  export PYTHONPATH="$PWD"
  cd src/auth/certs
  test ! -e private.pem && test ! -e public.pem || exit 1
  python create_certs.py
  chmod 600 private.pem
)
```

## 4. Схема базы и API

На **новой отдельной базе**:

```bash
alembic upgrade head
alembic current
uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload
```

Восстановленная история содержит head `c44d01bdd5d6`. Она не продолжает старые ревизии: не применяйте её поверх предыдущей базы без плана перехода.

Приложение при старте читает билеты из PostgreSQL для Redis. После старта проверьте `/openapi.json` и `/docs`. Для полного использования нужна инициализация записи банка с ID 1, счётчиков gold/silver-лотов, цен и прочих системных параметров, первого администратора. Готового seed-скрипта нет. В миграции также отсутствуют `task.sub_inst` и новые enum-значения; эти несоответствия нужно исправить отдельной миграцией до полного запуска.

Проверка базового профиля из второго терминала:

```bash
curl --fail http://127.0.0.1:8000/openapi.json
curl --fail -X POST http://127.0.0.1:8000/user \
  -H 'Content-Type: application/json' \
  -d '{"id":900000001,"username":"local_smoke","avatar":null}'
curl -i http://127.0.0.1:8000/user
```

Ожидаются OpenAPI `KAIFU`, HTTP 201 и HTTP 401 соответственно. Создание пишет тестового пользователя в выбранную базу; для повторной проверки используйте новый ID.

Чтение через локальный JWT из активированного окружения:

```bash
python - <<'PY'
import json
from urllib.request import Request, urlopen
from src.auth.service import encode_jwt
jwt = encode_jwt({'user_id': 900000001, 'banned': False})
request = Request('http://127.0.0.1:8000/user',
                  headers={'Authorization': 'Bearer ' + jwt})
with urlopen(request) as response:
    assert json.load(response)['id'] == 900000001
    print('JWT + database read: OK')
PY
```

## 5. Frontend-приложения

В отдельных терминалах из корня репозитория:

```bash
cd frontend/webapp
npm ci
# Создайте .env.local по .env.example; укажите публичные адреса API/бота/каналов.
npm run dev -- --port 3000
```

```bash
cd frontend/admin
npm ci
# Создайте .env.local по .env.example; укажите NEXT_PUBLIC_API_URL.
npm run dev -- --port 3001
```

Production-сборка в каждой директории: `npm run build`; запуск — `npm run start -- --port 3000` или `3001`. Переменные `NEXT_PUBLIC_*` доступны браузеру и встраиваются при сборке. Секреты в них помещать нельзя.

Mini App требует Telegram WebView-контекст. Для реального входа нужен HTTPS-адрес приложения и тестовый бот. При открытии в обычном браузере возможен экран загрузки. API имеет явный список CORS origin: локальный admin origin `http://localhost:3001` в нём пока отсутствует; согласуйте origin/reverse proxy перед browser-тестом. Secure refresh-cookie требуют HTTPS.

В frontend сохранены исторические TON manifest URL и счётчик Яндекс Метрики. Настройте их перед собственным публичным запуском.

Подробнее: [Mini App](../frontend/webapp/README.md), [Admin Panel](../frontend/admin/README.md).

## 6. Бот и фоновые процессы

Используйте отдельного тестового бота. `python -m bot.main` удаляет webhook с `drop_pending_updates=True` и запускает polling, поэтому может повлиять на действующую интеграцию этого токена.

Команды из корня с активированным venv и настроенным `.env`:

```bash
python -m bot.main
# В другом процессе:
celery -A src.task.celery_:celery worker -l INFO
# В другом процессе, только когда готовы к ежедневной обработке:
celery -A src.task.celery_:celery beat -l INFO
# Отдельный consumer:
python -m src.task.consumer
```

Beat планирует задачу ежедневно в 17:00 UTC (20:00 по Москве). Worker получает её из Redis и публикует в очередь RabbitMQ `messages`; consumer вызывает `daily_lottery`. Этот сценарий изменяет фонды/выигрыши и может отправлять Telegram-уведомления. При проверке портфолио я его не запускал.

## Docker Compose

Корневой Compose содержит backend, bot, Redis, Celery и consumer. PostgreSQL и RabbitMQ предполагаются внешними; их адреса задаются в локальном `.env-prod`. Полный стек через Compose не проверен. Frontend имеют отдельные Dockerfile/Compose; их сборка использует исторический незакреплённый `node:alpine` и `npm install`. Проверенный frontend-путь — `npm ci` и локальная production-сборка.
