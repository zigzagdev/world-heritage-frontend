FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

# 依存インストール
COPY ./client/package.json ./client/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ソース
COPY ./client ./

# ビルド
RUN npm run build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app

# 静的配信用の最小構成（serve）
RUN npm i -g serve

# builder で作った dist を持ってくる
COPY --from=builder /app/dist ./dist

# Koyeb は 8000 を見る（スクショがそう）
EXPOSE 8000

# 0.0.0.0:8000 で待ち受け
CMD ["serve", "-s", "dist", "-l", "8000"]