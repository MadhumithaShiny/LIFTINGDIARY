# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js 16 Breaking Changes

This project uses **Next.js 16** with **React 19** — APIs, conventions, and file structure may differ significantly from training data. Before writing any code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

Run from the project root (`C:\Users\madhu\LIFTINGDIARY`):

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm start        # serve production build
npm run lint     # ESLint
```

No test runner is configured yet.

## Architecture

- **Framework**: Next.js 16.2.4, App Router (`src/app/`)
- **React**: 19.2.4
- **Styling**: Tailwind CSS 4 via `@tailwindcss/postcss` (not the classic Tailwind v3 config)
- **Language**: TypeScript 5, strict mode, path alias `@/*` → `./src/*`

### Key conventions

- All routes live under `src/app/` using the App Router file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.)
- Server Components are the default; add `"use client"` only when needed
- Tailwind CSS 4 uses a CSS-first config in `src/app/globals.css` — there is no `tailwind.config.js`
