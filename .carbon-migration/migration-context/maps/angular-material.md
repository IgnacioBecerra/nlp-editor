# Angular Material → Carbon Web Components Migration Map

> Source: @angular/material (Material 3)
> Target: @carbon/web-components
> Last updated: 2026-04
> Docs: https://web-components.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches `angular` / `angular-material` per INDEX.md. Load ONCE per session.

> **Framework note:** `@carbon/react` is React-only. For Angular projects, migrate to `@carbon/web-components` (framework-agnostic custom elements) which are first-class in Angular templates. Register `CUSTOM_ELEMENTS_SCHEMA` in the consuming NgModule (or `schemas` on a standalone component) so Angular's template compiler accepts `<cds-*>` tags.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| mat-button | cds-button | low | mapped |
| mat-raised-button | cds-button kind="primary" | low | mapped |
| mat-stroked-button | cds-button kind="tertiary" | low | mapped |
| mat-flat-button | cds-button kind="primary" | low | mapped |
| mat-icon-button | cds-icon-button | low | mapped |
| mat-fab / mat-mini-fab | cds-button + icon slot | medium | partial |
| mat-button-toggle-group | cds-content-switcher | medium | partial |
| mat-toolbar | cds-header + cds-header-name | high | mapped |
| mat-sidenav / mat-sidenav-container | cds-side-nav + cds-side-nav-items | high | mapped |
| mat-menu | cds-overflow-menu + cds-overflow-menu-item | medium | mapped |
| mat-tab-group / mat-tab | cds-tabs + cds-tab | medium | mapped |
| mat-stepper | cds-progress-indicator + cds-progress-step | medium | partial |
| mat-expansion-panel | cds-accordion-item | low | mapped |
| mat-accordion | cds-accordion | low | mapped |
| mat-card | cds-tile | medium | partial |
| mat-dialog (MatDialog service) | cds-modal | medium | mapped |
| mat-bottom-sheet | cds-modal (bottom variant) | high | partial |
| mat-snack-bar | cds-toast-notification | medium | mapped |
| mat-progress-bar | cds-progress-bar | low | mapped |
| mat-progress-spinner | cds-loading | low | mapped |
| mat-form-field + matInput | cds-text-input | medium | mapped |
| mat-form-field + textarea matInput | cds-textarea | low | mapped |
| mat-select + mat-option | cds-dropdown + cds-dropdown-item | low | mapped |
| mat-autocomplete | cds-combo-box | medium | mapped |
| mat-checkbox | cds-checkbox | low | mapped |
| mat-radio-group / mat-radio-button | cds-radio-button-group + cds-radio-button | low | mapped |
| mat-slide-toggle | cds-toggle | low | mapped |
| mat-slider | cds-slider | low | mapped |
| mat-datepicker + matDatepicker | cds-date-picker + cds-date-picker-input | medium | mapped |
| mat-chip-listbox / mat-chip | cds-tag | low | mapped |
| mat-tooltip | cds-tooltip / cds-icon-tooltip | medium | mapped |
| mat-paginator | cds-pagination | medium | mapped |
| mat-table + MatTableModule | cds-table | high | mapped |
| mat-tree / mat-tree-node | (none native) | high | custom_required |
| mat-badge | cds-tag | low | partial |
| mat-divider | cds-layer / hr | low | mapped |
| mat-list / mat-list-item | cds-structured-list + cds-structured-list-row | medium | partial |
| mat-grid-list | cds-grid + cds-column | medium | mapped |
| mat-icon | @carbon/icons (svg import) | low | mapped |

---

## Setup

**Install:**
```
npm install @carbon/web-components@^2.49.0 @carbon/styles lit
```

**Register custom elements schema** (NgModule):
```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // …
})
export class AppModule {}
```

