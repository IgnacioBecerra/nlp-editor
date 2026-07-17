# Carbon Migrate front-end-developer — Technical Specification

> Runtime values, workflow steps, eval criteria, git rules, and the status contract
> are all in `.carbon-migration/AGENT_PROMPT_RESUME.md`. This file covers only the
> supplementary guidance not present there.

---

## Migration Context

Local migration reference files are available in `.carbon-migration/migration-context/`.

**Always read INDEX.md first.** It contains strict load rules — do not open any other file in that directory without checking INDEX.md first.

- **Component maps:** `.carbon-migration/migration-context/maps/<source_framework>.md` — prop mappings, structural changes, complexity, Carbon imports
- **Scaffold templates:** `.carbon-migration/migration-context/templates/<build_tool>.md` — install commands, critical pitfalls, file manifest, verification steps
- **UI patterns:** `.carbon-migration/migration-context/patterns/carbon-patterns.md` — Carbon pattern detection signals and key principles (load only if a pattern match is confirmed)
- **Load rules:** `.carbon-migration/migration-context/INDEX.md` — trigger conditions, alias table, framework version disambiguation

## Carbon MCP Tool Usage

### Carbon API verification budget — once per component

Verifying Carbon APIs against the `carbon-builder` skill / Carbon MCP is required for correctness; keep it token-conservative by verifying each component once, not repeatedly.

- **Source order.** Use (1) the `carbon-builder` skill, then (2) Carbon MCP directly (`code_search`/`docs_search`/`get_charts`); fall back to (3) model memory only when Carbon MCP is unreachable (log `⚠️ MCP UNAVAILABLE`).
- **Once per component, then cache.** Verify each distinct component at most ONCE per unit, cover everything you need in that single lookup, and record it in `CARBON_MIGRATION_LEDGER.md`. Reuse that entry — never re-verify a component you already confirmed.
- **Always verify icon/pictogram export names** via `code_search` (`asset_type:"icon"`); a wrong name is a catastrophic build break. On a build/type error, re-check the implicated component.
- **Right time only.** Verify when you write/fix a component — not during Phase 0, and not again at each step. A prop you already confirmed correct is not re-checked.

### `code_search`

Use `code_search` when the migration needs Carbon implementation references or existing examples, and to verify icon/pictogram export names (`asset_type:"icon"`). Consult it per the **Carbon API verification budget** above — the `carbon-builder` skill / Carbon MCP are the source of truth (model memory only as a fallback); look each component up at most once per unit. Do not re-query a component you already verified.

### `get_charts`

Use `get_charts` when the migration needs Carbon chart-specific patterns.

### `docs_search`

Use `docs_search` for design guidance, accessibility requirements, component usage rules, and SCSS specifications.

---

## Write Mode

In supervised mode, migration edits happen in place on the checked out branch.

The generated prompt unit file list is authoritative for writable migration scope.

---

## Migration Quality Tenets (MANDATORY)

Every migration output must satisfy all three tenets. These are non-negotiable.

1. **Enterprise quality** — robust, elegant, fully accessible (WCAG 2.2).
2. **Production-ready** — shippable without rework; no stubs, TODOs, or placeholders.
3. **Preserve UI → middleware → backend contracts** — before editing any component, trace its API calls, state management hooks, data-fetching patterns, event handlers, route transitions, and prop/context contracts. The migrated component must honour every contract the source relied on. A UI framework swap does not justify breaking data flow or backend integration.
4. **Complete source framework neutralization** — migration is not complete until all source framework artifacts are removed from every in-scope file: imports and `require()` calls, CSS class names and utility classes, framework-specific markup or wrapper elements, and any `className`/`style` values derived from the source framework. A file with Carbon added but source artifacts remaining is broken, not migrated.
5. **Carbon MCP and the `carbon-builder` skill are the preferred source of ground truth for Carbon component code** — consult the `carbon-builder` skill (preferred), then Carbon MCP (`code_search`, `docs_search`, `get_charts`) directly, falling back to model memory only when Carbon MCP is unreachable; verify each component per the **Carbon API verification budget** in "Carbon MCP Tool Usage" above — at most once per unit. If MCP is unreachable, proceed from model knowledge, log `⚠️ MCP UNAVAILABLE` in `CARBON_MIGRATION_LEDGER.md` for each affected component, and flag the output for downstream review. Do not abort the run — uptime is mandatory.
6. **Package API verification — MANDATORY** — Inventing an export name or subpath that does not exist in the installed package is a catastrophic failure (the build will not complete). Treat every `@carbon/*` import as untrusted until verified. Two ❌ INVALID example shapes that have shipped broken UIs: `import { TrendingUp } from '@carbon/icons-react'` (named export does not exist) and `import '@carbon/react/scss/index.scss'` (subpath absent from `exports` field). Verify every Carbon import via `code_search` (names) or `docs_search` + the package's `exports` field (subpaths) BEFORE writing it. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full procedure: `MIGRATION_AGENT_PROTOCOL.md` §1.3.

---

## Migration Boundary Constraint (MANDATORY)

