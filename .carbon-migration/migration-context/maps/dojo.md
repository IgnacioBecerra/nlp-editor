# Dojo → Carbon React v11 Migration Map

> Source: classic Dojo 1.6 – 1.14 (Dijit / Dojox / dojo.declare stack)
> Target: `@carbon/react` v11
> Last updated: 2026-04
> Docs: https://react.carbondesignsystem.com, https://dojotoolkit.org/reference-guide

**LOAD RULE:** Load this file only when source_framework matches `dojo` per INDEX.md. Load ONCE per session.

**CO-LOCATED PRECEDENT OVERRIDE (MANDATORY):** Before applying anything in this map, scan the target repo for sibling folders / feature modules where Dojo has already been migrated to Carbon (common signals: `*-react/` folder next to a legacy `*/` folder; `@carbon/react` imports alongside `dojo/…` imports in the same app root; prior-migration README or ledger files). If precedent exists, **prefer it over this generic map**. Log a deviation when precedent and this map diverge, noting which was chosen.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Authorship note

This map is **best-effort authored**. Dojo is a large framework era (not a component library), so the mapping below is necessarily lossy — Dojo widget behaviour varies with configuration, mixins, and subclassing that cannot be captured in a table. Treat this file as a starting point. Precedent files in the target repo are more authoritative than this document.

## Quick Reference

| Dojo source | Carbon equivalent | Complexity | Status |
|---|---|---|---|
| dijit/form/Button | Button | low | mapped |
| dijit/form/DropDownButton | OverflowMenu | medium | partial |
| dijit/form/ComboButton | Button + OverflowMenu | medium | partial |
| dijit/form/ToggleButton | Toggle | medium | mapped |
| dijit/form/CheckBox | Checkbox | low | mapped |
| dijit/form/RadioButton | RadioButton | low | mapped |
| dijit/form/TextBox | TextInput | low | mapped |
| dijit/form/ValidationTextBox | TextInput (with invalid / invalidText) | medium | mapped |
| dijit/form/NumberTextBox | NumberInput | medium | mapped |
| dijit/form/CurrencyTextBox | NumberInput | medium | partial |
| dijit/form/DateTextBox | DatePicker | medium | mapped |
| dijit/form/TimeTextBox | TimePicker | medium | mapped |
| dijit/form/Textarea | TextArea | low | mapped |
| dijit/form/SimpleTextarea | TextArea | low | mapped |
| dijit/form/Select | Select | low | mapped |
| dijit/form/FilteringSelect | ComboBox | medium | mapped |
| dijit/form/ComboBox | ComboBox | medium | mapped |
| dijit/form/MultiSelect | MultiSelect | medium | partial |
| dijit/form/Slider | Slider | medium | mapped |
| dijit/form/HorizontalSlider | Slider | medium | mapped |
| dijit/form/VerticalSlider | Slider (orientation="vertical") | medium | mapped |
| dijit/form/HorizontalRule | (none) | low | unsupported |
| dijit/form/HorizontalRuleLabels | (none) | low | unsupported |
| dijit/form/Form | Form | low | partial |
| dijit/Dialog | Modal | medium | mapped |
| dijit/TooltipDialog | Popover | high | partial |
| dijit/Tooltip | Tooltip | low | mapped |
| dijit/ConfirmDialog | Modal (danger variant) | low | mapped |
| dijit/TitlePane | Accordion + AccordionItem | medium | mapped |
| dijit/MenuBar | HeaderNavigation | high | partial |
| dijit/Menu | Menu / OverflowMenu | medium | partial |
| dijit/MenuItem | MenuItem / OverflowMenuItem | low | mapped |
| dijit/PopupMenuItem | MenuItem (submenu) | medium | partial |
| dijit/CheckedMenuItem | MenuItem (selected) | medium | partial |
| dijit/Toolbar | Header / OverflowMenu grouping | high | partial |
| dijit/ToolbarSeparator | (none — use spacing) | low | unsupported |
| dijit/layout/ContentPane | (none — use Grid/Column) | medium | custom_required |
| dijit/layout/BorderContainer | Grid | high | custom_required |
| dijit/layout/TabContainer | Tabs / TabList / TabPanels | high | mapped |
| dijit/layout/StackContainer | ContentSwitcher | high | partial |
| dijit/layout/AccordionContainer | Accordion | medium | mapped |
| dijit/layout/AccordionPane | AccordionItem | low | mapped |
| dijit/layout/LayoutContainer | Grid | high | custom_required |
| dijit/Tree | TreeView (from @carbon/react) | high | partial |
| dijit/tree/TreeStoreModel | (tree data prop) | medium | partial |
| dijit/ProgressBar | ProgressBar | low | mapped |
| dojox/widget/Standby | Loading (overlay variant) | medium | partial |
| dojox/widget/Toaster | ToastNotification | medium | mapped |
| dojox/widget/DialogSimple | Modal | low | mapped |
| dojox/form/BusyButton | Button (isLoading) | low | mapped |
| dojox/form/PasswordValidator | TextInput (type="password") + validation | high | partial |
| dojox/grid/DataGrid | DataTable | high | partial |
| dojox/grid/EnhancedGrid | DataTable (sortable, filterable) | high | partial |
| dojox/grid/TreeGrid | DataTable (hierarchical — custom) | high | custom_required |
| dgrid/Grid | DataTable | high | partial |
| dgrid/OnDemandGrid | DataTable (pagination) | high | partial |
| dgrid/Selection | DataTable (selectable) | medium | mapped |
| dgrid/Keyboard | (built into DataTable) | low | mapped |
| dojox/layout/FloatingPane | (no equivalent) | high | unsupported |
| dojox/layout/ResizeHandle | (CSS resize) | medium | custom_required |
| dojox/widget/ColorPicker | (no direct; use input type="color") | medium | unsupported |
| dojox/widget/Calendar | DatePicker (inline) | medium | partial |
| dojox/image/Gallery | (no direct equivalent) | high | unsupported |
| dojox/charting | Carbon Charts (@carbon/charts-react) | high | partial |

