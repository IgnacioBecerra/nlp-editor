# Dojo → Carbon React Scaffold

> End-to-end scaffold for migrating a classic Dojo (1.6–1.14) application to Carbon React v11 + Vite.
> Companion files: `maps/dojo.md` (components), `patterns/dojo-lifecycle.md` (widget lifecycle), `patterns/dojo-module-system.md` (AMD → ESM).
> Last updated: 2026-04

**LOAD RULE:** Load this file once at the start of a framework-era-swap job where source_framework == `dojo`. It is the end-to-end recipe; `patterns/dojo-module-system.md` and `patterns/dojo-lifecycle.md` are per-technique references loaded as needed.

**CO-LOCATED PRECEDENT OVERRIDE:** If the target repo already has a working Vite + Carbon setup in a sibling folder, use **that configuration** verbatim rather than following this scaffold. This document is the fallback.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## When to use this scaffold

A repo qualifies for the dojo-to-carbon-react scaffold when all of:
- Source framework is classic Dojo 1.x (Dijit / Dojox / dgrid widgets with `dojo.declare`)
- Target is `@carbon/react` v11 (React-based target, not Carbon Web Components)
- Build tool is either absent or the existing Dojo Build Tool
- Module system is AMD

For Dojo 2+ (TypeScript-first, different API), this scaffold does not apply.
For Carbon Web Components targets (`@carbon/web-components`), see `templates/carbon-web-components-vite.md` for bootstrap; widget mapping is in `maps/dojo.md` but the component set differs.

---

## Scaffold overview

The migration unfolds in five stages. Each stage is one architect- or FED-phase worth of work.

1. **Prep / bootstrap** — Architect, apply phase. Stand up the new build system, install deps, land config. No widget migrations yet.
2. **Core infra** — Architect, apply phase (continued). Replace dojoConfig, rewrite loader/alias map, set up SCSS pipeline.
3. **Widget migration (leaf-first)** — FED units. One widget per unit, starting from leaves of the import graph.
4. **Widget migration (interior)** — FED units. Middle tier — widgets that compose other widgets.
5. **Integration + sweep** — FED units + DPR + deviation-completeness-audit. Top-level routes, shell, and final cleanup.

Each stage below lists:
- What Architect / FED does
- Which files they touch
- Which deviations are common
- What success looks like

---

## Stage 1 — Prep / bootstrap

### Goal

Install the new build system alongside the old one. The Dojo app still works; the Carbon build is additive.

### What Architect does (apply phase)

1. Create `vite.config.js` at the app root:

   ```javascript
   // vite.config.js
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import path from 'node:path';

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         // Map the old dojoConfig.packages to the new src layout.
         // Architect fills these in based on what scan-digest found.
         'my': path.resolve(__dirname, 'src/my'),
         'app': path.resolve(__dirname, 'src/app'),
         // etc.
       },
     },
     css: {
       preprocessorOptions: {
         scss: {
           // Must be set so @use '@carbon/react' resolves.
           includePaths: ['node_modules'],
         },
       },
     },
     build: {
       outDir: 'dist',
       emptyOutDir: true,
     },
   });
   ```

2. Add a new minimal `package.json` stanza. Preserve existing deps.

   ```diff
    {
      "dependencies": {
   +    "@carbon/react": "^1.60.0",
   +    "@carbon/styles": "^1.60.0",
   +    "react": "^18.2.0",
   +    "react-dom": "^18.2.0",
        "dojo": "^1.10.0"
      },
      "devDependencies": {
   +    "vite": "^5.0.0",
   +    "@vitejs/plugin-react": "^4.2.0",
   +    "sass": "^1.69.0",
   +    "@types/react": "^18.2.0",
   +    "@types/react-dom": "^18.2.0"
      },
      "scripts": {
   -    "build": "./util/buildscripts/build.sh --profile=release.profile.js"
   +    "build:legacy": "./util/buildscripts/build.sh --profile=release.profile.js",
   +    "dev": "vite",
   +    "build": "vite build",
   +    "preview": "vite preview"
      }
    }
   ```

   Note the `build:legacy` alias preserves the old build so nothing breaks mid-migration.

