# IBM Products — Vite Scaffold Template

> **LOAD RULE:** Load during Phase 1 scaffold ONLY when build_tool is `ibm-products-vite`. Do NOT load at other phases.
> Last updated: 2026-03

## Install Commands

```bash
npm install
```

## Verifying Carbon Imports — IBM Products + Vite specifics

> Full rule: `MIGRATION_AGENT_PROTOCOL.md` §1.3 + the HARD RULE block in `migration-context/INDEX.md`. Same two failure shapes apply across `@carbon/react`, `@carbon/icons-react`, AND `@carbon/ibm-products`. Verify imports from all three.

1. **Invented named export** — ❌ INVALID (do NOT copy): `import { TrendingUp } from '@carbon/icons-react'` (`TrendingUp` is NOT exported). Same failure mode applies to invented exports from `@carbon/react` and `@carbon/ibm-products`. Verify every Carbon import name via `code_search` before writing it.
2. **Invented subpath** — ❌ INVALID (do NOT copy): `import '@carbon/react/scss/index.scss'` (absent from `@carbon/react`'s `exports` field). Same failure mode applies to `@carbon/ibm-products` subpaths. The `exports` field controls what is importable; files on disk inside the package are NOT importable unless `exports` exposes them.

For verification mechanics (which MCP call, how to read the `exports` field, ledger format), follow §1.3 — do not duplicate the procedure here.

## Critical Pitfalls

1. Do NOT forget @carbon/ibm-products styles — they must load AFTER @carbon/react.
2. Keep @use '@carbon/react' BEFORE @use '@carbon/ibm-products/css/index' in index.scss.
3. Do NOT use deprecated @carbon/ibm-products/scss import paths — use /css/index.
4. Do NOT import Carbon styles inside JS/TS files — only in SCSS.
5. IBM Products requires @carbon/react as a peer — both must be installed and version-compatible.
6. Do NOT skip sass devDependency — IBM Products SCSS compilation depends on it.

## File Manifest

> **IMPORTANT:** The paths below describe files to create. Do NOT use this table as file content. Use `docs_search` or `code_search` to retrieve actual file content before writing.

| Path | Description | Critical Notes |
|------|-------------|----------------|
| package.json | package.json with pinned Carbon and IBM Products dependencies | Versions are pinned to a verified working combination as of 2026-03.; @carbon/ibm-products@2 requires @carbon/react@1.x — do not mix major versions. |
| vite.config.ts | Vite config with SCSS quietDeps and IBM Products pre-bundle | optimizeDeps.include for @carbon/ibm-products prevents CJS/ESM interop errors on first load. |
| tsconfig.json | TypeScript project config | |
| index.html | Vite HTML entry | |
| src/main.tsx | Application entry point — imports index.scss once at root | Import index.scss exactly once here — never in component files. |
| src/App.tsx | Minimal IBM Products shell with PageHeader | |
| src/index.scss | Root SCSS — Carbon styles first, IBM Products styles second | @use '@carbon/react' MUST come before @use '@carbon/ibm-products/css/index'.; @use '@carbon/react' must be the very first line — no comments or blank lines above it. |
| .env.example | Sample environment variables | |

## Verification Steps

| Step | Command | Expected Output |
|------|---------|----------------|
| 1 | npm install | Dependencies installed without peer dependency errors |
| 2 | npm run dev | PageHeader renders with IBM Products styles, no SCSS errors |
| 3 | npm run build | Production build completes without errors |
