# React / Next.js → Carbon React v11 Migration Map

> Source: react, next.js (raw React or Next.js with custom CSS/SCSS — no third-party design system)
> Target: carbon-react-v11 (`@carbon/react`, `@carbon/styles`, `@carbon/icons-react`)
> Last updated: 2026-04
> Docs: <https://react.carbondesignsystem.com>
> Build targets: Vite (CSR), Next.js (App Router or Pages Router), Remix, CRA

**LOAD RULE:** Load this file only when `source_framework` is `react` or `nextjs` AND no more-specific design-system map applies (bootstrap5 / material-ui / chakra-ui / tailwind / etc.). Load ONCE per session.

**If the repo uses a dedicated design library**, prefer the specific map over this one (e.g. `maps/material-ui5.md` for MUI). This map covers "raw React + custom CSS/SCSS/CSS-Modules" — codebases whose UI primitives are plain HTML wrapped in custom styling.

**CO-LOCATED PRECEDENT OVERRIDE:** If the target repo has a partially-migrated area where Carbon is already present alongside the raw-HTML patterns — the prior team's translation choices are authoritative. Follow those; log a deviation only when this map would yield a different result.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Carbon target selection

| Target | When |
|---|---|
| `@carbon/react` | Default for all React / Next.js sources. |
| `@ibm/products` (in addition) | When the codebase needs DataGrid, TearSheet, SidePanel, EmptyState, or any IBM Products component. Install alongside `@carbon/react`, not instead. See `maps/carbon-v11-ibm-products.md`. |

`@carbon/react` v11 is React-only and cannot be consumed from other runtimes. This map always targets it.

---

## Quick Reference — raw-HTML patterns → Carbon components

| Source pattern | Carbon equivalent | Complexity | Status |
|---|---|---|---|
| `<button>` (styled) | `Button` | low | mapped |
| `<input type="text">` | `TextInput` | low | mapped |
| `<input type="password">` | `PasswordInput` | low | mapped |
| `<input type="number">` | `NumberInput` | low | mapped |
| `<input type="date">` | `DatePicker` + `DatePickerInput` | medium | mapped |
| `<input type="checkbox">` | `Checkbox` | low | mapped |
| `<input type="radio">` | `RadioButton` + `RadioButtonGroup` | low | mapped |
| `<input type="file">` | `FileUploader` | medium | mapped |
| `<input type="search">` | `Search` | low | mapped |
| `<textarea>` | `TextArea` | low | mapped |
| `<select>` | `Select` + `SelectItem` OR `Dropdown` | medium | mapped |
| Custom autocomplete | `ComboBox` | medium | mapped |
| Multi-select autocomplete | `MultiSelect` | medium | mapped |
| Custom toggle switch | `Toggle` | low | mapped |
| `<label>` + field | `FormLabel` (handled by input `labelText` prop) | low | mapped |
| `<form>` | `Form` + `FormGroup` + `Stack` | low | mapped |
| Custom dialog/modal | `Modal` | medium | mapped |
| Custom side drawer | `SidePanel` (from `@ibm/products`) | medium | mapped |
| Custom tooltip | `Tooltip` | medium | mapped |
| Custom popover | `Popover` | medium | mapped |
| Custom toast notification | `ToastNotification` + `NotificationActionButton` | medium | mapped |
| Custom inline alert | `InlineNotification` | low | mapped |
| Custom progress bar | `ProgressBar` | low | mapped |
| Custom spinner/loader | `Loading` or `InlineLoading` | low | mapped |
| Custom skeleton placeholder | `SkeletonText` + `SkeletonPlaceholder` + `SkeletonIcon` | low | mapped |
| Custom tabs | `Tabs` + `TabList` + `Tab` + `TabPanels` + `TabPanel` | medium | mapped |
| Custom accordion | `Accordion` + `AccordionItem` | low | mapped |
| Custom tag/badge | `Tag` | low | mapped |
| Custom breadcrumb | `Breadcrumb` + `BreadcrumbItem` | low | mapped |
| Custom pagination | `Pagination` | low | mapped |
| Custom data table | `DataTable` (composable) | high | mapped |
| Custom sidebar | `SideNav` + `SideNavItems` + `SideNavLink` | medium | mapped |
| Custom header / navbar | `Header` + `HeaderName` + `HeaderNavigation` + `HeaderMenuItem` + `HeaderGlobalBar` + `SkipToContent` | high | mapped |
| Custom hamburger menu | `HeaderMenuButton` | low | mapped |
| Custom tree view | `TreeView` + `TreeNode` | medium | mapped |
| Custom stepper / wizard | `ProgressIndicator` + `ProgressStep` | medium | mapped |
| Custom code block | `CodeSnippet` | low | mapped |
| Custom copy-to-clipboard | `CopyButton` | low | mapped |
| Custom overflow menu | `OverflowMenu` + `OverflowMenuItem` | medium | mapped |
| Custom card | `Tile`, `ClickableTile`, `ExpandableTile`, `SelectableTile` | low | mapped |
| CSS grid layout | `Grid` + `Column` (12-column fluid) | medium | mapped |
| Custom link | `Link` (use `@carbon/react`, not `<a>`, for styled external links) | low | mapped |
| Icon libraries (heroicons, react-icons, etc.) | `@carbon/icons-react` | low | mapped |

