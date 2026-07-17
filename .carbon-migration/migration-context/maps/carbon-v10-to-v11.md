# Carbon v10 → v11 Migration Map

> Source: Carbon v10 (`carbon-components-react` / `carbon-components` / `@carbon/icons-react` v10 / `node-sass`-driven SCSS)
> Target: Carbon v11 (`@carbon/react` / `@carbon/styles` / `@carbon/react/icons` or `@carbon/icons-react` v11 / Dart Sass)
> Last updated: 2026-05
> Source of truth: <https://carbondesignsystem.com/migrating/guide/develop/>
> Source retrieved: 2026-05-20

**LOAD RULE:** Load this file only when source_framework is `carbon-v10` (`@carbon/react` v10, `carbon-components-react`, or `carbon-components` packages detected) per INDEX.md. Load ONCE per session.

**CO-LOCATED PRECEDENT OVERRIDE:** If the target repo has a partially-migrated area where Carbon v11 is already present alongside v10 — the prior team's translation choices are authoritative. Follow those; log a deviation only when this map would yield a different result.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written EXCEPT rows marked `⚠️ verify`.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, type, or token name) MUST be verified using the **Tier-of-truth ladder** in §0.1 before you write it. Carbon's API — including its icon taxonomy and token namespace — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Authorship note

Carbon v10 → v11 is an **API/token migration**, not a framework swap. It does not require the `architecture-modernizer` agent — a specialized FED prompt variant handles it with `migration_class: "carbon-version-upgrade"`.

**Before adding rules to this map**, base them on evidence from real project migrations — do not write speculative rules.

This migration is **deterministic and instruction-driven**. The agent reads each numbered step below and applies it directly — it does not rely on codemods. Codemods (when available) are an optional accelerator described in Appendix A; the v11 → v12 upgrade will have none, so the discipline of following the steps directly carries forward.

**Run the steps in order.** Steps 0-1 are pre-flight; 2-7 are content migration; 8 is the verification gate that decides whether the unit is `done`.

---

## §0.1 — Tier-of-truth ladder (MANDATORY)

For ANY Carbon name written during this migration — component, icon, prop, hook, type export, SCSS token, SCSS subpath, CSS class — use the following ladder. **Never invent a name from training data.**

### Ladder

1. **PREFER** the `carbon-builder` skill. Invoke via the `Skill` tool when available.
2. **FALLBACK** to Carbon MCP tools directly when `carbon-builder` is unreachable:
   - `code_search` — named exports, icons, component variants, props
   - `docs_search` — design/dev docs, token/subpath guidance, migration sections
   - `get_charts` — chart source code and assembly (rare in upgrades)
3. **FALLBACK** to LLM training only when both above are unreachable. Log a MANDATORY ledger entry in `CARBON_MIGRATION_LEDGER.md`:
   ```
   ⚠️ CARBON SKILL/MCP UNAVAILABLE — used model knowledge for: <name> at <file:line>
   ```
   Continue the migration. The file is flagged for downstream DPR review.

**The migration MUST NOT halt because a tier is unavailable. Uptime is mandatory.**

### How to detect tier availability (avoid wasted turns)

- **Tier 1 (`carbon-builder` skill):** the skill appears in the session's available-skills list at conversation start. If a `Skill` invocation returns an error containing `not available` / `not found` / `unknown skill`, tier 1 is **unavailable for this session** — do NOT log a deviation for this (it's expected in some environments). Cache the result; do not retry.
- **Tier 2 (Carbon MCP):** the MCP tools appear as deferred tools at conversation start. If `code_search` / `docs_search` / `get_charts` return network/timeout errors **three times in a row**, treat MCP as unavailable for the session. Log ONE `[mcp-unavailable]` deviation (category: `design`, see §10) and continue at tier 3.
- **Tier 3:** training knowledge. Every Carbon name written at tier 3 gets a per-name ledger entry (see §8.5).

### Query patterns (Tier 2 — Carbon MCP)

- Icon lookup: `code_search { query: "<noun phrase>", filters: { asset_type: "icon" }, size: 2 }`. Use `import` for the export name; use `import_stmt` verbatim.
- Component lookup: `code_search { query: "<component name>", filters: { component_type: "React", component_id: "<id>" }, size: 2 }`. Use `imports[]` verbatim.
- Subpath / token / docs lookup: `docs_search { query: "<topic>", filters: { component_id: "<id-if-known>" }, size: 3 }`.

### Rule for rows in this map's tables

- Rows NOT marked `⚠️ verify` are confirmed against Carbon docs/MCP as of `Last updated`. Use them directly — no per-row tier-ladder invocation required.
- Rows marked `⚠️ verify` are model-inferred. The agent MUST run the tier ladder on these rows BEFORE substituting. If verification yields a different mapping, apply the verified version and log a `design` deviation tagged `[ambiguous-token]` noting "v10→v11 token rename (verified): `<from>` → `<to>`".

---

## §0 — Pre-flight gates

All checks run BEFORE any source edits. Failures here block the migration cleanly — they don't cause partial damage.

### 0.1 Detect Carbon v10 packages

Confirm at least one of these is present in `package.json`:

- `carbon-components` (any 10.x)
- `carbon-components-react` (any 7.x)
- `carbon-icons` (any 7.x)
- `@carbon/icons-react@10.x`
- `@carbon/themes@10.x` / `@carbon/colors@10.x` / `@carbon/grid@10.x` / `@carbon/layout@10.x` / `@carbon/motion@10.x` / `@carbon/type@10.x`

If none are present, this map does not apply — exit and reload INDEX.md.

### 0.1.1 Fast-path detection (JS imports only)

If `carbon-components-react@^8.x` or `carbon-components@^11.x` is present, these are **direct re-exports of v11**. The JS-side migration reduces to: change the import string (`carbon-components-react` → `@carbon/react`, `carbon-components` → `@carbon/styles`) and remove the old package.

**Fast-path caveat — JS imports only.** Color tokens, CSS class prefix (`bx--` → `cds--`), SCSS function prefix (`carbon--`), TypeScript types, custom SCSS, and component API changes still need full migration per §3, §4, §3.5, §5, §7. **Do NOT skip §3-§7 wholesale** — only §2.1 (JS imports) shortens. Run the full §8 build-verification gate regardless. Log a `design` deviation tagged `[fast-path-used]` noting "re-export package detected: JS imports shortcut taken; SCSS / tokens / prefix / types / components still migrated".

### 0.2 React version pre-flight

`@carbon/react@^1.x` peer dependency (verified 2026-05): `react: "^16.8.6 || ^17.0.1 || ^18.2.0 || ^19.0.0"`.

**Do not claim React 17+ is required — it is NOT.** The peer range admits 16.8.6+, but the REAL floor is **React 16.14.0**: `@carbon/react` v11 and `@carbon/icons-react` v11 import `react/jsx-runtime` (the new JSX transform), which first shipped in React 16.14.0. A 16.8.6–16.13.x project installs and type-checks but fails at build time with `Can't resolve 'react/jsx-runtime'` (field incidents occurred — including a downstream AI "fixing" an install error by downgrading to the recorded 16.13.1 and hitting exactly this wall).

**Deterministic detection command:**

```bash
node -e "
const pkg = require('./package.json');
const v = (pkg.dependencies && pkg.dependencies.react) || (pkg.devDependencies && pkg.devDependencies.react) || '';
const m = v.match(/(\d+)\.(\d+)\.(\d+)/);
if (!m) { console.log('NOT_DETECTED'); process.exit(0); }
const [_, major, minor, patch] = m.map(Number);
if (major > 16) { console.log('OK ' + v); process.exit(0); }
if (major === 16 && minor >= 14) { console.log('OK ' + v); process.exit(0); }
console.log('BUMP ' + v);
"
```

| Detection result | Action |
|---|---|
| `OK <version>` | Proceed. Do NOT bump. |
| `BUMP <version>` | Auto-bump `react` and `react-dom` to `^16.14.0` (the `react/jsx-runtime` floor — NOT 17/18). Log a `design` deviation tagged `[react-auto-bump]` with old → new versions. |
| `NOT_DETECTED` | Log an `architecture` deviation tagged `[react-version-not-detected]`; set `react` and `react-dom` to `^18.3.1`. |

**Do not introduce a React major bump (16→17, 16→18) as part of this class.** That's a separate concern. The supervisor enforces both rules deterministically at the end-of-migration dependency-normalize step: an introduced 16→17/18 bump is reverted to `^16.14.0` (`[react-major-bump-reverted]`), and a remaining 16.x < 16.14 is raised to `^16.14.0` (`[react-jsx-runtime-floor]`).

### 0.3 Sass build chain

**Deterministic detection:**

```bash
node -e "
const pkg = require('./package.json');
const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
console.log('node-sass:' + (deps['node-sass'] || 'absent'));
console.log('sass:' + (deps['sass'] || 'absent'));
"
```

| Detected | Action |
|---|---|
| `node-sass` present | Uninstall `node-sass`; install `sass@^1.33.0` to `devDependencies`. Carbon v11 requires Dart Sass. |
| `sass` present at `^1.33.0`+ | Confirm version; no install needed. |
| Neither | Install `sass@^1.33.0` to `devDependencies`. |

Also update any build config that references `node-sass` explicitly (webpack/gulp/etc.) to use `sass`.

