# Vue 2 / Vue 3 → Carbon Web Components Migration Map

> Source: vue (Vue 2.x Options API, Vue 3.x Composition / Options API), Nuxt 2/3, Quasar
> Target: carbon-web-components (`@carbon/web-components`) — Carbon's framework-agnostic custom elements
> Last updated: 2026-04
> Docs: <https://web-components.carbondesignsystem.com>

**LOAD RULE:** Load this file only when `source_framework` is `vue`. Load ONCE per session. This map targets `@carbon/web-components` because `@carbon/react` is React-only and cannot be consumed from Vue. Do NOT attempt to migrate a Vue repo to `@carbon/react` — if the user requests that path, flag the mismatch in the ledger and stop. A framework-era-swap Vue → React + `@carbon/react` is out of scope for this map and would be a separate `framework-era-swap` job with a purpose-built scaffold.

**CO-LOCATED PRECEDENT OVERRIDE:** If the target repo has a partially-migrated area where `@carbon/web-components` is already present alongside Vue components — the prior team's translation choices (how they wrap, handle events, bind v-models) are authoritative. Follow those; log a deviation only when this map would yield a different result.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Why Carbon Web Components for Vue

`@carbon/web-components` ships standard custom elements (`<cds-button>`, `<cds-text-input>`, etc.) that render identically in every runtime that supports HTML Custom Elements v1 — which Vue 2 and Vue 3 both do natively. The integration layer is small and stable:

1. Vue renders `<cds-button>` like any HTML element.
2. Attributes → strings on the element.
3. Properties (complex data) → bound via `.prop="value"` (Vue 3) or `:value.prop="value"` after a shim (Vue 2).
4. Custom events → `@cds-some-event="handler"` listeners.

No Vue plugin is required. Optional wrapper components can smooth v-model compatibility.

---

## Vue 2 vs. Vue 3 — choose your path

| Source | Strategy |
|---|---|
| **Vue 3.x** | Recommended. Native support for custom elements + property bindings via `.prop` modifier. |
| **Vue 2.7 / 2.6 with @vue/composition-api** | Works; use Vue's `ignoredElements` config to suppress custom-element warnings. |
| **Vue 2.x pre-2.7** | Works but needs a small property-binding shim. Consider upgrading to 2.7 first. |

---

## Quick Reference — Vue / raw HTML patterns → Carbon Web Components

Carbon Web Components use the `cds-` prefix. Component names match `@carbon/react` 1:1 where possible.

| Source pattern | Carbon web-component | Complexity |
|---|---|---|
| `<button>` or custom button | `<cds-button>` | low |
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
| Custom dialog | `<cds-modal>` + slot-header/body/footer | medium |
| Custom tooltip | `<cds-tooltip>` | medium |
| Custom popover | `<cds-popover>` | medium |
| Inline alert | `<cds-inline-notification>` | low |
| Toast notification | `<cds-toast-notification>` | low |
| Progress bar | `<cds-progress-bar>` | low |
| Spinner | `<cds-loading>` / `<cds-inline-loading>` | low |
| Tabs | `<cds-tabs>` + `<cds-tab>` + `<cds-tab-content>` | medium |
| Accordion | `<cds-accordion>` + `<cds-accordion-item>` | low |
| Tag / badge | `<cds-tag>` | low |
| Breadcrumb | `<cds-breadcrumb>` + `<cds-breadcrumb-item>` | low |
| Pagination | `<cds-pagination>` | low |
| Data table | `<cds-data-table>` + structural slots | high |
| Sidebar / side nav | `<cds-side-nav>` + `<cds-side-nav-link>` | medium |
| Header / app shell | `<cds-header>` + `<cds-header-name>` + `<cds-header-nav>` + `<cds-header-menu-item>` | high |
| Tile / card | `<cds-tile>`, `<cds-clickable-tile>`, `<cds-expandable-tile>`, `<cds-selectable-tile>` | low |
| Icon | `<cds-icon>` with `name="..."` OR Carbon icon SVG directly | low |

---

## Core migration patterns

### 1. Install + runtime setup

**Vue 3 (Vite or CLI):**

```bash
npm install @carbon/web-components @carbon/styles
```

`main.js` / `main.ts`:

