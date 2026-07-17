# Svelte / SvelteKit → Carbon Web Components Migration Map

> Source: svelte (Svelte 3 / 4 / 5), SvelteKit
> Target: carbon-web-components (`@carbon/web-components`) — Carbon's framework-agnostic custom elements
> Last updated: 2026-04
> Docs: <https://web-components.carbondesignsystem.com>

**LOAD RULE:** Load this file only when `source_framework` is `svelte`. Load ONCE per session. This map targets `@carbon/web-components` because `@carbon/react` is React-only and cannot be consumed from Svelte. Do NOT attempt to migrate a Svelte repo to `@carbon/react` — if the user requests that path, flag the mismatch in the ledger and stop. A framework-era-swap Svelte → React + `@carbon/react` is out of scope for this map.

**CO-LOCATED PRECEDENT OVERRIDE:** If the target repo has a partially-migrated area where `@carbon/web-components` is already present alongside Svelte components — the prior team's translation choices (how they handle events, two-way bindings, reactive statements) are authoritative. Follow those; log a deviation only when this map would yield a different result.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Why Carbon Web Components for Svelte

Svelte has **first-class custom-elements support**: the framework defers unknown lowercase-hyphenated tags to the browser's custom-elements registry, meaning `<cds-button>` works out of the box with zero configuration. Svelte's event system also transparently catches native `CustomEvent`s, so `on:cds-modal-closed={handler}` Just Works.

The integration is the smallest of any framework Carbon supports:

1. Import the web-component side-effect once at app boot.
2. Use the element in Svelte markup.
3. Bind non-string data via the `{name}` attribute — Svelte sets properties (not attributes) automatically for known element properties.
4. Listen for custom events with `on:cds-…`.

No wrapper components. No compiler configuration. No plugin.

---

## Quick Reference — Svelte / raw HTML patterns → Carbon Web Components

Carbon Web Components use the `cds-` prefix. Names match `@carbon/react` 1:1 where possible.

| Source pattern | Carbon web-component | Complexity |
|---|---|---|
| `<button>` (styled) | `<cds-button>` | low |
| `<input type="text">` | `<cds-text-input>` | low |
| `<input type="password">` | `<cds-password-input>` | low |
| `<input type="number">` | `<cds-number-input>` | low |
| `<input type="checkbox">` | `<cds-checkbox>` | low |
| `<input type="radio">` | `<cds-radio-button>` inside `<cds-radio-button-group>` | low |
| `<input type="file">` | `<cds-file-uploader>` | medium |
| `<input type="search">` | `<cds-search>` | low |
| `<textarea>` | `<cds-textarea>` | low |
| `<select>` | `<cds-select>` + `<cds-select-item>` or `<cds-dropdown>` | medium |
| Custom autocomplete | `<cds-combo-box>` | medium |
| Toggle / switch | `<cds-toggle>` | low |
| Dialog / modal | `<cds-modal>` + slotted header/body/footer | medium |
| Tooltip | `<cds-tooltip>` | medium |
| Popover | `<cds-popover>` | medium |
| Inline alert | `<cds-inline-notification>` | low |
| Toast notification | `<cds-toast-notification>` | low |
| Progress bar | `<cds-progress-bar>` | low |
| Spinner | `<cds-loading>` / `<cds-inline-loading>` | low |
| Tabs | `<cds-tabs>` + `<cds-tab>` + `<cds-tab-content>` | medium |
| Accordion | `<cds-accordion>` + `<cds-accordion-item>` | low |
| Tag / badge | `<cds-tag>` | low |
| Breadcrumb | `<cds-breadcrumb>` + `<cds-breadcrumb-item>` | low |
| Pagination | `<cds-pagination>` | low |
| Data table | `<cds-table>` + table-family slots | high |
| Side nav | `<cds-side-nav>` + `<cds-side-nav-link>` | medium |
| App header | `<cds-header>` + `<cds-header-name>` + `<cds-header-nav>` + `<cds-header-menu-item>` | high |
| Tile / card | `<cds-tile>`, `<cds-clickable-tile>`, `<cds-expandable-tile>` | low |

---

## Core migration patterns

### 1. Install + runtime setup

**SvelteKit / Vite:**

```bash
npm install @carbon/web-components @carbon/styles
```

`src/app.html` — load Carbon styles once:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="/node_modules/@carbon/styles/css/styles.css">
  </head>
  <body>%sveltekit.body%</body>