**CRA / `react-scripts` repos:** if the build toolchain is Create React App and `react-scripts` is pinned at `<5.0`, bump to `^5.0.1`. (The reason is **not** Sass: `react-scripts@3.3+` ships `sass-loader@8`, whose peers are `sass: ^1.3.0` plus an *optional* `node-sass` — Dart Sass works fine on CRA 3. The real driver is that Carbon v11's `@carbon/charts@^1.x` ESM and other modern `node_modules` ESM need CRA 5's webpack 5 / babel to transform under `node_modules` — see §2.5.4 — and the bump raises the jest major the CRA toolchain requires, 24 → 27.) For `carbon-version-upgrade` the supervisor performs this bump **deterministically** before the toolchain reconcile (so the jest ecosystem anchors to CRA-5's jest 27); either way log a `design` deviation tagged `[cra-react-scripts-bump]` with old → new versions.

### 0.4 Detect package manager (for §1.2 and §8)

```bash
PM=$(test -f pnpm-lock.yaml && echo pnpm || (test -f yarn.lock && echo yarn) || echo npm)
echo "PM=$PM"
```

Use the detected `$PM` for ALL install/build invocations in §1.2 and §8. **Do not hardcode `npm`** — creating a `package-lock.json` in a pnpm/yarn repo is a regression.

### 0.5 Detect build script

```bash
node -e "
const s = require('./package.json').scripts || {};
const order = ['build', 'tsc', 'compile', 'typecheck'];
const found = order.find(k => s[k]);
console.log(found ? 'BUILD=' + found : 'BUILD=none');
"
```

`BUILD=<script-name>` → use `<PM> run <script-name>` as the build verification command in §8.3. `BUILD=none` → fall back to `npx tsc --noEmit` if `tsconfig.json` exists, else log an `architecture` deviation tagged `[no-build-script]` and skip §8.3 (the §8.1 grep gate and §8.2 install gate still run).

### 0.6 Optional dev tooling

Recommend (do not require) installing the community-supported `stylelint-plugin-carbon-tokens` as a `devDependency` — it provides ongoing lint pressure against stale v10 tokens during the migration.

---

## §1 — Dependency sync (deterministic package.json rewrite)

This step is in scope for the carbon-version-upgrade class. **The agent edits `package.json` directly.**

### 1.1 Authoritative remove/add diff

> The diff block below is **generated from [`config/carbon-version-pins.json`](../../config/carbon-version-pins.json)** by `npm run sync-pins`. Do NOT hand-edit the block between the `pins:diff-start`/`pins:diff-end` markers — edit the pins file and re-run sync. A CI test fails if the block drifts.

<!-- pins:diff-start -->
```diff
 "dependencies": {
-  "carbon-components": "^10.58.0",
-  "carbon-components-react": "^7.59.0",
-  "carbon-icons": "^7.0.7",
-  "@carbon/icons-react": "^10.x",
-  "@carbon/themes": "^10.x",
-  "@carbon/colors": "^10.x",
-  "@carbon/grid": "^10.x",
-  "@carbon/layout": "^10.x",
-  "@carbon/motion": "^10.x",
-  "@carbon/type": "^10.x",
-  "@carbon/charts": "^0.40.x",
-  "@carbon/charts-react": "^0.40.x",
+  "@carbon/react": "1.109.0",
+  "@carbon/charts-react": "^1.27.11",
 }
 "devDependencies": {
-  "node-sass": "^4.x",
-  "@types/carbon-components-react": "^7.x",
+  "sass": "^1.33.0"
 }
```
<!-- pins:diff-end -->

Notes:
- `@carbon/react` is pinned **exact** (no `^`) — the current value is in the diff block above: a floating range drifts to the newest 1.x whose component types (e.g. `Slider` typed `() => ReactNode`) break projects on `@types/react@17` (see §7.14) and make the migration non-reproducible. `@carbon/styles` no longer shares `@carbon/react`'s version number; when §1.1.1 says it is needed as a direct dep, pin it exactly to the newest release satisfying the installed `@carbon/react`'s own `@carbon/styles` dependency range (`npm view @carbon/react@<pin> dependencies` shows the range). This pin, the scaffold `package.json.template`, and this diff block are all generated from [`config/carbon-version-pins.json`](../../config/carbon-version-pins.json) — bump the version there and run `npm run sync-pins`; never hand-edit.
- `@carbon/react` re-exports `@carbon/react/icons`. `@carbon/icons-react` is **only** added back if §1.1.2 says so.
- `@carbon/themes`, `@carbon/colors`, `@carbon/grid`, `@carbon/layout`, `@carbon/motion`, `@carbon/type` are NOT needed as direct deps when consuming via `@carbon/react` — they come transitively. Only re-add if explicit JS code references them.
- `@types/carbon-components-react` is **not needed** in v11 — TypeScript types ship with `@carbon/react` directly (see §5).
- **Carbon Charts:** v10-era `@carbon/charts@0.40.x` / `@carbon/charts-react@0.40.x` are deprecated. v11 install pattern is `yarn add @carbon/charts-react` (or `npm install @carbon/charts-react`) — `@carbon/charts` is pulled transitively via the React wrapper's deps, so the add side lists only `@carbon/charts-react`. SCSS-side Charts migration (the `~@carbon/charts/styles-g100` Webpack alias, `.bx--cc--*` selectors) is handled in §4 (class prefix) and the Carbon Charts v11 docs — this map only owns the dependency swap.

### 1.1.1 Decision table for `@carbon/styles`

| Project profile | `@carbon/styles` needed? |
|---|---|
| React app consuming `@carbon/react` | **No** — `@carbon/react` declares `@carbon/styles` as a peer; install it only if peer-dep resolution complains during §1.2. |
| CSS-only consumer (no React, just import compiled CSS) | **Yes** — `@carbon/styles` (exact — see §1.1 note for how the version is chosen) as a direct dep. |
| Component library or design-token library re-exporting Carbon | **Yes** — `@carbon/styles` (exact — see §1.1 note for how the version is chosen) as a peer dependency. |
| SCSS-only consumer using `@use '@carbon/styles'` directly | **Yes** — `@carbon/styles` (exact — see §1.1 note for how the version is chosen) as a direct dep. |
| React app **AND** any SCSS file imports/uses `@carbon/charts` (e.g. `@import '@carbon/charts/styles/styles.scss';`) | **Yes** — `@carbon/styles` (exact — see §1.1 note for how the version is chosen) AND `@carbon/layout@^11.x` BOTH as direct deps. `@carbon/charts/scss/_type.scss` does `@use '@carbon/layout';` which Sass resolves by walking node_modules from the importing file upward. `@carbon/charts` doesn't list `@carbon/layout` as a dep, so npm hoists copies inside each parent (`@carbon/styles/node_modules/@carbon/layout`, `@carbon/react/node_modules/@carbon/layout`) but NOT at the top-level `node_modules/@carbon/layout/`. Sass's resolver doesn't see those nested copies → `Can't find stylesheet to import`. Adding `@carbon/layout` as a direct dep forces npm to hoist it to the top. `npm install` does NOT warn; failure manifests as a Sass compile error at dev/build time. Log a `design` deviation tagged `[added-carbon-styles-for-charts]` (and `[added-carbon-layout-for-charts]` for the layout pin). (Surfaced 2026-05-22 build-phase epoch 1/2 against `carbon-v10-enterprise`.) |

Default for migrating a React product app: **No** (skip the dep). If `npm install` in §1.2 emits a peer-dep warning naming `@carbon/styles`, add it then. **Also add** if the app uses `@carbon/charts` / `@carbon/charts-react` AND any SCSS file imports from `@carbon/charts` — see the charts row above. Log a `design` deviation tagged `[added-carbon-styles]` if added.

### 1.1.2 Decision table for `@carbon/icons-react`

| Source code currently imports | v11 action |
|---|---|
| `from '@carbon/icons-react'` (v10, with `Add32`-style names) | **DEFAULT — Option A: keep `@carbon/icons-react`** (upgrade to `@carbon/icons-react@^11.50.0`, drop size suffix from names per §6.1, KEEP the import path). Option B (`from '@carbon/react/icons'` + remove `@carbon/icons-react`) is **NOT recommended**: `@carbon/react/icons` is a thin TypeScript re-export (`export * from '@carbon/icons-react'`); removing the top-level `@carbon/icons-react` leaves the runtime resolving via the nested `@carbon/react/node_modules/@carbon/icons-react` while TypeScript cannot reliably resolve every bare name through that nested copy → TS2305/TS2724 errors at every icon import. (Surfaced 2026-05-22 build-epoch-7: 20 icon errors when Option B was chosen.) If Option B is genuinely required, KEEP `@carbon/icons-react` as a direct dep anyway — at which point Option B's "fewer deps" motivation is gone, so just use Option A. |
| No direct icon-package imports (all icons via `@carbon/react`) | Don't add the package. |

If choosing Option A (DEFAULT): install `@carbon/icons-react@^11.50.0`; rewrite icon imports per §6.1 (strip size suffix, keep the import path). If choosing Option B: rewrite ALL imports to `from '@carbon/react/icons'` per §6.1 AND **KEEP `@carbon/icons-react@^11.50.0` as a direct dep** (the table above explains why — without it, TypeScript fails). **Do not leave the project in a mixed state** — pick one option per project and apply consistently. Log the choice in the §8.5 self-audit block.

**Package-presence invariant (BOTH options — MANDATORY):** whenever ANY source file imports icons — `from '@carbon/icons-react'` OR `from '@carbon/react/icons'` — `@carbon/icons-react@^11.50.0` MUST be present in `package.json` dependencies. "Not added" is valid ONLY when zero icon imports exist project-wide. Never record Option A in `MIGRATION_FACTS.md` while omitting the package: that contradiction leaves icon imports unresolvable, and the next unit "repairs" it by installing the latest icons package and bumping React — the exact freelance chain that shipped an uninstallable project on 2026-06-10. The supervisor enforces this invariant deterministically at the dependency-normalize step (`[icons-package-restored]`), but the deps unit MUST still get it right so intermediate units never see a broken state.

### 1.1.3 Lock the icon-import choice for the whole project (MANDATORY)

The synthetic `wu_shared_metadata` unit makes the §1.1.2 A-vs-B choice ONCE for the whole project. To prevent per-unit FEDs from making independent (and inconsistent) choices later, the metadata unit MUST persist the decision to `.carbon-migration/icon-import-style.txt`:

```bash
# Option A chosen — keep @carbon/icons-react as a direct dep:
echo "A" > .carbon-migration/icon-import-style.txt

# Option B chosen — replace with @carbon/react/icons:
echo "B" > .carbon-migration/icon-import-style.txt
```

Every subsequent unit reads this lock at start (see §6.2) and uses the matching import path for ALL its icon imports. If the file is missing when a non-metadata unit starts (e.g. metadata unit hasn't run yet, or skipped because `architectRuns=true`), default to **Option A** (keep importing from `@carbon/icons-react`; v11 names are bare with a `size` prop per §6.1) and log a `[icon-import-style-default-fallback]` deviation noting the missing lock file. The default flipped from B → A on 2026-05-22 (see §1.1.2): Option B's TypeScript resolution breaks at every icon name because `@carbon/react/icons` is a thin re-export of `@carbon/icons-react` and the nested copy under `@carbon/react/node_modules/` is not reliably resolved by `tsc`.

This eliminates the failure mode observed in field reports where one unit imports `from '@carbon/icons-react'` and another imports `from '@carbon/react/icons'` for the same component, breaking type-check + tree-shake.

#### 1.1.3.1 Local icon re-export barrel (`src/icons.ts` and similar) — MANDATORY consistency

Many projects have a **local icon barrel** — a file like `src/icons.ts` /
`src/components/icons.ts` that re-exports icons for the rest of the app
(`import { Add16 } from './icons'`). The migration MUST keep the barrel
and its consumers in agreement, or the build breaks with
`No matching export in "src/icons.ts" for import "<Name>"`.

The barrel is typically owned by the `wu_shared_metadata` (or `types`)
unit while its consumers are owned by component units — so the two are
migrated by **different** FED sessions and drift apart. Rule:

1. The unit that owns the barrel MUST re-export **every icon name any
   consumer imports**, in BOTH shapes:
   - the **bare v11 names** (`Add`, `Switcher`, `TrashCan`, …) — migrated
     in-scope consumers import these;
   - any **legacy sized-wrapper names** (`Add16`, `Delete20`, …) that
     genuinely-out-of-scope files still import — keep these as thin
     `size`-prop wrappers for back-compat.
2. When the barrel exists, in-scope consumers keep importing **from the
   barrel** (`from './icons'`), not from `@carbon/react/icons` directly —
   the icon NAME is migrated v10→v11 (§6.3) but the `from './icons'`
   source is preserved. The barrel is then responsible for resolving the
   v11 name.
3. Audit: after migrating any consumer that imports from a local barrel,
   grep the barrel's `export { … }` block and confirm every name the
   consumer now imports is present. If a name is missing, add it to the
   barrel's imports + exports. This is part of the unit's §8.1 gate.

### 1.1.4 Write `MIGRATION_FACTS.md` at repo root (downstream-reader truth file)

The synthetic `wu_shared_metadata` unit also writes `MIGRATION_FACTS.md` to the **repo root** (not under `.carbon-migration/`) as a structured truth file for downstream readers — humans debugging the migrated project later, AI assistants asked "why won't this build?", code-review tools, etc.

**Why this file exists.** Field reports document a recurring failure mode: a downstream user opens the migrated project, runs `npm install`, hits an ERESOLVE error, and asks an AI assistant for help. The assistant pattern-matches against common library upgrade lore and confidently claims **"Carbon v11 requires React 17+"** — which is FALSE for `@carbon/react@^1.x` (peer-dep is `^16.8.6 || ^17 || ^18 || ^19`). The user wastes hours bumping React, breaks other parts of the project, and blames Carbon Migrate. `MIGRATION_FACTS.md` puts the truth in the user's path: the next time anyone (human or AI) reads the project, the authoritative facts are right there at the repo root.

**Template** (the metadata unit fills in `<…>` with measured values from §0 pre-flight + §1.1):

```markdown
# Migration Facts — Carbon v10 → v11

> Generated by Carbon Migrate on `<ISO timestamp>` for job `<jobId>`.
> This file is the authoritative source for facts about THIS migration.
> If a downstream tool or AI assistant claims something contrary to what's
> here, prefer the facts in this file.

## React version compatibility

`@carbon/react@^1.x` peer dependency (verified against the installed package):
```

```
react: "^16.8.6 || ^17.0.1 || ^18.2.0 || ^19.0.0"
react-dom: "^16.8.6 || ^17.0.1 || ^18.2.0 || ^19.0.0"
```

```markdown
**React 16.14.0+ IS supported by Carbon v11 — React 17/18 is NOT required.**
(The peer range starts at 16.8.6, but 16.14.0 is the practical floor:
`react/jsx-runtime` — imported by `@carbon/react` v11 and
`@carbon/icons-react` v11 — first shipped in React 16.14.0.) If you see a
claim that "Carbon v11 requires React 17+", that claim is **incorrect** for
`@carbon/react@^1.x`. Equally: do NOT downgrade React below 16.14.0 to
"match" a recorded version — that re-breaks `react/jsx-runtime`. Verify the
peer-dep range yourself with `npm view @carbon/react peerDependencies`.

This migration kept React at `<detected-react-version>`, which is compatible.

## Carbon package versions (post-migration)

| Package | Version pinned | Source |
|---|---|---|
| `@carbon/react` | `<version>` | added |
| `@carbon/icons-react` | `<version, or "not added (zero icon imports project-wide)">` | per §1.1.2 — the package is REQUIRED under BOTH options whenever any source file imports icons |
| `@carbon/styles` | `<version or "not added">` | per §1.1.1 |
| `@carbon/charts-react` | `<version or "not present">` | per §1.1 (if Charts in project) |
| `@carbon/ibm-products` | `<version, or "not added (no re-export dead-end)">` | per §1.4 — added ONLY when a re-export dead-end routed names to Bucket B (successor wrapper) |

## Preserved public re-export surface (compat layer)

If a public re-export's backing package had no target-compatible release, the
migration preserved every export **name** via a generated compatibility layer
(map §1.4) rather than dropping it. This table is the authoritative manifest the
final-refinement pass regenerates the compat module from — do NOT delete the
module or "complete" any name back to a drop.

| Original export | Bucket | Target (or "stub — no successor") | Compat module |
|---|---|---|---|
| `<Name>` | `<A\|B\|C>` | `<target or stub>` | `<path>` |

(Empty when the project has no re-export dead-ends.)

## Icon-import style (project-wide lock)

This project uses **Option `<A|B>`** per §1.1.2:
- Option A → `import { Add } from '@carbon/icons-react'`
- Option B → `import { Add } from '@carbon/react/icons'`

The lock is persisted at `.carbon-migration/icon-import-style.txt`. Any new
icon import in this project MUST use the matching path.

## Dependency changes (scope)

The Carbon Migrate v10 → v11 migration class changes Carbon-related deps
and source code. It does NOT touch:

- React (kept at `<react-version>`)
- react-router-dom (kept at `<react-router-version>`)
- Application-runtime deps (i18next, redux, etc.)

It MAY adjust build/test toolchain deps when that is required to keep the
project installable: if §0.3 bumped `react-scripts` (CRA + Dart Sass), the
coupled `jest` / `ts-jest` / `@types/jest` / `babel-jest` and `typescript`
are reconciled to a mutually-satisfiable set (see §1.2). Any such change is
recorded in `.carbon-migration/dependency-health.json` and commit history;
unresolved dependency failures are recorded as deviations.

## How to install

Run:

    npm install

The toolchain peer graph was reconciled deterministically during the migration,
so a **bare** install resolves cleanly — no `--legacy-peer-deps`, no `--force`.
If a bare install still fails, that is a blocking `[toolchain-install-failed]`
deviation in `DEVIATIONS_FOR_REVIEW.md`: the project does not install cleanly
and that must be fixed, not masked.

## Where to look for more

- Per-unit deviations: `DEVIATIONS_FOR_REVIEW.md` (consolidated by `deviation-completeness-audit`)
- Per-unit self-audits: `.carbon-migration/CARBON_MIGRATION_LEDGER.md`
- Migration map used: `.carbon-migration/migration-context/maps/carbon-v10-to-v11.md`
```

If the `MIGRATION_FACTS.md` template emission fails (file system error, etc.), log a `[migration-facts-not-written]` deviation. The migration still completes — this file is best-effort.

### 1.2 Install + peer-dep gate

After editing `package.json` (using `$PM` from §0.4), the toolchain peer graph is reconciled deterministically and installed **without masking**:

```bash
$PM install
```

**No `--legacy-peer-deps`.** A bare install MUST resolve cleanly. When a build-toolchain anchor is bumped (e.g. `react-scripts` 3→5 per §0.3), the coupled jest ecosystem (`jest`, `ts-jest`, `@types/jest`, `babel-jest`, `jest-environment-*`) and `typescript` are reconciled to a mutually-satisfiable set **derived from the packages' published `peerDependencies`** by `src/services/reconcileToolchainPeerDeps.js`, which the supervisor runs deterministically at the end-of-migration build-fix step (before the build). Registry-deprecated-and-superseded packages (e.g. `jest-dom` → `@testing-library/jest-dom`) and obsolete shims (e.g. `jest-environment-jsdom-sixteen`, made redundant once jest ≥27 ships its own env) are dropped.

This **replaces the former `--legacy-peer-deps` default**, which masked exactly the `react-scripts@5`-induced jest skew (`ts-jest@26`/`jest@24`) and shipped a project that did not install — mislabelling a migration-introduced break as a "pre-existing skew" (field incident carbon-v10-charts-test, 2026-06-02).

If a bare install STILL fails after reconciliation, that is a **blocking** `[toolchain-install-failed]` deviation (NOT advisory): the migrated project does not install cleanly, the deviation gate goes red, and convergence cannot be claimed until it is fixed. Continue the run per Criterion 1, but the job is not "done".

### 1.3 Deviation triggers

- Package was imported from a CDN rather than npm — log how the CDN path was migrated.
- Repo re-exported Carbon components through a wrapper module — update the wrapper's imports; log if the wrapper's API changes.
- Package was at a pinned exact version (no caret) — preserve the pinning style and log it.

### 1.4 Re-export dead-ends: preserve the public surface, never silently drop

> **Applies when** a public entry point (`main` / `module` / `exports` / top-level `index.*`) re-exports names from a third-party package — explicitly (`import { A } from '<pkg>'; export { A }`) **or** via `export *` — and that package has **no version whose peer/dependency graph is compatible with the target major**. Detect by reading the package's declared `peerDependencies`/`dependencies` against the target (e.g. `@carbon/ibm-cloud-cognitive-cdai` peers `carbon-components-react@^7` / `carbon-components@^10`, so no published version resolves against Carbon v11) — **NOT** by "the package has no high-semver release" (it may publish many versions, all target-incompatible).

**Rule — never silently narrow the public surface.** A re-export dead-end is a **public-API contract** that the package's consumers depend on. Commenting it out with a `MIGRATION NOTE` and removing the package is **NOT a terminal state** and is **NOT an owner-sanctioned drop** — it silently narrows the public surface and crashes consumers at runtime with `undefined` (e.g. `Cannot read properties of undefined (reading 'onClick')`). Every original export **name** must still resolve to a defined, render-safe binding post-migration. Route each name through a generated **compatibility layer**; a silent removal is prohibited. (A prior team branch that merely commented the block out is *evidence of the unsolved problem*, not a sanctioned resolution.)

**Per-unit note.** If your unit's scope includes the entry point but you cannot install/verify a successor package inside a narrow per-unit scope, do the safe part (preserve every name you can via Bucket A or a render-safe stub) and leave successor-wrapper generation for the repo-level final-refinement pass — but **do not** leave the entry point in a commented-out / narrowed state as your terminal result.

**Successor & equivalence discovery (library-agnostic).** Resolve the successor package + per-name equivalents in this order, falling through on miss:
1. **GESTALT-recorded** successor/equivalence facts, if the premise generator captured them.
2. **Map lookup** keyed by source-package name — for `@carbon/ibm-cloud-cognitive-cdai`, see `maps/carbon-v11-ibm-products.md` (cdai `Ide*` lookup).
3. **Registry metadata** — `npm view <pkg> repository.url` / `homepage` / `deprecated` (a deprecation string often names the replacement). Example: cdai's `repository.url` = `github.com/carbon-design-system/ibm-products` → `@carbon/ibm-products` is the Bucket-B candidate.
4. **`carbon-builder` / Carbon MCP** (§0.1 ladder) for Carbon-family successors and per-name verification.
5. None resolve → **Bucket C**.

**Decision ladder (per exported name) — prefer a REAL component over a stub.**

> A name MUST be routed to Bucket A or B — a real, **defensively-wrapped** Carbon v11 component — whenever the successor lookup (`carbon-v11-ibm-products.md` cdai `Ide*` table) gives a target. Behavioral identity is NOT required: a real Carbon component that renders (even if styled differently from the CD/AI original) beats a blank stub, and the `CdaiSafe` error boundary (below) keeps it safe. **Bucket C is the LAST resort** — used ONLY when no core or successor target exists. Routing a name that HAS a known target to a `null` stub is a defect: it blanks UI that has a real equivalent (the all-stub result that motivated this revision). Stubbing every name is never the right answer when the lookup has targets.

- **Bucket A — core wrapper (no new dependency).** The lookup gives an equivalent already present in `@carbon/react` (e.g. `IdeButton→Button`, `IdeDataTable→DataTable`, `IdeNavigation→SideNav`, `IdeSideNavLink→SideNavLink`, `IdeSideNavMenu→SideNavMenu`). Render it through the **defensive wrapper** below — NOT a bare alias (a bare alias re-throws a prop mismatch as a new consumer error; the wrapper degrades to `null` instead). The per-unit FED that owns the entry point CAN and SHOULD do Bucket A (no install needed).
- **Bucket B — successor wrapper.** The equivalent lives in the discovered successor package (for Carbon: `@carbon/ibm-products` — e.g. `IdeEmptyState→EmptyState`, `IdePageHeader→PageHeader`, `IdeCreate→CreateTearsheet`, `IdeAPIKeyGeneration→APIKeyModal`, `IdeHTTPErrors→FullPageError`, `IdeSlideOverPanel→SidePanel`, `IdeCard→ProductiveCard`). Add it **pinned** (exact version in `config/carbon-version-pins.json` → `carbon."@carbon/ibm-products"`; installed **only when Bucket B fires** — not in the §1.1 diff), and render it through the same defensive wrapper. Verify the target export name **and canary/feature-flag status** via `carbon-builder` (a canary component needs `pkg.component.<Name> = true` enablement or it renders nothing). Bucket B needs the dep installed, so a per-unit FED defers it to the repo-level final-refinement pass (which can install) — it does NOT stub a Bucket-B name; it leaves a Bucket-A-or-stub placeholder for final-refinement to upgrade.
- **Bucket C — recorded render-safe stub (LAST resort).** Use ONLY when the lookup has no core or successor target (for cdai: `IdeHome`, `IdeImporting`, `IdeAutoSave`, `IdeManualSave`, `IdeRemove`, `IdePageContent`, `IdeCreateStep`). Emit a typed stub returning `null` — a **defined binding** so the import is not `undefined` — **and** a recorded deviation. Do NOT stub a name that has a mapped target merely because its props differ; wrap it defensively instead.

**`export *` drift.** When `export * from '<pkgA>'` is rewritten to `export * from '<pkgB>'` (e.g. `carbon-components-react` → `@carbon/react`), any name `pkgB` no longer exports vanishes from the surface. Compute the removed set `exports(pkgA) \ exports(pkgB)` and route each removed name through the same ladder.

**The generated compatibility layer (defensive-wrapper artifact).** One module — `src/<…>/<source-pkg>-compat.<ext>` (incident: `cdai-compat.tsx`) — re-exported from the entry point in place of the original block, preserving **exact** export names. Wrap every Bucket-A/B target in a per-component **error boundary** so a real component that would throw (prop mismatch, missing required prop) degrades to `null` instead of crashing the consumer. This is exactly what makes "render the real component" safe under Criterion 1 — real UI where the props line up, a safe blank only where they genuinely don't, never a new crash:

```tsx
// AUTOGENERATED compat layer — preserves the <source-pkg> public re-export surface.
// Regenerated from MIGRATION_FACTS.md; do NOT hand-delete.
import React from 'react';
import { Button, DataTable, SideNav, SideNavLink, SideNavMenu } from '@carbon/react';
import { EmptyState, PageHeader } from '@carbon/ibm-products';   // Bucket B (added pinned)

// Renders the real component, but falls back to null if it throws — a defined,
// render-safe binding (no `undefined` crash, and no NEW render error from prop drift).
class CdaiSafe extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
const wrap = (C: React.ComponentType<any>): React.FC<any> =>
  (props) => <CdaiSafe><C {...props} /></CdaiSafe>;

// Bucket A — real @carbon/react components (defensively wrapped, no new dep)
export const IdeButton = wrap(Button);
export const IdeDataTable = wrap(DataTable);
export const IdeNavigation = wrap(SideNav);
// …IdeSideNavLink, IdeSideNavMenu
// Bucket B — real @carbon/ibm-products successors (defensively wrapped)
export const IdeEmptyState = wrap(EmptyState);
export const IdePageHeader = wrap(PageHeader);
// …IdeCreate, IdeAPIKeyGeneration, IdeHTTPErrors, IdeSlideOverPanel, IdeCard
// Bucket C — render-safe stubs ONLY where no successor exists
export const IdeHome: React.FC<any> = () => null;
// …IdeImporting, IdeAutoSave, IdeManualSave, IdeRemove, IdePageContent, IdeCreateStep
```

- **Bounded progress (Criterion 1) — two independent safety nets.** The `CdaiSafe` boundary covers the RUNTIME risk (a real wrapped component that throws renders `null`, never crashes the consumer). Bounded-progress covers the BUILD risk: if a Bucket-A/B wrapper does not build/type-check after two consecutive remediation iterations, **downgrade that single name to a Bucket-C `null` stub** and log `[compat-wrapper-degraded]` — never loop, never block `done`. A defined render-safe binding always beats a type-correct one.
- **Idempotent.** Regenerate the whole module from the `MIGRATION_FACTS.md` manifest (§1.1.4) each pass — overwrite, never append; never re-parse the already-rewritten barrel.

**Recording (never silent).** Record every dead-end in `MIGRATION_FACTS.md` (the regeneration manifest: original name → bucket → target) and `DEVIATIONS_FOR_REVIEW.md` (Bucket B/C entries + prop caveats). A removed public export with no covering compat binding is a `[public-export-narrowed]` deviation — **informational, never blocking; the migration ALWAYS advances** (Criterion 1 / §8.1 doctrine).

**Posture.** The per-name ladder is biased by the job's `reexportPreservation` posture — `successor-first` (default for `library` / `carbon-version-upgrade`), `core-first`, or `stub-only` — surfaced from the class profile. `successor-first` prefers the behavior-restoring successor (B) over a thin core alias when both exist; `stub-only` never adds the successor dep.

---

## §2 — Import path migration (mechanical)

The agent rewrites import strings directly. No codemod dependency.

### 2.1 JavaScript / TypeScript imports

| v10 import source | v11 import source |
|---|---|
| `from 'carbon-components-react'` | `from '@carbon/react'` |
| `from 'carbon-components-react/lib/components/<X>'` | `from '@carbon/react'` (named import) |
| `from '@carbon/icons-react'` (with `Name32`-style suffix) | Per §1.1.2: either `from '@carbon/icons-react'` (Option A) or `from '@carbon/react/icons'` (Option B). Drop size suffix from name; use `size` prop (§6.1). |
| `from 'carbon-icons'` | Remove — package is end-of-life. Replace usages with `from '@carbon/react/icons'`. |
| `from '@carbon/themes'` (v10) | Prefer `@use '@carbon/react/scss/theme'` in SCSS; for JS bindings, `@carbon/themes@^11.x`. |
| `from '@carbon/colors'` (v10) | Prefer `@use '@carbon/react/scss/colors'`; for JS, `@carbon/colors@^11.x`. |
| `from '@carbon/icons'` v10 | `from '@carbon/icons'` v11 (rare; only for vanilla JS consumers). |

Bounded rewrite (using `sed -E`, BSD/GNU-portable):

```bash
sed -E -i.bak \
  -e "s|from ['\"]carbon-components-react['\"]|from '@carbon/react'|g" \
  -e "s|from ['\"]carbon-components-react/lib/[^'\"]+['\"]|from '@carbon/react'|g" \
  <JS_TS_FILES>
```

### 2.2 SCSS imports

```diff
- @import 'carbon-components/scss/globals/scss/styles.scss';
+ @use '@carbon/react';
```

**MANDATORY — Carbon v11 styles are consumed as SCSS, never pre-compiled
CSS.** Import Carbon only through Sass `@use` of its SCSS entrypoints. Do
NOT import `@carbon/styles/css/...`, `@carbon/charts/styles/styles.scss`,
or any other `.css` / pre-compiled build artifact: the compiled CSS bakes
in webpack-era asset paths (notably `~@ibm/plex/...` `@font-face` URLs)
that Vite / Dart Sass cannot resolve — IBM Plex then 404s at runtime and
the app falls back to a system typeface. Consume the SCSS and configure
the font path to a bare, bundler-resolvable package specifier:

```scss
@use '@carbon/react' with (
  $font-path: '@ibm/plex'   // IBM Plex @font-face URLs resolve via the package
);
@use '@carbon/charts/scss' as charts;   // charts SCSS source — NOT styles/styles.scss
```

Verify the exact configurable variable name (`$font-path` vs a
version-specific alternative) against the installed `@carbon/styles` via
the §0.1 tier ladder before writing it. The principle is fixed: **SCSS
in, never compiled CSS; the font path set to a specifier the bundler can
resolve.**

Granular SCSS subpath map (use `@use … as *` so the un-prefixed token names work):

| Asset | v11 subpath |
|---|---|
| Type tokens | `@use '@carbon/react/scss/type' as *;` |
| Theme tokens | `@use '@carbon/react/scss/theme' as *;` |
| Theme mixins | `@use '@carbon/react/scss/themes' as *;` |
| Colors | `@use '@carbon/react/scss/colors' as *;` |
| Spacing | `@use '@carbon/react/scss/spacing' as *;` |
| Breakpoints | `@use '@carbon/react/scss/breakpoint' as *;` |
| Motion | `@use '@carbon/react/scss/motion' as *;` |
| Convert functions (rem, etc.) | `@use '@carbon/react/scss/utilities/convert' as *;` |
| Z-index | `@use '@carbon/react/scss/utilities/z-index' as *;` |
| Focus outline | `@use '@carbon/react/scss/utilities/focus-outline' as *;` |
| Rotate | `@use '@carbon/react/scss/utilities/rotate' as *;` |
| Skeleton | `@use '@carbon/react/scss/utilities/skeleton' as *;` |
| Reset CSS | `@use '@carbon/react/scss/reset';` |
| Per-component (e.g. button) | `@use '@carbon/react/scss/components/button';` |
| Per-component tokens (e.g. `$button-primary`) | `@use '@carbon/react/scss/components/button/tokens' as *;` (see §3.7.1) |

**`@use '@carbon/react'` is required and emits all CSS — the token subpaths are optional and emit none.** Only `@use '@carbon/react'` emits *compiled CSS*: every component's styles, the reset, type, and the IBM Plex `@font-face` rules. It is REQUIRED — without it Carbon components render completely unstyled. The granular token subpaths in the table above (`scss/type`, `scss/theme`, `scss/spacing`, `scss/breakpoint`, …) emit **no CSS at all** — they only expose SCSS variables / mixins for *your own* custom SCSS to consume. Add a token subpath `@use` ONLY when an editable `.scss` file actually references that token family; carrying an unused token `@use` forward is harmless but noise. Because `@use '@carbon/react'` already delivers IBM Plex, a React SCSS project needs **no separate font CDN link** — adding a `<link>` to a font CDN, or a Google-Fonts `@import`, is wrong.

#### Carbon Charts SCSS entry — exact subpath (MANDATORY)

The v10 `@import '@carbon/charts/styles/styles.scss';` migrates to a
v11 `@use`. **Use one of the EXACT subpaths the `@carbon/charts@^1.x`
package's `exports` field exposes — do NOT guess:**

```scss
@use '@carbon/charts/scss' as charts;          // ✅ use this — SCSS source
// also valid (SCSS): @use '@carbon/charts/scss/index.scss' as charts;
// ❌ NOT this: @use '@carbon/charts/styles/styles.scss' — pre-compiled CSS;
//    bakes webpack ~@ibm/plex font URLs that 404 under Vite (§2.2 SCSS-only rule)
```

`@use '@carbon/charts/scss/index'` (no `.scss` extension) is **NOT** in
the package's `exports` map — Sass fails with
`Missing "./scss/index" specifier in "@carbon/charts" package`. The
extension-less `scss/index` form does not resolve; use the bare
`@carbon/charts/scss` form. If unsure, `cat node_modules/@carbon/charts/package.json`
and read the `exports` keys — only those subpaths are importable.

Configuration via `with()`:

```scss
@use '@carbon/react' with (
  $css--default-type: true,
  $css--reset: true,
  // optional: keep .bx-- prefix during phased migration
  // $prefix: 'bx',
);
```

**Theme config takes a map variable, never a string.** If the migration configures the Carbon theme in SCSS (`@use '@carbon/styles/scss/theme' with ($theme: …)`), `$theme` must be a theme **map variable** — `$white`, `$g10`, `$g90`, `$g100` — imported first from `@carbon/styles/scss/themes`. A string (`$theme: 'white'`) fails at compile time with `$map2: "white" is not a map`; `$theme: $white` is correct. (That is the SCSS theme config — distinct from the React `<Theme theme="white">` component in §7.10, which *does* take a string.)

Feature flags in v10 (`unstable_*`, `enable_*`) can be removed in v11 unless the repo opts in to specific v11 feature flags explicitly.

### 2.3 Sass `includePaths`

Add `node_modules` to Sass include paths so `@use '@carbon/react'` resolves.

**Vite:**
```javascript
// vite.config.js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { includePaths: ['node_modules'] },
    },
  },
});
```

**Webpack (sass-loader):**
```javascript
{
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    { loader: 'sass-loader', options: { sassOptions: { includePaths: ['node_modules'] } } },
  ],
}
```

### 2.4 Side-effect CSS imports

```diff
- import 'carbon-components/css/carbon-components.css';
+ // remove — use @use '@carbon/react' in your SCSS entry instead
```

If the project genuinely cannot use Sass (CSS-only consumer), use `@carbon/styles/css/styles.css` as the JS-side import. This is rare for React projects.

<!-- load-gate: project_uses_carbon_charts -->
### 2.5 Carbon Charts v0.x → v1.x migration

> **Skip §2.5 entirely** unless the project's `package.json` has `@carbon/charts` or `@carbon/charts-react` in `dependencies` or `devDependencies`. Check the project's deps and skip this section if the charts packages are absent. (This gate is applied by the reading agent, not by automated prompt assembly — see INDEX.md "Conditional sub-section gating".)

The migration upgrades `@carbon/charts` and `@carbon/charts-react` from 0.40.x → 1.27+. Several v0.x API/asset surfaces are gone in v1.x.

#### 2.5.1 Themed SCSS entry-points are removed

v0.x shipped these for setting chart theme via SCSS:

- `@carbon/charts/styles-g100`
- `@carbon/charts/styles-g90`
- `@carbon/charts/styles-g10`
- `@carbon/charts/styles-white`

v1.x ships ONE entry-point:

- `@carbon/charts/scss` (SCSS source) or `@carbon/charts/styles.css` (CSS)

Theme is now applied via the `data-carbon-theme="<g100|g90|g10|white>"` attribute on the chart wrapper. The chart's own SCSS uses CSS custom properties scoped by that attribute.

Find/replace pattern (FED):

```diff
- .g100 { @import '~@carbon/charts/styles-g100'; }
- .g90  { @import '~@carbon/charts/styles-g90'; }
- .g10  { @import '~@carbon/charts/styles-g10'; }
+ @use '@carbon/charts/scss/index' as *;
```

Verify: theming code that sets `<div className={chartTheme}>` should also set `data-carbon-theme={chartTheme}`. Search for `chartTheme` references and adjust both the className AND the attribute.

#### 2.5.2 Axes config: drop `primary` / `secondary`

v0.x used:

```ts
axes: {
  left:   { primary: true,  mapsTo: 'value' },
  bottom: { secondary: true, mapsTo: 'key', scaleType: 'labels' }
}
```

v1.x:

```ts
axes: {
  left:   { mapsTo: 'value' },
  bottom: { mapsTo: 'key', scaleType: 'labels' }
}
```

The `primary` and `secondary` keys are silently ignored AND emit a console warning. Grep:

```bash
grep -rn "primary: true\|secondary: true" --include="*.ts" --include="*.tsx" <SRC>
```

Any match in a chart options object: remove the key. Log a `[charts-axes-primary-secondary-dropped]` deviation per removed key.

#### 2.5.3 Don't double-import the styles

After §2.5.1 brings styles in via SCSS, search for any remaining JS-side `import '@carbon/charts/styles.css';` (or `.scss`) and remove it — the SCSS path already includes everything. Pattern:

```bash
grep -rn "import .* '@carbon/charts/styles" --include="*.ts" --include="*.tsx" <SRC>
```

#### 2.5.4 ESM bundles require modern build tools

`@carbon/charts@^1.x` and `@carbon/charts-react@^1.x` ship ESM with TypeScript class fields (`chart;`) unmodified. CRA 3's babel-loader on `node_modules` does NOT transform these. If `react-scripts <5` is in the project, §0.3 ALREADY prescribes the bump to `^5.0.1`. If the project cannot bump, fall back to a `react-app-rewired` + `config-overrides.js` shim so CRA's babel-loader transforms the Carbon Charts ESM class fields under `node_modules`. This shim is applied manually — it is not bundled with the migrator.

<!-- /load-gate -->

---

## §3 — Color token migration (PRIMARY FAILURE MODE)

> **Volume-of-bugs note.** Color tokens are the single largest source of v10 → v11 migration churn. Every component that uses theme color has at least one token; every page-level custom style references several. Get this section right and the build is half-fixed.

### 3.1 Naming-convention change

- v10: numbered tokens for most categories (`$text-01`, `$ui-01`, `$icon-01`, `$interactive-01`, `$inverse-01`, `$support-01`…).
- v11: numbered tokens **only for layering categories** (`$layer-01/02/03`, `$layer-accent-01/02/03`, `$field-01/02/03`, `$border-subtle-00/01/02/03`, `$border-strong-01/02/03`). Everything else uses adjective-descriptor naming (`$text-primary`, `$icon-secondary`, `$support-success`, `$button-primary`, `$background-inverse`…).

The new naming convention is **`[element]-[role]-[order]-[state]`**.

### 3.2 High-frequency v10 → v11 SCSS variable renames

Rows marked `⚠️ verify` are model-inferred and MUST be confirmed via the tier ladder (§0.1) BEFORE applying. The rest are confirmed against Carbon docs / MCP as of `Last updated`.

| v10 SCSS variable | v11 SCSS variable | Notes |
|---|---|---|
| `$ui-background` | `$background` | Page background. |
| `$ui-01` | `$layer-01` | First container layer. |
| `$ui-02` | `$layer-02` | Second container layer. |
| `$ui-03` | `$layer-accent-01` | Accent / tertiary layer. |
| `$ui-04` | `$border-strong-01` | ⚠️ verify: could be `$border-strong` (no number). Default to `$border-strong-01` for borders adjacent to `$field-01`. |
| `$ui-05` | `$text-primary` *or* `$border-inverse` | ⚠️ verify: text usage → `$text-primary`; border usage → `$border-inverse`. Log `[ambiguous-token]`. |
| `$text-01` | `$text-primary` | Primary text / body / headers. |
| `$text-02` | `$text-secondary` | Secondary text / labels. |
| `$text-03` | `$text-placeholder` | Placeholder text. |
| `$text-04` | `$text-on-color` | Text on colored / button backgrounds. |
| `$text-05` | `$text-helper` | Helper text. |
| `$text-error` | `$text-error` | Unchanged. |
| `$icon-01` | `$icon-primary` | Primary icons. |
| `$icon-02` | `$icon-secondary` | Secondary icons. |
| `$icon-03` | `$icon-on-color` | Icons on colored backgrounds. |
| `$interactive-01` | `$button-primary` | Primary button color. |
| `$interactive-02` | `$button-secondary` | Secondary button color. |
| `$interactive-03` | `$button-tertiary` | Tertiary button color. |
| `$interactive-04` | `$interactive` | ⚠️ verify: could be `$background-brand` or `$button-primary`. Log `[ambiguous-token]`. |
| `$inverse-01` | `$background-inverse` | Inverse background. |
| `$inverse-02` | `$text-inverse` | Inverse text. |
| `$inverse-link` | `$link-inverse` | Inverse links. |
| `$inverse-hover-ui` | `$background-inverse-hover` | Inverse hover. |
| `$inverse-support-01` | `$support-error-inverse` | Inverse error. |
| `$inverse-support-02` | `$support-success-inverse` | Inverse success. |
| `$inverse-support-03` | `$support-warning-inverse` | Inverse warning. |
| `$inverse-support-04` | `$support-info-inverse` | Inverse info. |
| `$field-01` | `$field-01` | Unchanged — layering category preserves number. |
| `$field-02` | `$field-02` | Unchanged. |
| `$support-01` | `$support-error` | Error / invalid state. |
| `$support-02` | `$support-success` | Success / on state. |
| `$support-03` | `$support-warning` | Warning. |
| `$support-04` | `$support-info` | Information. |
| `$focus` | `$focus` | Unchanged. |
| `$hover-primary` | `$button-primary-hover` | |
| `$hover-secondary` | `$button-secondary-hover` | |
| `$hover-tertiary` | `$button-tertiary-hover` | |
| `$active-primary` | `$button-primary-active` | |
| `$active-secondary` | `$button-secondary-active` | |
| `$active-tertiary` | `$button-tertiary-active` | |
| `$hover-primary-text` | `$link-primary-hover` | |
| `$hover-row` | `$layer-hover-01` | Table row hover. |
| `$hover-ui` | `$background-hover` | UI hover. |
| `$active-ui` | `$background-active` | UI active. |
| `$selected-ui` | `$background-selected` | UI selected. |
| `$selected-light-ui` | `$layer-selected-01` | Light selected layer. |
| `$hover-selected-ui` | `$background-selected-hover` | |
| `$disabled-01` | `$layer-01` | ⚠️ verify: v11 retired most disabled tokens; layer-01 is the typical fallback. May also map to `$background` per context. |
| `$disabled-02` | `$button-disabled` | |
| `$disabled-03` | `$text-on-color-disabled` | |
| `$visited-link` | `$link-visited` | |
| `$link-01` | `$link-primary` | |
| `$link-02` | `$link-secondary` | |
| `$skeleton-01` | `$skeleton-background` | Skeleton containers. |
| `$skeleton-02` | `$skeleton-element` | Skeleton text/elements. |
| `$brand-01` | `$background-brand` | Brand background. |
| `$brand-02` | `$interactive` | ⚠️ verify: could be `$background-brand-active`. |
| `$brand-03` | `$focus` | ⚠️ verify: brand-03 absorbed by focus token in v11. |
| `$danger` | `$button-danger-primary` | Danger primary (confirmed via Button style docs). |
| `$danger-01` | `$button-danger-primary` | Danger primary (confirmed via Button style docs). |
| `$danger-02` | `$button-danger-secondary` | Danger ghost/tertiary (confirmed via Button style docs). |
| `$overlay-01` | `$overlay` | Overlay / modal scrim. |
| `$decorative-01` | `$border-subtle-00` | Decorative borders. |
| `$highlight` | `$highlight` | Unchanged. |
| `$toggle-off` | `$toggle-off` | Unchanged. |

> **Unknown v10 token? Apply the tier ladder (§0.1) before substituting. Never invent a rename.**

### 3.3 CSS custom property renames (parallel to §3.2)

The v11 SCSS variables emit CSS custom properties prefixed with `--cds-`. Every rename in §3.2 has a parallel `--cds-` rename: `$text-01` → `$text-primary` implies `--cds-text-01` → `--cds-text-primary`, and so on.

```diff
- color: var(--cds-text-01);
+ color: var(--cds-text-primary);
```

### 3.4 Tokens / SCSS functions REMOVED — documented mechanical substitutions (no deviation)

These v10 tokens / functions have no 1:1 v11 export — but where v10's definition is a fixed numeric expansion, the substitution is **mechanical** and emits byte-equivalent CSS. Apply mechanically; do NOT log a deviation (per §10.0 rule 1: documented substitutions are the spec, not deviations):

- `$disabled-background-color` — disabled is now theme-driven via opacity; use `$button-disabled` / `$text-on-color-disabled` per context.
- `$tooltip-background` — tooltip uses inverse background (`$background-inverse`).
- `$disabled` (bare) — see disabled-* renames in §3.2.
- `carbon--mini-units(N)` (Sass function) — v11 retired `mini-units()` to UI Shell internals. **Mechanical substitution: replace with `(N * 0.5rem)`** (the v10 definition was `$N * $carbon--spacing-04`, i.e. `N * 0.5rem`; the expanded numeric form is byte-equivalent). Apply mechanically. **No deviation.** Surfaced 2026-05-23, epoch 17: prior wording told the FED to log a `[removed-token]` deviation for `mini-units(80)` — that broke the zero-deviation gate even though the substitution is mechanically determined.

**When to log `[removed-token]` and when not.** If the removed token / function HAS a documented mechanical substitution above → apply it; NO deviation. If the removed token / function does NOT have a documented substitution AND the FED has to invent one → log a `design` deviation tagged `[removed-token]` with the file path and chosen substitute. The presence of a substitution in this section is the test for "documented" — anything not listed needs a deviation, anything listed does not.

### 3.5 SCSS function/mixin prefix removal

Independent of the variable renames: every Carbon SCSS function or mixin used the `carbon--` prefix in v10. v11 removed it.

```diff
- @include carbon--breakpoint(lg) { width: 42%; }
+ @include breakpoint(lg) { width: 42%; }
```

**Bounded find/replace** — do NOT use a plain string substitution. Use a regex that matches `carbon--` only when it's preceded by `@include `, `@function `, or `$` (the three places it legitimately appears in v10 Sass). This avoids mangling user-authored class names like `.my-carbon--component`:

```bash
# In editable SCSS files only:
find <SCSS_DIR> -name "*.scss" -exec sed -E -i.bak \
  's/(@include |@function |\$)carbon--/\1/g' {} \;
