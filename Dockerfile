FROM python:3.12

LABEL authors="mirry-code"

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .
ENV PYTHONPATH="/src"

RUN chmod a+x ./*.sh
