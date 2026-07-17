# Angular + Carbon Web Components — Scaffold Template

> **LOAD RULE:** Load during Phase 1 scaffold ONLY when build_tool is `angular` / `angular-cli`. Do NOT load at other phases.
> Last updated: 2026-04

## Install Commands

```bash
npm install @carbon/web-components@^2.49.0 @carbon/styles lit
npm install --save-dev sass
```

For a brand-new project: `npx @angular/cli new my-app --style=scss --routing --strict`.

## Verifying Carbon Imports — Angular + `@carbon/web-components` specifics

> Full rule: `MIGRATION_AGENT_PROTOCOL.md` §1.3 + the HARD RULE block in `migration-context/INDEX.md`. The web-components instances of the general failure shapes:

1. **Invented element registration path** — ❌ INVALID (do NOT copy): `import '@carbon/web-components/es/components/<name>/index.js'` for a `<cds-*>` element that does not exist. Every `<cds-*>` element corresponds to a real directory under `node_modules/@carbon/web-components/es/components/`. If the directory is absent, the element does not exist.
2. **Invented Sass subpath** — ❌ INVALID (do NOT copy): `@use '@carbon/styles/scss/index'` when the path is absent from `@carbon/styles`'s `exports` field. The `exports` field controls what is importable; files on disk are NOT importable unless `exports` exposes them.
3. **Invented icon glyph path** — ❌ INVALID (do NOT copy): `@carbon/icons/lib/<category>/<size>/<name>.js` for a name that does not exist in the installed package.

Pre-write verification: `ls node_modules/@carbon/web-components/es/components/<name>/` (element directory) OR `code_search` (`asset_type: "icon"` for icons; component name for components). For the full procedure (MCP call types, ledger format), follow §1.3.

## Critical Pitfalls

1. Do NOT forget to add `CUSTOM_ELEMENTS_SCHEMA` to every NgModule (or `schemas` on every standalone component) that renders `<cds-*>` elements — Angular's template compiler will otherwise error on unknown elements.
2. Do NOT import Carbon element registrations inside files that also run under SSR (Angular Universal) without guarding on `isPlatformBrowser(platformId)` — `customElements` is undefined on the server.
3. Do NOT bind boolean attributes as properties (`[disabled]="x"`) — use `[attr.disabled]="x ? '' : null"` so the attribute is reflected/removed and Carbon CSS selectors match.
4. Do NOT import the same `@carbon/web-components/es/components/<name>/index.js` side-effect in two eagerly-loaded modules without guarding `if (!customElements.get('cds-<name>'))` — `customElements.define` throws on re-registration.
5. Do NOT use `@import '@carbon/styles'` in global SCSS — use `@use '@carbon/styles'` (Dart Sass module system). Angular CLI uses Dart Sass.
6. Do NOT wire Carbon inputs into Reactive Forms via `[(ngModel)]` alone — provide a `ControlValueAccessor` adapter so `formControlName` and `ngModel` propagate correctly.
7. Pin `@carbon/web-components` and `@carbon/styles` to a verified working combination in `package.json` — peer ranges on `lit` shift between 2.x minors.

## File Manifest

> **IMPORTANT:** The paths below describe files to create. Do NOT use this table as file content. Use `docs_search` or `code_search` to retrieve actual file content before writing.

| Path | Description | Critical Notes |
|------|-------------|----------------|
| package.json | Angular + Carbon Web Components + lit + sass dependencies pinned | Pin @carbon/web-components and lit to a verified matrix. |
| angular.json | Angular CLI workspace config | Ensure `styles` includes `src/styles.scss`; enable `stylePreprocessorOptions.includePaths` if token partials are shared across libs. |
| tsconfig.json | TypeScript project config — strict mode recommended | `"strict": true`; `"target": "ES2022"` for top-level await in custom element registration. |
| src/index.html | App HTML entry with `<app-root>` | |
| src/main.ts | Bootstraps the Angular app (standalone) or `AppModule` | Import `import '@carbon/web-components/es/components/ui-shell/index.js'` here for the global header so the custom element registers before the shell renders. |
| src/styles.scss | Global Carbon tokens entry — `@use '@carbon/styles'` must be the FIRST line | Use `@use`, never `@import`. No content above the `@use` line. |
| src/app/app.module.ts | Root NgModule (or `app.config.ts` for standalone) | Include `schemas: [CUSTOM_ELEMENTS_SCHEMA]`. |
| src/app/app.component.ts | Root component rendering a minimal Carbon UI Shell | Register `@carbon/web-components/es/components/ui-shell/index.js` at module scope. SkipToContent MUST be the first slotted child of the Carbon header for keyboard accessibility. |
| src/app/app.component.html | Carbon shell markup (`<cds-header>`, `<cds-skip-to-content>`, main `<cds-tile>` sample) | `<cds-skip-to-content>` is the first child of `<cds-header>`. |
| src/app/shared/cds-input.directive.ts | `ControlValueAccessor` adapter for `cds-text-input` so Reactive Forms work | Listen on `input`; write through `value` property; reflect `invalid` attribute from `NgControl`. |
| src/app/shared/carbon-icons.ts | Helper/directive for rendering `@carbon/icons` descriptors inline | Import size-specific modules (e.g. `/16`). |
| .browserslistrc | Browser targets compatible with Carbon Web Components (modern evergreen) | |

## Verification Steps

| Step | Command | Expected Output |
|------|---------|----------------|
| 1 | npm install | Dependencies installed without peer dependency errors |
| 2 | npm run start (ng serve) | Dev server starts on http://localhost:4200 with no SCSS or template-compile errors |
| 3 | npm run build | Production build completes; bundle contains `cds-*` custom element definitions only for used components |
| 4 | Smoke-check in browser DevTools | `customElements.get('cds-button')` returns a constructor, Carbon theme class applied on `<html>` or root element |