```

Second pass for bare function calls like `carbon--rem(16px)`:

```bash
find <SCSS_DIR> -name "*.scss" -exec sed -E -i.bak \
  's/(^|[^a-zA-Z0-9_-])carbon--(rem|em)\(/\1\2(/g' {} \;
```

Clean up backups:

```bash
find <SCSS_DIR> -name "*.scss.bak" -delete
```

The `\b`-equivalent boundary above (`[^a-zA-Z0-9_-]`) is safe in BSD/GNU `sed`. Examples this fixes: `@include carbon--breakpoint` → `@include breakpoint`, `@include carbon--type-style` → `@include type-style`, `$carbon--spacing-05` → `$spacing-05`, `carbon--rem(16px)` → `rem(16px)`.

### 3.6 Layout / spacing / type tokens

These categories changed differently from color tokens:

**Spacing tokens — UNCHANGED.** `$spacing-01` through `$spacing-13` are the same in v10 and v11. No migration needed.

**Type tokens — UNCHANGED for the productive/expressive families.** `$body-01`, `$body-02`, `$body-compact-01`, `$body-compact-02`, `$heading-01` through `$heading-07`, `$heading-compact-01`, `$heading-compact-02`, `$label-01`, `$label-02`, `$helper-text-01`, `$helper-text-02`, `$code-01`, `$code-02` are all valid in v11. Verified via MCP.

Some less-common v10 type tokens were retired (e.g. `$expressive-heading-01` through `$expressive-heading-06`, `$productive-heading-01` through `$productive-heading-07`). When encountered, apply the tier ladder to find the modern equivalent (usually `$heading-NN` or `$heading-compact-NN`).

**Layout tokens — DEPRECATED.** v10's `$layout-01` through `$layout-07` were removed in v11 — the spacing scale subsumed them.

| v10 layout token | v11 equivalent (verify) |
|---|---|
| `$layout-01` | `$spacing-05` ⚠️ verify |
| `$layout-02` | `$spacing-06` ⚠️ verify |
| `$layout-03` | `$spacing-07` ⚠️ verify |
| `$layout-04` | `$spacing-09` ⚠️ verify |
| `$layout-05` | `$spacing-10` ⚠️ verify |
| `$layout-06` | `$spacing-12` ⚠️ verify |
| `$layout-07` | `$spacing-13` ⚠️ verify |

These rows are `⚠️ verify` — confirm via MCP if a repo uses layout tokens heavily.

### 3.7 Component tokens

v10 emitted component-specific tokens that v11 reorganized. Common ones:

| v10 component token | v11 equivalent |
|---|---|
| `$tooltip-background` | `$background-inverse` |
| `$tooltip-text` | `$text-inverse` |
| `$tag-background` (variants) | v11 emits per-color tag tokens (`$tag-background-red`, etc.); see Carbon Tag style docs. |
| `$notification-background-error` | Use `$support-error` for icon/border; notification background uses theme `$background` + status accent. ⚠️ verify per notification type. |
| `$accordion-flex-direction` | Removed in v11 (Accordion API restructured). |

For any component token not listed: apply the tier ladder (§0.1) — `docs_search { query: "<component> style tokens" }` returns the v11 token list for each component.

#### 3.7.1 Component tokens require a component-scoped `@use` — MANDATORY

v11 **theme** tokens (`$background`, `$layer-01`, `$text-primary`,
`$text-helper`, `$focus`, `$border-*`, `$spacing-*`, …) are available
after `@use '@carbon/react/scss/theme' as *;`.

**Component-scoped tokens are NOT.** Tokens such as `$button-primary`,
`$button-primary-hover`, `$button-secondary`, `$button-tertiary`,
`$button-disabled`, `$button-danger-*`, `$tag-*`, `$notification-*` live
in **per-component token modules**, not the theme module. Referencing
`$button-primary` after only `@use '...theme'` fails the build with
`Error: Undefined variable`.

When migrated SCSS references a component-scoped token, add the matching
component token `@use` at the top of the file:

```scss
@use '@carbon/react/scss/theme' as *;
@use '@carbon/react/scss/components/button/tokens' as *;   // $button-primary, etc.
@use '@carbon/react/scss/components/notification/tokens' as *; // $notification-*
@use '@carbon/react/scss/components/tag/tokens' as *;       // $tag-*
```

Subpath shape is `@carbon/react/scss/components/<component>/tokens`. If
unsure whether a token is theme- or component-scoped, apply the tier
ladder (§0.1): `docs_search { query: "<token-name> scss import" }`.
A token that the §8.3 build gate reports as `Undefined variable` is
component-scoped — add its component `tokens` `@use` and rebuild.

### 3.8 Prefer v11 tokens over hardcoded values (OPTIONAL improvement)

> **Scope note (see §10.0).** This section is an *optional* fidelity
> improvement, NOT a required transformation. A value that was a **v10
> Carbon token** in the source MUST be migrated to its v11 token (that's
> §3.2, required). A value that was **hardcoded hex/rem in the v10
> source** is pre-existing non-Carbon code — tokenising it is encouraged
> when cheap, but **skipping it is not a deviation** and must not be
> logged as one.

When a migrated SCSS/CSS file hardcodes a value that has an exact Carbon
v11 token equivalent, prefer the token — a theme-aware surface survives
a `g90`/`g100` theme switch.

Apply to values that unambiguously map to a token:

| Hardcoded | v11 token (`@use '@carbon/react/scss/theme' as *;` etc.) |
|---|---|
| Carbon greys used as surfaces — `#161616` / `#262626` / `#393939` / `#f4f4f4` / `#ffffff` | `$background-inverse` / `$background-inverse-hover` / `$background-selected` / `$background` / `$text-on-color` — verify each via tier ladder |
| Focus blue `#0f62fe` / `#78a9ff` | `$focus` |
| Spacing literals `0.25rem 0.5rem 1rem 1.5rem 2rem 3rem` | `$spacing-02 / 03 / 05 / 06 / 07 / 09` (`@use '@carbon/react/scss/spacing' as *;`) |
| `font-size` / `font-weight` pairs matching a type scale | `@include type.type-style('<style>')` (`@use '@carbon/react/scss/type' as type;`) |

