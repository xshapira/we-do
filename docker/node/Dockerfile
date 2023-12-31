FROM node:19-bullseye-slim as base

ENV NODE_ENV=production

RUN apt-get update \
  # Update and install pnpm ref: https://pnpm.io/
  && npm install -g pnpm@v7.27.0

EXPOSE 5173

# Configure pnpm path
ENV PNPM_HOME=/pnpm-test/.pnpm
ENV PATH=$PATH:$PNPM_HOME

WORKDIR /usr/src/app/frontend
RUN chown -R node:node /usr/src/app/frontend
USER node
COPY --chown=node:node ./frontend/package.json ./frontend/pnpm-lock.yaml ./
RUN pnpm i --prod && pnpm store prune

FROM base as dev
ENV NODE_ENV=development
ENV PATH=/usr/src/app/frontend/node_modules/.bin:$PATH
RUN pnpm i && pnpm store prune

# switch user to install git inside container
USER root
RUN apt-get -y install git && apt-get -y install eslint

# once git is installed, set user to node to comply with git repo security
USER node

# Build the frontend
COPY --chown=node:node ./frontend ./
RUN pnpm run build

# vite start
CMD ["pnpm", "run", "dev", "--host"]
