# Migration Context Index

> **Pipeline-aware note (1.2.0)**: load rules below are driven by the job's
> `migration_class` (see `src/config/migrationFrameworks.js` — library /
> framework-era-swap / runtime-swap / carbon-version-upgrade). The Map files
> table routes each framework id to a map; the Pattern/Scaffold companion
> section adds files triggered by specific patterns inside scoped code.
> A `deviation-completeness-audit` role runs last in every pipeline and
> consolidates deviation shards into `DEVIATIONS_FOR_REVIEW.md` at the target
> repo root — not this directory.

> **MANDATORY:** This INDEX file **and** `maps/carbon-react-v11-target.md` (see the MANDATORY section immediately below) load unconditionally for every `@carbon/react` migration. Every OTHER file in this `migration-context/` directory loads ONLY when the exact condition in the tables below is met. Loading files speculatively is a **protocol violation**.
>
> **Auto-loaded files in `.carbon-migration/`** (loaded per your session prompt, not governed by these rules):
> `AGENT_PROMPT_RESUME.md` · `SPEC.md` · `TASKS_TO_COMPLETE.md` · `CARBON_MIGRATION_LEDGER.md`
>
> **Not present in this repo** (exist only inside the carbon-migrate tool — do not attempt to read them):
> `MIGRATION_AGENT_PROTOCOL.md` · `AGENT_PROMPT_START.md` · `SUMMARY_OF_TASK.md`