Guidance: this is a **SHOULD**, not a blanket find-replace. Only
substitute when the hardcoded value clearly corresponds to a token
(verify via tier ladder §0.1). Do not invent mappings for arbitrary
brand colors that have no Carbon equivalent — leave those, and log a
single `[token-drift-brand-color]` note if many remain.

---

## §4 — CSS class prefix migration

### 4.1 The prefix change

v11 changed the default class prefix from `bx` to `cds`. Every Carbon-emitted class is affected: `.bx--btn` → `.cds--btn`, `.bx--text-input` → `.cds--text-input`, and so on. **No class names changed beyond the prefix** — the segment after `--` is byte-identical.

### 4.2 Two migration options

**Option A — Update selectors (clean state).** Bounded find/replace (preferred):

```bash
find <FILES_DIR> \( -name "*.scss" -o -name "*.css" -o -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) \
  -exec sed -E -i.bak 's/(^|[^a-zA-Z0-9_-])bx--/\1cds--/g' {} \;
find <FILES_DIR> -name "*.bak" -delete
```

The `[^a-zA-Z0-9_-]` boundary above is honored by `sed -E` on both BSD and GNU.

**Option B — Preserve `bx` prefix (deferred cleanup).** Configure Carbon to keep emitting `bx--`:

```scss
@use '@carbon/react' with ($prefix: 'bx');
// or, when consuming styles only:
@use '@carbon/styles' with ($prefix: 'bx');
// or, on the config submodule:
@use '@carbon/styles/scss/config' with ($prefix: 'bx');
```

Option A is preferred for a clean migration. Option B is acceptable when there are many custom selectors targeting `bx--` and rewriting them all in this unit would balloon the diff. **Log a `design` deviation tagged `[prefix-override-kept]` when Option B is used** so a future cleanup unit knows the prefix was deferred.

### 4.3 Custom CSS targeting Carbon inner elements

v11 applies `className` to the **outermost** element of components (see §7.2). Any custom CSS like:

```css
.MyForm .bx--text-input__field-wrapper input { … }
```

…may still work after the prefix swap, but if v11 changed the internal DOM tree (some components did), the selector breaks silently. Log a `design` deviation tagged `[style-approximation]` for any pre-existing custom selector you preserve.

**Sibling selectors (`~`, `+`) broken by new wrapper components.** Introducing `<Theme>` (§7.10) or `<Layer>` (§7.7) inserts an extra DOM node, which breaks custom CSS using sibling or adjacent combinators against the children. Example: `.bx--header ~ .bx--content { margin-top: 3rem; }` works in v10 (Header and Content are siblings) but breaks in v11 if Content is wrapped in `<Theme>` (now nested, not sibling). **Fix:** target a class on the wrapper or the inner element directly (`.app-content { margin-top: 3rem; }`) instead of relying on the sibling combinator. Log a `design` deviation tagged `[sibling-selector-broken]` for each affected selector.

---

## §5 — TypeScript type imports

### 5.1 Type packages

| v10 | v11 |
|---|---|
| `@types/carbon-components-react` (external types package, often outdated) | **Types ship with `@carbon/react` directly.** Uninstall `@types/carbon-components-react`. |

#### 5.1.1 Delete stale ambient icon-type shims — MANDATORY

Carbon v10's `@carbon/icons-react` did **not** ship TypeScript types, so
many v10 projects carry a hand-written **ambient declaration shim** — a
file like `src/types/carbon-icons-react.d.ts` containing:

```ts
declare module '@carbon/icons-react' {
  const Add16: ...; const ArrowRight16: ...;   // v10 sized names
}
```

Carbon v11's `@carbon/icons-react` (and `@carbon/react/icons`, which
does `export * from '@carbon/icons-react'`) **ships its own real
types**. A leftover ambient `declare module '@carbon/icons-react'`
**shadows** those real types — TypeScript then sees ONLY the shim's
stale v10 sized names and the build fails with
`'@carbon/react/icons' has no exported member 'Add'` /
`Did you mean 'ArrowRight16'?` for every modern bare icon name.

**Action (MANDATORY) — DELETE the file, do NOT migrate it.** If the
project has an ambient `.d.ts` that does `declare module
'@carbon/icons-react'` (or `'@carbon/react/icons'`), the **only** correct
action is to **`rm` the whole file**. Editing it, renaming the sized
constants (`Add16` → `Add`) to v11 bare names, or otherwise "migrating"
its contents is WRONG — any surviving `declare module` block still
shadows v11's real types and still breaks the build. v11 ships the real
types; this shim has no v11 purpose and must not exist post-migration.

