# Dojo Module System (AMD) → ESM Migration Patterns

> Source: Dojo AMD (`define`, `require`, `dojo/text!`, `dojo/has`, package map)
> Target: ESM (ES Modules) with Vite / Webpack / Rollup build tooling
> Last updated: 2026-04

**LOAD RULE:** Load this file when the scoped files contain `define([...], function(...) {...})` or `require([...], function(...) {...})` bodies, or import `dojo/*` modules. Usually triggered alongside `maps/dojo.md`.

**CO-LOCATED PRECEDENT OVERRIDE:** If the repo already has a working AMD-to-ESM migration in a sibling folder (bundler config, loader plugin, alias map), that configuration is authoritative. Use it; do not re-derive.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Authorship note

The module-system migration is the most invasive infrastructure change in a Dojo-to-Carbon project. It almost always falls to the `architecture-modernizer` agent rather than `front-end-developer`, because it touches build config, dep graph, and sometimes loader plugins that FED's boundary forbids.

This document lists the known translations. Deviations are common because real Dojo apps sometimes use AMD features (dynamic module loading, `dojo/has` conditional branches, `dojo/text!` plugins) that have no clean single-line ESM equivalent.

---

## 1. `define([deps], function(args) {…})` → ESM `import` + `export`

AMD:

```javascript
define([
  'dojo/_base/declare',
  'dijit/form/Button',
  'dojo/topic',
  './helper'
], function(declare, Button, topic, helper) {
  return declare('my.Widget', [], {
    postCreate: function() { /* … */ }
  });
});
```

ESM:

```javascript
import { Button } from '@carbon/react';
import { topic } from '../events';
import * as helper from './helper';

export default function MyWidget(props) { /* … */ }
```

**Translation rule**: one-to-one from the `define` dependency array to ESM imports. Name order is preserved (`declare`, `Button`, `topic`, `helper` became the function arguments; same names become the imported bindings).

**Gotcha #1**: AMD allows reordering — the `function(a, b, c)` parameters correspond by position to the `[…]` array. Don't assume alphabetic order.

**Gotcha #2**: AMD's `define` can be called with just a factory (no deps): `define(function() { … })`. That's an IIFE-style module. ESM equivalent: just write the `export`s directly.

**Deviation trigger**: when a `define` dependency name maps to a Dojo module that doesn't have a clean Carbon equivalent (e.g., `dojox/mvc/at`, `dojo/Stateful`) — log the dependency and the chosen replacement.

---

## 2. `require([deps], callback)` (dynamic / runtime loading) → dynamic `import()`

AMD (CommonJS-ish):

```javascript
require(['dijit/Dialog'], function(Dialog) {
  var dlg = new Dialog({ title: 'Hi' });
  dlg.show();
});
```

ESM:

```javascript
const { default: MyDialog } = await import('./MyDialog');
// then render <MyDialog open={true} …/>
```

**Translation rule**: `require([...], cb)` is runtime / lazy loading. Map to dynamic `import()`. In React, this is almost always combined with `React.lazy()` and a `Suspense` boundary:

```jsx
const LazyMyDialog = React.lazy(() => import('./MyDialog'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyMyDialog open={isOpen} />
    </Suspense>
  );
}
```

**Gotcha**: AMD `require` is synchronous-looking (callback fires after load). Dynamic `import()` is explicitly promise-based. Calls that relied on synchronous-after-callback ordering need careful review.

**Deviation trigger**: if lazy-loaded widgets were previously passed between other widgets via `dijit.registry.byId`, surfaces a pub-sub / registry migration problem in addition to the lazy-load — log one deviation per coupled widget.

---

## 3. `dojo/text!./path/to.html` — raw text/HTML imports

AMD:

```javascript
define(['dojo/text!./templates/UserRow.html'], function(templateString) {
  // templateString is the file contents as a string
});
```

This is the single most common AMD pattern that blocks a naive ESM migration. HTML templates referenced this way are *data*, not code.

### Option A (recommended for Vite): `?raw` import

```javascript
import templateString from './templates/UserRow.html?raw';
```

Vite's `?raw` suffix is first-class. Works for text, HTML, CSS, SVG as strings.

### Option B (Webpack): `raw-loader`

```javascript
import templateString from 'raw-loader!./templates/UserRow.html';
```

or inline with a resourceQuery: `import templateString from './templates/UserRow.html?raw';` (Webpack 5+ asset modules with `type: 'asset/source'`).

### Option C (the usual 1.2.0 answer): **convert the template to JSX and drop the import entirely**

For Dojo templates inside Dijit widgets (using `_WidgetsInTemplateMixin`), the template is usually the *thing being migrated*. Convert the HTML to JSX inline; there's no template string to import anymore.

**Deviation trigger**: if a template is loaded via `dojo/text!` but used by code that is **not** being migrated in this scope (e.g., an un-migrated legacy widget still references it) — keep the file on disk and use Option A or B to maintain the import. Log a deviation noting the deferred migration of the consumer.