For **standalone components**, add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` to the `@Component` decorator.

**Import pattern (side-effect import that registers the custom element):**
```ts
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/text-input/index.js';
```

Place these imports in the feature module / component where the element is consumed (or eagerly in `main.ts`). Tree-shaking keeps unused components out of the bundle.

**Styles:** add Carbon tokens via `@use '@carbon/styles'` in a global SCSS entry (e.g. `src/styles.scss`). Carbon Web Components ship their own encapsulated styles — global SCSS is only for app-level Carbon tokens / grid.

**angular.json** — ensure `styles` includes the global Sass entry and that `stylePreprocessorOptions.includePaths` is configured if you use token partials across packages.

---

## Angular template binding cheatsheet

Carbon Web Components expose properties (rich types) and emit DOM CustomEvents. Angular templates support both:

| Intent | Angular syntax |
|--------|----------------|
| Set a string attribute | `<cds-button kind="primary">` |
| Set a boolean attribute | `<cds-button [attr.disabled]="isDisabled ? '' : null">` |
| Set a rich JS property | `<cds-dropdown [items]="options">` |
| Listen to a CustomEvent | `<cds-dropdown (cds-dropdown-selected)="onSelect($event)">` |
| Two-way binding | Use event + property; no `[( )]` banana-box support out of the box |
| ngModel on form controls | Wrap with a small `ControlValueAccessor` adapter; Carbon inputs emit `input`/`cds-*-changed` events |

---

### mat-button

**Carbon:** `cds-button` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/button/index.js'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Angular Material | Carbon | Notes |
|------------------|--------|-------|
| `mat-button` | `<cds-button kind="ghost">` | Low-emphasis text button |
| `mat-raised-button` / `mat-flat-button` | `<cds-button kind="primary">` | |
| `mat-stroked-button` | `<cds-button kind="tertiary">` | |
| `color="primary"` | `kind="primary"` | |
| `color="warn"` | `kind="danger"` | |
| `disabled` | `[attr.disabled]="disabled ? '' : null"` | |
| `(click)` | `(click)` | Native DOM click — unchanged |
| `matTooltip="…"` | `tooltip-text="…"` attribute on icon-only button, OR wrap in `<cds-tooltip>` | |

**Structural changes:**
- `mat-icon-button` → `<cds-icon-button>` with an `<svg slot="icon">` child (from `@carbon/icons`).
- FAB → `<cds-button kind="primary">` with an SVG icon slot; Carbon does not ship a dedicated FAB.

**Behavioral differences:**
1. `kind` attribute replaces `color` input.
2. Button ripples are not emitted — Carbon uses focus rings + subtle background transitions.
3. `disabled` must be reflected as an attribute, not a property binding, for CSS to apply reliably.

---

### mat-form-field + matInput

**Carbon:** `cds-text-input` (and `cds-textarea`, `cds-number-input`, `cds-password-input`) from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/text-input/index.js'`
**Complexity:** medium — Carbon inputs are self-contained; `mat-form-field` wrapper/label/hint composition is flattened into attributes.
**Status:** mapped

**Prop map:**

| Angular Material | Carbon | Notes |
|------------------|--------|-------|
| `<mat-label>` | `label-text="…"` attribute | Label becomes an attribute, not a projected child |
| `<mat-hint>` | `helper-text="…"` attribute | |
| `<mat-error>` | `invalid-text="…"` + `invalid` attribute | |
| `appearance="outline"` | (removed) | Carbon has one canonical style |
| `floatLabel` | (removed) | Carbon labels are always above the field |
| `[(ngModel)]` | `[value]` + `(input)` event, or custom CVA | |
| `required` | `required` | |
| `type="password"` | use `cds-password-input` | Built-in show/hide toggle |
| `type="number"` | use `cds-number-input` | |

**Structural changes:**
- Drop the `<mat-form-field>` wrapper entirely — labels/hints/errors collapse into attributes on the Carbon input.
- Prefix / suffix icons move into slot content (`<svg slot="ai-label-icon">`) or require custom composition.

**Behavioral differences:**
1. Floating label is replaced with a static, persistent label above the input.
2. Validation styling is driven by the `invalid` attribute, not by Angular form state — bridge with a directive that mirrors `ngControl.invalid && ngControl.touched` onto the attribute.
3. No ripple / line-shift animation; Carbon uses a simple focus outline.

---

### mat-dialog (MatDialog service)