---

## Core migration patterns

### 1. Package install + import boundary

Source `package.json` additions:

```json
{
  "dependencies": {
    "@carbon/react": "^1.60.0",
    "@carbon/styles": "^1.60.0",
    "@carbon/icons-react": "^11.40.0"
  }
}
```

Optional (only when DataGrid / TearSheet / SidePanel etc. appear):

```json
{
  "dependencies": {
    "@ibm/products": "^2.50.0"
  }
}
```

**Import pattern**: always from `@carbon/react` (components) and `@carbon/icons-react` (icons).

```jsx
import { Button, TextInput, Form, Stack } from '@carbon/react';
import { ArrowRight, TrashCan } from '@carbon/icons-react';
```

Icon size in v11 is a prop, NOT baked into the import name:

```jsx
// OK
<ArrowRight size={16} />
<TrashCan size={20} />

// WRONG — this is v10 syntax
// import { ArrowRight16 } from '@carbon/icons-react';
```

### 2. SCSS / styles wiring

Pick ONE integration path, not both:

**Path A — Sass `@use` (recommended)** at the app entry point (e.g. `src/index.scss` or `app/globals.scss`):

```scss
@use '@carbon/styles';
@use '@carbon/react';
```

**Path B — Pre-compiled CSS** (when Sass isn't available):

```js
import '@carbon/styles/css/styles.css';
```

Source files that previously used CSS Modules, styled-components, or inline `style={}` for layout primitives (padding / spacing / colours) should migrate to Carbon tokens where applicable. Component-local styles for non-token concerns (animations, page-specific positioning) can stay in existing CSS Modules. Do NOT port every colour literal to a token — Carbon tokens cover design-surface colours; app-specific brand colours remain in the app's style layer.

### 3. Theming

Wrap the app in `<Theme>` at or near the root:

```jsx
import { Theme } from '@carbon/react';

function App() {
  return (
    <Theme theme="g10">
      {/* app */}
    </Theme>
  );
}
```

Themes: `white`, `g10` (light grey), `g90` (dark grey), `g100` (black). `g10` is the most common enterprise default. Sections needing a different theme can nest a second `<Theme>`.

### 4. Fluid layout

Replace ad-hoc CSS grid / flexbox scaffolding with Carbon's 12-column `Grid`:

```jsx
import { Grid, Column } from '@carbon/react';

<Grid>
  <Column sm={4} md={4} lg={8}>Primary</Column>
  <Column sm={4} md={4} lg={8}>Secondary</Column>
</Grid>
```

`Grid` accepts `condensed` (4px gutters) or `narrow` (16px gutters) props. Most app shells don't need either.

### 5. Form composition

Carbon forms use `Form` + `Stack` + `FormGroup` instead of `<form>` + raw divs. `Stack gap={7}` gives the Carbon-standard spacing between form fields (6 = 1rem / 16px, 7 = 1.5rem / 24px — standard).

```jsx
import { Form, Stack, FormGroup, TextInput, PasswordInput, Button } from '@carbon/react';

<Form onSubmit={handleSubmit}>
  <Stack gap={7}>
    <FormGroup legendText="Account">
      <TextInput
        id="user"
        labelText="Username"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        required
      />
      <PasswordInput
        id="pw"
        labelText="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        required
      />
    </FormGroup>
    <Button type="submit">Sign in</Button>
  </Stack>
</Form>
```

### 6. Notifications

Three notification variants, picked by context — NOT interchangeable:

| Carbon component | When |
|---|---|
| `InlineNotification` | Renders inside the page flow (form validation summary, panel-level status). |
| `ActionableNotification` | Inline notification with one primary action (undo, retry). Renders in-flow. |
| `ToastNotification` | Timed overlay at the edge of the viewport (background job done, copy-to-clipboard success). |

Inline notifications are NOT dismissible by default. Use `onCloseButtonClick` to opt in.

### 7. Accessibility — form labels

Every Carbon input requires `labelText` (visible) or `aria-label` (for search inputs that don't use a visible label). Unlike `<input>`, there is no `<label htmlFor=...>` sibling — the label is inside the component props.

```jsx
// ✓ Correct
<TextInput id="q" labelText="Search query" />

// ✗ Wrong (Carbon's label will render duplicate)
<label htmlFor="q">Search query</label>
<TextInput id="q" />
```

---

## Component-by-component detail

### Button

**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button, IconButton } from '@carbon/react'`
**Complexity:** low — direct replacement for styled `<button>`.
**Status:** mapped

**Prop map (common):**

| Source idiom | Carbon prop | Notes |
|---|---|---|
| `onClick` | `onClick` | unchanged |
| `disabled` | `disabled` | unchanged |
| `type="submit"` | `type="submit"` | unchanged |
| CSS class for primary/secondary | `kind="primary"` / `kind="secondary"` / `kind="tertiary"` / `kind="ghost"` / `kind="danger"` / `kind="danger--tertiary"` / `kind="danger--ghost"` | closed enum |
| CSS class for small/large | `size="sm"` / `size="md"` (default) / `size="lg"` / `size="xl"` / `size="2xl"` | v11 uses size tokens, not size-in-prop |

**Icon-only button**: use `IconButton` (NOT `Button` with only an icon child), because `IconButton` includes the required aria-label and 48×48 hit-target automatically:

```jsx
import { IconButton } from '@carbon/react';
import { TrashCan } from '@carbon/icons-react';

<IconButton label="Delete item" onClick={handleDelete} kind="ghost">
  <TrashCan />
</IconButton>
```

**SCSS:** no component-specific styles needed.

---

### TextInput / NumberInput / PasswordInput / TextArea

**Carbon:** `TextInput`, `NumberInput`, `PasswordInput`, `TextArea` from `@carbon/react`
**Import:** `import { TextInput, NumberInput, PasswordInput, TextArea } from '@carbon/react'`
**Complexity:** low — direct replacement for `<input>` / `<textarea>` variants.
**Status:** mapped

**Prop map:**

| Source idiom | Carbon prop | Notes |
|---|---|---|
| `value` | `value` | unchanged |
| `onChange` | `onChange` | unchanged |
| `placeholder` | `placeholder` | unchanged |
| `required` | `required` | unchanged |
| `disabled` | `disabled` | unchanged |
| `readOnly` | `readOnly` | unchanged |
| `<label htmlFor>` sibling | `labelText` prop | **required** — do not keep the sibling label |
| helper text (custom) | `helperText` prop | |
| error state | `invalid={true}` + `invalidText="…"` | replaces custom red border + text |
| warning state | `warn={true}` + `warnText="…"` | |
| inline validation on blur | `onBlur` + update invalid state | |

`NumberInput` requires `id`, `label`, `min`, `max`, `step` to render the spinner controls predictably.

**PasswordInput** renders the show/hide eye button automatically. `hidePasswordLabel` and `showPasswordLabel` customise the accessible labels.

### Select / Dropdown / ComboBox / MultiSelect

| Source pattern | Carbon component | When |
|---|---|---|
| `<select>` with a few static options | `Select` + `SelectItem` | Short closed list (< ~10 items). |
| Custom select with custom rendering | `Dropdown` | Fewer than ~30 items, no filter needed. |
| Autocomplete / type-ahead | `ComboBox` | User types to filter a single-select list. |
| Multi-select with tags | `MultiSelect` | User selects multiple items. |
| Multi-select + filter | `FilterableMultiSelect` | Multi-select with type-ahead. |

All use `titleText` (the label above the control) + `label` (the placeholder when nothing is selected) + `items` (the option array) + `itemToString(item) => string` (how to render each item).

```jsx
<ComboBox
  id="fruit"
  titleText="Fruit"
  label="Choose a fruit"
  items={['apple', 'banana', 'cherry']}
  itemToString={(it) => it ?? ''}
  onChange={({ selectedItem }) => setFruit(selectedItem)}
/>
```

**Prop map from `<select>`:**

| Source | Carbon | Notes |
|---|---|---|
| `value` | `selectedItem` (ComboBox/Dropdown) or `value` (Select) | Carbon picks different prop names depending on component type. |
| `onChange={e => setX(e.target.value)}` | `onChange={({selectedItem}) => setX(selectedItem)}` | Callback receives `{selectedItem}`, NOT a DOM event. |
| `<option value={v}>` | `items` array entries | Items are arbitrary objects; `itemToString` renders. |

---

### Modal

**Carbon:** `Modal` (general purpose) or `ComposedModal` + `ModalHeader` + `ModalBody` + `ModalFooter` (composable)
**Import:** `import { Modal, ComposedModal, ModalHeader, ModalBody, ModalFooter } from '@carbon/react'`
**Complexity:** medium — Carbon enforces focus trap, ESC to close, scroll lock automatically.
**Status:** mapped

**Prop map:**

| Source idiom | Carbon prop | Notes |
|---|---|---|
| `isOpen` | `open` | |
| `onClose` | `onRequestClose` | |
| primary action button | `primaryButtonText` + `onRequestSubmit` | |
| secondary/cancel button | `secondaryButtonText` + `onRequestClose` | |
| destructive action | `danger={true}` on `Modal` | styles primary button red |
| modal size | `size="xs" \| "sm" \| "md" \| "lg"` | `md` default |

Use `Modal` for 90% of cases. Use `ComposedModal` when you need custom header/body/footer layouts (multi-step modals, large forms, custom button counts).

```jsx
<Modal
  open={isOpen}
  onRequestClose={close}
  onRequestSubmit={save}
  modalHeading="Delete item"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  danger
>
  <p>This action cannot be undone.</p>
</Modal>
```

---

### Tabs

**Carbon:** `Tabs` + `TabList` + `Tab` + `TabPanels` + `TabPanel`
**Import:** `import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react'`
**Complexity:** medium — v11 split from v10's single `Tabs` component; requires all 5 parts.
**Status:** mapped

```jsx
<Tabs selectedIndex={idx} onChange={({ selectedIndex }) => setIdx(selectedIndex)}>
  <TabList aria-label="Sections">
    <Tab>Overview</Tab>
    <Tab>Details</Tab>
    <Tab>History</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>…</TabPanel>
    <TabPanel>…</TabPanel>
    <TabPanel>…</TabPanel>
  </TabPanels>
</Tabs>
```

`TabList` takes `contained` for the bar-style appearance, `fullWidth` for equal-width tabs.

---

### DataTable

**Carbon:** `DataTable` (render-prop pattern) + `Table` family (`TableContainer`, `Table`, `TableHead`, `TableRow`, `TableHeader`, `TableBody`, `TableCell`) + optional expansion (`TableExpandHeader`, `TableExpandRow`, `TableExpandedRow`) + optional selection (`TableSelectAll`, `TableSelectRow`)
**Import:** from `@carbon/react`
**Complexity:** high — the render-prop shape is the biggest learning curve.
**Status:** mapped

**Structural migration:**

1. Build `rows[]` with an `id` field on each row (unique, stable, used as the React key).
2. Build `headers[]` with `{ key, header }` shape (`key` must match a field in each row).
3. Wrap `<Table>` in `<DataTable rows={rows} headers={headers}>{(renderProps) => <TableContainer>…</TableContainer>}</DataTable>`.
4. Use `getRowProps({ row })`, `getHeaderProps({ header })`, `getTableProps()` from render-props for a11y wiring.

**Built-in features, opt-in:**

| Feature | How |
|---|---|
| Sortable columns | `<DataTable ... isSortable>` |
| Row selection | `TableSelectRow` + `TableSelectAll`, read from `selectedRows` in render-props |
| Row expansion | `TableExpandHeader` + `TableExpandRow` + `TableExpandedRow`, check `row.isExpanded` |
| Search | `TableToolbar` + `TableToolbarSearch`, read from `getToolbarProps` |
| Batch actions | `TableBatchActions` + `TableBatchAction` |
| Pagination | Use Carbon's `Pagination` component below the `TableContainer` — NOT a built-in DataTable prop |

**Large-dataset consideration**: Carbon `DataTable` does NOT virtualize. For > 500 rows, combine with client-side pagination or switch to `@ibm/products` `DataGrid` which virtualizes via TanStack Virtual.

---

### Notifications

**Carbon:** `InlineNotification`, `ActionableNotification`, `ToastNotification`
**Import:** `import { InlineNotification, ActionableNotification, ToastNotification } from '@carbon/react'`
**Complexity:** low — direct replacement for custom alert UIs.
**Status:** mapped

**Kind values** (closed enum): `error` | `info` | `info-square` | `success` | `warning` | `warning-alt`.

**Do NOT use `<div>` with role="alert"** for validation summaries — use `InlineNotification` to get the Carbon iconography, colour tokens, and screen-reader announcements correctly.

**ToastNotification**: render inside a toast-portal at the edge of the viewport. Users commonly pair with a small portal helper (`ReactDOM.createPortal`) or an existing toast manager (e.g. a custom hook). Carbon does NOT ship a toast-queue manager — that's a layer above the component.

---

### Header / navigation shell

**Carbon:** `UIShell` composition — `Header`, `HeaderName`, `HeaderNavigation`, `HeaderMenu`, `HeaderMenuItem`, `HeaderGlobalBar`, `HeaderGlobalAction`, `SkipToContent`, `SideNav`, `SideNavItems`, `SideNavLink`
**Import:** all from `@carbon/react`
**Complexity:** high — custom nav bars don't translate 1:1; expect structural changes.
**Status:** mapped

Minimum viable shell:

```jsx
<Header aria-label="App">
  <SkipToContent />
  <HeaderMenuButton
    aria-label="Open menu"
    isCollapsible
    onClick={toggleSideNav}
    isActive={sideNavOpen}
  />
  <HeaderName href="/" prefix="IBM">Carbon App</HeaderName>
  <HeaderNavigation aria-label="Primary">
    <HeaderMenuItem href="/catalog">Catalog</HeaderMenuItem>
    <HeaderMenuItem href="/orders">Orders</HeaderMenuItem>
  </HeaderNavigation>
  <HeaderGlobalBar>
    <HeaderGlobalAction aria-label="Profile" onClick={...}>
      <UserAvatar />
    </HeaderGlobalAction>
  </HeaderGlobalBar>
</Header>
```

**Behaviour changes vs. a custom nav bar:**

- Carbon `Header` is a full-width fixed top bar (`position: fixed; top: 0; inset-inline: 0`).
- Content below must have `padding-top: var(--cds-spacing-09, 48px)` to avoid being hidden behind the Header.
- `SkipToContent` is required for WCAG — do not skip.
- Mobile hamburger collapses into `SideNav`, not a custom overlay; use `<HeaderSideNavItems>` to project nav items into the side drawer on mobile.

---

### Tile (card) family

**Carbon:** `Tile`, `ClickableTile`, `ExpandableTile`, `SelectableTile`, `TileAboveTheFoldContent`, `TileBelowTheFoldContent`
**Import:** from `@carbon/react`
**Complexity:** low
**Status:** mapped

Replace `<div className="card">` (or any boxed container with shadow + padding) with `Tile`. `ClickableTile` for interactive cards, `SelectableTile` for single-select patterns, `ExpandableTile` for show-more/hide-more content.

---

### Icons (@carbon/icons-react)

**Import pattern (v11):**

```jsx
import { Add, TrashCan, ArrowRight, CheckmarkFilled } from '@carbon/icons-react';

<Add size={16} />
<TrashCan size={20} />
<ArrowRight size={24} />
```

Sizes: `16`, `20`, `24`, `32`. Default is `16`.

**Migrating from other icon libraries:**

| Source library | Migration path |
|---|---|
| `heroicons` / `lucide-react` | Find the closest Carbon icon by semantic meaning, NOT visual match. Carbon icons are consistently sized and weighted. When no exact match exists, log a deviation with `What the system did: best-guess-carbon`. |
| `react-icons` | Same — map by meaning. `react-icons` is a multi-library aggregator; many icons won't have direct equivalents. |
| `@mui/icons-material` | Carbon has most equivalents; see `maps/material-ui5.md` for the icon column map. |
| `@fortawesome/react-fontawesome` | Carbon has most equivalents. Keep brand icons (github, gmail) as-is from FA; replace UI icons. |
| Custom SVG components | Keep as-is if the icon is domain-specific (brand marks, industry-specific glyphs). Only replace UI icons (arrows, checks, close, menu) with Carbon equivalents. |

---

## Next.js-specific notes

### App Router (`app/` directory)

Carbon React v11 uses `useId`, `useLayoutEffect`, and refs throughout — all of these require a client component. Any page or component that renders a Carbon component (anything from `@carbon/react`) must start with:

```jsx
'use client';

import { Button } from '@carbon/react';
export default function Page() { return <Button>Click</Button>; }
```

**Strategy**:

1. Keep `app/layout.js` as a server component (imports `@carbon/styles` at the top-level is fine — it's CSS, not a React component).
2. Mark every page / layout / component that uses `@carbon/react` as `'use client'`. A common pattern is one client-component wrapper per route group.
3. Data fetching stays on the server; pass the result into the client boundary.

Metadata stays in the server-component `layout.js`:

```jsx
// app/layout.js  (server component — no 'use client')
import '@carbon/styles/css/styles.css';

export const metadata = {
  title: 'Carbon App',
  description: '…',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Pages Router (`pages/` directory)

Simpler — no RSC boundary. Import `@carbon/react` anywhere. Load `@carbon/styles` in `pages/_app.js`:

```jsx
import '@carbon/styles/css/styles.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

### Fonts

Carbon defaults to IBM Plex Sans. With `next/font`:

```jsx
import { IBM_Plex_Sans } from 'next/font/google';

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
});

// Apply to body via className or CSS variable override
```

### SSR hydration

Carbon components are hydration-safe. If you see hydration warnings on Carbon components, the cause is almost always server/client date/random-id mismatch OUTSIDE of Carbon — check `Date.now()` calls, random UUID generation, and `useId()` across boundaries.

---

## Common gotchas

| Gotcha | Fix |
|---|---|
| Button renders without Carbon styles | Confirm `@carbon/styles` is imported at app entry (SCSS `@use '@carbon/styles'` or JS `import '@carbon/styles/css/styles.css'`). |
| `labelText` prop results in duplicate labels | Remove the legacy `<label htmlFor>` sibling — Carbon inputs render the label via prop. |
| `v-for`-style keys lost on DataTable rows | `rows[].id` must be stable across renders (NOT array-index). |
| TypeScript complains about `selectedItem: unknown` | Use generics: `<ComboBox<string>>` or cast inside `onChange`. |
| Dark theme flickers on initial load | Apply the theme CSS class in `<html>` via SSR or a blocking script BEFORE React hydrates. Carbon's `Theme` component handles runtime theming; initial paint needs its own path. |
| Icons render at wrong size | v11 uses `size={16}` prop. v10 bakes size in name (`Add16`). Don't mix. |
| Form submission reloads the page | Add `onSubmit={(e) => { e.preventDefault(); … }}` on the `Form` component — Carbon's `Form` is still a native `<form>`. |
| Select `onChange` receives a full event (legacy) | Carbon's `Select` onChange still uses the `(e) => e.target.value` pattern. `Dropdown` / `ComboBox` use `({selectedItem}) => …`. |
| SideNav overflow under Header on mobile | Use `<HeaderSideNavItems>` inside `<SideNav>` — it handles the top-offset for you. |

---

## Deviation triggers (log these during migration)

Log a deviation with `What the system did: best-guess-carbon` when:

- An icon in the source has no Carbon equivalent and you picked a similar-looking one.
- A custom widget (chart, video player, calendar) isn't part of Carbon's component library — keep the custom widget; log the boundary.
- A CSS Module uses brand-specific colours that don't map to Carbon tokens — keep the module; log.
- A layout uses CSS Grid in ways the 12-column Carbon Grid can't express (grid template areas, masonry) — keep the custom CSS; log.
- Next.js App Router requires `'use client'` on a component that the human-authored source expected to be a server component — you converted it; log.

Log with `What the system did: preserved-source` when:

- Third-party component library (react-select, react-beautiful-dnd, etc.) has no Carbon equivalent and the team needs it.
- Custom animations or motion-design work (framer-motion, GSAP) that Carbon's motion tokens don't replace 1:1.

Log with `What the system did: wrapper-added` when:

- You added a thin adapter around a Carbon component to match a pre-existing internal component API the codebase uses everywhere.

---

## Carbon v11 references

- <https://react.carbondesignsystem.com> — component catalog with code samples.
- <https://carbondesignsystem.com/guidelines/> — usage + pattern guidance.
- <https://carbondesignsystem.com/accessibility/> — a11y requirements per component.
- <https://carbondesignsystem.com/migrating/guide/develop/> — v10 → v11 migration (see `maps/carbon-v10-to-v11.md` for that specific migration class).