---

## Detailed mappings

### dijit/form/Button

**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low
**Status:** mapped

**Prop map:**

| Dojo prop | Carbon prop | Notes |
|---|---|---|
| `label` | children | Move text content into children |
| `iconClass` | `renderIcon` | Replace CSS icon class with a Carbon icon component from `@carbon/react/icons` |
| `showLabel` | (n/a) | Carbon Buttons always show their children |
| `disabled` | `disabled` | Same semantics |
| `type` | `kind` | Dojo's `type="button" \| "submit"` → HTML `type`. Dojo has no style variant; Carbon `kind` selects variant: `primary` (default), `secondary`, `tertiary`, `ghost`, `danger`, `danger--primary`, `danger--tertiary`, `danger--ghost` |
| `style` | (className preferred) | Pass Carbon tokens through SCSS rather than inline styles |
| `onClick` | `onClick` | Same; Dojo uses `on(button, 'click', handler)` or programmatic `button.on('click', …)` |

**Structural changes:**
1. Dojo buttons are often constructed programmatically (`new Button({…}, domNode)`). Carbon buttons are React components; replace the construction pattern with JSX.
2. Dojo's button label is a prop; Carbon's is children.
3. Carbon has multiple visual variants (`kind`) where Dojo relied on CSS class mixing.

**Behavioural differences:**
1. Carbon buttons have explicit size (`size="sm" \| "md" \| "lg" \| "xl"`) — default is `md` (40 px). Choose based on container density.
2. Carbon buttons handle focus ring and high-contrast mode automatically; remove any manual focus styling from the Dojo version.

---

### dijit/form/ValidationTextBox

**Carbon:** `TextInput` from `@carbon/react` with `invalid` / `invalidText` / `warn` / `warnText`
**Complexity:** medium
**Status:** mapped

**Prop map:**

| Dojo prop | Carbon prop | Notes |
|---|---|---|
| `value` | `value` | Controlled; same semantics |
| `name` | `name` | |
| `required` | (custom) | Carbon has no `required` prop on inputs; use HTML `required` or manage via form state + `invalid` |
| `invalidMessage` | `invalidText` | |
| `promptMessage` | `helperText` | Dojo's "tell the user what to enter" text |
| `missingMessage` | `invalidText` (conditional) | Set `invalid={!value && touched}` with this message |
| `regExp` | (custom validation) | Carbon does not do pattern-regex via props; run regex in an `onChange` / form validator |
| `validator` | (custom validation) | Same — validate in JS, set `invalid` |
| `trim` | (custom) | Handle `value.trim()` in onChange |
| `uppercase` / `lowercase` | (custom) | Handle in onChange transformer |

