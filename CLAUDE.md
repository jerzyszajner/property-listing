# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Vacation-rental listing app: React 19 + TypeScript + Vite frontend (root) and a separate Firebase Cloud Functions backend (`functions/`, its own `package.json`, Node 22). Backend provides AI natural-language search (Gemini embeddings + Firestore vector search) and AI description generation. Deployed frontend: Netlify.

## Commands

Frontend (repo root):
```bash
npm run dev        # Vite dev server (host: true, ngrok hosts allowed)
npm run build      # tsc -b && vite build
npm run lint       # eslint .
```
There is no frontend test runner.

Backend (`cd functions`):
```bash
npm run build                      # tsc -> lib/
npm run lint
npm test                           # vitest run
npx vitest run tests/search/parseSearchIntent.test.ts   # single test file
npx vitest run -t "name"           # single test by name
npm run serve                      # build + Firebase emulator (functions only)
npm run deploy                     # firebase deploy --only functions (predeploy runs lint + test + build)
npm run backfill:embeddings        # regenerate embeddings for existing properties
npm run seed:test / delete:test    # add/remove test properties
```
Backend scripts run compiled output from `functions/lib/`, so build first (the npm scripts already do).

## Architecture

**Frontend** (`src/`): routes defined in `src/routes/routes.tsx` (lazy-loaded pages; `ProtectedRoute` wraps Bookings, AddListing, Profile). Auth state lives in `src/contexts/AuthContext.tsx`. All Firebase/Cloudinary access goes through `src/services/*` (components and hooks never call Firebase directly). Pages follow a per-page layout: `Page.tsx`, `pageConfig.ts` (static content/options), `pageFormSchema.ts` (Zod schema for react-hook-form), and `hooks/` with page-specific logic. Shared helpers: `src/utils/cloudinaryImage.ts` (image URL builder), `src/utils/zodSchemas.ts`.

**Backend** (`functions/src/`, region `europe-north1`): `index.ts` wires callable functions and triggers:
- `searchProperties` (callable): `search/parseSearchIntent` extracts price/capacity hints from the query -> `embeddings.generateEmbedding` -> `search/retrieveCandidates` (Firestore vector search) -> `search/applyBusinessFilters` (city, price, capacity, distance cutoffs) -> `search/mapToResponse`. Thresholds are constants at the top of `index.ts`.
- `onPropertyWrite` (Firestore trigger on `properties/{id}`): recomputes the `embedding` field (768 dims) only when the searchable content from `propertyUtils.buildSearchableContent` actually changed. Changing which fields feed that function means running `backfill:embeddings`.
- `content/generateDescription` (callable): AI listing description from form data.
- `GEMINI_API_KEY` is a Firebase secret (`firebase functions:secrets:set`), passed to functions via `secrets: [...]`.

Firestore needs a vector index on `properties.embedding` (dimension 768); see `firestore.indexes.json` and `docs/PLAN_VECTOR_SEARCH.md`. Env vars for the frontend (`VITE_FIREBASE_*`, `VITE_GOOGLE_MAPS_API_KEY`, `VITE_CLOUDINARY_NAME`) go in `.env.local`; see README for the list.

## Conventions (from `.cursor/rules/`)

- Import alias `@/` -> `src/`. Import order: React, libraries, local components, styles. Use `import type` for type-only imports.
- Components: functional, default export, folder `Name/Name.tsx` + `Name.module.css`, preceded by `/* Name component */`. Hooks: named export, return type `UseXReturn` interface, `use` prefix. Constants `UPPER_SNAKE_CASE`, CSS classes camelCase, config files end with `Config`.
- No inline comments in frontend code (self-documenting); only the header comments above components/hooks/services. Backend: English JSDoc on exported functions, sparse `//` comments.
- Error handling: try/catch with `catch (err)`, `setError(err instanceof Error ? err.message : "...")`, `setError(null)` before each operation, hooks return `error: string | null`.
- Styling: CSS Modules only, always use CSS variables from `src/index.css` (`--color-*`, `--spacing-*`, `--font-size-*`, `--border-radius-*`); never hardcode colors/spacing. Mobile-first, breakpoint `@media (max-width: 768px)`.
- TypeScript strict: no `any` (use `unknown`), `??` and `?.`, explicit return types on async functions.
- Code comments and docs stay in English, even when chatting in Polish.