```js
import { createApp } from 'vue';
import App from './App.vue';

// Side-effect import — registers every Carbon custom element. Fine for most
// apps; tree-shake by importing only the components you use if bundle size
// matters (see below).
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/text-input/index.js';
import '@carbon/web-components/es/components/modal/index.js';
// …one import per component you actually render

import '@carbon/styles/css/styles.css';

const app = createApp(App);

// Tell Vue these tags are NOT Vue components.
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('cds-');

app.mount('#app');
```

**Vue 2.7:**

```js
import Vue from 'vue';
import App from './App.vue';

import '@carbon/web-components/es/components/button/index.js';
import '@carbon/styles/css/styles.css';

Vue.config.ignoredElements = [/^cds-/];

new Vue({ render: (h) => h(App) }).$mount('#app');
```

**Vue 2.x pre-2.7:** same as 2.7 but also install `@vue/composition-api` if the codebase uses it; no change needed for web-components specifically.

### 2. Attributes vs. properties

Web components accept data through **attributes** (always strings) and **properties** (any type). Vue binds to attributes by default. For non-string data — arrays, objects, booleans that must be boolean-not-string — use the `.prop` binding modifier:

**Vue 3:**

```vue
<template>
  <!-- string attribute -->
  <cds-text-input label-text="Username" value="scott" />

  <!-- boolean property (NOT the string "true") -->
  <cds-text-input label-text="Username" :disabled.prop="isDisabled" />

  <!-- array property -->
  <cds-dropdown :items.prop="fruits" label-text="Fruit" />
</template>
```

**Vue 2.7 (property-binding shim):**

Vue 2 doesn't natively support `.prop`. Install a small directive or do:

```vue
<template>
  <cds-text-input :ref="el => applyProps(el, { disabled: isDisabled })" label-text="Username" />
</template>
<script>
export default {
  methods: {
    applyProps(el, props) {
      if (!el) return;
      for (const [k, v] of Object.entries(props)) el[k] = v;
    },
  },
};
</script>
```

Or wrap each Carbon element in a thin Vue component (see pattern in §4).

### 3. v-model compatibility

Web components don't implement Vue's v-model contract out of the box. Three options:

**Option A — Expand v-model manually (recommended):**

```vue
<template>
  <cds-text-input
    label-text="Username"
    :value.prop="username"
    @input="username = $event.target.value"
  />
</template>
```

**Option B — Vue 3 v-model with model config** (Vue 3 ≥ 3.2):

```vue
<template>
  <cds-text-input
    label-text="Username"
    :model-value="username"
    @input="username = $event.target.value"
  />
</template>
```

**Option C — Thin Vue wrapper component** that exposes Vue's standard `modelValue` contract (see §4).

### 4. Optional Vue wrapper pattern

For codebases that use v-model everywhere and don't want to rewrite every binding, wrap each Carbon web-component in a Vue SFC. Rule of thumb: worth it when >10 usages of the component, skip when <5 — the direct binding is clearer.

`components/CarbonTextInput.vue`:

```vue
<template>
  <cds-text-input
    ref="root"
    :label-text="labelText"
    :value.prop="modelValue"
    :disabled.prop="disabled"
    :invalid.prop="invalid"
    :invalid-text="invalidText"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  labelText:  { type: String, required: true },
  disabled:   { type: Boolean, default: false },
  invalid:    { type: Boolean, default: false },
  invalidText:{ type: String, default: '' },
});
defineEmits(['update:modelValue']);
</script>
```

Then in the rest of the app:

```vue
<CarbonTextInput v-model="username" label-text="Username" />
```

### 5. SCSS / styles wiring

Same as React — pick ONE integration path:

**Sass `@use` (recommended)** in your app's `main.scss`:

```scss
@use '@carbon/styles';
```

**Pre-compiled CSS:**

```js
import '@carbon/styles/css/styles.css';
```

Scoped styles inside SFCs (`<style scoped>`) work with web-components: scoping only affects Vue-authored markup, not the shadow-DOM rendered inside `<cds-*>` elements. If you want to restyle the *content* of a Carbon web-component, use CSS Custom Properties (Carbon exposes design tokens as CSS variables — `--cds-background`, `--cds-text-primary`, etc.).

### 6. Slots

