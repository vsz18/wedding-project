# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimalist wedding logistics app built around a **30-day countdown**. Helps a couple track and complete every task needed before their wedding day. No social features, no vendor marketplace — intentionally small scope.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Backend | Node.js + Express (ESM) |
| Database | PostgreSQL via `pg` (no ORM) |
| Deployment | Render (static site + web service + managed Postgres) |

---

## Repository Structure

```
wedding-project/
├── frontend/                  # Vite + React app
│   ├── src/
│   │   ├── components/        # reusable UI pieces
│   │   ├── pages/             # route-level components
│   │   ├── hooks/             # fetch logic lives here, not in components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Tailwind directives only
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/                   # Express API (ESM, "type": "module")
│   ├── routes/                # export a Router, no logic
│   ├── controllers/           # business logic + DB queries
│   ├── middleware/            # asyncHandler.js, etc.
│   ├── db/
│   │   ├── pool.js            # singleton pg Pool — import everywhere that needs a query
│   │   ├── schema.sql         # canonical table definitions
│   │   └── seed.sql           # development seed data
│   └── index.js               # Express app entry
├── render.yaml                # Render monorepo deployment config
├── package.json               # root scripts (dev, build, install:all)
└── .gitignore
```

---

## Build & Dev Commands

Run from the repo root unless noted.

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend dev servers concurrently
npm run dev

# Frontend only (localhost:5173)
npm run dev:frontend

# Backend only (localhost:3000, nodemon)
npm run dev:backend

# Production build (outputs to frontend/dist)
npm run build

# Database: apply schema
psql $DATABASE_URL -f backend/db/schema.sql

# Database: load seed data
psql $DATABASE_URL -f backend/db/seed.sql
```

---

## API Conventions

- All routes prefixed `/api/v1/`
- JSON bodies in and out
- Express error middleware signature: `(err, req, res, next)` — always the last middleware in `index.js`
- Error shape: `{ error: string }`
- All async route handlers use `asyncHandler` from `middleware/asyncHandler.js`
- DB pool imported from `db/pool.js` — never create a new `Pool` elsewhere

---

## Environment Variables

Copy `backend/.env.example` → `backend/.env` for local development.

| Variable | Where used | Notes |
|---|---|---|
| `DATABASE_URL` | backend | Postgres connection string |
| `CLIENT_ORIGIN` | backend | CORS allow-list |
| `PORT` | backend | defaults to 3000 |
| `NODE_ENV` | backend | `production` enables SSL on pg |
| `VITE_API_URL` | frontend build | Base URL for API calls |

---

## Design Tokens (Tailwind)

Custom values added in `tailwind.config.js`:

- **Colors**: `taupe-50` through `taupe-700` — warm neutral accent palette
- **Fonts**: `font-sans` → Inter, `font-serif` → Lora (headings only)

Use Tailwind utility classes throughout; avoid inline styles and separate CSS files for components.

---

## Coding Standards

- **No TypeScript** — plain JS with JSDoc annotations where types are non-obvious
- **Named exports only** — no default exports from component or module files
- React state: `useState` / `useEffect` for local state; no global state manager unless complexity demands it
- Fetch calls live in `hooks/` — never inline in components
- Express routes export a `Router`; logic lives in controllers
- Backend uses ESM (`"type": "module"`) — use `import/export`, not `require`

---

## Deployment (Render)

Configured via `render.yaml`:

- **`wedding-frontend`** — Static Site, builds `frontend/dist`, rewrites all paths to `index.html` for SPA routing
- **`wedding-backend`** — Web Service, `node index.js`, auto-injected `DATABASE_URL` from managed Postgres
- **`wedding-db`** — Managed PostgreSQL (free tier)

Health check endpoint: `GET /api/health` → `200 { ok: true }`