3. Create `src/index.jsx` (or `.tsx` if TypeScript):

   ```jsx
   import React from 'react';
   import { createRoot } from 'react-dom/client';
   import App from './App';
   import './styles/app.scss';

   const root = createRoot(document.getElementById('carbon-root'));
   root.render(<App />);
   ```

4. Create `src/styles/app.scss`:

   ```scss
   @use '@carbon/react';
   @use '@carbon/react/scss/reset';

   // App-specific tokens live here if the repo needs them.
   ```

5. Create `src/App.jsx` — a stub shell:

   ```jsx
   export default function App() {
     return <div>Carbon app shell — awaiting widget migration.</div>;
   }
   ```

6. Update `index.html` (or the JSP / server-rendered root):

   ```diff
    <div id="legacy-root">
      <!-- Existing Dojo content -->
    </div>
   +<div id="carbon-root"></div>
   +<script type="module" src="/src/index.jsx"></script>
   ```

   The two roots coexist during the migration. Individual widgets move from `legacy-root` to `carbon-root` one at a time.

7. Log the config in `PRECEDENT_SCAN.md` (Architect-authored) if the repo already had a partial Carbon root.

### Common deviations at this stage

| What happened | Category | Typical entry |
|---|---|---|
| dojoConfig had `paths` entries pointing outside `src/` (e.g., `/static/vendor/*`) | `build-config-assumption` | "External path `/static/vendor/some-lib` mapped to `vendor/some-lib` in Vite alias. Verify the path still resolves post-build." |
| Repo already had a `webpack.config.js` doing non-Dojo work | `build-config-assumption` | "Webpack config at `build/webpack.config.js` kept in place for non-migration asset pipeline. Vite handles only src/." |
| Server-rendered root in JSP/Thymeleaf with hardcoded Dojo script tag | `server-integration` | "JSP file `views/layout.jsp` has `<script src='/static/dojo/dojo.js'>`. Added Carbon root alongside; JSP update deferred." |

### Stage-1 success gate

- `npm run build` exits 0 (Vite build of the empty shell succeeds).
- `npm run build:legacy` still works (Dojo build unchanged).
- `index.html` (or equivalent) has both roots.

---

## Stage 2 — Core infra

### Goal

Replace the dojoConfig alias map, SCSS entry points, and the "global" modules (`dojo/_base/*`, `dojo/topic`, `dojo/request`) with React-world equivalents the rest of the migration will rely on.

### What Architect does

1. Identify `dojoConfig` (usually inline in `index.html` or in a `dojoConfig.js`). Migrate each package/path into `vite.config.js > resolve.alias` (see `patterns/dojo-module-system.md` §5).

2. Set up the event bus that will replace `dojo/topic`:

   ```javascript
   // src/events/bus.js
   export const appEvents = new EventTarget();

   export const publish = (topic, detail) =>
     appEvents.dispatchEvent(new CustomEvent(topic, { detail }));

   export const subscribe = (topic, handler) => {
     const cb = (e) => handler(e.detail);
     appEvents.addEventListener(topic, cb);
     return () => appEvents.removeEventListener(topic, cb);
   };
   ```

   Or use a store library (Zustand / Redux Toolkit) if the repo already has one. Architect picks and logs the choice.

3. Set up the HTTP request layer that replaces `dojo/request`:

   ```javascript
   // src/api/client.js
   export async function request(url, { method = 'GET', body, headers = {} } = {}) {
     const res = await fetch(url, {
       method,
       headers: { 'Content-Type': 'application/json', ...headers },
       body: body ? JSON.stringify(body) : undefined,
     });
     if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
     return res.json();
   }
   ```

   (Or TanStack Query, or whatever the repo already uses.)

4. i18n bootstrap — pick a library, load one locale, leave bundles loadable.

### Common deviations at this stage

| What happened | Category |
|---|---|
| Repo used `dojo/store/JsonRest` with specific REST conventions | `build-config-assumption` — record REST conventions (PUT semantics, response envelope) |
| `dojo/topic` listeners in non-migrated files still need to receive events | `event-topic-unverified` — publish to both old and new bus during transition |
| `dojo/request` had request interceptors for auth headers | `build-config-assumption` — reproduce interceptor in the new client |

### Stage-2 success gate