This migration targets front-end UI source files only. The repository may also contain
server-side logic, API handlers, middleware, data models, background workers, and shared
infrastructure. Those files exist outside the **migration boundary**.

### Files outside the migration boundary

Do NOT modify their logic, exports, function signatures, or module interfaces.
Do NOT reorganise, rename, or move these files.
Do NOT change how they are called, invoked, or imported.

Common patterns excluded from the migration boundary:
  (defaults — see SOURCE_SCOPING in supervisor_config.json)

### Files inside the migration boundary that call outside it

If a component you are migrating imports from a server-side module or calls an API:

- Preserve the existing import path exactly as-is (unless it is itself a legacy framework artefact).
- Preserve all calling conventions, prop shapes passed to API clients, and data-fetching patterns.
- Migrate the component's UI layer only — not the service it calls.
- After migration, the component must remain **fully backwards-compatible** with the same server contracts it relied on before.

The migration boundary is defined in SOURCE_SCOPING configuration.
Files outside that boundary are context — not targets.

### Uncertainty → deviation, never blocked (1.2.0)

When you encounter an unknown pattern, an approximation, or a case where
you are not sure what the Carbon equivalent should be, continue with your
best attempt AND log a deviation entry in your per-session shard file at
`.carbon-migration/deviations/<role>-<session_id>.md`. Do not return
`blocked` or `failed`; those statuses are retired. Exit states are only
`continue` or `done`.

---

## Deviation Emission Protocol (MANDATORY)

Your session is one of several that contribute to this job. At the end of
the job a consolidated `DEVIATIONS_FOR_REVIEW.md` at the target repo
root collects every uncertainty, approximation, and assumption the pipeline
made, for human review of the draft PR.

### Your responsibility

While you work, whenever you make a choice you are not fully confident in,
append an entry to your shard file at:

```
.carbon-migration/deviations/<your-role>-<your-session-id>.md
```

Commit the shard file along with your regular code changes. Do not try
to write the final `DEVIATIONS_FOR_REVIEW.md` — that is built by the
`deviation-completeness-audit` role at job finalization from all shards.

### Entry format (spec §8.3)

Each entry is a small markdown block with five fields:

```markdown
- Description: <= 250 characters, single summary sentence
  File: `path/to/file.js`
  Lines: 42–58
  Agent: <your-role>
  What the system did: preserved-source | best-guess-carbon | wrapper-added | todo-comment-added | partial-migration | stub-inserted | no-change | other
```

Descriptions longer than 250 characters are automatically truncated at
consolidation time. `What the system did` values outside the closed
enum are coerced to `other`.

### Examples of cases that warrant a deviation

- a removed-icon substitution where you chose a similar-looking icon
- a Tabs refactor where the original used renderAnchor/renderButton/renderContent
- an interactive-notification migration to ActionableNotification
- a custom CSS selector reshape needed because className now targets the outermost element
- a SCSS prefix retention (`.bx-` kept via prefix override) that you expect to clean up later

### What NOT to log as deviations

- Ordinary successful migrations where the map gave a clear answer and
  you applied it.
- Style tweaks or Carbon-token adjustments that are standard design-system
  practice.
- Work that is out of scope for your unit (those are another agent's
  concern; leave them alone, do not log a shadow entry).

### Status contract (spec §7.1)

Your exit states are only `continue` or `done`. Do not return
`blocked`, `failed`, `needs_architect`, or `needs_human_*`.
Uncertainty becomes a deviation entry and you keep going. True
infrastructure failures are the supervisor's concern — it writes
`infra_failed` after its retry ladder exhausts. You never do.

---

## 9. Cross-language coupling — MANDATORY when ENABLE_CROSS_LANGUAGE_COUPLING is on

When the supervisor sets `ENABLE_CROSS_LANGUAGE_COUPLING=true`, you receive a per-unit
context block from the supervisor. You MUST consume it. See
[CROSS_LANGUAGE_COUPLING.md](../../../CROSS_LANGUAGE_COUPLING.md) for full design.

### MANDATORY first read at every unit start

Before reading ANY source file, you MUST read:

1. `.carbon-migration/unit-context/<unit_id>.md` — the supervisor's deterministic
   context block for this unit. Lists exactly what files to modify, what files
   are read-only context, what API contracts you have access to, and what
   Carbon component mappings the architect resolved.
2. `.carbon-migration/unit-context/<unit_id>.json` — same data in structured form,
   for tools that prefer JSON.
3. `.carbon-migration/component-mappings-resolved.json` — architect-resolved
   source→Carbon component mapping table. Use these mappings; do NOT invent.

If `.carbon-migration/unit-context/<unit_id>.md` is missing AND
ENABLE_CROSS_LANGUAGE_COUPLING is on, exit `blocked` with:

- `status: "blocked"`
- `message:` "Unit context file missing: .carbon-migration/unit-context/<unit_id>.md.
  Supervisor failed to provide V2 cross-language inputs. Cannot proceed without
  guessing component mappings or API contracts."

Use `blocked` (not `failed`) here because the convention in this codebase is
that `blocked` signals "I'm waiting on a missing input the supervisor can
provide" while `failed` signals "I tried and the work itself didn't succeed."
Both are coerced to `infra_failed` by the supervisor's status canonicalizer
(see `sessionStatus.js::LEGACY_STATUS_MAP`), but the message field carries
the semantic distinction into operator-facing logs.