> **HARD RULE — Package API Verification (applies to every file loaded from this directory).** Inventing an export name or subpath that does not exist in the installed package is a catastrophic failure. The build will not complete. Your training data is stale. **Treat every `@carbon/*` import as untrusted until verified.** Before writing any Carbon import — including any icon, component, hook, prop, or token name not literally shown in the file you are reading — verify it exists in the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` plus the package's `exports` field (subpaths). Carbon's API surface — including its icon taxonomy — is its own. Names that look familiar from any other library (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Verify, do not transliterate; do not rely on remembered translations. Full procedure: `MIGRATION_AGENT_PROTOCOL.md` §1.3.

---

## MANDATORY — Carbon v11 React target rules (load unconditionally)

`maps/carbon-react-v11-target.md` — the Carbon v11 React **target-authoring
rules** — is loaded **unconditionally, at session start**, for **every**
migration whose target is `@carbon/react` (Carbon v11). This holds for every
source framework and every `migration_class` (`library`, `framework-era-swap`,
`runtime-swap`, `carbon-version-upgrade`, `platform-modernize`).

- It is **not** trigger-gated. Not loading it is a protocol violation.
- It is loaded **in addition to** your one source map (next section) — it
  does NOT count against the "load exactly ONE map" rule. It is a *target*
  rules file, not a *source* map.
- The source map governs source→Carbon translation; `carbon-react-v11-target.md`
  governs whether the resulting Carbon v11 React output is correct: SCSS
  baseline, accessibility-mandatory props, fixed-header layout, grid, Modal,
  DataTable, DOM-correctness. Where the two restate the same rule, the
  target file is authoritative.
- Web-Components targets (`@carbon/web-components` for Vue / Svelte / Angular)
  do NOT load this file — that React API does not apply to them.

Record the load in the ledger:
`Loaded: maps/carbon-react-v11-target.md — Trigger: mandatory (Carbon v11 React target)`.

## Map Files

Load exactly ONE map file per session. Load it when you first encounter a component from the source framework. Do NOT reload it. Do NOT load multiple map files.

**Precedence when multiple rows could match:**

1. A framework-specific design-library map (bootstrap, ant-design, mui, chakra, tailwind, semantic-ui, fluid) always wins if that library is a dependency.
2. A runtime map (`maps/react.md`, `maps/vue.md`, `maps/svelte.md`) applies when **no** dedicated design-library dependency is present — it covers raw HTML primitives in that runtime.
3. The framework-era-swap map (`maps/dojo.md`) applies regardless of other deps — Dojo implies a full infrastructure rewrite.

If two candidates are equally valid, the job's `source_framework` field decides.

| Source Framework (detected) | File to Load |
|-----------------------------|--------------|
| bootstrap, bootstrap5, react-bootstrap | maps/bootstrap5.md |
| ant-design, antd, @ant-design/icons | maps/ant-design5.md |
| @mui/material v5 | maps/material-ui5.md |
| @mui/material v7 | maps/material-ui7.md |
| @chakra-ui/react | maps/chakra-ui2.md |
| tailwindcss | maps/tailwind.md |
| semantic-ui-react, semantic-ui | maps/semantic-ui.md |
| @fluentui/react (fluid) | maps/fluid.md |
| **react, next / nextjs / next.js** (raw React, no dedicated design library) | **maps/react.md** |
| **vue** (Vue 2 / 3, Nuxt, Quasar) | **maps/vue.md** |
| **svelte, sveltekit** | **maps/svelte.md** |
| @carbon/react v10, carbon-components-react (**v10 → v11 upgrade**) | maps/carbon-v10-to-v11.md |
| @carbon/react v10, carbon-components-react (pre-v11 component reference) | maps/carbon-v10.md |
| **@carbon/react v11 with bespoke wrappers + a custom CSS/SCSS skin (remediation / de-customization)** | **maps/carbon-v11-remediation.md** |
| carbon-react-v11 → @ibm/products | maps/carbon-v11-ibm-products.md |
| @mui/material → @ibm/products | maps/material-ui5-ibm-products.md |
| bootstrap5 → @ibm/products | maps/bootstrap5-ibm-products.md |
| bootstrap5 → carbon-web-components | maps/bootstrap5-carbon-web-components.md |
| @angular/material (Angular) → carbon-web-components | maps/angular-material.md |
| **dojo, dijit, dojox, dgrid (Dojo 1.x / `dojo.declare`)** | **maps/dojo.md** |
| **java-server-ui + subtype ps-wcl** (`com.ibm.psw.wcl.*` widgets) | **maps/java-server-ui-pswcl.md** |

### Pattern / Scaffold companion files (framework-era-swap class only)

When source framework is `dojo` (`migration_class: framework-era-swap`), the map above is paired with pattern and scaffold files loaded **on trigger** — not automatically. Same one-per-session load discipline.

| Condition | File to Load |
|-----------|--------------|
| Scoped files contain `dojo.declare`, `postCreate`, `_setXAttr`, `startup`, `destroy`, `dojo/topic`, `dojo/on`, or `_WidgetsInTemplateMixin` | patterns/dojo-lifecycle.md |
| Scoped files contain `define([...], function(...) {})`, `require([...], cb)`, `dojo/text!`, `dojo/has`, or the repo has a `dojoConfig` global | patterns/dojo-module-system.md |
| Job start for `framework-era-swap` + `dojo` source — load once at the beginning of Architect scan / FED unit Phase-0 | scaffolds/dojo-to-carbon-react.md |

### Pattern / Scaffold companion files (platform-modernize class only, 1.3.0)

When `migration_class` is `platform-modernize` (currently `source_framework=java-server-ui`), the subtype-specific map above is paired with patterns loaded **on trigger** and one scaffold loaded once at Architect start:

| Condition | File to Load |
|-----------|--------------|
| Scoped source references a single-dispatcher servlet (e.g., `ITIMControlServlet`, `FrontController`), `TaskIdConstants`, or `CommandInfo` / `setForward(` | patterns/java-server-ui-dispatch.md |
| Scoped source contains `.properties` resource bundles OR calls to `NLSUtils.getString(` / `ResourceBundle.getBundle(` | patterns/java-server-ui-i18n-bridge.md |
| Job start for `platform-modernize` (any subtype) — load once at Architect scan-phase start | scaffolds/java-server-ui-to-carbon-react.md |

### Examples — MANDATORY per FED unit (platform-modernize class only, 1.3.1)

Load EXACTLY ONE example file per FED unit. The unit-context block at
`.carbon-migration/unit-context/<unitId>.md` specifies the
`archetype_hint` for the unit. Load the corresponding file BEFORE
authoring any target code. Loading is mandatory; not loading is a
protocol violation that surfaces as a `missing-archetype-example`
deviation in the migration-coverage-audit.

| Archetype hint | File to Load |
|---|---|
| data-table-direct-ajax    | examples/java-server-ui-to-carbon-react/data-table-direct-ajax.md |
| data-table-view-mediated  | examples/java-server-ui-to-carbon-react/data-table-view-mediated.md |
| auth-form                 | examples/java-server-ui-to-carbon-react/auth-form.md |
| dashboard-with-kpis       | examples/java-server-ui-to-carbon-react/dashboard-with-kpis.md |
| static-content            | examples/java-server-ui-to-carbon-react/static-content.md |
| general (catch-all)       | examples/java-server-ui-to-carbon-react/general-jsp-to-react.md |

The catch-all `general` is loaded for any platform-modernize unit
that does not match a specific archetype, so every platform-modernize
unit MUST end up loading exactly one example file. Never load more
than one.

## Template Files

Load exactly ONE template file, during Phase 1 only. Do NOT load at any other phase.

| Build Tool (detected) | File to Load |
|----------------------|--------------|
| next, nextjs, next.js | templates/nextjs.md |
| vite (Carbon React) | templates/vite.md |
| cdn (Carbon Web Components) | templates/carbon-web-components-cdn.md |
| vite (Carbon Web Components) | templates/carbon-web-components-vite.md |
| vite (IBM Products) | templates/ibm-products-vite.md |
| angular, angular-cli (Angular + Carbon Web Components) | templates/angular.md |

## Patterns File

| Condition | File to Load |
|-----------|--------------|
| Phase 0 scan detects a UI pattern match (see detection signals below), OR Phase 2 migration involves a component matched to a pattern | patterns/carbon-patterns.md |

Do NOT load patterns/carbon-patterns.md unless a match is confirmed. Pattern matching is based on component name signals and text signals — if none are present in the scoped files, skip this file entirely.

## Target Selection Guide

Before picking a map, confirm the correct Carbon target flavor. Target packages are **not interchangeable** — `@carbon/react` is React-only and cannot be consumed from Angular, Vue, Svelte, or vanilla JS projects.

| Source project runtime | Default target | Notes |
|------------------------|----------------|-------|
| React / Next.js | `@carbon/react` (v11) | Default target for all React sources. Use `@ibm/products` additionally when the map calls for IBM-Products-specific components (DataGrid, TearSheet, SidePanel, etc.). |
| Angular (any version) | `@carbon/web-components` | `@carbon/react` does not support Angular. Register `CUSTOM_ELEMENTS_SCHEMA` and bind via attributes/CustomEvents. |
| Vue, Svelte, Lit, Stencil, Vanilla JS / HTML | `@carbon/web-components` | Framework-agnostic custom elements work in all of these runtimes. |
| Mixed runtime (React + Angular micro-frontend) | `@carbon/web-components` | Use web components across the host shell to keep one Carbon runtime; React children may still import `@carbon/react` for React-only regions. |

If the user explicitly requests a target that conflicts with the source runtime (e.g. requests `@carbon/react` for an Angular repo), flag the mismatch in the ledger and stop — do not attempt to migrate.

## Framework Version Disambiguation

Use package.json `dependencies` / `devDependencies` to determine the exact version and select the correct map:

| Package | Version range | Map | Notes |
|---------|--------------|-----|-------|
| @mui/material | ^5.x | maps/material-ui5.md | |
| @mui/material | ^7.x | maps/material-ui7.md | |
| @carbon/react | ^0.x or v10 | **maps/carbon-v10-to-v11.md** | If job's `migration_class` is `carbon-version-upgrade` (v10 → v11). Codemods-first path. |
| @carbon/react | ^0.x or v10 | maps/carbon-v10.md | If job is migrating **from** v10 to a non-Carbon target (rare). |
| @ibm/products target | any | maps/carbon-v11-ibm-products.md | |
| @angular/material | ^15.x – ^18.x | maps/angular-material.md | |
| @angular/core | ^15.x – ^18.x | maps/angular-material.md | |
| dojo | ^1.6 – ^1.14 | maps/dojo.md | Framework-era swap. Pair with patterns/dojo-lifecycle.md + patterns/dojo-module-system.md + scaffolds/dojo-to-carbon-react.md as triggered. |
| react, react-dom, next | ^17.x – ^19.x | maps/react.md | Load only when no dedicated design-library dep is present. If `@mui/material`, `@chakra-ui/react`, `bootstrap`, `tailwindcss`, etc. is in `dependencies`, that map wins instead. |
| vue | ^2.6 – ^3.5 | maps/vue.md | Targets `@carbon/web-components`. `@carbon/react` cannot be consumed from Vue. |
| svelte, @sveltejs/kit | ^3.x – ^5.x | maps/svelte.md | Targets `@carbon/web-components`. `@carbon/react` cannot be consumed from Svelte. |

## Migration Class → Map / Pattern / Scaffold

For quick cross-reference:

| `migration_class` | Primary map | Patterns loaded on trigger | Scaffold |
|---|---|---|---|
| `library` | one of bootstrap5.md / material-ui5.md / chakra-ui2.md / tailwind.md / etc. | none | templates/vite.md or templates/nextjs.md |
| `framework-era-swap` (dojo) | maps/dojo.md | patterns/dojo-lifecycle.md, patterns/dojo-module-system.md | scaffolds/dojo-to-carbon-react.md |
| `carbon-version-upgrade` (v10 → v11) | maps/carbon-v10-to-v11.md | none (codemod-driven) | templates/vite.md (if build system also migrating) |
| `platform-modernize` (java-server-ui, subtype ps-wcl) | maps/java-server-ui-pswcl.md | patterns/java-server-ui-dispatch.md, patterns/java-server-ui-i18n-bridge.md | scaffolds/java-server-ui-to-carbon-react.md (+ templates/vite.md + templates/ibm-products-vite.md for bootstrap) + **MANDATORY per-unit:** one of examples/java-server-ui-to-carbon-react/{data-table-direct-ajax,data-table-view-mediated,auth-form,dashboard-with-kpis,static-content,general-jsp-to-react}.md per the unit-context's `archetype_hint` |

**Every class above also loads `maps/carbon-react-v11-target.md`** unconditionally when the target is `@carbon/react` — the mandatory Carbon v11 React target-authoring rules (loaded in addition to the primary source map). See the MANDATORY section near the top of this file.

## Conditional sub-section gating (within an already-loaded map)

Some map files carry sections that only apply to a subset of projects loading that map. Rather than splitting them into separate files (which would multiply the load-rules table), these sections are wrapped in `<!-- load-gate: <flag> -->` ... `<!-- /load-gate -->` markers inside the map.

Currently registered gates:

| Gate flag                    | True when                                                                                                | First use site                                |
|------------------------------|----------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| `project_uses_carbon_charts` | target project's `package.json` has `@carbon/charts` or `@carbon/charts-react` in any dep section        | `maps/carbon-v10-to-v11.md` §2.5              |

How to evaluate a gate:

1. Read the gate flag name from the marker.
2. Check the rule above for the boolean expression.
3. If true, the section's content applies — include it in your working context.
4. If false, skip the section entirely (do not load it into the FED's prompt; do not act on its directives).

Today this is an **agent-followed convention**: the FED evaluates each gate itself (per the steps above) against the target project's `package.json` and includes or skips the section accordingly. There is no automated orchestrator-side stripping — the gate is enforced by the reading agent, not by prompt assembly. A new gate is added by appending a row above and wrapping the relevant map content in the marker pair.

## Ledger Requirement

Each time you load a file from this directory, record it in the migration ledger:
```
Loaded: [filename] — Trigger: [exact condition that was met]
```

This makes load rule violations visible in the run log.