**Structural changes:**
1. Dojo pushes validation rules into the widget config; Carbon expects validation to live in the form-state layer (Formik / react-hook-form / component state) and only displays the result.
2. `state` setter in Dojo (`widget.set('state', 'Error')`) becomes `invalid={true}` + `invalidText` in Carbon.

**Behavioural differences:**
1. Dojo validates on blur by default; Carbon does nothing automatically — the consumer controls when validation runs.
2. The displayed message colour/icon is a token-driven visual; no custom CSS needed for error state.

---

### dijit/Dialog

**Carbon:** `Modal` from `@carbon/react`
**Complexity:** medium
**Status:** mapped

**Prop map:**

| Dojo prop | Carbon prop | Notes |
|---|---|---|
| `title` | `modalHeading` | Primary heading |
| (body) | children | Put body content as Modal's children |
| `style` `width`/`height` | `size` | `xs \| sm \| md \| lg` — choose by intended content width |
| Programmatic `.show()` / `.hide()` | `open` prop | Carbon modal is controlled: `open={boolean}` + `onRequestClose` |
| `onShow` / `onHide` | `onRequestClose`, conditional `open` | React lifecycle — use `useEffect` if you need to run code on open/close |
| `closable` | `passiveModal` | Inverse sense; `passiveModal` hides the default action buttons |
| `onExecute` | `onRequestSubmit` + `primaryButtonText` | For ConfirmDialog-style primary-action pattern |

**Structural changes:**
1. Dojo dialogs have a global dialog-underlay; Carbon Modal manages this internally. Remove any custom dialog-underlay SCSS.
2. Programmatic show/hide → React state: `const [open, setOpen] = useState(false)`.
3. `dijit.byId('myDialog').show()` from anywhere in the codebase → must become prop-drilled state or a state-manager reference.

**Behavioural differences:**
1. Carbon Modal focus-traps automatically and restores focus to the invoking element on close. Remove manual focus code.
2. Escape-to-close is built in; remove custom handlers.
3. Carbon Modal emits no `onShow` equivalent — trigger follow-up side effects in the caller where `setOpen(true)` was set.

---

### dijit/layout/TabContainer

**Carbon:** `Tabs` + `TabList` + `Tab` + `TabPanels` + `TabPanel` from `@carbon/react`
**Complexity:** high (structural rewrite)
**Status:** mapped

**Prop map:**

| Dojo prop | Carbon prop | Notes |
|---|---|---|
| `selectedChildWidget` | `selectedIndex` on `Tabs` | Carbon v11 uses a numeric index; track in state |
| `tabPosition` | (CSS / layout) | Carbon tabs are horizontal by default; no vertical variant — use Side nav for vertical navigation instead |
| (child `ContentPane`s with `title` prop) | one `Tab` per title, one `TabPanel` per body | The single widget becomes five composed components |

**Structural changes:**
1. This is a structural rewrite, not a prop swap:
   ```jsx
   <Tabs selectedIndex={tab} onChange={(e) => setTab(e.selectedIndex)}>
     <TabList aria-label="List of tabs">
       <Tab>First</Tab>
       <Tab>Second</Tab>
     </TabList>
     <TabPanels>
       <TabPanel>…first body…</TabPanel>
       <TabPanel>…second body…</TabPanel>
     </TabPanels>
   </Tabs>
   ```
2. Lazy-loaded tabs (Dojo `parseOnLoad: false`) → render `TabPanel` children conditionally on `selectedIndex`.

**Behavioural differences:**
1. No built-in close button on tabs in Carbon v11 (Dojo `closable: true`). If the repo used closable tabs, this is a deviation: implement custom close control inside each `Tab` or reject the pattern and migrate to a different UX.
2. Keyboard navigation (arrow keys, Home/End) is built in to Carbon — remove custom keyhandlers.

---

### dojox/grid/DataGrid / dgrid/OnDemandGrid

**Carbon:** `DataTable` from `@carbon/react` (with optional `@carbon/ibm-products` `Datagrid` for advanced use)
**Complexity:** high
**Status:** partial — most common cases map; highly-customised grids are custom_required

**Prop map (common case):**

