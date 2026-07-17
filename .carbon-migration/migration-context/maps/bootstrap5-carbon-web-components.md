# Bootstrap 5 → Carbon Web Components Migration Map

> Source: bootstrap@5
> Target: carbon-web-components
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| Button | cds-button | low | mapped |
| Navbar | cds-header + cds-header-name + cds-header-nav + cds-header-nav-item | high | mapped |
| Modal | cds-modal | medium | mapped |
| Alert | cds-inline-notification | low | mapped |
| Toast | cds-toast-notification | low | mapped |
| Spinner | cds-loading | low | mapped |
| ProgressBar | cds-progress-bar | low | mapped |
| Accordion | cds-accordion + cds-accordion-item | low | mapped |
| Breadcrumb | cds-breadcrumb + cds-breadcrumb-item | low | mapped |
| Tabs | cds-tabs + cds-tab | medium | mapped |
| Badge | cds-tag | low | mapped |
| Dropdown | cds-dropdown + cds-dropdown-item | medium | mapped |
| Table | cds-table | medium | mapped |
| Input (text) | cds-text-input | low | mapped |
| Select (form-select) | cds-select + cds-select-item | low | mapped |
| Textarea | cds-textarea | low | mapped |
| Checkbox | cds-checkbox | low | mapped |
| Radio | cds-radio-button + cds-radio-button-group | low | mapped |
| Switch (Form.Switch) | cds-toggle | low | mapped |
| Tooltip | cds-tooltip or cds-icon-tooltip or cds-definition-tooltip | medium | mapped |
| Pagination | cds-pagination | low | mapped |
| Grid (Container/Row/Col) | cds-grid + cds-row + cds-column | medium | mapped |
| SideNav (Offcanvas as nav) | cds-side-nav | medium | mapped |
| Search input | cds-search | low | mapped |

---

## Setup

**Install:**
```
npm install @carbon/web-components@^2.49.0 lit
```

**Import pattern:**
```js
import '@carbon/web-components/es/components/{component-slug}/index.js'
```

**CDN (no build step):**
```html
<script type="module" src="https://1.www.s81c.com/common/carbon/web-components/version/v2.49.0/{component-id}.min.js"></script>
```
Replace `{component-id}` with the component slug (e.g. button, ui-shell, tile, modal, text-input, data-table).

**Usage notes:** Use HTML-like tag syntax: `<cds-button>Click me</cds-button>`. Props are set as attributes (strings) or properties (rich types via JS). Events use `on-` prefix in frameworks or `addEventListener` in vanilla JS. Compatible with any framework (Vue, Angular, Svelte, Vanilla JS) or no framework. Lit is a peer dependency.

---

### Button

**Carbon:** `cds-button` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/button/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant/class (primary) | kind="primary" | |
| variant/class (secondary) | kind="secondary" | |
| variant/class (danger) | kind="danger" | |
| variant/class (link) | kind="ghost" | |
| variant/class (outline-*) | kind="tertiary" | |
| disabled | disabled | |
| type | type | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Use kind attribute not class names
2. Icon-only: add icon slot + tooltip-text attr

**SCSS:**
```scss
None
```

---

### Navbar

**Carbon:** `cds-header + cds-header-name + cds-header-nav + cds-header-nav-item` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/ui-shell/index.js'`
**Complexity:** high — UIShell is a composite structure with header, nav, side nav.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| brand | prefix attr on cds-header-name | |
| expand | no equivalent | |

**Structural changes:**
1. cds-header wraps everything
2. cds-header-name for brand/logo (prefix + children for name)
3. cds-header-nav for nav items
4. cds-header-nav-item for each nav link
5. cds-header-global-bar for right-side actions

**Behavioral differences:**
1. Mobile hamburger → cds-side-nav with is-rail attr

**SCSS:**
```scss
None
```

---

### Modal

**Carbon:** `cds-modal` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/modal/index.js'`
**Complexity:** medium — Slot-based composition instead of Bootstrap's class-based structure.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| show | open (boolean attr) | |
| onHide | @cds-modal-closed event | |

**Structural changes:**
1. cds-modal-header for header slot
2. cds-modal-heading for title
3. cds-modal-body for body content
4. cds-modal-footer for footer
5. cds-modal-footer-button for action buttons

**Behavioral differences:**
1. open attribute controls visibility
2. Listen for cds-modal-closed event

**SCSS:**
```scss
None
```

---

### Alert

**Carbon:** `cds-inline-notification` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/notification/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant (danger) | kind="error" | |
| variant (success) | kind="success" | |
| variant (warning) | kind="warning" | |
| variant (info) | kind="info" | |

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Toast

**Carbon:** `cds-toast-notification` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/notification/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| show | open | |
| variant | kind | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Use timeout attr for auto-dismiss

**SCSS:**
```scss
None
```

---

### Spinner

**Carbon:** `cds-loading` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/loading/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| size (sm) | type="small" | |

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### ProgressBar

