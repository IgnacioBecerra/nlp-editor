# Java Server UI → Carbon React Scaffold

> End-to-end scaffold for migrating a server-rendered Java UI to Carbon
> React via the 1.3.0 `platform-modernize` migration class. Companion
> files: `maps/java-server-ui-pswcl.md` (widgets),
> `patterns/java-server-ui-dispatch.md` (Strangler-Fig cutover),
> `patterns/java-server-ui-i18n-bridge.md` (`.properties` → JSON).
>
> **LOAD RULE:** Load this file once at the start of a platform-modernize
> job (any subtype). It is the end-to-end recipe; the companion maps and
> patterns are loaded on trigger as the agent encounters specific Java
> idioms in the source.
>
> **CO-LOCATED PRECEDENT OVERRIDE:** If the target repo already has a
> working Carbon React app in a sibling folder — e.g., `CONSOLE_UI_REACT/`
> or `WEB_UI_CONTENT_REACT/` — use **that configuration verbatim** for
> the bootstrap stage rather than following this scaffold. The Architect's
> `precedent-scan` phase detects sibling React modules and records them
> in `.carbon-migration/PRECEDENT_SCAN.md`. Precedent beats this scaffold
> for every archetype it covers. This document is the fallback.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## When to use this scaffold

A repo qualifies for this scaffold when:

- Source framework is `java-server-ui` (any 1.3.0-accepted subtype —
  `ps-wcl`; reserved: `struts`, `jsf`).
- Target is `@carbon/react` v11 (+ optionally `@carbon/ibm-products`
  for opinionated archetypes like `CreateFullPage`, `CreateTearsheet`).
- Build tool for the new React app is Vite (recommended) or Next.js
  (if precedent uses it).

For Dojo / Angular / Vue migrations, this scaffold does not apply — see
the corresponding `framework-era-swap` scaffolds instead.

---

## Scaffold overview — five stages

Each stage is one Architect phase or one FED unit's worth of work. The
source tree stays read-only throughout; every write lands under
`<new_app_root>` (default `{SourceModuleName}_REACT/`, operator-
overridable at job creation).

1. **Precedent scan (Architect)** — inventory sibling React modules
   that already encode the product's Carbon + React conventions. Emit
   `.carbon-migration/PRECEDENT_SCAN.md`. If precedent is high-
   confidence, SKIP the rest of this scaffold and reuse precedent's
   bootstrap verbatim. Otherwise proceed.
2. **Bootstrap (Architect, scaffold phase)** — stand up `<new_app_root>`
   with a minimal Carbon React app skeleton. See §2.
3. **Plan + apply (Architect)** — author `ARCHITECTURE_PLAN.md` with
   the view-to-component map + dispatcher redirect list. Apply lands
   the `expected_diff_manifest[]` to prep branch.
4. **Per-feature authoring (FED units)** — one unit per source feature
   folder. Each FED unit consumes the read-only source views and
   produces the corresponding React components + routes.
5. **Coverage audit + consolidation (`migration-coverage-audit`)** —
   verify N-to-M coverage across views, REST, i18n. Consolidate all
   deviation shards into `DEVIATIONS_FOR_REVIEW.md`.

---

## Stage 1 — Precedent scan

Eligibility heuristic (1.3.0 spec §9.2): a sibling directory qualifies
as precedent when at least two of these hold:

- `package.json > name` shares a product namespace with the source module
- Imports `@carbon/react` or `@carbon/ibm-products`
- Has committed changes within the last 12 months
- Contains `.tsx` / `.jsx` files under a `src/` tree with `components/`
  or `features/`

Low-confidence matches emit a `precedent-low-confidence` deviation
rather than being auto-harvested. Operator decides at PR review.

---

## Stage 2 — Bootstrap (`<new_app_root>` skeleton)

When precedent is absent or partial, create these files:

```
<new_app_root>/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .eslintrc
├── .prettierrc
├── .gitignore
├── index.html
└── src/
    ├── main.tsx                 # Root. Mount App, wrap in Theme + Router.
    ├── App.tsx                  # UIShell + SideNav + Route skeleton.
    ├── api/
    │   ├── client.ts            # fetch wrapper with auth interceptor
    │   ├── csrf.ts              # CSRF token helper (for stateful backends)
    │   └── pending-rest.ts      # runtime helper that checks .pending-rest/ at build
    ├── archetypes/
    │   ├── DataTablePage.tsx    # list + pagination + row actions archetype
    │   ├── DetailsFormPage.tsx  # form-based detail view archetype
    │   └── WizardPage.tsx       # multi-step wizard archetype
    ├── routes/
    │   └── index.tsx            # route table (populated per-feature later)
    ├── features/                # per-feature folders — FED units write here
    ├── i18n/
    │   ├── index.ts             # t() helper + locale loading
    │   ├── en.json              # produced by i18n-bridge conversion
    │   └── .conversion-report.md
    └── .pending-rest/           # per-gap OpenAPI stubs (see §4)
```

### Bootstrap dependencies (`package.json`)

Pin to known-good versions. Operator can bump after job completes.

```jsonc
{
  "name": "<new_app_root>",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@carbon/react": "^1.97.0",
    "@carbon/icons-react": "^11.71.0",
    "@carbon/ibm-products": "^2.86.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@tanstack/react-query": "^5.62.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.1",
    "typescript": "^5.6.3",
    "vite": "^6.1.6"
  }
}
```

### AppShell skeleton (`src/App.tsx`)

Minimal. Consumers extend the route list in stage 4.

