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
  && apt install -y curl git libpq-dev gcc libglu1 \
  && curl -sL https://deb.nodesource.com/setup_lts.x | bash - \
  && pip install --upgrade pip \
  && pip install psycopg psycopg-binary \
  && curl -sSL https://install.python-poetry.org | POETRY_HOME=/usr/local/poetry python3 - \
  # cleaning up unused files
  && apt purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

COPY ./backend/pyproject.toml ${APP_HOME}/

RUN poetry config virtualenvs.create false \
  && poetry install

COPY ./docker/django/entrypoint /usr/src/app/docker/django/entrypoint
COPY ./docker/django/start_dev /usr/src/app/docker/django/start_dev

RUN ls -la /usr/src/app/docker/django/ \
  && chmod +x /usr/src/app/docker/django/start_dev \
  && sed -i 's/\r$//g' /usr/src/app/docker/django/start_dev

COPY . ${APP_HOME}/

RUN chmod +x /usr/src/app/docker/django/entrypoint

ENTRYPOINT ["/usr/src/app/docker/django/entrypoint"]