</html>
```

(For production, import `@carbon/styles/scss/styles` via Vite's asset pipeline instead of linking to `node_modules`.)

`src/lib/carbon.ts` (or `carbon.js`) — register the components you use:

```ts
// Side-effect imports — each registers one custom element with the
// browser. Importing only what you use keeps the bundle lean.
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/text-input/index.js';
import '@carbon/web-components/es/components/modal/index.js';
// …
```

Import this helper once at app start. In SvelteKit, `src/routes/+layout.ts` or the root `+layout.svelte` is the right place — the browser-only dependency is safe to import there.

**Svelte (non-Kit, Vite):**

Same install and side-effect imports. Register them in `src/main.ts`:

```ts
import './lib/carbon.js';
import './app.css';
import App from './App.svelte';
new App({ target: document.getElementById('app')! });
```

### 2. Attributes vs. properties — Svelte handles this for you

Unlike Vue (where you need `.prop`) or React (where you need refs for non-string props), **Svelte's compiler inspects the custom element's registry and sets properties directly when available, falling back to attributes when not**. This means:

```svelte
<cds-text-input
  label-text="Username"
  value={username}
  disabled={isDisabled}
  required={true}
/>
```

…binds `value`, `disabled`, and `required` as element *properties* (typed correctly as string / boolean / boolean), not as attribute strings. No `.prop` modifier needed.

### 3. Two-way binding

Svelte's `bind:` shorthand works with any DOM property that has a matching change event. Carbon web-components expose value-like properties with corresponding events, so:

```svelte
<script>
  let username = '';
</script>

<cds-text-input
  label-text="Username"
  bind:value={username}
/>
```

For components where `bind:value` doesn't introspect cleanly (Svelte can't always guess which event to listen for on custom elements), expand manually:

```svelte
<cds-combo-box
  label-text="Fruit"
  value={fruit}
  on:cds-combo-box-selected={(e) => fruit = e.detail.item.value}
>
  <cds-combo-box-item value="apple">Apple</cds-combo-box-item>
  <cds-combo-box-item value="banana">Banana</cds-combo-box-item>
</cds-combo-box>
```

### 4. Custom events

Svelte's `on:` directive catches native `CustomEvent`s directly — no special prefix handling:

```svelte
<cds-modal open={isOpen} on:cds-modal-closed={() => isOpen = false}>
  …
</cds-modal>
```

The payload is the standard `CustomEvent` — access `event.detail` inside the handler.

Common events:

| Component | Events |
|---|---|
| `<cds-modal>` | `cds-modal-beingclosed`, `cds-modal-closed` |
| `<cds-dropdown>` | `cds-dropdown-beingselected`, `cds-dropdown-selected` |
| `<cds-combo-box>` | `cds-combo-box-beingselected`, `cds-combo-box-selected` |
| `<cds-tabs>` | `cds-tabs-beingselected`, `cds-tabs-selected` |
| `<cds-checkbox>` | `cds-checkbox-changed` |
| `<cds-number-input>` | `cds-number-input` |

### 5. Slots

Carbon web-components use named slots for composition (e.g. `<cds-modal-header>` goes in the modal's header slot). Svelte's `<slot name="…">` is on the *Svelte* component side — for custom elements, pass children the normal way and they land in the web-component's shadow DOM slot via the `slot="…"` attribute:

```svelte
<cds-modal open={isOpen}>
  <cds-modal-header>
    <cds-modal-close-button />
    <cds-modal-label>Item controls</cds-modal-label>
    <cds-modal-heading>Delete item</cds-modal-heading>
  </cds-modal-header>
  <cds-modal-body>
    <p>This cannot be undone.</p>
  </cds-modal-body>
  <cds-modal-footer>
    <cds-modal-footer-button kind="secondary" data-modal-close>Cancel</cds-modal-footer-button>
    <cds-modal-footer-button kind="danger" on:click={confirmDelete}>Delete</cds-modal-footer-button>
  </cds-modal-footer>
</cds-modal>
```

The modal-family sub-elements project into named slots automatically.

### 6. Reactive assignments with Carbon state

Svelte's reactivity works transparently through web-component properties. Example — gated button state driven by form validity:

```svelte
<script>
  let user = '';
  let pw = '';

  $: canSubmit = user.length > 0 && pw.length >= 8;