---

## 4. `dojo/has` — conditional module loading

AMD:

```javascript
define([
  'dojo/has',
  'dojo/has!ie?./LegacyImpl:./ModernImpl'
], function(has, Impl) {
  // Impl is one of the two, chosen at load time
});
```

`dojo/has` is a feature-detection layer that Dojo uses to serve different modules for different runtimes (legacy IE vs modern browsers, server vs client, etc.).

### Translation approach

Most `has` features Dojo checks for are no longer relevant in 2026 (IE 11 support, non-ES5 environments). **Default action**: remove the `has!` conditional and keep only the modern branch.

When the `has` check is for a still-relevant runtime dimension (e.g., server vs client), translate using modern equivalents:

- Server vs browser: `typeof window === 'undefined'` or use a framework convention (`useEffect` only runs client-side).
- Touch vs pointer: `'ontouchstart' in window` at runtime.
- Specific browser capability: modern feature-detect inline.

**Deviation trigger**: always log a deviation when removing a `has!` conditional. List what was detected and what the dropped branch contained. Some of those legacy branches existed for a reason (a bug in a specific browser) that might still be relevant.

---

## 5. Dojo package-map / loader config (`dojoConfig`)

Dojo apps configure their AMD loader with a global `dojoConfig` object before `dojo.js` loads:

```html
<script>
  var dojoConfig = {
    async: true,
    parseOnLoad: false,
    packages: [
      { name: 'my', location: '/static/js/my' },
      { name: 'app', location: '/static/js/app' }
    ],
    paths: {
      'some/lib': '/static/vendor/some-lib'
    },
    aliases: [
      ['dojo/store/Observable', 'my/store/BetterObservable']
    ]
  };
</script>
<script src="/static/js/dojo/dojo.js"></script>
```

