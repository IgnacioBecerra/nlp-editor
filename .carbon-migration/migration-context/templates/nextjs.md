# Carbon React v11 — Next.js Scaffold Template

> **LOAD RULE:** Load during Phase 1 scaffold ONLY when build_tool is `next` or `nextjs`. Do NOT load at other phases.
> Last updated: 2026-03

## Install Commands

```bash
npm install
```

## Verifying Carbon Imports — Next.js + `@carbon/react` specifics

> Full rule: `MIGRATION_AGENT_PROTOCOL.md` §1.3 + the HARD RULE block in `migration-context/INDEX.md`. The two examples below are the Next.js + `@carbon/react` instances of the general failure shapes.

1. **Invented named export** — ❌ INVALID (do NOT copy): `import { TrendingUp } from '@carbon/icons-react'` (`TrendingUp` is NOT exported). Verify every Carbon import name via `code_search` before writing it.
2. **Invented Sass subpath** — ❌ INVALID (do NOT copy): `import '@carbon/react/scss/index.scss'` (absent from `@carbon/react`'s `exports` field). The `exports` field controls what is importable; files on disk inside `node_modules/@carbon/react/scss/` are NOT importable unless `exports` exposes them.

For verification mechanics (which MCP call, how to read the `exports` field, ledger format), follow §1.3 — do not duplicate the procedure here.

## Critical Pitfalls

1. Do NOT import Carbon SCSS in component-level CSS modules — only in the root globals.scss.
2. Import globals.scss from src/app/layout.tsx (App Router) or pages/_app.tsx (Pages Router) — not from components.
3. Do NOT use @import for Carbon — use @use '@carbon/react' as the FIRST line in globals.scss.
4. Add all @carbon/* packages to transpilePackages in next.config.js or Carbon ESM will fail to compile.
5. Do NOT mix App Router and Pages Router Carbon SCSS strategies — pick one and be consistent.
6. Set sassOptions.quietDeps: true in next.config.js to suppress Sass deprecation warnings.

## File Manifest

> **IMPORTANT:** The paths below describe files to create. Do NOT use this table as file content. Use `docs_search` or `code_search` to retrieve actual file content before writing.

| Path | Description | Critical Notes |
|------|-------------|----------------|
| package.json | package.json with pinned Next.js 15 and Carbon dependencies | Versions are pinned to a verified working combination as of 2026-03.; Next.js 15 with React 19 is supported by Carbon React v1.72+. |
| next.config.js | Next.js config — transpilePackages + SCSS quietDeps | All @carbon/* packages must be in transpilePackages or ESM/SCSS will not compile. |
| tsconfig.json | TypeScript config for Next.js | |
| src/app/layout.tsx | Next.js App Router root layout — imports Carbon globals.scss once | globals.scss MUST be imported here and ONLY here — not in page.tsx or components. |
| src/app/page.tsx | Minimal Carbon app route | |
| src/app/globals.scss | Global Carbon SCSS — @use must be the very first line | @use '@carbon/react' MUST be the very first line — no comments or blank lines above it. |

## Verification Steps

| Step | Command | Expected Output |
|------|---------|----------------|
| 1 | npm install | Dependencies installed without peer dependency errors |
| 2 | npm run dev | Next.js dev server starts, Carbon components render with styles |
| 3 | npm run build | Production build succeeds with no type or CSS errors |
