# World Heritage Explorer (Frontend)

World Heritage Explorer is a SPA to search and compare UNESCO World Heritage sites.

## Highlights
- Filter by **Region / Category / Keyword** (single “travel-style” search bar)
- Clean list-to-detail navigation with image-first layout
- UI stays **white-based even in dark mode** for readability

## Tech Stack
- React + TypeScript + Vite
- React Router
- TailwindCSS (white-based theme policy)
- (Optional) Jest + Testing Library

## Architecture Notes
- Container components handle data fetching/state.
- Presentational components focus on UI rendering.
- Search parameters are handled as a single `SearchQuery` type.

## Getting Started
```bash
cd client
docker compose up -d --build
docker compose exec frontend sh
npm ci
npm run dev
