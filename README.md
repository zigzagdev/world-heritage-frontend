# World Heritage Explorer（フロントエンド） / World Heritage Explorer (Frontend)

ユネスコ世界遺産を検索・比較するための SPA です。  
A SPA to search and compare UNESCO World Heritage sites.

---

## 主な機能 / Highlights

- **地域 / カテゴリ / キーワード**によるフィルタリング（「旅行スタイル」に合わせた単一検索バー）  
  Filter by **Region / Category / Keyword** (single "travel-style" search bar)

- 画像ファーストのレイアウトによる、一覧→詳細へのスムーズなナビゲーション  
  Clean list-to-detail navigation with image-first layout

- ダークモードでも**ホワイトベースのUI**を維持し、高い可読性を確保  
  UI stays **white-based even in dark mode** for readability

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