- `vite.config.js > resolve.alias` has an entry for every `dojoConfig.packages` / `.paths` entry.
- `src/events/bus.js` exists and has unit tests.
- `src/api/client.js` exists and a smoke test confirms it can hit one endpoint.

---

## Stage 3 — Widget migration (leaves first)

### Goal

Migrate widgets that have **no** dependencies on other widgets. Working from the leaves lets interior widgets find their children already migrated when their turn comes.

### What FED does per unit

For each widget-containing file in the unit scope:

1. Phase-0 self-scan:
   - Is this widget in `maps/dojo.md`? If yes, follow the mapping.
   - Is there precedent in `PRECEDENT_SCAN.md`? If yes, prefer precedent.
   - Any lifecycle hooks? (`postCreate`, `_setXAttr`, `startup`, `destroy`) → consult `patterns/dojo-lifecycle.md`.

2. Rewrite the widget as a React functional component (see `patterns/dojo-lifecycle.md` §1–§8 for lifecycle translations).

3. For every template (.html referenced via `dojo/text!` or `templatePath`), convert to JSX inline. If the template has non-dojo server attributes, preserve them.

4. For every `dijit.registry.byId('x')` call in this file, replace per `patterns/dojo-lifecycle.md` §10.

5. Remove the `define(…)` wrapper; add `import`/`export`. The file now conforms to ESM.

6. Rename the file if the repo convention dictates (`Foo.js` → `Foo.jsx`).

7. Update imports in consumer files in **this unit's scope only**. Out-of-scope consumers are a different unit's responsibility.

8. Run the build:
   - `npm run build` — must exit 0.
   - If failures are in this unit's files, fix.
   - If failures are in out-of-scope files, **do not fix** — log a deviation and stop touching those files.

9. Commit per the FED protocol (1.1.0 standard).

### Common deviations at this stage

| Pattern | Category |
|---|---|
| Widget had a `_setXAttr` that published a topic | `event-system` — one deviation per unique topic |
| Widget's template was shared with another (unmigrated) widget | `template-loader-unverified` |
| Widget called `dijit.registry.byId('x')` where `x` was rendered by another unit | `widget-lifecycle` — log the coupling |
| Widget had `dojo.declare` with 3+ level mixin chain | `ambiguous-lifecycle` — list the chain |
| Widget had pixel-perfect CSS that doesn't cleanly map to Carbon tokens | `style-approximation` |

### Stage-3 success gate

- All leaf widgets in the unit compile and render in isolation in a synthetic test / Storybook / the fixture.
- Every deviation category that applies has at least one entry.

---

## Stage 4 — Widget migration (interior tier)

### Goal

Migrate widgets that compose other widgets — panels, forms, dialogs that contain leaf widgets.

### Additional considerations over Stage 3

1. **Child widgets must already be migrated.** If a dialog contains a MessageBar and the MessageBar is still Dojo, this unit is blocked on the MessageBar unit; log a deviation and continue with whatever can be done (e.g., migrate the dialog shell, leave a stub for the MessageBar slot).

2. **Layout containers** (`BorderContainer`, `LayoutContainer`, `ContentPane`) don't have 1:1 Carbon equivalents; they become Carbon `Grid` + `Row` + `Column` compositions. The visual outcome may differ slightly from the Dojo original — log as `style-approximation` if the new layout doesn't visually match the old.

3. **Tabs and Accordions**: structural rewrites, not prop swaps. See `maps/dojo.md` entries for TabContainer and AccordionContainer.

### Common deviations at this stage

| Pattern | Category |
|---|---|
| Layout container (BorderContainer) visual outcome differs from original | `style-approximation` |
| Modal / Dialog was opened from an un-migrated caller via `byId` | `widget-lifecycle` |
| Tab `closable: true` had no clean Carbon equivalent | `style-approximation` + `widget-lifecycle` |

### Stage-4 success gate

- Interior widgets render with their (migrated) children.
- Every blocked-on-child case is either resolved (child now migrated) or a deviation.

---

## Stage 5 — Integration, shell, and final sweep

### Goal

Top-level routes and the app shell. Final cleanup and the deviation-completeness audit.

### What FED does

