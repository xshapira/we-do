# Base image
FROM node:18.16-buster-slim

# Install npm, gulp, pnpm
RUN npm i npm@latest gulp pnpm

# Install system packages and clean up
RUN apt-get update && apt-get install -y --no-install-recommends \
  autoconf \
  automake \
  g++ \
  libpng-dev \
  make \
  nasm \
  wget \
  && wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb \
  && dpkg -i /tmp/libpng12.deb \
  && rm /tmp/libpng12.deb \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src

# Copy package files
COPY ./app/package.json ./app/pnpm-lock.yaml ./

# Install project dependencies
RUN pnpm install --frozen-lockfile

# Set PATH to include node_modules bin directory
ENV PATH /usr/src/node_modules/.bin/:$PATH

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy all other project files
COPY . .