This shim almost always lives in the `types` (or synthetic
`wu_shared_metadata`) unit's editable file set — **that unit owns the
deletion.** Detect every shim:

```bash
grep -rlE "declare module ['\"]@carbon/(icons-react|react/icons)['\"]" --include='*.d.ts' src/
```

Every match is a v10-era shim. **Delete each one (`rm`).** This is
*enforced*: the owning unit's §8.1 source-side leak gate (**Grep 8**)
re-runs this exact search, and the unit CANNOT reach `status: done`
while a match remains. Leaving the shim is the single most common cause
of a totally-broken v11 icon build — *every* bare icon import (`Add`,
`Notification`, `Settings`, …) then fails with `has no exported member` /
`Did you mean 'Add16'?`, in `src/icons.ts` **and** in every consumer.

Deletion is safe: after migration nothing should still import the
standalone `@carbon/icons-react` package (icons resolve via
`@carbon/react/icons`, §1.1.2). If §8.1 Grep 1 / Grep 7 still show a
real `@carbon/icons-react` *import*, migrate that import first (§6.3),
THEN delete the shim.

### 5.2 Type-import pattern

**Default to `import type` syntax** — universally safe across all TypeScript versions ≥3.8:

```diff
- import { Button, ButtonProps } from 'carbon-components-react';
+ import { Button } from '@carbon/react';
+ import type { ButtonProps } from '@carbon/react';
```

**Alternative (TypeScript ≥4.5):** inline `type` modifier in a single import line:

```ts
import { Button, type ButtonProps } from '@carbon/react';
```

**Verify the TS version before choosing the inline form:**

```bash
node -e "try { console.log(require('./node_modules/typescript/package.json').version) } catch (_) { console.log('NOT_FOUND') }"
```

If ≥4.5, either form is acceptable. If <4.5 or `NOT_FOUND`, use the two-line form. **Default is the two-line form** — it's the safer choice.

### 5.3 Common type exports in v11

These are exported from `@carbon/react` (verify the exact name via the tier ladder if you need a specific one):

- `ButtonProps`, `IconButtonProps`
- `ModalProps`, `ComposedModalProps`
- `TextInputProps`, `TextAreaProps`, `NumberInputProps`, `PasswordInputProps`
- `DropdownProps`, `ComboBoxProps`, `MultiSelectProps`, `FilterableMultiSelectProps`
- `DataTableProps`, `DataTableHeader`, `DataTableRow`, `DataTableCell`
- `TileProps`, `ClickableTileProps`, `SelectableTileProps`, `ExpandableTileProps`
- `TagProps`, `TabsProps`, `TabProps`, `TabListProps`, `TabPanelProps`
- `NotificationProps`, `ActionableNotificationProps`, `ToastNotificationProps`, `InlineNotificationProps`
- `OverflowMenuProps`, `OverflowMenuItemProps`
- `AccordionProps`, `AccordionItemProps`
- `CheckboxProps`, `RadioButtonProps`, `RadioButtonGroupProps`, `ToggleProps`, `SwitchProps`
- `LinkProps`, `BreadcrumbProps`, `BreadcrumbItemProps`
- `PaginationProps`
- `SliderProps`
- `SearchProps`
- `DatePickerProps`, `DatePickerInputProps`, `TimePickerProps`, `TimePickerSelectProps`
- `FileUploaderProps`, `FileUploaderItemProps`, `FileUploaderDropContainerProps`, `FileUploaderButtonProps`
- `LoadingProps`, `InlineLoadingProps`, `ProgressBarProps`, `ProgressIndicatorProps`, `ProgressStepProps`
- `SkeletonTextProps`, `SkeletonPlaceholderProps`, `SkeletonIconProps`
- `HeaderProps` and the rest of the UIShell family
- `TooltipProps`, `DefinitionTooltipProps`, `PopoverProps`

For `@carbon/react/icons`, the icon component prop type is the React `SVGProps<SVGSVGElement>` augmented with `size`. Carbon does NOT export a public `IconProps` symbol from `@carbon/react/icons` — type icons via `React.ComponentType<…>` when needed.

> **Verify the type export name via the tier ladder (§0.1) before importing.** Common pitfalls: `IconProps` is not directly exported; `ListItemProps` doesn't exist; some prop types are namespaced (e.g. `DataTable.Header`).

---

## §6 — Icons

### 6.1 Size is now a prop, not part of the name

| v10 | v11 |
|---|---|
| `import { Add32, Add24, Add20, Add16 } from '@carbon/icons-react'` | `import { Add } from '@carbon/icons-react'` (Option A) or `from '@carbon/react/icons'` (Option B per §1.1.2) |
| `<Add32 />` | `<Add size={32} />` |

Mechanical rewrite: strip the trailing size digits from the import name; pass the size as a prop.

### 6.2 Anti-hallucination protocol for icons

**Step 0 — Read the project-wide icon-import-style lock (set by §1.1.3).** Before writing ANY icon import in this unit, read `.carbon-migration/icon-import-style.txt`:

```bash
ICON_STYLE=$(cat .carbon-migration/icon-import-style.txt 2>/dev/null | tr -d '[:space:]' || echo "B")
```

- `A` → use `from '@carbon/icons-react'` (Option A from §1.1.2 — package kept as direct dep)
- `B` → use `from '@carbon/react/icons'` (Option B from §1.1.2 — package removed; icons via @carbon/react)
- Missing/empty → default to `B`, log `[icon-import-style-default-fallback]` deviation noting the missing lock file

ALL icon imports in THIS unit MUST use the matching path. Do NOT make a per-file or per-icon choice — the project-wide lock is authoritative. If a file you're editing currently uses the OTHER style (e.g., lock says B but the file imports from `@carbon/icons-react`), rewrite it to match the lock.

**Step 1 — Apply the tier ladder (§0.1) for the icon EXPORT NAME.** The MCP `code_search` returns the authoritative export name. Concrete query:

```
code_search { query: "<noun phrase>", filters: { asset_type: "icon" }, size: 2 }
```

Then:
1. Use the returned `import` field for the export name (NOT the noun-phrase you searched for).
2. Use `import_stmt` verbatim for the import line.
3. If the search returns no plausible match, the icon may have been removed in v11 — log a `design` deviation tagged `[removed-icon]`; replace with the closest semantic icon and mark the file for DPR review.

**Do not substitute names from non-Carbon libraries.** `TrendingUp` (Material/Heroicons), `ChevronDown16`, `IconArrowRight`, `MdAdd`, etc. do NOT exist in Carbon. The Carbon name is usually plainer (e.g. Carbon has `Add`, not `Plus`; `Subtract`, not `Minus`).

### 6.3 Common renames (verified)

| v10 name | v11 name | Status |
|---|---|---|
| `AppSwitcher` | `Switcher` | Renamed |
| `Arrows` | `ArrowsVertical` | Renamed |
| `BackToTop` | `UpToTop` | Renamed |
| `CheckboxUndeterminate` | `CheckboxIndeterminate` | Renamed (typo fix) |
| `Delete` | `TrashCan` | Renamed |
| `EditFilter` | `FilterEdit` | Renamed |
| `LetterAaLarge` | `TextFont` | Renamed |
| `GlyphCaution` | `Caution` | Renamed |
| `GlyphCircleFill` | `CircleFill` | Renamed |
| `CloudLightning` | — | **Removed** |
| `CloudRain` | — | **Removed** |
| `CloudSnow` | — | **Removed** |
| `Sunny` | — | **Removed** |
| `LogoGoogle` | — | **Removed** |

Removed icons → log a `design` deviation tagged `[removed-icon]` with the location and the chosen replacement.

### 6.4 Icons passed as props

`<Button renderIcon={Add32}>` → `<Button renderIcon={Add}>` (no instantiation; Carbon passes `size` internally based on Button size). Verify with the tier ladder if the rendered icon looks wrong.

### 6.5 Snapshot tests

Snapshot tests for icons will diff because the rendered SVG now has a `size` attribute. Regenerate or update expectations.

### 6.6 Framework-specific icon packages (reference)

- React: `@carbon/icons-react@^11.x` (also re-exported from `@carbon/react/icons`)
- Angular: `@carbon/icons-angular`
- Vue: `@carbon/icons-vue`
- Svelte: `carbon-icons-svelte`
- Vanilla JS: `@carbon/icons`

---

## §7 — Component API migration

> Per-component prop maps and structural rewrites for components whose API changed in v11. The pattern: read each subsection before editing a file that uses that component; apply the tier ladder (§0.1) if anything looks ambiguous.

### 7.1 Size props (affects many components)

**Default size is now `md` (40 px).** Old booleans and short strings are replaced with explicit `size` values.

| Old prop / value | New | Pixel size |
|---|---|---|
| `small` (boolean) | `size="sm"` | 32 px |
| `field` | `size="md"` | 40 px |
| `medium` | `size="md"` | 40 px |
| `short` | `size="md"` | 40 px |
| `normal` | `size="lg"` | 48 px |
| `tall` | `size="lg"` | 48 px |
| — | `size="xs"` | 24 px (new) |
| — | `size="lg"` | 48 px (new) |
| — | `size="xl"` | 64 px (new) |
| — | `size="2xl"` | 80 px (new) |

> The v11 `size` prop is a **closed string enum** — `'xs' | 'sm' | 'md'
> | 'lg' | 'xl'` (and `'2xl'` on a few). v10 string values
> `"normal"` / `"short"` / `"tall"` / `"compact"` are **not** valid v11
> values and fail the build with `Type '"normal"' is not assignable to
> type '"lg" | "sm" | "md" | "xs" | "xl"'`. On `DataTable`/`Table`,
> v10 `size="normal"` → v11 `size="lg"`; `size="compact"` → `size="sm"`.
> Map EVERY occurrence — a stray v10 size string is a guaranteed
> TypeScript error.

**Components affected**: Accordion, Button, ComboBox, Dropdown, Multiselect, ContentSwitcher, DataTable, DatePicker, FileUploader, Link, Modal, NumberInput, OverflowMenu, Search, Select, Tag, TextInput, TimePicker, Toggle.

**Manual follow-up**: visual review of every size-bearing component. Default `md` (40 px) may change layout density on pages that implicitly relied on `small`. Log `design` deviations tagged `[style-approximation]` for any page where the visual density changes noticeably.

### 7.2 `className` application

In v11 the `className` prop is applied to the **outermost** element of the component. This breaks custom CSS selectors that targeted inner elements.

**Affected components**: Checkbox, ComboBox, Table, TableToolbar, DataTableSkeleton, DatePicker, DatePickerSkeleton, DatePickerInput, Dropdown, FileUploaderDropContainer, FileUploaderItem, FormGroup, FilterableMultiSelect, MultiSelect, NotificationTextDetails, NotificationIcon, NumberInput, OverflowMenuItem, RadioButtonGroup, RadioTile, Select, Slider, Switch, TextArea, ControlledPasswordInput, PasswordInput, TextInput, TimePicker, Tooltip, HeaderContainer.

**Manual follow-up**: find custom CSS selectors targeting inner elements of these components and adjust them. **Deviation trigger**: each component where custom CSS must be rewritten — log as `design` tagged `[style-approximation]`.

### 7.3 Notifications

`ToastNotification` and `InlineNotification` changed:
- Now have `role="status"` by default.
- **Children cannot contain interactive elements.** If you had a button inside a notification, move it out or switch to `ActionableNotification`.
- `notificationType` prop **removed**.
- `lowContrast` prop is **RETAINED** in v11 — it is a valid optional
  boolean on BOTH `InlineNotification` and `ToastNotification`
  (verified against `@carbon/react@1.74`'s
  `Notification.d.ts`). **Do NOT drop `lowContrast` during migration** —
  removing it is a visual regression, not an API-forced change. Carry
  the v10 value through unchanged.
- New `closeOnEscape` prop available.
- `InlineNotification`: `actions` prop **removed** (interactive actions
  now require `ActionableNotification`).

**New component**: `ActionableNotification` — for interactive actions.
- `role="alertdialog"`.
- Accepts `inline`, `actionButtonLabel`, `hasFocus`.

**Toast vs. inline — pick the right component (MANDATORY).** v11 keeps
`InlineNotification` and `ToastNotification` as distinct components for
distinct surfaces. Migrate to the one that matches the USE-CASE, do not
just keep whatever v10 used:

- **Transient, positioned, auto-dismissed confirmation** (a "toast" —
  e.g. `position: fixed` + a dismiss timer) → **`ToastNotification`**.
  `ToastNotification` carries an implicit `role="status"` live region so
  screen readers announce it. Using `InlineNotification` for this surface
  is a Carbon-purity miss AND an a11y miss (no live region).
- **Anchored within a form or content section** → `InlineNotification`.

If the v10 source used `InlineNotification` with fixed-position CSS +
an auto-dismiss timer, migrating it to `ToastNotification` is an
*encouraged* fidelity improvement — but it is **optional** (§10.0): the
v10 component choice is pre-existing, so keeping `InlineNotification`
is also a valid, complete v10→v11 result. **Whichever component is
kept, preserve its `lowContrast` value** — `lowContrast` is valid on
both (see the bullet above). Do **not** log a deviation for the toast
component choice.

**Deviation trigger**: every interactive notification (one with a
button/link child), one per location → `design` deviation.

### 7.4 Tabs

Structural rewrite — single component → composite:

**Before (v10):**

```jsx
<Tabs type="contained" selected={0}>
  <Tab label="First">First body</Tab>
  <Tab label="Second">Second body</Tab>
</Tabs>
```

**After (v11):**

```jsx
<Tabs selectedIndex={0} onChange={({ selectedIndex }) => setTab(selectedIndex)}>
  <TabList contained aria-label="List of tabs">
    <Tab>First</Tab>
    <Tab>Second</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>First body</TabPanel>
    <TabPanel>Second body</TabPanel>
  </TabPanels>
</Tabs>
```

**Prop changes**:

| Old prop | New prop / behavior |
|---|---|
| `type` | `contained` prop on `TabList` |
| `selected` | `selectedIndex` on `Tabs` |
| `hidden` | Use conditional rendering in `TabPanel` |
| `label` | Children of `Tab` |
| `tabContentClassName` | `className` on `TabPanel` |
| `renderAnchor`, `renderButton`, `renderContent` | **Removed** — use composition |
| `tabIndex` | **Removed** |

Manual refactor per instance. **Deviation trigger**: any `<Tabs>` using custom renderers → `architecture` deviation noting the dropped behavior.

### 7.5 Tooltip

Tooltip API was completely restructured. Interactive tooltips, definition tooltips, and icon tooltips each have a distinct v11 pattern:

- Interactive tooltips → `Tooltip` with a trigger element as children.
- Definition tooltips → `DefinitionTooltip` (renamed from `TooltipDefinition`) with `definition` prop (`tooltipText` was renamed).
- Icon tooltips → `IconButton` with built-in tooltip via `label` prop (replaces `TooltipIcon`).

Removed props: `triggerText`, `showIcon`, `iconName`, `focusTrap`, `renderIcon`, `selectorPrimaryFocus`, `tooltipBodyId`, `tooltipId`, `triggerClassName`, `iconDescription`, `direction` (merged into `align`).

### 7.6 Removed components (use these instead)

| v10 Component | v11 replacement |
|---|---|
| `Icon` | `import { <name> } from '@carbon/react/icons'` with `size` prop |
| `ModalWrapper` | `Modal` with controlled `open` prop |
| `Row` | Remove Row wrappers (or use `FlexGrid` + `Row` if v10 layout must be preserved) |
| `SearchFilterButton` | No equivalent |
| `SearchLayoutButton` | No equivalent |
| `ToggleSmall` | `<Toggle size="sm" />` |
| `ToggleSkeleton` | No equivalent |
| `ToggleSmallSkeleton` | No equivalent |
| `TooltipIcon` | `import { IconButton } from '@carbon/react'` |
| Toolbar family | No equivalent |

### 7.7 Light prop removed

The `light` prop is deprecated across many components (ComboBox, DatePicker, Dropdown, MultiSelect, NumberInput, OverflowMenu, PasswordInput, Search, Select, SelectableTile, TextArea, TextInput, Tile, etc.). v11 uses the new `Layer` component for layered backgrounds:

```diff
- <TextInput light labelText="Email" />
+ <Layer><TextInput labelText="Email" /></Layer>
```

### 7.8 Grid changes

- v11's default layout grid is **CSS Grid**, not flexbox.
- `Row` is deprecated when using `Grid`. Columns sit directly inside `Grid`.
- `Column` no longer auto-spans — explicitly set `sm`/`md`/`lg`/`xlg`/`max` props.
- To preserve v10's flexbox behaviour, use `FlexGrid` (new in v11) which still supports `Row`.

#### 7.8.1 Carbon v11 grid for page layout — the v11 syntax differs from v10

Where the migrated app lays out **multiple columns / regions** on a page,
the **Carbon v11 grid is MANDATORY** for that layout — not hand-rolled
`display:grid` / `display:flex` SCSS. The v11 grid **syntax differs from
v10** — migrate it; do not carry v10 grid markup forward unchanged:

