#!/bin/bash

if [[ "${1}" == "celery" ]]; then
  celery -A src.task.celery_:celery worker -B
elif [[ "${1}" == "flower" ]]; then
  celery -A src.task.celery_:celery flower
fi