If `.carbon-migration/component-mappings-resolved.json` is present but the
unit references tags that aren't in it, exit `blocked` with the missing tag
names — the architect needs to resolve them before this unit can proceed.

### MANDATORY component mapping behavior

For every source-framework component (e.g. JSP `<itim:WBoxLayout>`) you encounter
in your TARGET FILES:

1. Look up the mapping in `.carbon-migration/component-mappings-resolved.json`.
2. Use the `carbon_component_name` and `carbon_import_path` from that entry.
3. NEVER invent a Carbon mapping. If a tag is missing from the mapping table,
   exit `blocked` with the missing tag in your message — do not guess.

### MANDATORY API client usage

For every backend call your TARGET FILES make:

1. Look up the matching API contract in the unit-context (or in
   `.carbon-migration/api-contracts.json`).
2. Import and call the architect-generated typed function from
   `<NEW_APP_ROOT>/src/api/<contract_name>.ts`.
3. NEVER write `fetch(...)` directly. NEVER write `$.ajax(...)`. NEVER write
   `axios(...)`. Every backend call goes through the typed client. The reviewer
   verifies this and rejects the migration if it finds raw fetch.

### MANDATORY middleware contract usage (Phase 21)

When the architect generated middleware-aware scaffold files (look for
non-empty `<NEW_APP_ROOT>/src/auth/`):

1. **Import the auth provider/store from `<NEW_APP_ROOT>/src/auth/`** —
   `AuthProvider` + `useAuth` (React) or `authStore` (Web Components). NEVER
   roll your own auth context, store, or provider. The architect already wired
   it to the source app's auth strategy.
2. **Use architect-generated typed-client functions for ALL backend calls.**
   These already have the auth strategy wired (header attachment / cookie mode
   / CSRF token plumbing). Raw `fetch()` is rejected (already in §9; restated).
3. **Wrap protected routes with the architect-generated `ProtectedRoute`**
   (React) or **register the router guard with `installAuthGuard(router)`**
   (Web Components). NEVER hand-roll auth checks in your component.
4. **Login page** — import `LoginPage` (React) or use the `<app-login>` custom
   element (Web Components) from `<NEW_APP_ROOT>/src/auth/`. Do not create a
   second login form.
5. **Conditional middleware** — if `<NEW_APP_ROOT>/src/auth/CONDITIONAL.md` is
   present, the source app's middleware was environment-conditional and a
   manual deviation review is required. Surface the conditional in your
   migration notes and exit `blocked` with the deviation id.

### MANDATORY i18n behavior

For every user-facing string your TARGET FILES emit:

1. Look up the architect-generated i18n key in the unit-context or in
   `<NEW_APP_ROOT>/src/i18n/<bundle>.<locale>.json`.
2. Use the key via the architect's i18n hook/import (e.g. `t('key')`).
3. NEVER hardcode user-facing strings in JSX. The reviewer verifies this.

### MANDATORY status reporting

Your `status.json` must conform to `STATUS_JSON_SCHEMA` in
`carbon-migrate/src/services/sessionStatus.js`:

- `status` ∈ `{continue, done, done_no_op, blocked, failed}` (you do NOT write
  `infra_failed` — that's supervisor-only)
- `message` is a non-empty string ≥ 5 chars
- `progress_marker` matches `/^[A-Za-z0-9_-]+$/`, ≤ 200 chars
- If `status === "done_no_op"`, `no_op_reason` is REQUIRED and must explain
  WHY no migration was possible (e.g. "all unit files were Java applet code,
  out of FED scope")

### MANDATORY done_no_op behavior

The supervisor verifies your status with `git diff` after exit. If you claim
`status: "done"` but produced no commits in unit scope, the supervisor
will RECLASSIFY your status to `done_no_op` automatically. To avoid this
override:

- If you actually completed migration work and committed, write `done`.
- If you determined the unit had no migratable source (e.g. all out-of-scope),
  write `done_no_op` with `no_op_reason`.
- If you don't know whether to write `done` or `done_no_op`, just write what's
  true: did you produce any commits? `done` if yes, `done_no_op` if no.

NEVER write `done` to "make the run look successful" when you produced no
commits. The supervisor catches it. The user sees "Skipped (no work)" instead
of "Migrated" — which is the correct outcome.

### MANDATORY: do not edit out-of-scope files

The supervisor's deterministic eval gate runs `git diff --name-only` and RECORDS
any modified file outside your unit's `target_files` as an out-of-scope edit.
That edit is NOT merged — only your scoped changes are salvaged, so out-of-scope
work is discarded when the next unit checks out. Staying in scope is how your
work survives.
The architect-generated scaffold files in `<NEW_APP_ROOT>/src/api/`,
`<NEW_APP_ROOT>/src/i18n/`, `<NEW_APP_ROOT>/src/components/` are also off-limits
for direct edit (you import from them, you do not modify them). If you need to
change them, that's a job for the architect's next iteration — file a deviation.
