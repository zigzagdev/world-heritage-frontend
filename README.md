# World Heritage Explorer（フロントエンド） / World Heritage Explorer (Frontend)

ユネスコ世界遺産を検索・比較するアプリのフロントエンドの内容です。  
A SPA to search and compare UNESCO World Heritage sites.

---

## 主な機能 / Highlights

- **地域 / カテゴリ / キーワード**によるフィルタリング
  Filter by **Region / Category / Keyword** (single "travel-style" search bar)

- 画像ファーストのレイアウトによる、一覧→詳細へ遷移
  Clean list-to-detail navigation with image-first layout

---

## 技術スタック / Tech Stack

- React + TypeScript + Vite
- React Router
- TailwindCSS（ホワイトベーステーマポリシー / white-based theme policy）
- （任意 / Optional）Jest + Testing Library

---

## アーキテクチャ / Architecture Notes

- コンテナコンポーネントがデータ取得・状態管理を担当  
  Container components handle data fetching/state.

- プレゼンテーションコンポーネントはUIレンダリングに専念  
  Presentational components focus on UI rendering.

- 検索パラメータは単一の `SearchQuery` 型で管理  
  Search parameters are handled as a single `SearchQuery` type.

---

## セットアップ手順 / Getting Started
```bash
cd client
docker compose up -d --build
docker compose exec frontend sh
npm ci
npm run dev -- --host 0.0.0.0 --port 3876
```

> アプリは http://localhost:3876 で起動します  
> App runs at http://localhost:3876
