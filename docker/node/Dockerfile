FROM node:18.16-buster-slim

# Install pnpm
RUN npm install -g pnpm

# Install system packages and clean up
RUN apt-get update && apt-get install -y --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ARG APP_HOME=/usr/src/app/frontend
WORKDIR ${APP_HOME}

# Copy package files
COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ${APP_HOME}

# Install project dependencies
# RUN pnpm install --frozen-lockfile
RUN rm -rf /usr/src/app/frontend/node_modules/* \
  && pnpm install

# Set PATH to include node_modules bin directory
ENV PATH ${APP_HOME}/node_modules/.bin/:$PATH

# Copy all other project files
COPY ./frontend/ ${APP_HOME}/

EXPOSE 3000

CMD ["sh", "-c", "pnpm build && pnpm start"]