Vue slots and web-component slots work identically under the hood (both use HTML `<slot>`). Pass content through Vue's default/named slots and it lands in the web-component's shadow DOM slot of the same name.

```vue
<template>
  <cds-modal open>
    <cds-modal-header slot="header">
      <cds-modal-heading>Delete item</cds-modal-heading>
    </cds-modal-header>
    <cds-modal-body>
      <p>This cannot be undone.</p>
    </cds-modal-body>
    <cds-modal-footer>
      <cds-modal-footer-button kind="secondary">Cancel</cds-modal-footer-button>
      <cds-modal-footer-button kind="danger">Delete</cds-modal-footer-button>
    </cds-modal-footer>
  </cds-modal>
</template>
```

### 7. Custom events

Carbon web-components fire native `CustomEvent`s. Vue's `@event-name` listener catches them:

```vue
<cds-modal :open.prop="isOpen" @cds-modal-closed="isOpen = false">
  …
</cds-modal>
```

Common event names (always prefixed with `cds-`):

| Component | Events |
|---|---|
| `<cds-modal>` | `cds-modal-beingclosed`, `cds-modal-closed` |
| `<cds-dropdown>` | `cds-dropdown-beingselected`, `cds-dropdown-selected` |
| `<cds-combo-box>` | `cds-combo-box-beingselected`, `cds-combo-box-selected` |
| `<cds-tabs>` | `cds-tabs-beingselected`, `cds-tabs-selected` |
| `<cds-checkbox>` | `cds-checkbox-changed` |
| `<cds-number-input>` | `cds-number-input` |

Check the component docs for the exact event-name contract — it's stable across Carbon web-component releases but differs per component.

---

## Component-by-component detail

### Button

**Carbon:** `<cds-button>`
**Import:** `import '@carbon/web-components/es/components/button/index.js'`
**Complexity:** low

```vue
<cds-button kind="primary" size="md" @click="handleSave">Save</cds-button>
<cds-button kind="danger" @click="handleDelete">Delete</cds-button>
```

**Kind values:** `primary` (default), `secondary`, `tertiary`, `ghost`, `danger`, `danger-tertiary`, `danger-ghost`.

**Size values:** `sm`, `md` (default), `lg`, `xl`, `2xl`.

**Icon-only button:** use `<cds-icon-button>` with `aria-label`.

---

### TextInput family

**Carbon:** `<cds-text-input>`, `<cds-number-input>`, `<cds-password-input>`, `<cds-textarea>`
**Import:** `import '@carbon/web-components/es/components/text-input/index.js'` (and similarly per component)
**Complexity:** low

```vue
<cds-text-input
  label-text="Username"
  placeholder="ex: scottw1"
  :value.prop="username"
  :required.prop="true"
  @input="username = $event.target.value"
/>
```

**Attribute ↔ property mapping** (kebab-case attributes; the property is the same name in camelCase — web-components expose both):

| Attribute (HTML) | Property (JS) | Notes |
|---|---|---|
| `label-text` | `labelText` | **required** for every input variant |
| `helper-text` | `helperText` | below the input, before invalid/warn text |
| `value` | `value` | bind via `.prop` to avoid stringification |
| `disabled` | `disabled` | boolean — bind via `.prop` |
| `invalid` | `invalid` | boolean; pairs with `invalid-text` |
| `invalid-text` | `invalidText` | renders below when `invalid` is true |
| `warn` | `warn` | boolean; pairs with `warn-text` |
| `warn-text` | `warnText` | warning state (softer than invalid) |
| `readonly` | `readonly` | |
| `placeholder` | `placeholder` | |

---

### Select / Dropdown / ComboBox

**Carbon:** `<cds-select>` + `<cds-select-item>` (native-looking), `<cds-dropdown>` + `<cds-dropdown-item>` (Carbon-styled popover), `<cds-combo-box>` + `<cds-combo-box-item>` (autocomplete)
**Import:** per-component `import '@carbon/web-components/es/components/dropdown/index.js'`, `.../combo-box/index.js`, `.../select/index.js`
**Complexity:** medium — selection events differ from native `<select>`.