ESM equivalent in Vite:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      'my': path.resolve(__dirname, 'src/my'),
      'app': path.resolve(__dirname, 'src/app'),
      'some/lib': path.resolve(__dirname, 'vendor/some-lib'),
      'dojo/store/Observable': path.resolve(__dirname, 'src/my/store/BetterObservable'),
    },
  },
});
```

Equivalent in `tsconfig.json paths` (for TypeScript projects):

```jsonc
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "my/*": ["my/*"],
      "app/*": ["app/*"]
    }
  }
}
```

**Translation rule**: every `dojoConfig.packages` entry becomes a bundler alias; every `dojoConfig.paths` entry also becomes an alias. `aliases[…]` entries are the same concept.

**`async: true`** — no equivalent; modern bundlers are always async-safe.
**`parseOnLoad: false`** — no equivalent; React has no parser.
**`locale`, `extraLocale`** — typically become i18n library configuration (see `patterns/dojo-lifecycle.md` §12).

**Deviation trigger**: always log a deviation capturing the original `dojoConfig` object in full, because it's the canonical record of how the app resolved modules. Future debugging depends on having this.

---

## 6. `dojo/parser` — HTML-based widget parsing

Dojo pages often had markup like:

```html
<div data-dojo-type="my/Widget" data-dojo-props="label: 'Hi', count: 3"></div>
```

And a bootstrap call:

```javascript
require(['dojo/parser', 'dojo/domReady!'], function(parser) {
  parser.parse();
});
```

`dojo/parser` walks the DOM finding `data-dojo-type` nodes and instantiates widgets in-place.

**Translation**: **no ESM equivalent exists or should exist**. React mounts to a single root via `createRoot(node).render(<App />)`; widgets don't come from DOM markup.

**Action**: remove `dojo/parser` usage entirely. Replace the `data-dojo-type` HTML with JSX rendered from a React entry point. If the HTML was server-generated (from JSP or similar), that's a deviation — the server template also needs updating, or the React entry point needs to read the server-provided data via a dedicated endpoint instead.

**Deviation trigger**: always. `dojo/parser` usage indicates server-side markup was driving client-side widget construction. Log a deviation for every parsed region, listing the server template source file (if known) and the proposed React mount strategy.

---

## 7. Circular dependencies

Dojo's AMD loader tolerates circular dependencies more gracefully than ESM does. Symptoms after ESM migration: `TypeError: Cannot read property 'foo' of undefined` on import, or imports resolving to `{}`.

**Action**:
- Identify the cycle with the bundler's dependency graph tool or `madge` / `dpdm`.
- Break the cycle by extracting shared code to a third module that both sides depend on.
- Sometimes the cycle is accidental (an `import` that was never really needed) — prune.

**Deviation trigger**: any cycle that required non-trivial refactoring (more than a prune) should be a deviation, since the original AMD code had some implicit ordering that should be reviewed.

---

## 8. `dojo/_base/kernel`, `dojo/_base/array`, `dojo/_base/lang`

These are the low-level Dojo utility modules. Their functions have direct modern equivalents:

| Dojo | Modern JS |
|---|---|
| `array.forEach(arr, fn)` | `arr.forEach(fn)` |
| `array.map(arr, fn)` | `arr.map(fn)` |
| `array.filter(arr, fn)` | `arr.filter(fn)` |
| `array.indexOf(arr, item)` | `arr.indexOf(item)` |
| `lang.hitch(ctx, fn)` | `fn.bind(ctx)` or arrow fn |
| `lang.mixin(a, b)` | `Object.assign(a, b)` or `{...a, ...b}` |
| `lang.clone(obj)` | `structuredClone(obj)` or `JSON.parse(JSON.stringify(obj))` for simple cases |
| `lang.getObject('a.b.c', create, root)` | `root?.a?.b?.c` (optional chaining) |
| `lang.setObject('a.b.c', val, root)` | Direct assignment with care for path creation |
| `kernel.global` | `globalThis` |

Remove the Dojo imports; use the modern equivalents inline.

---

## 9. `dojo/Deferred`, `dojo/promise/all`

AMD:

```javascript
var d = new Deferred();
fetch(…).then(function(result) { d.resolve(result); });
return d.promise;
```

```javascript
require(['dojo/promise/all'], function(all) {
  all([promise1, promise2]).then(…);
});
```

ESM:

```javascript
// Just use native Promise
return fetch(…).then(result => /* … */);
```

```javascript
Promise.all([promise1, promise2]).then(…);
```

Native Promises cover all of `dojo/Deferred`'s functionality. Remove the Dojo abstractions.

**Edge case**: `dojo/Deferred` has a `.cancel()` method. Native promises don't. If the code relied on cancellation, use `AbortController` and pass its `signal` to `fetch`.

---

## 10. Build-system decision: Vite vs Webpack vs keep-Dojo-Build

For a dojo-to-Carbon migration, **Vite is the default recommendation** (fast, modern, minimal config, native ESM, first-class `?raw` imports). Reasons not to pick Vite:

- Repo already uses Webpack 5 successfully and an engineer has strong preference.
- A custom loader that only exists as a Webpack plugin is being kept.
- Corporate build-system mandate requires Webpack.

Keeping the Dojo Build Tool (`util/buildscripts/build.sh`) is not a sensible path for new Carbon code. Dojo Build produces AMD output; Carbon React expects ESM/CJS. The bundler must change.

**Deviation trigger**: when Architect picks a bundler, the decision and rationale are logged in `ARCHITECTURE_PLAN.md > build_system_changes`. Not a deviation entry — a plan entry.

---

## 11. `package.json` changes

Typical incoming Dojo app has a thin `package.json` with dojo packages as deps. The ESM migration needs to adjust:

```diff
{
  "dependencies": {
-   "dojo": "^1.10.0",
-   "dijit": "^1.10.0",
-   "dojox": "^1.10.0",
-   "dgrid": "^1.2.0",
+   "@carbon/react": "^1.x",
+   "@carbon/icons-react": "^11.x",
+   "@carbon/styles": "^1.x"
  },
  "devDependencies": {
-   "dojo-util": "^1.10.0",
+   "vite": "^5.x",
+   "sass": "^1.x",
+   "@types/react": "^18.x",
+   "@types/react-dom": "^18.x",
+   "react": "^18.x",
+   "react-dom": "^18.x"
  },
  "scripts": {
-   "build": "./util/buildscripts/build.sh --profile=release.profile.js",
+   "dev": "vite",
+   "build": "vite build",
+   "preview": "vite preview"
  }
}
```

Architect handles this in the prep phase. FED units inherit the new deps and scripts.

**Deviation trigger**: if the old `package.json` had non-dojo devDependencies that are still needed (e.g., a custom test runner, a specific linter config), they stay. Log a deviation noting which legacy devDeps were preserved and why.

---

## Summary — the common order of operations

Architect's apply phase typically executes module-system migration in this order:

1. Install new deps (`@carbon/react`, bundler, sass).
2. Add `vite.config.js` / `vite.config.ts` with alias map translating `dojoConfig.packages` / `.paths` / `.aliases`.
3. Rewrite `package.json` scripts.
4. For each source file in scope:
   a. Convert `define([...], fn)` → ESM `import`s + `export`s.
   b. Convert `require([...], cb)` → dynamic `import()` (+ `React.lazy` if widget-level).
   c. Convert `dojo/text!` → `?raw` imports (or eliminate if template became JSX).
   d. Strip `dojo/has!` conditionals (keep modern branch; log deviation).
   e. Replace `dojo/_base/*` utilities with native JS.
   f. Replace `dojo/Deferred`, `dojo/promise/all` with native `Promise`.
5. Delete `dojoConfig` global (and any `<script>` bootstrap that used it).
6. Build once (`npm run build`) to find circular-dep fallout; fix.
7. For every file that couldn't be cleanly migrated, log a deviation (category: `build-config-assumption` or `module-system`).
