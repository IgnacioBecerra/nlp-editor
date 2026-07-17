# Carbon React v11 — Vite Scaffold Template

> **LOAD RULE:** Load during Phase 1 scaffold ONLY when build_tool is `vite`. Do NOT load at other phases.
> Last updated: 2026-03

## Install Commands

```bash
npm install
```

## Verifying Carbon Imports — Vite + `@carbon/react` specifics

> Full rule: `MIGRATION_AGENT_PROTOCOL.md` §1.3 + the HARD RULE block in `migration-context/INDEX.md`. The two examples below are the Vite + `@carbon/react` instances of the general failure shapes.

1. **Invented named export** — ❌ INVALID (do NOT copy): `import { TrendingUp } from '@carbon/icons-react'` (`TrendingUp` is NOT exported). Verify every Carbon import name via `code_search` before writing it.
2. **Invented Sass subpath** — ❌ INVALID (do NOT copy): `import '@carbon/react/scss/index.scss'` (absent from `@carbon/react`'s `exports` field). The `exports` field controls what is importable; files on disk inside `node_modules/@carbon/react/scss/` are NOT importable unless `exports` exposes them.

For verification mechanics (which MCP call, how to read the `exports` field, ledger format), follow §1.3 — do not duplicate the procedure here.

## Critical Pitfalls

1. Do NOT use @import for Carbon styles. Use @use '@carbon/react' as the FIRST line in src/index.scss.
2. Do NOT import Carbon styles inside JS/TS files — only in SCSS.
3. Do NOT change @use to @import in index.scss — this causes Sass compilation failures.
4. Prefix all Carbon SCSS variables with 'carbon.' when using @use.
5. Do NOT skip sass devDependency — it is required for Carbon SCSS compilation.
6. Pin Carbon package versions from package.json to avoid breaking peer dependency changes.

## File Manifest

> **IMPORTANT:** The paths below describe files to create. Do NOT use this table as file content. Use `docs_search` or `code_search` to retrieve actual file content before writing.

| Path | Description | Critical Notes |
|------|-------------|----------------|
| package.json | package.json with pinned Carbon and Vite dependencies | Versions are pinned to a verified working combination as of 2026-03.; Update last_verified in this template when upgrading. |
| vite.config.ts | Vite build config with SCSS quietDeps for Carbon | quietDeps suppresses Sass deprecation warnings from Carbon internals. |
| tsconfig.json | TypeScript project config | |
| index.html | Vite HTML entry | |
| src/main.tsx | Application entry point — imports index.scss once at root | Keep index.scss imported exactly once at root entry. |
| src/App.tsx | Minimal Carbon shell with Theme, Header, SkipToContent, Content, and a sample Tile | Include Content wrapper to preserve Carbon shell spacing.; SkipToContent must be the first child of Header — required by the Carbon global header pattern for keyboard accessibility. |
| src/index.scss | Carbon SCSS entry point — @use must be the FIRST line | @use '@carbon/react' MUST be the very first line — no comments, no blank lines above it. |
| .env.example | Sample environment variables | |

## Verification Steps

| Step | Command | Expected Output |
|------|---------|----------------|
| 1 | npm install | Dependencies installed without peer dependency errors |
| 2 | npm run dev | Vite dev server starts, no SCSS compilation errors |
| 3 | npm run build | Production build completes without type or bundler errors |
