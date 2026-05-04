# Data Hunter

A small **Next.js** app for browsing airline loyalty datasets: flight activity, member loyalty history, a calendar spine, and a data dictionary. CSV files at the repository root are loaded into a **SQLite** database; the UI exposes them through REST routes and a dashboard studio.

## Repository layout

| Path | Purpose |
|------|---------|
| `web/` | Next.js application (App Router, API routes, UI) |
| `web/data/` | Local SQLite database (`app.sqlite`; created at seed/runtime, not committed) |
| `*.csv` (repo root) | Source CSVs consumed by `web/scripts/seed.ts` |

## Prerequisites

- **Node.js** (current LTS or compatible with Next.js 16)
- npm (or another package manager; examples below use npm)

## Quick start

1. **Install dependencies** (from the `web` app):

   ```bash
   cd web && npm install
   ```

2. **Place the CSV files** in the **repository root** (parent of `web/`). The seed script expects:

   - `Customer Flight Activity.csv`
   - `Customer Loyalty History.csv`
   - `Calendar.csv`
   - `Airline Loyalty Data Dictionary.csv`

3. **Seed the database** (creates `web/data/app.sqlite` and loads the CSVs):

   ```bash
   cd web && npm run db:seed
   ```

4. **Run the dev server**:

   ```bash
   cd web && npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000); the home route redirects to `/dashboard`.

## Scripts (`web/package.json`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Start production server (after `build`) |
| `npm run lint` | ESLint |
| `npm run db:seed` | Recreate SQLite tables and import CSVs from the repo root |

Re-running `db:seed` clears existing table data before importing again.

## Stack

- **Next.js** 16, **React** 19
- **TypeORM** with **better-sqlite3**
- **Tailwind CSS** 4 and UI components aligned with the shadcn pattern