```vue
<cds-dropdown label-text="Fruit" @cds-dropdown-selected="fruit = $event.detail.item.textContent">
  <cds-dropdown-item value="apple">Apple</cds-dropdown-item>
  <cds-dropdown-item value="banana">Banana</cds-dropdown-item>
  <cds-dropdown-item value="cherry">Cherry</cds-dropdown-item>
</cds-dropdown>
```

**Event payload:**
- `<cds-dropdown>` fires `cds-dropdown-selected` with `event.detail.item` (the DOM element of the selected item).
- `<cds-combo-box>` fires `cds-combo-box-selected` with the same shape.
- Read `event.detail.item.value` or `event.detail.item.textContent` for the selected identifier.

For multi-select: `<cds-multi-select>` + `<cds-multi-select-item>`. Read selected items via the `value` property (array) after `cds-multi-select-selected` fires.

---

### Modal

**Carbon:** `<cds-modal>` + `<cds-modal-header>` + `<cds-modal-body>` + `<cds-modal-footer>` + `<cds-modal-footer-button>`
**Import:** `import '@carbon/web-components/es/components/modal/index.js'`
**Complexity:** medium — focus trap + ESC handling come for free.

```vue
<cds-modal :open.prop="isOpen" @cds-modal-closed="isOpen = false" size="sm" danger>
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
    <cds-modal-footer-button kind="danger" @click="confirmDelete">Delete</cds-modal-footer-button>
  </cds-modal-footer>
</cds-modal>
```

`data-modal-close` on any footer button closes the modal automatically — no listener needed.

---

### DataTable

**Carbon:** `<cds-table>` + `<cds-table-head>` + `<cds-table-row>` + `<cds-table-header-cell>` + `<cds-table-body>` + `<cds-table-cell>`
**Import:** `import '@carbon/web-components/es/components/data-table/index.js'`
**Complexity:** high — cell-level composition is more verbose than `@carbon/react`'s render-prop DataTable.

```vue
<cds-table>
  <cds-table-head>
    <cds-table-header-row>
      <cds-table-header-cell>Name</cds-table-header-cell>
      <cds-table-header-cell>Status</cds-table-header-cell>
      <cds-table-header-cell>Created</cds-table-header-cell>
    </cds-table-header-row>
  </cds-table-head>
  <cds-table-body>
    <cds-table-row v-for="row in rows" :key="row.id">
      <cds-table-cell>{{ row.name }}</cds-table-cell>
      <cds-table-cell>
        <cds-tag :type="row.statusColor">{{ row.status }}</cds-tag>
      </cds-table-cell>
      <cds-table-cell>{{ row.createdAt }}</cds-table-cell>
    </cds-table-row>
  </cds-table-body>
</cds-table>
```

**Features, opt-in:**

| Feature | How |
|---|---|
| Sortable | `<cds-table is-sortable>` + `sort-direction` on header cells |
| Selection | `<cds-table-row selected>` on selected rows |
| Expansion | Wrap each row in `<cds-table-expand-row>` + companion `<cds-table-expanded-row>` |
| Pagination | `<cds-pagination>` below the table |
| Toolbar + search | `<cds-table-toolbar>` + `<cds-table-toolbar-search>` above the table |

Large datasets: `<cds-table>` does NOT virtualize. Combine with pagination or render only the visible page.

---

### Header / navigation shell

**Carbon:** `<cds-header>` + `<cds-header-name>` + `<cds-header-nav>` + `<cds-header-nav-item>` + `<cds-header-global-action>` + `<cds-side-nav>` + `<cds-side-nav-link>`
**Import:** `import '@carbon/web-components/es/components/ui-shell/index.js'`
**Complexity:** high

```vue
<cds-header aria-label="App">
  <cds-skip-to-content />
  <cds-header-menu-button
    button-label-active="Close menu"
    button-label-inactive="Open menu"
    @click="sideNavOpen = !sideNavOpen"
  />
  <cds-header-name prefix="IBM" href="/">Carbon App</cds-header-name>
  <cds-header-nav aria-label="Primary">
    <cds-header-nav-item href="/catalog">Catalog</cds-header-nav-item>
    <cds-header-nav-item href="/orders">Orders</cds-header-nav-item>
  </cds-header-nav>
  <cds-header-global-action aria-label="Profile" @click="openProfile">
    <cds-icon name="user--avatar" size="20" />
  </cds-header-global-action>
</cds-header>
```