1. Migrate the top-level shell (whatever mounted the original Dojo app — usually an `AppController` or similar).
2. Wire the `<App />` in `src/index.jsx` to a real route layout (React Router v6, or equivalent).
3. Render all migrated widgets from the React shell.

### What DPR does (final unit)

1. Carbon purity review on all migrated files.
2. Aggregate Architecture-section shards from every unit into its shard.
3. Append its own Design-section shard.
4. Commit the final unit (FED work + DPR fixes).

### What `deviation-completeness-audit` does

1. Fetch all unit branches and prep.
2. Read every `.carbon-migration/deviations/*.md` shard.
3. Run the completeness audit (per spec §13.1): scan diffs for uncertainty-shaped changes not logged as deviations.
4. Build the final consolidated `DEVIATIONS_FOR_REVIEW.md` at repo root on prep.
5. Commit + push.
6. Draft PR is now complete.

### Stage-5 success gate

- Single Carbon root mounts the whole app; legacy root is empty (or gone from `index.html`).
- `npm run build` exits 0.
- `npm run build:legacy` is no longer needed (optionally removed).
- Every widget from Stage 3 & 4 renders inside the real shell, not just in isolation.
- `DEVIATIONS_FOR_REVIEW.md` exists at repo root with numbering 1..N.

---

## Anti-patterns — things not to do

1. **Do not migrate server-side-rendered widget markup in one pass**. JSP / Thymeleaf / Liberty server code stays untouched (per spec §12 PATH_DENYLIST). Markup changes there are a follow-up migration, logged as a deviation.

2. **Do not rewrite dojo/store or dojo/data to a specific library without architectural sign-off**. The Architect plan must name the chosen library. FED units don't decide data-fetching strategy on their own.

3. **Do not touch `util/buildscripts/` or the legacy Dojo build system** unless Architect's plan says so. Preserve it for rollback.

4. **Do not skip the precedent scan**. Every repo is different; the generic scaffold is wrong 10% of the time. Precedent is correct for that repo 100% of the time.

5. **Do not batch-migrate across widget families**. One widget type (e.g., all TextBoxes) per unit is tempting but violates the leaf-first ordering — a TextBox deep inside a dialog can't be migrated without migrating the dialog too if the dialog uses `dijit.byId`.

---

## What an Architect plan for a dojo-to-carbon-react job typically contains

Following the structured schema from spec §18+1:

```yaml
module_system_strategy: "AMD → ESM via Vite. dojoConfig.packages/paths/aliases mapped to vite.config.js resolve.alias. `dojo/text!` converted to ?raw imports or eliminated where templates become JSX. dojo/has conditionals stripped (keep modern branch only)."

build_system_changes:
  - "Add vite, @vitejs/plugin-react, sass, @types/react, @types/react-dom to devDependencies"
  - "Create vite.config.js with resolve.alias mirroring dojoConfig"
  - "Rename npm run build to npm run build:legacy; add new scripts: dev, build, preview"
  - "Keep util/buildscripts/ unchanged for rollback"

template_loader_strategy: "Dijit templates converted inline to JSX during each widget's migration. Orphan HTML files (templates loaded by un-migrated widgets) retained and imported via ?raw suffix."

widget_lifecycle_mapping:
  postCreate: "useEffect([])"
  startup: "useLayoutEffect([])"
  _setXAttr: "Controlled component pattern"
  destroy: "useEffect return function"
  "dojo/topic": "src/events/bus.js (EventTarget-backed) OR Zustand if repo already has one"
  "dijit.registry.byId": "React Context / refs / store; legacy callers preserved by retaining DOM id"

affected_paths:
  - "vite.config.js (new)"
  - "src/index.jsx (new)"
  - "src/App.jsx (new)"
  - "src/events/bus.js (new)"
  - "src/api/client.js (new)"
  - "src/styles/app.scss (new)"
  - "package.json (edited)"
  - "index.html (edited — add carbon-root)"

expected_diff_manifest: [per-file list — too long for this example]

risks:
  - "Server-rendered markup in JSP files references widget IDs — out of scope; deviation per unique reference"
  - "Pub-sub rewire may miss cross-widget coupling — one deviation per topic recommended"
  - "Visual parity for layout containers not guaranteed"
```
