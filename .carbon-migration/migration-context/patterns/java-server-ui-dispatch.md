# Java Server UI — Single-Dispatcher Strangler-Fig Pattern

> **Load rule:** this file is loaded on trigger when the FED agent or
> Architect encounters a single-dispatcher servlet in the source tree
> during a `platform-modernize` job. Typical trigger: a Java class named
> `*ControlServlet.java` or similar, referenced by many views via a
> `TaskIdConstants`-style routing table. Loaded ONCE per session.

---

## What this pattern is

Some Java server-UI frameworks don't use a servlet-per-page model.
Instead a **single controller servlet** dispatches to many view classes
by a task/command ID constant. The servlet resolves the ID to a View
class; the View constructs PSW widgets; PSW renders HTML.

Canonical example — IBM Tivoli Identity Manager's `ITIMControlServlet.java`:

```
HTTP request → ITIMControlServlet.doGet()
               → look up taskId in TaskIdConstants
               → resolve to a com.ibm.itim.ui.view.* class
               → create the View, hand it a CommandEvent
               → View builds a PSW widget tree and renders
```

No per-task `.jsp` file. No `<url-pattern>` per page in `web.xml`. One
servlet. Many task IDs. Many View classes.

## Why it matters for migration

The URL space is owned by the dispatcher. You **cannot** replace one
page at a time by editing `web.xml` mappings — the mapping layer
doesn't exist. Strangler-Fig cutover happens **per task ID**, not per
URL path.

## The cutover protocol

For each source view being migrated:

1. **Mount the new React app at a new path** (e.g. `/im/react/`) served
   from `<new_app_root>`. Do NOT try to replace the dispatcher.
2. **Add a redirect branch** to the dispatcher for the migrated taskId:
   when the servlet receives the taskId, respond with an HTTP 302 to
   the React route (or render a tiny shim HTML that loads the React
   app at the equivalent deep-link path). Keep all non-migrated task
   IDs flowing through the legacy dispatcher unchanged.
3. **Do NOT modify `TaskIdConstants`** or the legacy dispatch table
   while pages are still in flight — the servlet must continue to
   resolve old task IDs for un-migrated pages.
4. **REST endpoints called by React** live in ADMIN_REST / ISVG_REST
   (or equivalent), NOT inside the dispatcher. The dispatcher's only
   migration-facing change is the redirect table.
5. **Last step** (after 100% of views migrated): delete the dispatcher
   + the View classes. NOT before.

## Integration-point boundary

The dispatcher file is an **integration point** under platform-modernize's
three-scope write model (§7 of the 1.3.0 spec):

- Architect's apply phase MAY append redirect lines.
- Each redirect write emits ONE `write-scope-exception-granted`
  deviation keyed on `{taskId} → {reactRoute}`.
- Nothing else in the dispatcher file is editable. The supervisor's
  filesystem guard reverts unrelated writes.

## Preservation contract

- `TaskIdConstants` string values — must not change. They are logged,
  referenced by audit systems, and possibly bookmarked.
- `CommandEvent` shape as seen by backend code paths outside the view
  tree — must not change. Other modules may consume it.
- Auth/session attributes on `SessionWrapper` (or the framework's
  equivalent) — must not change. CSRF + cookie continuity depends on it.
- Any calls into `com.ibm.websphere.security` or equivalent — must not
  change. Auth boundary belongs to the backend.

## What changes

- The View class for a migrated taskId becomes dead code. Delete only
  after full cutover.
- The dispatcher gains a redirect branch per migrated taskId (small,
  additive).
- Breadcrumb / navigation state previously held in session moves to
  React router state.

## Load signals

- Reference to a single-dispatcher servlet name (e.g., `ITIMControlServlet`,
  `FrontController`, `MainServlet`)
- References to `TaskIdConstants.*` or equivalent
- `CommandInfo`, `ListenerHelper`, `SessionWrapper` imports
- Any `setForward(` calls

## Related

- `patterns/java-server-ui-i18n-bridge.md` — i18n continuity across the cutover
- `scaffolds/java-server-ui-to-carbon-react.md` — the broader bootstrap recipe
- 1.3.0 spec §7 — three-scope write model + integration-point rules
