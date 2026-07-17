# Carbon Web Components — Vite Scaffold Template

> **LOAD RULE:** Load during Phase 1 scaffold ONLY when build_tool is `carbon-web-components-vite`. Do NOT load at other phases.
> Last updated: 2026-03

## Install Commands

```bash
npm install
```

## Verifying Carbon Imports — Vite + `@carbon/web-components` specifics

> Full rule: `MIGRATION_AGENT_PROTOCOL.md` §1.3 + the HARD RULE block in `migration-context/INDEX.md`. The web-components instances of the general failure shapes:

1. **Invented element registration path** — ❌ INVALID (do NOT copy): `import '@carbon/web-components/es/components/<name>/index.js'` for a `<cds-*>` element that does not exist. Every `<cds-*>` element corresponds to a real directory under `node_modules/@carbon/web-components/es/components/`. If the directory is absent, the element does not exist.
2. **Invented icon descriptor path** — ❌ INVALID (do NOT copy): `import` from `@carbon/icons/lib/<category>/<size>/<name>.js` for a name that does not exist in the installed package.

Pre-write verification: `ls node_modules/@carbon/web-components/es/components/<name>/` (element directory) OR `code_search` (`asset_type: "icon"` for icons). For the full procedure (MCP call types, ledger format), follow §1.3.

## Critical Pitfalls

1. Do NOT use @carbon/react component imports — this target uses `<cds-*>` custom elements.
2. Each `<cds-*>` element MUST be registered by importing its ES module before use.
3. Import components individually (e.g., /es/components/button/index.js) for optimal tree-shaking.
4. Use the all-components bundle only in prototypes — it adds ~800KB to production bundles.
5. Do NOT mix @carbon/react and @carbon/web-components in the same entry point.
6. Custom element registration is side-effectful — import statements must execute before DOM is queried.
7. For vanilla HTML without a build step, use CDN script tags from cdn_urls instead of npm — see carbon-web-components:cdn template.

## File Manifest

> **IMPORTANT:** The paths below describe files to create. Do NOT use this table as file content. Use `docs_search` or `code_search` to retrieve actual file content before writing.

| Path | Description | Critical Notes |
|------|-------------|----------------|
| package.json | package.json with pinned @carbon/web-components and Lit dependencies | Versions are pinned to a verified working combination as of 2026-03.; lit is a peer dependency of @carbon/web-components — both must be installed.; No Sass required — Carbon Web Components ships pre-built CSS. |
| vite.config.ts | Minimal Vite config for Carbon Web Components (no React plugin needed) | No @vitejs/plugin-react is needed — this is a vanilla JS/Lit project.; Build target must be es2020+ for native custom elements support. |
| tsconfig.json | TypeScript config for Lit/CWC project | |
| index.html | Vite HTML entry for Carbon Web Components app | |
| src/main.ts | Web Components entry point — registers cds-* elements before DOM manipulation | All @carbon/web-components imports must appear BEFORE any DOM queries.; Import components individually for production — do not import the all bundle. |

## Verification Steps

| Step | Command | Expected Output |
|------|---------|----------------|
| 1 | npm install | Dependencies installed without errors |
| 2 | npm run dev | `<cds-button>` and `<cds-header>` render as Carbon-styled custom elements |
| 3 | npm run build | Production build completes; dist/ contains bundled CWC modules |