</script>

<cds-text-input label-text="User" bind:value={user} />
<cds-password-input label-text="Password" bind:value={pw} />
<cds-button disabled={!canSubmit} on:click={submit}>Sign in</cds-button>
```

`disabled={!canSubmit}` re-evaluates whenever `user` or `pw` changes — Svelte sets the boolean property on `<cds-button>` directly.

### 7. SCSS / styles wiring

**Option A — Import compiled CSS once** (simplest):

```js
// in +layout.svelte or main.ts
import '@carbon/styles/css/styles.css';
```

**Option B — Sass `@use` via Vite / preprocessors** (finer control):

```scss
// src/app.scss
@use '@carbon/styles';
```

Then either link `app.scss` from `app.html` or import it in the root layout.

Svelte's `<style>` block is component-scoped. That scoping only applies to Svelte-authored markup, not the shadow-DOM content inside `<cds-*>` elements. To theme a Carbon web-component's internal text, colours, etc., use Carbon's CSS Custom Properties:

```svelte
<style>
  .brand-accent {
    --cds-interactive: #0f62fe;
  }
</style>

<div class="brand-accent">
  <cds-button>Primary</cds-button>
</div>
```

---

## Component-by-component detail

### Button

**Carbon:** `<cds-button>`, `<cds-icon-button>`
**Import:** `import '@carbon/web-components/es/components/button/index.js'`
**Complexity:** low

```svelte
<cds-button kind="primary" size="md" on:click={handleSave}>Save</cds-button>
<cds-button kind="danger" on:click={handleDelete}>Delete</cds-button>
```

**Kind values:** `primary` (default), `secondary`, `tertiary`, `ghost`, `danger`, `danger-tertiary`, `danger-ghost`.

**Icon-only button:**

```svelte
<script>
  import '@carbon/web-components/es/components/icon-button/index.js';
</script>

<cds-icon-button aria-label="Delete" kind="ghost" on:click={handleDelete}>
  <!-- Inline SVG or <cds-icon> child -->
  <svg slot="icon">…</svg>
</cds-icon-button>
```

### TextInput family

**Carbon:** `<cds-text-input>`, `<cds-number-input>`, `<cds-password-input>`, `<cds-textarea>`
**Import:** per-component
**Complexity:** low

```svelte
<script>
  let username = '';
  let err = '';
  $: invalid = err.length > 0;
</script>

<cds-text-input
  label-text="Username"
  placeholder="ex: scottw1"
  bind:value={username}
  invalid={invalid}
  invalid-text={err}
  required
/>
```

Every input variant requires `label-text`. Use `helper-text` for non-error guidance and `invalid-text` (with `invalid={true}`) for error state. Warn state uses `warn={true}` + `warn-text`.

---

### Select / Dropdown / ComboBox

**Carbon:** `<cds-select>`, `<cds-dropdown>`, `<cds-combo-box>`, `<cds-multi-select>`
**Import:** per-component
**Complexity:** medium — selection events differ from native `<select>`.

```svelte
<script>
  let fruit = 'apple';
</script>

<cds-dropdown
  label-text="Fruit"
  value={fruit}
  on:cds-dropdown-selected={(e) => fruit = e.detail.item.getAttribute('value')}
>
  <cds-dropdown-item value="apple">Apple</cds-dropdown-item>
  <cds-dropdown-item value="banana">Banana</cds-dropdown-item>
  <cds-dropdown-item value="cherry">Cherry</cds-dropdown-item>
</cds-dropdown>
```

For `<cds-combo-box>` (autocomplete), the event payload is the same shape — read `event.detail.item.value` (property) or `event.detail.item.getAttribute('value')` (attribute) for the selection. For `<cds-multi-select>`, read `event.detail.items` (array).

---

### Modal

**Carbon:** `<cds-modal>` + `<cds-modal-header>` + `<cds-modal-body>` + `<cds-modal-footer>` + `<cds-modal-footer-button>`
**Import:** `import '@carbon/web-components/es/components/modal/index.js'`
**Complexity:** medium

```svelte
<cds-modal open={isOpen} on:cds-modal-closed={() => isOpen = false} size="sm" danger>
  <cds-modal-header>
    <cds-modal-close-button />
    <cds-modal-label>Item controls</cds-modal-label>
    <cds-modal-heading>Delete item</cds-modal-heading>
  </cds-modal-header>
  <cds-modal-body>
    <p>This action cannot be undone.</p>
  </cds-modal-body>
  <cds-modal-footer>
    <cds-modal-footer-button kind="secondary" data-modal-close>Cancel</cds-modal-footer-button>
    <cds-modal-footer-button kind="danger" on:click={confirmDelete}>Delete</cds-modal-footer-button>
  </cds-modal-footer>