**Carbon:** `cds-modal` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/modal/index.js'`
**Complexity:** medium — Imperative `MatDialog.open()` service becomes declarative `<cds-modal [open]>` in a template, or a thin service wrapper that attaches the element to the DOM.
**Status:** mapped

**Prop map:**

| Angular Material | Carbon | Notes |
|------------------|--------|-------|
| `MatDialog.open(Cmp, { data })` | `<cds-modal [open]="isOpen">` + component @Input/@Output | Prefer declarative in templates |
| `disableClose` | `prevent-close-on-click-outside` + `[attr.close-button-hidden]` | |
| `matDialogTitle` | `<cds-modal-header><cds-modal-heading>…` | |
| `matDialogContent` | `<cds-modal-body>` | |
| `matDialogActions` | `<cds-modal-footer>` + `<cds-modal-footer-button>` | |
| `(afterClosed)` | `(cds-modal-closed)` CustomEvent | |

**Structural changes:**
- The MatDialogRef data-flow pattern (`dialogRef.close(result)`) maps to emitting a CustomEvent with the result payload from the modal footer buttons.

**Behavioral differences:**
1. Carbon modals are slotted inline; there is no hidden portal container to configure.
2. Danger modals use the `danger` attribute, which styles the primary footer button red.
3. Focus trap and escape handling are built in — remove any custom CDK focus-trap wrappers.

---

### mat-snack-bar

**Carbon:** `cds-toast-notification` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/notification/index.js'`
**Complexity:** medium — MatSnackBar service → small service that creates/appends a `cds-toast-notification` element.
**Status:** mapped

**Prop map:**

| Angular Material | Carbon | Notes |
|------------------|--------|-------|
| `snackBar.open(msg, action, { duration })` | `document.createElement('cds-toast-notification')` + `timeout` attribute | |
| `panelClass` | `kind="info" \| "success" \| "warning" \| "error"` | |

**Behavioral differences:**
1. Toasts are full DOM elements — place them inside a fixed container at the page edge.
2. Auto-dismiss is driven by the `timeout` attribute (milliseconds).
3. `aria-live=polite` is built in; do not add `role=alert` unless the message is urgent.

---

### mat-select + mat-option

**Carbon:** `cds-dropdown` + `cds-dropdown-item` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/dropdown/index.js'`
**Complexity:** low — Native replacement.
**Status:** mapped

**Prop map:**

| Angular Material | Carbon | Notes |
|------------------|--------|-------|
| `<mat-select [(value)]>` | `<cds-dropdown [value]> (cds-dropdown-selected)` | |
| `<mat-option [value]>` | `<cds-dropdown-item [value]>` | |
| `multiple` | Use `cds-multi-select` instead | Different element |
| `placeholder` | `helper-text` (above) or `title-text` | |

**Behavioral differences:**
1. Keyboard interaction mirrors Carbon spec (Enter/Space to open, arrow keys to navigate).
2. `compareWith` has no equivalent — compare on primitive `value` strings.

---

### mat-table

**Carbon:** `cds-table` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/data-table/index.js'`
**Complexity:** high — Angular Material's declarative column-def model is replaced with direct slot/row composition or an `*ngFor` of `cds-table-row`.
**Status:** mapped

**Prop map:**

| Angular Material | Carbon | Notes |
|------------------|--------|-------|
| `<mat-table [dataSource]>` | `<cds-table>` + `<cds-table-head>` + `<cds-table-body>` | Data is bound via `*ngFor` over rows |
| `matColumnDef` + `matHeaderCell` / `matCell` | `<cds-table-header-cell>` / `<cds-table-cell>` | Flattened — no column-def indirection |
| `mat-sort-header` | `sort` attribute on `cds-table-header-cell` + `(cds-table-header-cell-sort)` | |
| `matPaginator` | `<cds-pagination>` below the table | |
| `mat-row-def` `when` predicate | Conditional `*ngIf` in template | |

**Behavioral differences:**
1. MatTableDataSource filtering/sorting/paging must be re-implemented in app code or a small helper service — Carbon Web Components expose events but not a DataSource abstraction.
2. Virtual scrolling is not built in — pair with CDK `cdk-virtual-scroll-viewport` if needed.
3. Selection (checkbox column) uses `cds-table-selection-cell` / `cds-table-batch-actions`.