```tsx
import { Theme, SideNav, Content } from '@carbon/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from './i18n';
import Routing from './routes';

const queryClient = new QueryClient();

export default function App() {
  return (
    <Theme theme="g10">
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Content>
              <Routing />
            </Content>
          </BrowserRouter>
        </QueryClientProvider>
      </I18nProvider>
    </Theme>
  );
}
```

---

## Stage 3 — Plan + apply (Architect)

The Architect produces `ARCHITECTURE_PLAN.md` containing:

- **`new_app_root`** (derived from operator input or convention default)
- **`view_to_component_map`** — one row per source view → expected React component path under `<new_app_root>/src/features/`
- **`expected_diff_manifest[]`** — the specific files the apply phase will write or modify. Under platform-modernize, most are creations in `<new_app_root>`; a small set are integration-point edits (see §7 of the 1.3.0 spec).
- **`dispatcher_redirects[]`** — one row per migrated taskId → new React route. Applied to the subtype's single-dispatcher file (e.g., `ITIMControlServlet.java` for ps-wcl) per `patterns/java-server-ui-dispatch.md`.
- **`rest_gap_estimate`** — from scan-phase `rest-endpoint-index.json`, count of backend calls WITHOUT an existing REST endpoint. Informational, not blocking.

The apply phase writes strictly within:

- `<new_app_root>/` — editable
- Enumerated integration-point paths (repo-root `package.json`, `**/web.xml`, `.gitignore`, `.github/workflows/*.yml`, `build.gradle`, `pom.xml`, subtype dispatcher file) — writable with `write-scope-exception-granted` deviation
- Source tree — readonly; attempted writes are reverted + logged

---

## Stage 4 — Per-feature FED units

Each FED unit covers one source feature folder. Typical unit:

- Input: N source view files (e.g., `view/account/AccountTableView.java`,
  `view/account/AccountDetailsView.java`, `view/account/ChangeAccountView.java`).
- Output under `<new_app_root>/src/features/account/`:
  - `index.tsx` — route entry
  - `AccountListPage.tsx` — extends `DataTablePage`
  - `AccountDetailsPage.tsx` — extends `DetailsFormPage`
  - `ChangeAccountPage.tsx` — extends `DetailsFormPage`
  - shared sub-components as needed
- Output under `<new_app_root>/src/api/account.ts`:
  - `listAccounts()`, `getAccount(id)`, `updateAccount(id, body)`, etc. wired to REST endpoints. When a matching REST endpoint doesn't exist, FED emits a `rest-endpoint-missing` deviation + OpenAPI stub at `<new_app_root>/.pending-rest/AccountManager_list.yaml`.
- Output under `<new_app_root>/src/routes/index.tsx`:
  - appended `<Route path="/accounts" element={<AccountListPage />} />` (and equivalents)

### Per-view decomposition recipe

For each `*View.java` in the unit:

1. **Identify archetype** — match against abstract base class (`AbstractTablePageView`, `AbstractFilterPageView`, `AbstractDetailsView`, `AbstractAdvancedSearchView`, `AbstractPasswordPickupView`, or `AbstractPageView`). Map to scaffold archetype.
2. **Enumerate data-fetch call sites** — grep for imports of backend packages (subtype-specific; for ps-wcl: `com.ibm.itim.apps.*`, `com.ibm.itim.dataservices.*`, `com.ibm.itim.remoteservices.*`, etc.). Each call is a potential REST endpoint.
3. **For each backend call: match or stub** — consult `.carbon-migration/rest-endpoint-index.json`. If matched, wire React fetch. If not, emit `rest-endpoint-missing` deviation + OpenAPI stub.
4. **Port button/link handlers** — source `*Listener` imports become React `onClick` / `onSubmit` handlers.
5. **Carry i18n keys verbatim** — consume via the `t()` helper. Do not hard-code English.
6. **Widget mapping** — consult `maps/java-server-ui-pswcl.md`.

### REST stub + contract mode

When a backend call has no matching endpoint:

```tsx
// .pending-rest/AccountManager_list.yaml — OpenAPI 3.x contract stub
//   describing the request/response inferred from the Java signature.

// In AccountListPage.tsx:
const { data, error, isPending: isPendingRest } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => client.get('/api/v1/accounts'),
});

return (
  <>
    {isPendingRest && (
      <InlineNotification
        kind="warning"
        title="Endpoint pending"
        subtitle="This page depends on a REST endpoint that has not yet been implemented."
      />
    )}
    <DataTablePage rows={data ?? []} headers={HEADERS} />
  </>
);
```

---

## Stage 5 — Coverage audit + consolidation

`migration-coverage-audit` (spec §12) runs last. Three axes:

- **View coverage** — every source view → React component OR `coverage-missed` deviation.
- **REST coverage** — every backend call → endpoint usage OR `rest-endpoint-missing` deviation.
- **i18n coverage** — every `.properties` key → JSON bundle entry OR `i18n-key-untranslated` deviation.

Outputs:

- `.carbon-migration/COVERAGE_AUDIT_REPORT.md` — human-readable per-axis summary.
- `DEVIATIONS_FOR_REVIEW.md` at target-repo root on prep branch — consolidated, numbered 1..N. `## Coverage` section first (with 4 subsections), then `## Design`, then `## Architecture`.

---

## Preservation invariants (behaviour)

- **HTTP traffic unchanged** — same endpoints, same methods, same request bodies. FED must not change the URL a page hits; it may rename internal wrappers.
- **Auth / session / CSRF unchanged** — JSESSIONID cookie forwarded; CSRF token helper preserves the backend's existing protection.
- **Events unchanged** — same publish/subscribe semantics across the UI.
- **User interactions unchanged** — click handlers, keyboard shortcuts, form-submission flows, navigation targets.

See `constraints/security_continuity.md` (from the project's GESTALT, when present) for the full auth-continuity checklist.