</cds-modal>
```

`data-modal-close` closes the modal without a listener. The component handles focus trap, ESC key, and scroll lock automatically.

---

### DataTable

**Carbon:** `<cds-table>` family (see `maps/vue.md` for the same composition — identical in Svelte)
**Import:** `import '@carbon/web-components/es/components/data-table/index.js'`
**Complexity:** high

```svelte
<script>
  export let rows = [];
</script>

<cds-table>
  <cds-table-head>
    <cds-table-header-row>
      <cds-table-header-cell>Name</cds-table-header-cell>
      <cds-table-header-cell>Status</cds-table-header-cell>
      <cds-table-header-cell>Created</cds-table-header-cell>
    </cds-table-header-row>
  </cds-table-head>
  <cds-table-body>
    {#each rows as row (row.id)}
      <cds-table-row>
        <cds-table-cell>{row.name}</cds-table-cell>
        <cds-table-cell>
          <cds-tag type={row.statusColor}>{row.status}</cds-tag>
        </cds-table-cell>
        <cds-table-cell>{row.createdAt}</cds-table-cell>
      </cds-table-row>
    {/each}
  </cds-table-body>
</cds-table>
```

`{#each}` key via `(row.id)` is Svelte's stable-key syntax — matches what Carbon expects for stable DOM across re-renders.

---

### Header / navigation shell

**Carbon:** `<cds-header>` + `<cds-header-name>` + `<cds-header-nav>` + `<cds-header-nav-item>` + `<cds-header-global-action>` + `<cds-side-nav>` + `<cds-side-nav-link>` + `<cds-skip-to-content>`
**Import:** `import '@carbon/web-components/es/components/ui-shell/index.js'`
**Complexity:** high

```svelte
<script>
  let sideNavOpen = false;
</script>

<cds-header aria-label="App">
  <cds-skip-to-content />
  <cds-header-menu-button
    button-label-active="Close menu"
    button-label-inactive="Open menu"
    on:click={() => sideNavOpen = !sideNavOpen}
  />
  <cds-header-name prefix="IBM" href="/">Carbon App</cds-header-name>
  <cds-header-nav aria-label="Primary">
    <cds-header-nav-item href="/catalog">Catalog</cds-header-nav-item>
    <cds-header-nav-item href="/orders">Orders</cds-header-nav-item>
  </cds-header-nav>
  <cds-header-global-action aria-label="Profile" on:click={openProfile}>
    <!-- icon slot -->
  </cds-header-global-action>
</cds-header>

<main style="padding-top: 48px;">
  <slot />
</main>
```

---

### Notifications

**Carbon:** `<cds-inline-notification>`, `<cds-actionable-notification>`, `<cds-toast-notification>`
**Import:** per-component

```svelte
{#if error}
  <cds-inline-notification
    kind="error"
    title="Authentication failed"
    subtitle={error}
    on:cds-notification-closed={() => error = ''}
  />
{/if}
```

`kind` values: `error`, `info`, `info-square`, `success`, `warning`, `warning-alt`.

`<cds-toast-notification>` is designed for viewport-edge positioning. Place it in a portal-like container (`#svelte-head`, a layout-level fixed-position div, or similar) — Carbon does not ship a toast-queue manager; that's a layer above the component.

---

## SvelteKit-specific notes

### Server-side rendering (SSR)

Carbon web-components require `window.customElements`, which is not available during SvelteKit server-side rendering.

Three strategies:

**A. Browser-only imports (cleanest for SvelteKit):**

```svelte
<!-- +layout.svelte -->
<script>
  import { onMount } from 'svelte';

  onMount(async () => {
    await import('$lib/carbon.js');
  });
</script>

<slot />
```

Web-component registration happens in `onMount`, which never runs on the server. The initial SSR pass renders the `<cds-*>` tags as plain unknown elements; hydration upgrades them.

**B. Explicit `browser` guard:**

```svelte
<script>
  import { browser } from '$app/environment';
  if (browser) {
    import('$lib/carbon.js');
  }
</script>
```

**C. `ssr: false` at the route level:**

```js
// +page.js or +layout.js
export const ssr = false;
```

Disables SSR entirely for that route — simplest for admin dashboards where SEO doesn't matter.

### SvelteKit forms (progressive enhancement)

Carbon's `<cds-text-input>` renders a real `<input>` inside its shadow DOM — so SvelteKit's form actions work naturally:

```svelte
<form method="POST" action="?/signIn">
  <cds-text-input name="username" label-text="Username" />
  <cds-password-input name="password" label-text="Password" />
  <cds-button type="submit">Sign in</cds-button>
</form>
```

The `name` attribute is forwarded to the inner `<input>`, so the form submit carries the value correctly.

---

## Svelte 5 notes (runes)

Svelte 5's `$state`, `$derived`, `$effect` runes work transparently with Carbon web-components. The property-binding and event-listener mechanics are unchanged from Svelte 4.

```svelte
<script>
  let username = $state('');
  let pw = $state('');
  let canSubmit = $derived(username.length > 0 && pw.length >= 8);
</script>

<cds-text-input label-text="User" bind:value={username} />
<cds-password-input label-text="Password" bind:value={pw} />
<cds-button disabled={!canSubmit} onclick={submit}>Sign in</cds-button>
```

(Note: Svelte 5 prefers `onclick` over `on:click` — both work on custom elements during the Svelte 4 → 5 transition.)

---

## Common gotchas

| Gotcha | Fix |
|---|---|
| `<cds-button>` renders unstyled | Confirm `@carbon/styles/css/styles.css` is loaded (linked in `app.html` or imported at entry). |
| `ReferenceError: customElements is not defined` during SSR | Move the web-component import into `onMount` or guard with `browser` from `$app/environment`. |
| `bind:value` on `<cds-combo-box>` doesn't work | Expand to `value={x} on:cds-combo-box-selected={e => x = e.detail.item.value}`. |
| Boolean prop renders as the string "true" | Svelte usually sets the property, not the attribute. If you see this, remove any explicit `true/false` strings (`disabled={true}` not `disabled="true"`). |
| Icon slot is empty | Carbon web-components expect an `slot="icon"` attribute on the icon child (or inside a named slot element). |
| Event handler doesn't fire | Check the event name includes the `cds-` prefix (`on:cds-modal-closed`, not `on:close`). |
| Focus escapes modal | Ensure `open` is a boolean, not a string. Svelte should handle this automatically. |
| Scoped CSS doesn't reach inside `<cds-*>` | Shadow DOM is isolated. Use CSS custom properties (`--cds-…` tokens) to theme from outside. |
| Svelte 5 `onclick` vs `on:click` | Both work. The project's convention is what matters — follow co-located precedent if present. |
| `aria-label` required warning | Icon-only `<cds-icon-button>` and `<cds-header-global-action>` require `aria-label`. Add one. |

---

## Deviation triggers

Log `What the system did: best-guess-carbon` when:

- A Svelte Material UI (SMUI) / Skeleton component doesn't have a direct Carbon equivalent — picked the closest composition.
- A Svelte `<transition>` / `crossfade` animation doesn't line up with Carbon motion tokens — replaced with a simple fade.

Log `What the system did: preserved-source` when:

- A Svelte component uses Svelte-specific slot features (named slots with exposed props via `let:`) that don't map to web-component slot semantics — kept the Svelte component unchanged and wrapped its children individually.
- A Svelte store binding was load-bearing and couldn't be trivially translated to a `bind:value` pattern.

Log `What the system did: wrapper-added` when:

- You introduced a `CarbonTextInput.svelte` wrapper to match an existing internal component API the codebase uses in many places.

Log `What the system did: partial-migration` when:

- A page uses both legacy Svelte Flowbite/Skeleton components and new Carbon side-by-side during a staged rollout.

---

## References

- <https://web-components.carbondesignsystem.com> — component catalog with live examples for every `cds-*` element.
- <https://web-components.carbondesignsystem.com/?path=/docs/integrations-svelte--docs> — official Svelte integration guide.
- <https://custom-elements-everywhere.com/#svelte> — independent scoring of Svelte's custom-element support (consistently 100%).
- <https://carbondesignsystem.com/guidelines/> — design guidance (framework-agnostic).