---

### mat-datepicker

**Carbon:** `cds-date-picker` + `cds-date-picker-input` from `@carbon/web-components`
**Import:** `import '@carbon/web-components/es/components/date-picker/index.js'`
**Complexity:** medium — Carbon wraps flatpickr; Angular Material uses native or Moment/Luxon adapters.
**Status:** mapped

**Prop map:**

| Angular Material | Carbon | Notes |
|------------------|--------|-------|
| `[matDatepicker]` + `#picker` ref | `<cds-date-picker [value]>` parent wraps `<cds-date-picker-input kind="single">` | |
| `[min]` / `[max]` | `min-date` / `max-date` attributes on `cds-date-picker` | |
| `dateFilter` | `enabled-range` or custom via flatpickr config on the element | |
| Range: `<mat-date-range-input>` | `kind="from"` + `kind="to"` inputs under a `kind="range"` picker | |

**Behavioral differences:**
1. No MAT_DATE_LOCALE / adapter — Carbon formats via flatpickr locale packs.
2. Angular forms: value is emitted as a `Date[]` via `cds-date-picker-changed`.
3. Touch UI / modal calendar is not offered; only inline/popover.

---

### mat-icon

**Carbon:** `@carbon/icons` (SVGs) rendered inline or via a small helper directive.
**Import:** `import Add16 from '@carbon/icons/es/add/16'` — returns a descriptor you render to SVG, OR `import '@carbon/icons-react'` equivalents are NOT available for Angular (use the raw package).
**Complexity:** low
**Status:** mapped

**Prop map:**

| Angular Material | Carbon | Notes |
|------------------|--------|-------|
| `<mat-icon>add</mat-icon>` | `<svg aria-hidden="true" width="16" height="16"><use href="#add-16" /></svg>` | Use an icon sprite, or a `[cdsIcon]="Add16"` directive to render the descriptor |
| `fontIcon`, `svgIcon` | (removed) | Carbon ships SVGs only; no icon font |

**Behavioral differences:**
1. Icon sizing is explicit: import the size-specific module (`/16`, `/20`, `/24`, `/32`).
2. For decorative icons set `aria-hidden="true"`; for meaningful icons provide a sibling `sr-only` label.

---

## Migration notes (Angular-specific)

1. **Reactive Forms / `[(ngModel)]`:** Carbon inputs are plain custom elements and do not implement `ControlValueAccessor`. Provide thin CVA adapters (one per input family: text, select, checkbox, radio, toggle, slider, date) so existing `formControlName` / `ngModel` bindings continue to work. Wire the CVA `writeValue` to the element's `value` property and subscribe to the `input` / `cds-*-changed` CustomEvent for change propagation.
2. **Change detection:** CustomEvents from `cds-*` components fire outside Angular zones in some configurations. If binding via `addEventListener` manually, wrap handlers in `NgZone.run(...)` to trigger change detection.
3. **SSR (Angular Universal):** Carbon Web Components register themselves on `customElements` which is undefined on the server. Guard registration behind `isPlatformBrowser(platformId)` in the module that imports the side-effect files, or import lazily in the component's `ngOnInit`.
4. **Lazy-loaded modules:** Side-effect imports in a lazy module cause the custom element to register only when that module loads. If two modules import the same element, `customElements.define` will throw the second time — guard with `if (!customElements.get('cds-button'))`.
5. **Angular Material theming → Carbon themes:** Replace `mat.core()` + `mat.define-light-theme` with `@use '@carbon/styles/scss/themes'` + apply a theme class (`cds--white`, `cds--g10`, `cds--g90`, `cds--g100`) on the root element.
6. **CDK overlays (cdk-overlay-container):** Not used by Carbon — remove the overlay container and any custom scroll-strategy / position-strategy code when retiring MatDialog/MatMenu.
7. **Animations:** `BrowserAnimationsModule` is not required by Carbon Web Components. It can be left in place for other Angular animations, but Carbon animations are CSS-only.
