FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY ./client/package.json ./client/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY ./client ./src