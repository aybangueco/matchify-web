# Base Image to use
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/deps
COPY package.json bun.lock /temp/deps/
RUN cd /temp/deps && bun install --frozen-lockfile

# Build project
FROM base AS build
RUN mkdir -p /temp/build
COPY --from=install /temp/deps/node_modules /temp/build/node_modules
COPY . /temp/build/
RUN cd /temp/build && bun run build

# Copy built project into the final image
FROM nginx:stable-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /temp/build/dist/ /usr/share/nginx/html