| | v10 | v11 (default — CSS Grid) |
|---|---|---|
| Wrapper | `<Grid>` (flexbox, 16-col) | `<Grid>` (CSS Grid) |
| Row | `<Row>` **required** | **no `<Row>`** — `<Column>` sits directly inside `<Grid>` |
| Column span | auto-span / loose `<Column sm md lg>` | **explicit** `<Column sm={4} md={8} lg={16}>` (no auto-span) |
| Legacy flexbox | (was the only option) | opt back in with `<FlexGrid><Row><Column>` |

- v10 source already used Carbon `Grid`/`Row`/`Column` → migrate to the
  v11 form above (drop `<Row>` for the CSS-Grid `<Grid>`; add explicit
  column spans).
- v10 source hand-rolled a multi-column page/region layout in SCSS →
  move it onto `<Grid>` / `<Column>`.
- **Exemption — single-component panels.** A panel whose content *is* a
  single full-width component — one `DataTable`, one `StructuredList`,
  one form, one `Tile` — does NOT need a grid wrapper; that component is
  the layout. Do not add a pointless single-child `<Grid>`. The grid
  requirement is about genuine multi-column layout, not wrapping
  everything.
- The app shell (header + side-nav + content region) should use the
  Carbon grid or the grid-aware UI Shell components.
- **Vertical spacing for wrapped rows.** When `<Column>`s wrap onto
  multiple rows, set `row-gap` on the `<Grid>` to match the horizontal
  gutter — Default grid 32px → `row-gap: $spacing-07`; `<Grid narrow>`
  16px → `$spacing-05`; `<Grid condensed>` 0. Carbon `<Column>`s use
  margins for alignment, so wrapped-row spacing comes from the grid's
  `row-gap`, never a `<Column>` `margin-bottom`.

#### 7.8.2 Fixed UI Shell header — keep panel content clear of it

The Carbon UI Shell `<Header>` is `position: fixed` — it overlays the
top of the page. v11 components scroll programmatically on mount
(`Tabs` moves the selected tab into view; focus and anchor links also
scroll), which can leave a freshly-navigated panel scrolled so its
heading sits **behind** the fixed header. Two MANDATORY mitigations when
the migrated app renders a fixed Carbon `<Header>`:

1. **Reset scroll on panel/view navigation.** The shell (or router)
   MUST scroll the page back to the top whenever the active panel/view
   changes, so every panel opens at its own top:
   ```tsx
   useEffect(() => {
     window.scrollTo({ top: 0 });
   }, [activeView]); // activeView = whatever state selects the panel
   ```
2. **`scroll-padding-top` on the scroll root** — so any in-panel
   focus/anchor scroll stops below the header, never behind it:
   ```scss
   html { scroll-padding-top: 3rem; } // = Carbon UI Shell header height (48px)
   ```
   This also satisfies **WCAG 2.2 §2.4.11 Focus Not Obscured** — a
   keyboard-focused element must never be fully hidden behind a sticky
   header; Carbon does not handle 2.4.11 automatically.

Without (1), navigating to a panel that contains `Tabs` scrolls that
panel's content up under the header — a visible overlap. Surfaced
2026-05-22, carbon-v10-enterprise epoch 11: the Settings panel's `Tabs`
tucked the panel heading behind the fixed header.

**Static offset — `<Content>` is the canonical pattern.** Mitigations
(1)–(2) fix the *scroll* overlap. The main content region must also sit
*below* the fixed header at rest. Carbon's `<Content>` component
(exported from `@carbon/react`) is the UI Shell content wrapper: it
applies `padding-top: 3rem` automatically and tracks the header height.
When the migration **creates or repairs** shell layout, wrap the main
region in `<Content>` — never substitute a hardcoded `margin-top: 48px`
or `margin-top: 3rem` pixel offset (it silently breaks if the header
height changes, and is not the Carbon composition). A pre-existing v10
offset that already works is not itself a migration target (§10.0); but
if the offset is wrong, or the migration is introducing the shell,
`<Content>` is the fix — not a bigger hardcoded margin.

### 7.9 Other component-level renames / API changes

For per-component prop maps not covered above (Accordion, Button, Checkbox, ClickableTile, ContentSwitcher, DataTable, DatePicker, ExpandableTile, FileUploader, FormGroup, InlineLoading, Modal, MultiSelect, NumberInput, OverflowMenu, RadioButton, Search, Select, SelectableTile, Slider, StructuredList, TextArea, TextInput, Toggle, Breadcrumb, etc.), see **`migration-context/maps/carbon-v10.md`** for the per-component reference matrix. Apply the tier ladder if the carbon-v10.md entry conflicts with what you find via MCP.

### 7.10 Theme component (new in v11)

v10 themed via Sass mixin only (`@include carbon--theme($carbon--theme--g100)`). v11 introduces a React `<Theme>` component for runtime theming and per-region theme overrides.

**Common pattern** — wrap top-level `App` (or a region) with `<Theme>`:

```diff
+ import { Theme } from '@carbon/react';

  export default function App() {
    return (
+     <Theme theme="white">
        <Header>…</Header>
        <Content>…</Content>
+     </Theme>
    );
  }
```

Valid `theme` prop values: `"white"`, `"g10"`, `"g90"`, `"g100"`. Default if omitted: `"white"`.

**When to add `<Theme>`:** when migrating an app that switched themes at the Sass mixin level in v10, OR when introducing nested theme regions (e.g. a `<Theme theme="g100">` dark panel inside a white app). For simple single-theme apps that worked fine in v10 without explicit theme switching, `<Theme>` is optional — the default `white` is implicit.

**Caveat (cross-reference §4.3):** introducing `<Theme>` adds a DOM node and breaks custom CSS sibling selectors against its children. Plan for this — see §4.3 for the fix and deviation tag.

**Alternative for inline theme regions:** `<Layer>` (§7.7) handles layered backgrounds within a single theme. `<Theme>` switches the active theme; `<Layer>` switches the active layer set within a theme.

Verify the import via the tier ladder if the project's existing v11 partial-migration uses a different theming primitive.

### 7.11 DataTable — use Carbon wrapper components, never raw HTML table elements

v11's `DataTable` render-prop API hands you `getTableProps`,
`getHeaderProps`, `getRowProps`, `getCellProps`. These return
Carbon-internal props (e.g. `sortDirection`, `isSortHeader`, `onExpand`)
that are **only valid on Carbon's table wrapper components**. Spreading
them onto raw HTML `<table>`/`<thead>`/`<th>`/`<tr>`/`<td>` leaks invalid
attributes to the DOM and throws React console errors:
`React does not recognize the 'sortDirection' prop on a DOM element`,
`Unknown event handler property 'onExpand'`.

**Migrate raw table markup to the Carbon wrapper set:**

| Raw HTML | Carbon v11 component |
|---|---|
| `<table {...getTableProps()}>` | `<Table {...getTableProps()}>` |
| `<thead>` | `<TableHead>` |
| `<th {...getHeaderProps({header})}>` | `<TableHeader {...getHeaderProps({header})}>` |
| `<tbody>` | `<TableBody>` |
| `<tr {...getRowProps({row})}>` | `<TableRow {...getRowProps({row})}>` |
| `<td>` | `<TableCell>` |

All are exported from `@carbon/react`. A v10 migration that kept raw
`<table className="bx--data-table">` markup must move to the wrapper
components — keeping raw elements is a §8 gate failure (console errors).

**Do NOT hand-author types for the render-prop callback.** v11's
`DataTable` already types its `children` render prop as
`(renderProps: DataTableRenderProps<RowType, HeaderKeys>) => ReactElement`.
A migration that declares a *local* `interface DataTableRenderProps { … }`
(or a local `DataTableHeaderDef` / row / cell type) and annotates the
callback parameter with it **fails the build** — the hand-rolled shape
never structurally matches Carbon's generic (Carbon's `header` is
`ReactNode`, not `string`; rows and headers carry Carbon-internal
fields):

```
src/.../Panel.tsx: error TS2322: Type '(props: LocalDataTableRenderProps)
  => Element' is not assignable to type '(renderProps:
  DataTableRenderProps<…>) => ReactElement'.
```

Rule: **leave the render-prop parameter UN-annotated** — let TypeScript
infer it from `<DataTable>`'s `children` signature:

```diff
- {({ rows, headers, getHeaderProps, getRowProps, getTableProps }: DataTableRenderProps) => (
+ {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
```

Removing the annotation is the build fix. Also delete any local
`interface DataTableRenderProps` / `DataTableHeaderDef` / local row/cell
type that existed *only* to annotate this callback, and drop the
now-unused `import type { DataTableRenderProps }` if present. If you
genuinely need the type by name, import the **real** one from
`@carbon/react` (`import type { DataTableRenderProps } from
'@carbon/react'`) — never re-declare it locally.

### 7.12 DOM-correctness rules (MANDATORY — runtime console errors)

These produce no build error but throw React console errors at runtime;
the §8 gate (and any console check) fails on them.

1. **No interactive/popover component inside a `<p>`.** Components that
   render a Popover or Tooltip into the DOM — `IconButton`, `Tooltip`,
   `CodeSnippet` (`type="inline"`), `Toggletip`, `DefinitionTooltip` —
   emit a `<div>`/`<span>` subtree. A `<div>` cannot be a descendant of
   `<p>` (`validateDOMNesting` error). When migrated copy embeds one of
   these inside a paragraph, change the wrapping `<p>` to a `<div>`
   (keep the class).
2. **No double-labelling of form controls.** A Carbon form control
   (`Select`, `TextInput`, …) inside a `<FormGroup legendText="X">`
   must NOT also set its own `labelText="X"` — the label renders twice.
   Set the child's `labelText=""` (the `FormGroup` legend is the label),
   or drop the `FormGroup` and keep the control's `labelText`.
3. **Keyboard-only focus.** Use `:focus-visible` (not `:focus`) for
   focus-ring styling on interactive elements. A combined
   `:hover, :focus { … }` rule paints the ring on mouse focus too,
   defeating the keyboard-only pattern — split `:focus-visible` into its
   own rule and drop the `:focus` half.

### 7.13 Modal / ComposedModal

- **`ModalFooter` requires `children` in v11.** `ModalFooterProps`
  types `children: ReactNode` as **required**. A v10 self-closing
  `<ModalFooter primaryButtonText="…" secondaryButtonText="…" />` fails
  the build (`Property 'children' is missing`). Compose `<Button>`
  children explicitly:
  ```jsx
  <ModalFooter>
    <Button kind="secondary" onClick={onCancel}>Cancel</Button>
    <Button kind="primary" onClick={onSubmit}>Save</Button>
  </ModalFooter>
  ```
- The all-in-one `<Modal …>` (with `modalHeading` / `primaryButtonText`
  props) still works for simple modals. For the composed form
  (`ComposedModal` + `ModalHeader`/`ModalBody`/`ModalFooter`), every
  sub-part that has a required `children` (`ModalFooter`) must receive it.
- **Dismissal callback is `onRequestClose`, not `onClose`.** `Modal` and
  `ComposedModal` fire `onRequestClose` on user dismissal (the X, `Esc`,
  overlay click) and `onRequestSubmit` for the primary action. `Modal`
  has no `onClose` prop — a handler wired to `onClose` silently never
  fires and the modal will not close. This is unchanged v10→v11; flag it
  only if migrated code (or a hand-edit) introduced `onClose`.
- **Floating children inside a `Modal` need `autoAlign`.** A `Dropdown`,
  `ComboBox`, or `Select` rendered inside a `Modal` can open its menu
  outside the viewport; add the `autoAlign` prop so Carbon flips the
  menu into view. Apply it when migrated copy nests these controls in a
  modal.

### 7.14 Component prop / handler changes that break the build

These v10→v11 API changes can produce hard TypeScript errors when the
migrated code keeps the v10 shape. The exact set that errors depends on
the pinned `@carbon/react` minor — newer minors ship progressively
stricter types — so **apply every rule below regardless of version**:
each is a correct v11 substitution at all minors. Verified against
`@carbon/react@1.74` (an earlier §1.1 pin) and `@carbon/react@1.108`;
the current §1.1 pin is newer than both, which the "apply every rule
below regardless of version" instruction above already covers.
Each is a mechanically-correct v11 substitution, **not** a deviation
(§10.0).

- **`DatePickerInput` — the `iconDescription` prop was removed.** v10's
  `DatePickerInput` took `iconDescription` for the calendar icon's a11y
  label. v11's `DatePickerInputProps` has no such prop (the icon is
  described internally). A migrated
  `<DatePickerInput … iconDescription="…" />` fails the build:
  `Property 'iconDescription' does not exist on type … DatePickerInputProps`.
  **Delete the `iconDescription` prop** from every `<DatePickerInput>`.
  Do not relocate it to `<DatePicker>` — `DatePickerProps` has no such
  prop either.

- **`FileUploader` — `onChange` handler shape.** v10's
  `FileUploader.onChange` handed you a DOM change event whose
  `event.target` was the file `<input>`, so `event.target.files`
  type-checked. v11 keeps `onChange` but tightens its type in newer
  minors: `@carbon/react@1.74` types the event loosely as `any` (a
  v10-shaped body still compiles there), while `@carbon/react@1.108`+
  types it `(event: React.SyntheticEvent<HTMLElement>, data?:
  FileChangeData) => void` — and there `event.target` is `EventTarget`,
  which has **no `.files`**, so the v10 body fails the build:
  `Property 'files' does not exist on type 'EventTarget'`. Write the
  handler the forward-compatible way — cast `event.target` to
  `HTMLInputElement`:
  ```diff
    onChange={(event) => {
  -   const files = Array.from(event.target.files ?? []).map((f) => f.name);
  +   const input = event.target as HTMLInputElement;
  +   const files = Array.from(input.files ?? []).map((f) => f.name);
      update('attachedDocs', files);
    }}
  ```
  `HTMLInputElement` extends `EventTarget`, so the `as` cast needs no
  `unknown` hop, and it is harmless when the event is `any`. (Carbon also
  passes added-file metadata in the optional second `data` argument —
  `data.addedFiles`, typed `FileChangeData` — when the
  enhanced-file-uploader feature flag is on.)

- **`Slider` JSX-element typing.** Recent `@carbon/react` minors retype
  `Slider` as a function component returning `ReactNode`, which a
  project on `@types/react@17` rejects (`'Slider' cannot be used as a
  JSX component … return type 'ReactNode' is not a valid JSX element`).
  This is **not** a source-code fix — it is handled by the pinned
  `@carbon/react` version in the §1.1 dependency diff (an exact pin, not
  a floating `^` range, so the migration is reproducible and the pinned
  minor still types `Slider` as a class component). Do not edit `Slider`
  call sites; do not hack `tsconfig`. If `Slider` still errors after a
  clean install, the pin drifted — see §1.1 / `carbon-version-pins.json`.

- **`FilterableMultiSelect` — `filterItems` is now REQUIRED.** v10's
  `FilterableMultiSelect` made `filterItems` optional (defaulted to a
  built-in case-insensitive substring match). v11's
  `FilterableMultiSelectProps<T>` types `filterItems` as **required**. A
  v10 usage that omitted it fails the build: `Property 'filterItems' is
  missing in type '{…}' but required in type 'FilterableMultiSelectProps<…>'`.
  Pass the substring-match default explicitly:
  ```diff
    <FilterableMultiSelect
      id="reports-filter"
      titleText="Filter"
      items={items}
      itemToString={(item) => item?.label ?? ''}
  +   filterItems={(items, { inputValue }) =>
  +     items.filter((item) =>
  +       (item?.label ?? '')
  +         .toLowerCase()
  +         .includes((inputValue ?? '').toLowerCase())
  +     )
  +   }
      onChange={...}
    />
  ```
  Surfaced 2026-05-22 build-epoch-7 on `ReportsPanel.tsx`. `MultiSelect`
  (non-filterable) does NOT require `filterItems`.

### 7.15 Accessibility-mandatory Carbon props (TS-optional, a11y-required)

Carbon v11 components accept a small set of props that are **optional in
TypeScript** — omitting one is no build error and no console warning —
but **mandatory for an accessible component**. Omit one and the control
ships silently inaccessible: no programmatic label, no accessible name.
A v10 → v11 migration MUST:

- **Preserve** every such prop the v10 source already set — never drop it
  while rewriting a component's imports, props, or icon usage.
- **Supply** it on any component the migration *adds* or *substitutes*
  (a §7.6 removed-component replacement, a raw element migrated to a
  Carbon wrapper, an icon-only control) — the replacement carries the
  same a11y prop the original had.

This is a correctness rule for every migration class, not a discretionary
enhancement. It is NOT, however, a mandate to retro-fit accessibility
onto pre-existing v10 code the migration does not otherwise touch — that
is §10.0 out-of-scope.

| Component | a11y-activating prop(s) | Omitted → |
|---|---|---|
| `Button` icon-only (`hasIconOnly`) | `iconDescription` | no accessible name |
| `IconButton` | `label` | no accessible name |
| `TextInput` / `TextArea` / `Select` / `Search` / `Slider` | `labelText` | control has no programmatic label |
| `Checkbox` / `RadioButton` | `labelText` | no label |
| `NumberInput` | `label` | no label |
| `Toggle` | `labelText` + `labelA` + `labelB` | state change not announced |
| `Modal` | `modalHeading` | dialog has no accessible name |
| `FileUploader` | `labelTitle` + `labelDescription` | upload control unlabeled |
| `InlineNotification` / `ToastNotification` | `title` | alert content not announced |

