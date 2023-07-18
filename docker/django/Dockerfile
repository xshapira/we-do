FROM python:3.11-slim-bookworm

ARG APP_HOME=/usr/src/app/backend
WORKDIR ${APP_HOME}

ARG POETRY_HOME=/usr/local/poetry

ENV PYTHONDONTWRITEBYTECODE 1 \
  PYTHONUNBUFFERED 1 \
  POETRY_HOME=${POETRY_HOME} \
  PYTHONPATH=${PYTHONPATH}:${PWD}

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN apt update \
  && apt install -y curl \
  && apt install -y git \
  && curl -sL https://deb.nodesource.com/setup_lts.x | bash - \
  && apt-get -y install libpq-dev gcc \
  && pip install --upgrade pip \
  && pip install psycopg \
  && pip install psycopg-binary \
  # cleaning up unused files
  && apt purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/usr/local/poetry python3 -

COPY ./backend/pyproject.toml ${APP_HOME}

RUN poetry config virtualenvs.create false

RUN poetry install

RUN apt-get update && apt-get install -y libglu1

COPY . ${APP_HOME}

COPY ./docker/django/entrypoint ${APP_HOME}/docker/django/entrypoint

COPY ./docker/django/start_dev ${APP_HOME}/docker/django/start_dev
RUN sed -i 's/\r$//g' ${APP_HOME}/docker/django/start_dev
RUN chmod +x ${APP_HOME}/docker/django/start_dev

ENTRYPOINT ["/usr/src/app/docker/django/entrypoint"]