| Dojo prop / feature | Carbon prop / pattern | Notes |
|---|---|---|
| `store` (dojo/store, dojox/data) | `rows` array | Fetch data in React (useState/useQuery/etc.), pass as rows |
| `structure` / `layout` | `headers` array of `{ key, header }` | Declare column metadata |
| `selectionMode="single"` / `"multiple"` | `DataTable selection={true \| "multi"}` | Selectable rows via `TableSelectRow` |
| `sortable` | Carbon `TableHeader isSortable` | Manage sort state in `useState`; Carbon gives you the UI hook |
| `canEdit` / inline edit | No built-in equivalent | Implement with Carbon form inputs inside cells (custom) |
| Row virtualisation | Not in Carbon v11 DataTable | For very large datasets, use `@carbon/ibm-products` `Datagrid` |
| `onRowClick` | `onClick` on `TableRow` | |
| `canSort` / `noDataText` | Custom empty state | Render an empty `TableBody` message when `rows.length === 0` |

**Structural changes:**
1. Data-source swap: Dojo stores (observable, lazy, pageable) → plain React arrays plus a data-fetching library (TanStack Query, SWR, Redux Toolkit Query). This is almost always a separate architectural decision captured in the Architect plan.
2. In-cell editors: Dojo inline editors become Carbon inputs rendered inside `TableCell`, controlled by component state.

**Behavioural differences:**
1. Carbon `DataTable` is not virtualised by default; do not use for > 500 rows without pagination or swap to Datagrid.
2. No built-in server-side paging widget; use Carbon `Pagination` alongside `DataTable` with external state.

---

### dojo/topic, dojo/on (pub-sub + event model)

**Not a component** — but one of the more consequential non-component migrations. Covered in detail in `patterns/dojo-lifecycle.md` under "event model." Summary:

- `topic.publish('event/name', payload)` / `topic.subscribe(…)` → event library of choice (EventTarget + CustomEvent, or Redux/Zustand for application-wide state, or React Context for narrower scope).
- `on(node, 'click', handler)` → React `onClick` prop.
- `dojo/aspect` before/after/around → usually an architectural anti-pattern in React; flag as a deviation and surface for human review.

---

### Icons

Dojo icons are CSS-class-driven (`dijitIcon dijitIconSave`). Carbon uses component icons:

- Remove icon CSS classes.
- `import { Save } from '@carbon/react/icons'`
- `<Button renderIcon={Save}>Save</Button>` or `<Save size={16} />`

See `migration-context/maps/carbon-v10-to-v11.md` §3 for the full icon-naming scheme (Carbon v11 removed size-in-name conventions like `Save32`).

---

## Idioms that routinely become deviations

These are patterns where no clean Carbon equivalent exists; the migrator should preserve source semantics with a wrapper and log a deviation entry.

| Dojo idiom | What to do | Deviation category |
|---|---|---|
| `dijit.registry` global lookup by widget id | Replace with React ref or Context; where callers use the id at runtime from foreign code (e.g. JSP), preserve the DOM id and log a deviation | `widget-lifecycle` |
| `dojo.declare(className, [mixins], {…})` with deep inheritance chains | Flatten into a React component; log which mixins were merged and any behaviour that couldn't be reproduced | `widget-lifecycle` |
| `_WidgetsInTemplateMixin` with dijit widgets nested in HTML template strings | Convert template to JSX; log any `data-dojo-*` attributes that were dropped | `template-loader-unverified` |
| `dojo/data/ItemFileReadStore`, `dojo/store/JsonRest` | Introduce a real data-fetching library (see DataGrid mapping above); log the choice | `build-config-assumption` |
| `dojo/_base/lang.hitch`, `dojo.hitch` | Replace with arrow functions or `.bind(this)`; no deviation needed unless a side-effect chain is involved |  |
| `dojo/aspect.after` / `aspect.before` | Flag as deviation; often indicates an architectural rethink is needed | `ambiguous-lifecycle` |
| `dojo/parser` scanning HTML for `data-dojo-type` | Remove entirely; Carbon is JSX-only | `template-loader-unverified` |
| `dojox/mvc` two-way binding | Replace with one-way React state + change handlers; log binding targets | `ambiguous-lifecycle` |
| `dojo/text!./Template.html` imports | See `patterns/dojo-module-system.md` for the loader-strategy decision | `template-loader-unverified` |
| i18n via `dojo/i18n!./nls/strings` | Replace with the repo's React-side i18n layer (often already present in partially-migrated repos). If none exists, log deviation and preserve bundle structure. | `missing-context` |

---

## Ledger requirement

When you load this map, record it in `CARBON_MIGRATION_LEDGER.md`:

```
Loaded: migration-context/maps/dojo.md — Trigger: source_framework == dojo
Precedent scan: completed / skipped — found <N> precedent files at <paths>
```

If the precedent scan found files, treat them as the primary reference and this map as the fallback.