A real `<label>` / legend is required — a placeholder, an adjacent `<p>`,
or a bare `aria-label` is not a substitute (`aria-label` hides the label
from sighted users; a placeholder disappears as soon as the user types).

**Do not over-add ARIA.** Carbon already supplies `role`, `aria-modal`,
the focus trap, sort announcements, and landmark roles for its own
components. Do NOT add `role="dialog"` to `Modal`, a second `<nav>`
around `SideNav`, or `aria-current` to a `Breadcrumb` item — duplicate
ARIA breaks assistive technology. Per WCAG 2.5.3, an `aria-label` on a
control that has visible text must *contain* that text, never replace it.

---

## §8 — Verification gates

Two gates at two scopes — do **not** conflate them:

- **§8.1 source-side leak grep — runs PER UNIT**, before that unit
  declares `status: done`. Cheap, catches v10 residue early.
- **§8.2 install gate + §8.3 build gate — run ONCE at END OF MIGRATION**,
  on the integration branch after every unit has merged. **Never run
  §8.2 / §8.3 inside a per-unit FED session**: a per-unit branch only
  has THAT unit's files migrated — the rest of the app is still v10, so
  a per-unit `npm install` / build fails spuriously on the other units'
  un-migrated code.

Who runs the END-OF-MIGRATION build gate depends on the migration
class's verification mode (see the carbon-migrate README "Migration
classes & build verification" table). `architectRuns` classes
(platform-modernize, framework-era-swap, runtime-swap) are
**`human-owned`** — the operator runs the end build. Non-architect
classes (carbon-version-upgrade, library) are **`full`** — the agent /
harness runs the end build on the integration branch and feeds failures
back as fix re-attempts.

Failures here are normal build failures — fixable via re-attempt. They
are not tier-availability failures (§0.1 already guarantees the
migration ran regardless of MCP).

### 8.1 Source-side leak grep — PER UNIT (portable, BSD/GNU-safe)

> **Portability note.** BSD `grep` (the default on macOS) does NOT support `\b` word boundaries in `-E` mode; GNU `grep` does. The patterns below use **explicit character classes** for boundaries (`[^a-zA-Z0-9_-]`) which work on both. Use single-quoted patterns to avoid shell-escape bugs around `$`.

Run each grep with the scope set to the unit's editable file set (`<SRC>`). Every grep below must return **zero matches**:

```bash
# Grep 1 — old packages still imported in JS/TS:
grep -rE "from ['\"](carbon-components-react|carbon-components|carbon-icons)(/[^'\"]*)?['\"]" \
  --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" <SRC>

# Grep 2 — old icon-size-suffixed imports (e.g. Add32):
grep -rE "(^|[^a-zA-Z0-9_])[A-Z][a-zA-Z]+(16|20|24|32)([^a-zA-Z0-9_]|$)" \
  --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" <SRC> \
  | grep -E "from ['\"]@carbon/icons-react['\"]"

# Grep 3 — v10 color tokens still in SCSS / CSS:
grep -rE '(^|[^a-zA-Z0-9_-])[$](ui-(0[1-5]|background)|text-0[1-5]|icon-0[1-3]|interactive-0[1-4]|inverse-(0[12]|link|hover-ui|support-0[1-4])|support-0[1-4]|brand-0[1-3]|hover-(primary(-text)?|secondary|tertiary|row|ui|selected-ui)|active-(primary|secondary|tertiary|ui)|selected-(ui|light-ui)|disabled-0[1-3]|skeleton-0[12]|link-0[12]|visited-link|decorative-01|danger(-0[12])?|overlay-01|layout-0[1-7])([^a-zA-Z0-9_-]|$)' \
  --include="*.scss" --include="*.css" <SRC>

# Grep 4 — v10 SCSS function/mixin prefix:
grep -rE '(^|[^a-zA-Z0-9_-])carbon--(breakpoint|type-style|rem|em|spacing|motion|font-family|grid|layout)' \
  --include="*.scss" <SRC>

# Grep 5 — bx-- class prefix (skip / accept if Option B in §4.2 was chosen and a [prefix-override-kept] deviation exists):
grep -rE '(^|[^a-zA-Z0-9_-])bx--' \
  --include="*.scss" --include="*.css" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" <SRC>

# Grep 5b — raw HTML <table> carrying a Carbon data-table class. v11
# DataTable render-props (getHeaderProps/getRowProps) must be spread onto
# Carbon <Table>/<TableHeader>/<TableRow>/<TableCell> wrappers, never raw
# <table>/<th>/<tr>/<td> — see §7.11. A non-empty result means raw table
# markup leaked through; migrate it to the wrapper components.
grep -rE '<table[^>]*(cds--data-table|bx--data-table)' \
  --include="*.tsx" --include="*.jsx" <SRC>

# Grep 6 — old v10 CSS custom properties:
grep -rE '\-\-cds-(ui-(0[1-5]|background)|text-0[1-5]|icon-0[1-3]|interactive-0[1-4]|inverse-0[12]|support-0[1-4]|brand-0[1-3]|disabled-0[1-3]|skeleton-0[12]|link-0[12]|danger(-0[12])?|overlay-01|layout-0[1-7])([^a-zA-Z0-9_-]|$)' \
  --include="*.scss" --include="*.css" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" <SRC>

# Grep 7 — cross-unit icon-import-style consistency. Checks that ALL files
# across <SRC> use the SAME icon-import path (Option A xor Option B, per
# §1.1.2 / §1.1.3 lock). Mixed-state ends with import-not-resolved errors
# and broken tree-shake. The lock file written in §1.1.3 should have made
# this impossible — if Grep 7 fails, a per-unit FED ignored the lock OR
# the lock was missing when the unit ran. Either way: must be resolved.
{
  LOCK=$(cat .carbon-migration/icon-import-style.txt 2>/dev/null | tr -d '[:space:]' || echo "")
  if [ -z "$LOCK" ]; then
    # Suggestion E (criterion 1): do not fail. Default to Option A (per §1.1.2)
    # and log a deviation rather than aborting.
    echo "A" > .carbon-migration/icon-import-style.txt
    LOCK="A"
    echo "Grep 7: lock missing; defaulted to A. Log [icon-import-style-default-fallback]."
  fi
  COUNT_A=$(grep -rE "from ['\"]@carbon/icons-react['\"]" \
    --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" <SRC> | wc -l)
  COUNT_B=$(grep -rE "from ['\"]@carbon/react/icons['\"]" \
    --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" <SRC> | wc -l)
  if [ "$COUNT_A" -gt 0 ] && [ "$COUNT_B" -gt 0 ]; then
    echo "Grep 7 FAIL: mixed icon-import styles. ${COUNT_A} files use @carbon/icons-react (Option A), ${COUNT_B} files use @carbon/react/icons (Option B). Lock says: '${LOCK}'. Rewrite the minority style's imports to the locked path. Log [icon-import-style-inconsistent] deviation if any residual remains."
  fi
}

# Grep 8 — leftover v10 ambient icon-type shim. A hand-written
# `declare module '@carbon/icons-react'` (or '@carbon/react/icons') in
# ANY *.d.ts SHADOWS v11's real icon types — every bare icon name then
# fails to resolve and the whole icon build collapses (§5.1.1). v11
# ships the real types; the shim must be DELETED (`rm`), never migrated.
# Any match → delete the listed file(s), re-run.
grep -rlE "declare module ['\"]@carbon/(icons-react|react/icons)['\"]" \
  --include="*.d.ts" <SRC>

# Grep 9 — interactive/popover Carbon component inside a `<p>` (§7.12.1
# DOM-nesting → runtime `validateDOMNesting` console.error). A `.tsx` /
# `.jsx` file containing BOTH an opening `<p` AND one of these
# popover-rendering components is suspicious: CodeSnippet (type="inline"),
# IconButton, Tooltip, Toggletip, DefinitionTooltip. The grep is coarse
# (file-level: presence of both patterns); inspect each suspect for
# actual nesting and apply §7.12.1 — change the wrapping `<p>` to a
# `<div>`, preserve the className. Surfaced 2026-05-23, epoch 18
# playwright: `ReportsPanel.tsx` had `<p ...><CodeSnippet type="inline">
# …</CodeSnippet></p>` which fired `<div> cannot appear as a descendant
# of <p>` at React render time and broke the playwright console-error
# gate even though the migration phase and build phase were both green.
grep -rlE "<p[[:space:]>]" --include="*.tsx" --include="*.jsx" <SRC> | while IFS= read -r f; do
  if grep -qE '<(IconButton|Tooltip|Toggletip|DefinitionTooltip)\b|<CodeSnippet[^>]*type=["'\'']inline' "$f"; then
    echo "GREP-9-SUSPECT: $f (has both <p> and a popover-rendering Carbon component; check §7.12.1)"
  fi
done

# Grep 10 — v10 prop names still in use on v11 components. Each pattern below
# is a v10 API the FED rewrite should have eliminated. Any non-empty match
# names a file:line that the FED missed. Fix the residual and re-run the grep;
# if AI-fixable matches remain after a reasonable effort, log a
# `[v10-prop-leaked]` deviation listing them and continue (never blocking).
# Component-by-component fix rules live in maps/carbon-v10.md.
for pattern in 'triggerText=' 'placeHolderText=' 'ariaLabel=' \
               'hasForm' 'primaryFocus' \
               "size=['\"]small['\"]" "size=['\"]field['\"]" "size=['\"]default['\"]"; do
  grep -rEn "$pattern" --include='*.tsx' --include='*.jsx' --include='*.ts' <SRC> || true
done
```

**Criterion 1.** Grep 10 (and any other §8.1 grep) is informational, never blocking. Fix the residual matches and re-run the grep; if AI-fixable residuals remain after a reasonable effort, log a `[v10-prop-leaked]` deviation listing them and close the unit. The migration ALWAYS advances.

Any non-empty result from greps 1–9 → fix the residual and re-run the grep. If the residual is intentional (feature flag, prefix-override-kept), log a `design` deviation explaining why.

### 8.2 Build verification — runtime-owned checks

> Runs on the integration branch after every unit has merged — NOT in a
> per-unit FED session. For `human-owned` classes the operator runs it;
> for `full` classes the agent/harness runs it.
>
> §8.2 was historically a HARD GATE — a build failure refused to mark the
> migration complete, which violated Criterion 1 (the migration must always
> complete). In this build, verification is owned by supervisor runtime phases,
> not by a map-defined set of start/smoke loops. Dependency normalization and
> build-fix are best-effort and never throw out of `runQa`; QA/audit can still
> hold completion if their real gates return `continue` or `infra_failed`.

Runtime checks in this build:

| Check | Runtime owner | Failure handling |
|---|---|---|
| Bare dependency install + dependency-health recheck | `runBuildFix()` before the build-fix FED session | Writes `.carbon-migration/dependency-health.json`; unresolved install/dependency failures write dependency deviation shards and keep the final supervisor-side commit gated. |
| Production build | `runBuildFix()` / FED build-fix session, then supervisor recheck | The run continues per Criterion 1. A red build is reported in build-fix status/logs; a green build plus clean dependency health is required for the supervisor's final consolidation commit. |
| QA compile/build checks, when the QA role is configured | `qaEngineerService` / `qaGateChecks` | These can return `continue` and hold ACTIVE → COMPLETE until the operator or a rerun resolves the failure. |

There is no bundled start/curl loop, smoke-spec loop, or runtime metrics file in this build.

If failure, the most likely causes (for the human reading the deviation):
- An import that didn't get rewritten (look for "module not found" referencing `carbon-components-react` or `carbon-icons`).
- An invented/hallucinated Carbon name (apply the tier ladder §0.1, fix the import, re-run).
- A type mismatch from v11 prop changes (cross-reference §7).
- A Sass compilation error from an unmigrated token or `carbon--` mixin (cross-reference §3.5).
- A toolchain / peer-dep resolution failure — the reconciler (§1.2) aligns the `jest` / `ts-jest` / `typescript` graph; if a bare `npm install` still fails it surfaces as a blocking `[toolchain-install-failed]` deviation.

Overall job completion is decided by the supervisor's terminal audit and QA gate. Criterion 1 means build/dependency failures leave fixable output and precise deviation context, not an unrecoverable app failure.

### 8.3 (RETIRED — see 8.2)

This section's content has merged into §8.2's runtime-owned check table. The retired §8.3 anchor is preserved to keep deep-links from older docs working.

### 8.4 Ledger entries

Every Carbon name written must have a tier-of-truth entry in `CARBON_MIGRATION_LEDGER.md`. The DPR review uses these entries to prioritize manual verification.

### 8.5 Self-audit checklist (REQUIRED — the FED agent writes this before `status: done`)

**Who runs this:** the front-end-developer (FED) agent itself, as the LAST action before transitioning to `status: done`. Each field is filled with a **measured value** — counts, exit codes, Y/N derived from commands the FED just ran. **No interpretation.** Downstream design-principal-reviewer and deviation-completeness-audit read these values during their own runs.

**Where it goes:** appended to `.carbon-migration/CARBON_MIGRATION_LEDGER.md` (the FED's session ledger).

**Template** (paste verbatim, replace `<…>` with measured values):

```
## Carbon v10 → v11 Self-Audit — unit <unitId> — <ISO timestamp>

### Pre-flight
- React version detected: <X.Y.Z>
- React pre-flight result: <OK|BUMP|NOT_DETECTED>
- React auto-bump applied: <Y|N> (from→to: <…>)
- React peer-dep range from installed @carbon/react: <range, e.g. "^16.8.6 || ^17.0.1 || ^18.2.0 || ^19.0.0">
- React-version compatibility: <COMPATIBLE|INCOMPATIBLE|UNKNOWN>  (compare detected version against the peer-dep range)
- Sass package: <sass|node-sass→sass>
- Package manager: <npm|yarn|pnpm>
- Build script: <name|none|tsc-fallback>
- TypeScript version: <X.Y.Z|NOT_FOUND>
- Icon-import style lock: <A|B|MISSING> (from .carbon-migration/icon-import-style.txt)
- MIGRATION_FACTS.md written: <Y|N> (at repo root)

### Source-side leak greps (§8.1)
- Grep 1 (old JS imports): <N> matches
- Grep 2 (icon size suffix): <N> matches
- Grep 3 (v10 SCSS color tokens): <N> matches
- Grep 4 (carbon-- SCSS prefix): <N> matches
- Grep 5 (bx-- class prefix): <N> matches  [option B? <Y|N>]
- Grep 5b (raw HTML data-table markup): <N> matches
- Grep 6 (v10 CSS custom properties): <N> matches
- Grep 7 (cross-unit icon-import consistency): <PASS|FAIL count_A=<N> count_B=<N>>
- Grep 8 (leftover ambient icon-type shim): <N> matches

### Install and build (§8.2, §8.3)
- `$PM install` exit code: <0|N>
- `$PM run $BUILD` exit code: <0|N|skipped>

### Migration coverage
- Files modified: <N>
- `@types/carbon-components-react` removed: <Y|N|absent>
- Fast-path used (re-export package): <Y|N>
- `@carbon/icons-react` option chosen: <A-keep|B-replace|N/A>
- `@carbon/styles` added as direct dep: <Y|N>
- `bx--` prefix option chosen: <A-rename|B-override-kept|N/A>

### Tier-of-truth ledger
- Total Carbon names written: <N>
- Tier 1 (carbon-builder skill): <N>
- Tier 2 (Carbon MCP): <N>
- Tier 3 (training fallback): <N>
- Tier 1 availability: <available|unavailable|untested>
- Tier 2 availability: <available|unavailable|untested>

### Deviations logged
- Total deviation entries: <N>
- By tag: react-auto-bump=<N>, react-version-not-detected=<N>, removed-token=<N>, ambiguous-token=<N>, removed-icon=<N>, prefix-override-kept=<N>, style-approximation=<N>, mcp-unavailable=<N>, install-failure=<N>, no-build-script=<N>, added-carbon-styles=<N>, fast-path-used=<N>, cra-react-scripts-bump=<N>, sibling-selector-broken=<N>, reference-baseline-consulted=<N>, icon-import-style-default-fallback=<N>, icon-import-style-inconsistent=<N>, migration-facts-not-written=<N>, design-other=<N>, architecture-other=<N>

### Confidence
- All gates green: <Y|N>
- Tier-3 fallback proportion: <(tier3/total)*100>%
- Confidence: <high|medium|low>
  - high: all gates green, tier-3 < 10%
  - medium: all gates green, tier-3 in [10%, 50%]
  - low: any gate red, OR tier-3 >= 50% — flag for DPR priority review
