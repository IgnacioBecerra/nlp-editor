# Carbon Web Components — CDN Scaffold Template

> **LOAD RULE:** Load during Phase 1 scaffold ONLY when build_tool is `carbon-web-components-cdn`. Do NOT load at other phases.
> Last updated: 2026-03

## Install Commands

```bash
(no install step — CDN-based; no npm required)
```

## Verifying Carbon CDN URLs — `@carbon/web-components` CDN specifics

> Full rule: `MIGRATION_AGENT_PROTOCOL.md` §1.3 + the HARD RULE block in `migration-context/INDEX.md`. CDN-based imports fail the same way as npm imports — a hallucinated path resolves to a 404, not a valid module.

1. **Invented CDN element URL** — ❌ INVALID (do NOT copy): a `<script type="module" src="...">` referencing a `<cds-*>` element that does not exist. Every URL must correspond to a real entry in the package's `es/components/` directory.
2. **Invented icon URL** — ❌ INVALID (do NOT copy): a CDN URL referencing an icon name that does not exist in `@carbon/icons`.

Pre-write verification: invoke `code_search` to confirm the `<cds-*>` element or icon name exists. The CDN URL pattern is `https://1.www.s81c.com/common/carbon/web-components/version/v2.x.y/<element-name>.min.js` — valid ONLY for elements present in the package. As a cross-check, open the URL in a browser to confirm it returns JavaScript, not a 404 / HTML error page. Log every verified URL in `CARBON_MIGRATION_LEDGER.md` as `VERIFIED-CDN: <url>`.

## Critical Pitfalls

1. Each cds-* element only works after its CDN script has loaded — always place `<script>` tags in `<head>` with type="module" so they load as ES modules.
2. Do NOT add defer to CDN scripts — type="module" already defers by default; adding defer is redundant and may cause ordering issues.
3. For production apps with many components, switch to the npm + Vite approach (carbon-web-components:vite template) to enable tree-shaking.
4. Component attribute names are kebab-case (label-text, helper-text, validity-message) — not camelCase.
5. Boolean attributes follow HTML rules: presence = true (disabled), absence = false. Do NOT pass 'false' as a string.
6. Events are standard DOM CustomEvents — use addEventListener, not on* HTML attribute handlers, for reliable cross-browser behavior.
7. cds-header, cds-side-nav, and cds-header-nav are part of the ui-shell bundle — one `<script>` tag covers all.
8. Do NOT load multiple component bundles that provide overlapping elements — each cds-* element should be defined exactly once.

## File Manifest

> **IMPORTANT:** The paths below describe files to create. Do NOT use this table as file content. Use `docs_search` or `code_search` to retrieve actual file content before writing.

| Path | Description | Critical Notes |
|------|-------------|----------------|
| index.html | Single-file Carbon Web Components app using CDN script tags — no npm or build tool required | CDN version is v2.49.0 — sourced from carbon-mcp import_cdn fields.; To add a component, add the corresponding `<script type="module">` CDN tag from cdn_component_urls.; For multi-page apps, repeat the CDN script tags in each HTML file or extract them to a shared `<head>` partial. |

## Verification Steps

| Step | Command | Expected Output |
|------|---------|----------------|
| 1 | Open index.html in a modern browser (Chrome, Edge, Firefox, Safari) | cds-header renders with IBM brand bar; cds-tile and cds-button appear styled as Carbon components |
| 2 | Open DevTools → Elements and inspect `<cds-button>` | Shadow DOM is attached; button renders Carbon styles inside shadow root |
| 3 | Click the Primary action button | Alert dialog appears — confirms vanilla JS event listener is wired to the custom element |