**Carbon:** `cds-progress-bar` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/progress-bar/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| striped | no equivalent | |
| animated | no equivalent | |
| now | value | |

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Accordion

**Carbon:** `cds-accordion + cds-accordion-item` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/accordion/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| flush | no equivalent | |

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Breadcrumb

**Carbon:** `cds-breadcrumb + cds-breadcrumb-item` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/breadcrumb/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Tabs

**Carbon:** `cds-tabs + cds-tab` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/tabs/index.js'`
**Complexity:** medium — Slot-based tab panels.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| activeKey | selected (on cds-tab) | |

**Structural changes:**
1. cds-tab for each tab label + target attr pointing to panel id
2. cds-tabs-content + cds-tab-panel for content panels

**SCSS:**
```scss
None
```

---

### Badge

**Carbon:** `cds-tag` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/tag/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| bg-primary | type="blue" | |
| bg-secondary | type="gray" | |
| bg-success | type="green" | |
| bg-danger | type="red" | |
| bg-warning | type="gold" | |

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Dropdown

**Carbon:** `cds-dropdown + cds-dropdown-item` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/dropdown/index.js'`
**Complexity:** medium — Controlled dropdown with items array, not open/close menu structure.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title/placeholder | label | |
| show/hide | open (managed internally) | |

**Structural changes:**
1. Items as cds-dropdown-item children
2. label-text attr for the trigger label

**SCSS:**
```scss
None
```

---

### Table

**Carbon:** `cds-table` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/data-table/index.js'`
**Complexity:** medium — Carbon table is semantic; sorting/selection handled by attributes.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| striped | no equivalent | |
| hover | no equivalent | |
| bordered | no equivalent | |

**Structural changes:**
1. cds-table-head + cds-table-header-row + cds-table-header-cell for headers
2. cds-table-body + cds-table-row + cds-table-cell for body
3. cds-table-toolbar for search/filter

**Behavioral differences:**
1. Sort by adding is-sortable to cds-table-header-cell

**SCSS:**
```scss
None
```

---

### Input (text)

**Carbon:** `cds-text-input` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/text-input/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| placeholder | placeholder | |
| disabled | disabled | |
| readonly | readonly | |

**Structural changes:**
(none)

**Behavioral differences:**
1. label-text attr for the label
2. helper-text attr for helper text
3. invalid attr + validity-message for error

**SCSS:**
```scss
None
```

---

### Select (form-select)

**Carbon:** `cds-select + cds-select-item` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/select/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Textarea

**Carbon:** `cds-textarea` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/textarea/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| rows | rows | |

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Checkbox

**Carbon:** `cds-checkbox` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/checkbox/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | checked | |
| disabled | disabled | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Label is set via label-text attr or slot

**SCSS:**
```scss
None
```

---

### Radio

**Carbon:** `cds-radio-button + cds-radio-button-group` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/radio-button/index.js'`
**Complexity:** low — Direct equivalent with group wrapper.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Switch (Form.Switch)

**Carbon:** `cds-toggle` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/toggle/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | checked | |
| disabled | disabled | |

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Tooltip

**Carbon:** `cds-tooltip or cds-icon-tooltip or cds-definition-tooltip` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/tooltip/index.js'`
**Complexity:** medium — Three tooltip types in Carbon WC corresponding to different use cases.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title | slot="content" | |
| placement | direction (top/bottom/left/right) | |

**Structural changes:**
1. Interactive content → cds-tooltip with trigger slot
2. Icon tooltips → cds-icon-tooltip
3. Definition tooltips → cds-definition-tooltip

**SCSS:**
```scss
None
```

---

### Pagination

**Carbon:** `cds-pagination` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/pagination/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| page | page | |
| count | total-items | |
| rowsPerPage | page-size | |

**Structural changes:**
(none)

**SCSS:**
```scss
None
```

---

### Grid (Container/Row/Col)

**Carbon:** `cds-grid + cds-row + cds-column` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/grid/index.js'`
**Complexity:** medium — Same 12-column grid concept; attribute-based span instead of class-based.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| container | cds-grid | |
| row | cds-row | |
| col-md-6 | sm="4" md="4" lg="6" attrs on cds-column | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Span values use Carbon column counts (max 16 for lg, 8 for md, 4 for sm)

**SCSS:**
```scss
None
```

---

### SideNav (Offcanvas as nav)

**Carbon:** `cds-side-nav` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/ui-shell/index.js'`
**Complexity:** medium — Persistent or expandable side navigation.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| expanded | expanded | |
| fixed | is-fixed-nav | |

**Structural changes:**
1. cds-side-nav-items as container
2. cds-side-nav-link for leaf items
3. cds-side-nav-menu for groups

**SCSS:**
```scss
None
```

---

### Search input

**Carbon:** `cds-search` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/search/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| placeholder | placeholder | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Built-in clear button

**SCSS:**
```scss
None
```

---