```

**Gating rule:** The FED MUST NOT transition to `status: done` unless:
- All §8.1 greps (1, 2, 3, 4, 5, 5b, 6, 7, 8) return 0 (or grep 5 has a corresponding `[prefix-override-kept]` deviation).
- `$PM install` exit code is 0.
- `$PM run $BUILD` exit code is 0 (or skipped per §0.5).
- The self-audit block above is present in the ledger.

If `Confidence: low`, the FED still exits `status: done` (the build passed) — but the low-confidence flag is the signal to DPR to prioritize manual review of this unit.

---

## Appendix A — Optional codemod accelerator

The Carbon team publishes `@carbon/upgrade` with a handful of v10 → v11 jscodeshift transforms. They are **optional**; the deterministic instructions in §2-§7 are authoritative. The v11 → v12 upgrade will ship no codemods, so do not build a workflow that depends on them.

### A.1 ⚠️ Do NOT use the interactive form from an automated agent run

```bash
npx @carbon/upgrade@10 -d --write   # ❌ DO NOT USE from an agent
```

The v10 CLI is **interactive** — it opens a menu prompt and blocks waiting for keyboard input. An automated FED agent will hang at this command. Use the headless form in §A.2 instead.

### A.2 Headless / scripted invocation (the only agent-safe form)

```bash
$PM install --save-dev @carbon/upgrade@10
npx jscodeshift -t node_modules/@carbon/upgrade/transforms/update-carbon-components-react-import-to-scoped.js --extensions=js,jsx,ts,tsx <SRC>
npx jscodeshift -t node_modules/@carbon/upgrade/transforms/icons-react-size-prop.js --extensions=js,jsx,ts,tsx <SRC>
```

Transforms available in `@carbon/upgrade@10.17.3`:
- `update-carbon-components-react-import-to-scoped`
- `icons-react-size-prop`
- `small-to-size-prop`
- `size-prop-update`
- `sort-prop-types`

These transforms only touch imports and component props in source files. They do NOT modify `package.json`. The agent must still perform §1 (dependency sync) manually.

The `latest` tag of `@carbon/upgrade` (currently `@11.x`) ships v11 → v12 transforms only — **do not invoke `npx @carbon/upgrade` without the `@10` pin** for a v10 → v11 migration.

### A.3 Why codemods are demoted

- The v10 codemods are interactive-only by default and require the `jscodeshift` workaround to fit a scripted agent workflow.
- They cover a small slice of the migration (imports + icon size + a few prop renames) — they don't touch color tokens, CSS class prefixes, TypeScript types, or the structural rewrites for Tabs/Tooltip/Notifications.
- The v11 → v12 upgrade has no codemods, so the deterministic-instruction discipline is what carries forward.

Treat codemods as a one-time accelerator for the bulk import rewrite. The agent still validates every output against §8.

---

## Appendix B — Reference baselines (sanity-check, NOT a blueprint)

The repo ships a Carbon v11 scaffold used by the `architecture-modernizer` for platform-modernize jobs. The scaffold files are a **known-good v11 baseline** — when the agent's upgrade output gets stuck on "what does a working v11 file look like?", read ONE specific scaffold file as a sanity check.

| Question the agent has | Reference file (read on-demand, do NOT inline) |
|---|---|
| "What does a minimal v11 `App.tsx` look like, including `<Theme>`?" | `architecture-modernizer/scaffolds/carbon-react-v11/_common/src/App.tsx.template` |
| "How is the SCSS entry wired in `main.tsx`?" | `architecture-modernizer/scaffolds/carbon-react-v11/_common/src/main.tsx.template` |
| "What does a working `vite.config.ts` look like for Carbon v11?" | `architecture-modernizer/scaffolds/carbon-react-v11/_common/vite.config.ts.template` |
| "What `package.json` dependency block ships in the scaffold (for pinned versions)?" | `architecture-modernizer/scaffolds/carbon-react-v11/_common/package.json.template` |
| "What does the SCSS index file conventionally look like in v11?" | `migration-context/templates/vite.md` (the Vite scaffold conventions doc) |

### Anti-overfitting rules (MANDATORY)

These files are **sanity checks, not blueprints**. The carbon-version-upgrade migration class **edits an existing project in place** — the source repo's build system, file layout, routing setup, and entry-point conventions are authoritative. The scaffold templates were designed for greenfield platform-modernize jobs (new app written from scratch into `new_app_root`), not upgrades.

- **DO NOT** replace the source repo's `vite.config.ts` / `webpack.config.js` / `package.json` / `main.tsx` / `App.tsx` with copies of these templates.
- **DO NOT** introduce `react-router-dom`, `@carbon/styles/css/styles.css`, `<BrowserRouter>`, or any other dep that isn't already in the source repo just because the scaffold uses it.
- **DO** consult a single template file when investigating a specific symptom (e.g. the agent's migrated SCSS won't compile → open `_common/src/main.tsx.template` to see the canonical SCSS entry pattern, NOT to copy the file).
- **DO** log a `design` deviation tagged `[reference-baseline-consulted]` noting which template was read and why, so DPR can see if the agent over-applied the reference.

The tier ladder (§0.1) still applies: when in doubt about a Carbon name, the MCP / `carbon-builder` skill is the authoritative source. The scaffold is a secondary cross-check for *project shape*, not a source of truth for *Carbon names*.

---

## §9 — Deprecations (reference)

- `carbon-components` package — deprecated; reached end-of-support 2024-09-30. Use `@carbon/styles` or `@carbon/react`.
- `carbon-components-react` package — deprecated; reached end-of-support 2024-09-30. Use `@carbon/react`.
- `carbon-icons` package — deprecated since 2022 v11 release. Use framework-specific icon packages (`@carbon/icons-react`, etc.).
- `@carbon/import-once` package — no further updates; safe to drop.
- `@types/carbon-components-react` — not needed; types ship with `@carbon/react`.
- v10 ranges of `@carbon/colors`, `@carbon/elements`, `@carbon/grid`, `@carbon/layout`, `@carbon/motion`, `@carbon/themes`, `@carbon/type` — all deprecated 2024-09-30. Use the v11 ranges (or rely on `@carbon/react` to pull them transitively).

`carbon-components-react@8.x` and `carbon-components@11.x` are **direct re-exports** of v11 packages — see §0.1.1 for the fast-path caveat.

---

## §10 — Deviation tag taxonomy

### §10.0 — Deviation discipline (what IS and ISN'T a deviation) — AUTHORITATIVE

This section is **authoritative for every agent on a `carbon-version-upgrade`
job — FED, design-principal-reviewer, and deviation-completeness-audit
alike.** Where a role's generic LAUNCH_PROMPT (e.g. the DPR's "binary
Carbon conformance" Purity Protocol) is stricter than this section, **this
section wins for this migration class.** carbon-version-upgrade is a
narrow, deterministic v10→v11 version bump — not a greenfield Carbon
authoring task. The deviation log must therefore carry **only real
signal**: a human reading `DEVIATIONS_FOR_REVIEW.md` should see exactly
the things the migration could not complete with confidence — nothing
else.

**A deviation IS logged when, and only when:**

- A *required* v10→v11 transformation (§1–§8) is **ambiguous** — e.g. a
  `⚠️ verify` token row in §3 with no clean v11 mapping after the tier
  ladder; a removed Carbon component (§7.6) that has a **live callsite**
  and no clean equivalent.
- A required transformation **could not be completed** — a build error
  that could not be resolved, a Carbon API that could not be verified.
- The migration made a **judgement call a human should sanity-check** —
  a genuine either/or where the agent picked one option.

**A deviation is NOT logged for (do NOT log these):**

1. **A mechanically-correct, documented v10→v11 substitution.** Icon
   renames (§6.3), the v11 Carbon Charts SCSS path (§1.1.1 / §2.2),
   dropping a removed prop (`lowContrast`, `light`, …), the documented
   default icon-import choice (§1.1.2 Option B). These are *the
   migration working correctly*. They are not deviations — they are the
   spec. Logging them buries real signal.
2. **Pre-existing v10 code the version-upgrade is not scoped to change.**
   A `carbon-version-upgrade` migrates **v10 Carbon → v11 Carbon**. It
   does NOT refactor code that never used Carbon. The following are
   **out of scope and NOT deviations**:
   - hand-rolled CSS with hardcoded hex/rem values that were *hardcoded
     in the v10 source* (the migration only re-maps values that were
     **v10 Carbon tokens**);
   - custom non-Carbon components (a hand-built nav, card, layout) that
     a Carbon component *could* replace — replacing them is a redesign,
     not a version upgrade;
   - absence of `<Theme>`, `<Layer>`, or other v11 niceties the v10
     source never had;
   - a CSS surface that imports all of `@carbon/react` (the documented
     migration default).
3. **Expected multi-unit coordination.** "This unit migrated a shared
   file; consumers in other units will update when their unit runs" is
   normal pipeline behaviour, not a deviation.
4. **`MIGRATION-TEST:` comment directives in v10 source.** The
   `carbon-v10-enterprise` corpus seeds the v10 source with comments like
   `// MIGRATION-TEST: prefix-override-kept — … The tool should … log a
   [prefix-override-kept] deviation`. These are **stale test scaffolding**
   — they served their purpose when the corpus was authored against
   earlier versions of the tool. They are NOT v11 production source.
   Rule:
   - STRIP every `// MIGRATION-TEST: <slug> — …` directive from the
     migrated v11 file. The v11 file is production code, not a fixture.
   - Do NOT propagate the `[<slug>]` tag the directive names into the
     migrated file's comments.
   - Do NOT author the deviation the directive requests.
   - Apply the **map's documented mechanical substitution** for whatever
     v10 syntax the directive was wrapping (e.g. `.bx--theme--g10` →
     `.cds--theme--g10` under §4.2 Option A; or `mini-units(80)` →
     `(80 * 0.5rem)` under §3.4).
   Surfaced 2026-05-23, epoch 17: the FED preserved the
   `[prefix-override-kept]` tag in a migrated comment for
   `.bx--theme--g10` because the v10 source comment requested it; the
   DCA's uncertainty scan then logged it, breaking the zero-deviation
   gate. The corpus directive is a TEST INPUT for the migration tool,
   not an output instruction the tool should obey.

**The Carbon v11 grid (§7.8.1) is the one in-scope layout requirement.**
It is mandatory. If a unit's layout is not on the Carbon grid after
migration, that is an *incomplete required transformation* → fix it (do
not merely log it).

**§3.8 / §7.3 "improvement" guidance is OPTIONAL.** Tokenising
pre-existing hardcoded values, or swapping `InlineNotification` for
`ToastNotification`, *improves* fidelity and is encouraged when cheap —
but NOT doing it is **not a deviation** (the value was hardcoded / the
component choice was made in v10, both out of scope per rule 2).

Net effect: a correct `carbon-version-upgrade` migration of a clean v10
codebase should produce a `DEVIATIONS_FOR_REVIEW.md` with **zero
entries**. A non-zero count means a *required* transformation was
genuinely ambiguous or incomplete — which is exactly what a human
should review.

**The deviation shard file contains ONLY real deviations.** A deviation
shard (`.carbon-migration/deviations/<role>-<id>.md`) and the
consolidated `DEVIATIONS_FOR_REVIEW.md` are counted entry-for-entry —
every entry is one unit of the "Total entries" number. Therefore:

- Write an entry **only** for a genuine deviation per the IS-logged
  test above. If you have zero genuine deviations, write a shard with
  **zero entries** (a header + an explicit "No deviations." line is
  correct and expected).
- **Review observations are NOT deviation entries.** "Drift", "nits",
  "suggestions", "consider…", "could be more idiomatic", "pre-existing
  tech debt", "follow-up cleanup", forward-looking notes ("when the
  project moves to React 18…") — these are useful review prose but they
  **must not be written as numbered deviation entries** in the shard.
  Put them in a free-text "Review notes" section that the consolidator
  does not count, or omit them. They never increment "Total entries".
- A `## Verdict` line like "0 blockers, N drift, M nits" means the
  shard's deviation-entry count is **0** — `drift` and `nits` are not
  deviations. Do not also emit them as numbered entries.

### §10.1 — Deviation tags

The `carbon-version-upgrade` migration class allows two deviation categories: `design` and `architecture`. The map's instructions emit specific **tags** that map to those two categories — no schema change required (the `migrationClassProfile.baseline.test.js` test continues to pass).

Every deviation entry uses the form:

```
- [category: design|architecture] [tag] <one-line description> — <file:line>
```

| Tag | Category | When to log |
|---|---|---|
| `[react-auto-bump]` | `design` | §0.2 detected react < 16.14.0 and bumped to ^16.14.0 (the `react/jsx-runtime` floor). |
| `[react-version-not-detected]` | `architecture` | §0.2 — could not parse React version; defaulted to ^18.3.1. |
| `[react-major-bump-reverted]` | `design` | Supervisor dependency-normalize — a migration-introduced React 16→17/18 major bump was reverted to ^16.14.0 (§0.2 forbids major bumps for this class). |
| `[react-jsx-runtime-floor]` | `design` | Supervisor dependency-normalize — final react 16.x < 16.14 raised to ^16.14.0 (`react/jsx-runtime` requirement, §0.2). |
| `[carbon-pin-clamped]` | `design` | Supervisor dependency-normalize — a `@carbon/*` version drifted from `config/carbon-version-pins.json` and was clamped back (§1.1/§1.1.2). |
| `[icons-package-restored]` | `design` | Supervisor dependency-normalize — source files import Carbon icons but `@carbon/icons-react` was missing from package.json; restored at the §1.1.2 pin (package-presence invariant). |
| `[install-failure]` | `architecture` | §1.2 `$PM install` emitted a peer-dep or resolution error. |
| `[added-carbon-styles]` | `design` | §1.1.1 — added `@carbon/styles` as a direct dep. |
| `[removed-token]` | `design` | §3.4 — v10 token has no v11 equivalent; nearest substitute used. |
| `[ambiguous-token]` | `design` | §3.2 / §3.6 row marked `⚠️ verify` chosen by context. |
| `[removed-icon]` | `design` | §6.3 — v10 icon removed from v11; substituted with closest semantic match. |
| `[prefix-override-kept]` | `design` | §4.2 Option B — `.bx--` prefix preserved via Sass config. |
| `[style-approximation]` | `design` | §4.3 / §7.2 — custom CSS reshaped because `className` now applies to outer element. |
| `[fast-path-used]` | `design` | §0.1.1 — re-export package detected; JS imports shortcut taken. |
| `[no-build-script]` | `architecture` | §0.5 — `package.json` has no build script; §8.3 used `tsc --noEmit` or skipped. |
| `[mcp-unavailable]` | `design` | §0.1 — Carbon MCP was unreachable for the session; tier 3 (training) was used. |
| `[cra-react-scripts-bump]` | `design` | §0.3 — CRA repo with `react-scripts < 5.0` bumped to `^5.0.1` for Dart Sass compatibility. |
| `[sibling-selector-broken]` | `design` | §4.3 — custom CSS sibling/adjacent combinator (`~`/`+`) broken by `<Theme>` or `<Layer>` wrapper; rewritten to target a class. |
| `[reference-baseline-consulted]` | `design` | Appendix B — agent read a scaffold template as a sanity check; record which file and why. |
| `[icon-import-style-default-fallback]` | `design` | §6.2 — `.carbon-migration/icon-import-style.txt` was missing when the unit started; defaulted to Option B. |
| `[icon-import-style-inconsistent]` | `design` | §8.1 Grep 7 — project ended with both `@carbon/icons-react` and `@carbon/react/icons` imports across files. List the offending files in the deviation message. |
| `[migration-facts-not-written]` | `design` | §1.1.4 — synthetic metadata unit could not write `MIGRATION_FACTS.md` (filesystem error, permission denied, etc.). Migration still completes; downstream readers won't see the truth file. |
| `[public-export-narrowed]` | `design` | §1.4 — a public re-export's backing package has no target-compatible release; names preserved via the compat layer. If a name could not be preserved (no successor, stub also infeasible), list it here. Informational, never blocking. |
| `[compat-wrapper-degraded]` | `design` | §1.4 — a Bucket-A/B compat wrapper failed to build/type-check after the bounded-retry cutoff; downgraded to a render-safe Bucket-C stub. Name the export and the intended target. |
| `[public-export-removed]` | `architecture` | §1.4 / deviation-completeness-audit §5.1 — deterministic surface-diff found a public export present pre-migration and absent post-migration with no covering compat binding. Record-only (the audit cannot fix); remediation is owned by the FED / final-refinement pass. |

---

## §11 — Related resources

- Official migration guide (develop): <https://carbondesignsystem.com/migrating/guide/develop/>
- Official migration guide (overview): <https://carbondesignsystem.com/migrating/guide/overview/>
- Official migration guide (design): <https://carbondesignsystem.com/migrating/guide/design/>
- FAQ: <https://carbondesignsystem.com/migrating/faq/>
- Color tokens reference: <https://carbondesignsystem.com/elements/color/tokens/>
- Themes reference: <https://carbondesignsystem.com/elements/themes/code/>
- Stylelint plugin: `stylelint-plugin-carbon-tokens` (community supported; helps with token migration)

---

## Ledger requirement

When you load this map, record it in `CARBON_MIGRATION_LEDGER.md`:

```
Loaded: migration-context/maps/carbon-v10-to-v11.md — Trigger: source_framework == carbon-v10
Precedent scan: completed / skipped — found <N> precedent files at <paths>
```

Every Carbon name written gets one tier-of-truth entry:

```
<file:line> — wrote <name> — tier=<carbon-builder|mcp|training> — query=<terms or 'training-only'>
```

The §8.5 self-audit block is written as the LAST action before `status: done`. The DPR and deviation-completeness-audit read both the per-name tier entries and the self-audit block to prioritize review.