Same behaviour as React: fixed top, content needs `padding-top: 48px`, `<cds-skip-to-content>` required for a11y.

---

## Nuxt-specific notes

### Nuxt 3

In `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('cds-'),
    },
  },
  css: ['@carbon/styles/css/styles.css'],
});
```

Import each Carbon web-component once at app init (a Nuxt plugin is the clean place):

```ts
// plugins/carbon.client.ts
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/text-input/index.js';
// …

export default defineNuxtPlugin(() => {});
```

Use `.client.ts` suffix so the import runs only in the browser — web-components rely on `window.customElements`.

### Nuxt 2

```js
// nuxt.config.js
export default {
  vue: {
    config: {
      ignoredElements: [/^cds-/],
    },
  },
  css: ['@carbon/styles/css/styles.css'],
  plugins: [{ src: '~/plugins/carbon.js', mode: 'client' }],
};
```

---

## Server-side rendering (SSR)

Carbon web-components require `window.customElements` which does not exist on the server. Three strategies:

1. **Client-only components** — Nuxt's `<client-only>` wrapper (Nuxt) or Vue 3's `<ClientOnly>`.
2. **Dynamic import** — `defineAsyncComponent(() => import('./CarbonWrapper.vue'))` with `ssr: false`.
3. **Static HTML fallback** — SSR renders the inner slot content without the custom element wrapper; hydration replaces with the full web-component.

For content-heavy pages (marketing, docs), approach 3 is best. For admin dashboards, approach 1 is simplest.

---

## Common gotchas

| Gotcha | Fix |
|---|---|
| `[Vue warn]: Unknown custom element: <cds-button>` | `app.config.compilerOptions.isCustomElement` (Vue 3) or `Vue.config.ignoredElements` (Vue 2). |
| Properties render as strings | Use `.prop` modifier (Vue 3) or assign via ref (Vue 2). |
| v-model doesn't work | Expand to `:value.prop` + `@input` or write a thin wrapper SFC. |
| Event doesn't fire | Check for the `cds-` prefix in the listener: `@cds-modal-closed`, not `@modal-closed`. |
| Styles missing | Confirm `@carbon/styles/css/styles.css` is imported at app entry. |
| Modal doesn't trap focus | Set `open` via `.prop` (boolean), not attribute (becomes the string "true" / "false"). |
| SSR error `customElements is not defined` | Wrap in `<ClientOnly>` or use Nuxt's `.client.ts` plugin. |
| Component-level scoped styles don't reach inside `<cds-*>` | Use CSS variables (`--cds-…` tokens) — shadow DOM is isolated from Vue's scoping. |
| Icon doesn't render | Confirm icon-name is kebab-case (`user--avatar`, not `UserAvatar`). |
| Dropdown `value` binding ignored | Listen for `cds-dropdown-selected` and read `event.detail.item.value`; don't expect two-way binding. |

---

## Deviation triggers

Log `What the system did: best-guess-carbon` when:

- Vue's `<transition>` / `<transition-group>` wraps a Carbon component and the animation timing doesn't line up with Carbon motion tokens — kept the Vue transition, reduced to a fade.
- Vuetify/Element Plus/PrimeVue had a component with no direct Carbon equivalent (e.g. `v-rating`, `el-tree-select`) — picked the closest Carbon composition (Tag + Button, TreeView + Checkbox).

Log `What the system did: preserved-source` when:

- Custom Vue component uses slots or scoped-slots in ways web-components can't express (render-prop-style scoped slots with typed arguments).
- Vuex / Pinia store binding where two-way v-model was load-bearing — kept the Vue component, wrapped the Carbon element.

Log `What the system did: wrapper-added` when:

- You introduced `components/Carbon*.vue` wrappers to preserve v-model ergonomics at call sites.

Log `What the system did: partial-migration` when:

- A screen uses both legacy Vuetify and new Carbon side-by-side during a staged rollout — migrated the top-level chrome, deferred individual widgets for a later pass.

---

## References

- <https://web-components.carbondesignsystem.com> — component catalog with live examples for every `cds-*` element.
- <https://web-components.carbondesignsystem.com/?path=/docs/integrations-vue--docs> — official Vue integration guide.
- <https://carbondesignsystem.com/guidelines/> — design guidance (framework-agnostic).
