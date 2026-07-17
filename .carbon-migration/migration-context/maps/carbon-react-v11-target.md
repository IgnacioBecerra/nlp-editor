# Carbon v11 React — Target Authoring Rules

> **MANDATORY · ALWAYS LOADED · AUTHORITATIVE.** Load this file at the start
> of every migration whose target is `@carbon/react` (Carbon v11) — regardless
> of source framework (`bootstrap`, `material-ui`, `chakra`, `ant-design`,
> `tailwind`, `dojo`, raw `react`, `carbon` v10, `java-server-ui`, …) and
> regardless of migration class (`library`, `framework-era-swap`,
> `runtime-swap`, `carbon-version-upgrade`, `platform-modernize`). It is
> **not** trigger-gated; loading it is not optional.
>
> It is loaded **in addition to** your one source-framework map — it does NOT
> count against INDEX.md's "load exactly ONE map" rule. The **source map**
> governs how to *translate* source-framework code into Carbon. **This file**
> governs whether the resulting Carbon v11 React code is *correct*.
>
> **Precedence.** Where a source-framework map restates a target-authoring
> rule, the rule here is authoritative. Maps describe source→Carbon
> translation; this file describes correct Carbon v11 React output. If the two
> ever disagree, follow this file and log a `[map-target-rule-drift]` note.
>
> **Scope.** `@carbon/react` (React) only. Web-Components targets
> (`@carbon/web-components` for Vue / Svelte / Angular / vanilla) use a
> different API surface (CSS custom properties, `cds--grid` classes, custom
> elements) — these React rules do not transfer verbatim to them.

---

## 0. How to use this file

- **Apply these rules inline while authoring** every Carbon v11 React file —
  components, styles, the SCSS entry, the app shell.
- These rules are **correctness**, not discretionary polish. A violation
  ships a broken build, a runtime console error, an inaccessible control, or
  a visibly wrong layout. They are in scope for every migration class.
- This is **not** a mandate to retro-fit pre-existing source-side code the
  migration does not otherwise touch. Apply a rule when you author or
  substitute the component it governs.
- **Verify every Carbon API name.** Your training data is stale. Before
  writing any `@carbon/*` import — component, hook, prop, icon, or token —
  not literally shown in a file you are reading, verify it exists in the
  installed package via the `carbon-builder` skill or Carbon MCP
  (`code_search` for named exports / icons, `docs_search` + the package
  `exports` field for subpaths). Names familiar from Material UI, Heroicons,
  Phosphor, Lucide, Font Awesome, etc. do **not** translate. See INDEX.md's
  Package API Verification block.

---

## 0.5 Dependency pre-flight (MANDATORY — every class, owned by the dependency/metadata unit)

These rules govern `package.json` for EVERY Carbon v11 React migration. They
exist because field incidents (2026-05-29, 2026-06-10) shipped projects that
did not `npm install`. The supervisor re-enforces each rule deterministically
at the end-of-migration dependency-normalize step, but intermediate units see
whatever you write — get it right at the source.

1. **React floor is 16.14.0 — and React 17/18 is NOT required.** `@carbon/react`
   v11 and `@carbon/icons-react` v11 import `react/jsx-runtime` (the new JSX
   transform), which first shipped in React 16.14.0. The peer range's 16.8.6
   minimum understates this: a 16.8.6–16.13.x project installs and
   type-checks but fails at build time with `Can't resolve 'react/jsx-runtime'`.
   A React 16 project that must move goes to `^16.14.0` — never to 17/18.
2. **Never introduce a React major bump.** For in-place migrations
   (carbon-version-upgrade, library) the app runtime is out of scope: do not
   bump 16→17/18 to "fix" a peer warning — it breaks React-16-only peers
   (e.g. `react-hook-form@6`, peer `^16.8.0`) and the bare install with it.
   The supervisor reverts such bumps to `^16.14.0`
   (`[react-major-bump-reverted]`). Scaffolded apps (framework-era-swap,
   platform-modernize) take their React version from the pin-synced template
   and it is not yours to change.
3. **Carbon versions come from the pins, not from memory or `@latest`.**
   `@carbon/react` and `@carbon/styles` are pinned EXACT, and
   `@carbon/icons-react` to a pinned range, in
   `config/carbon-version-pins.json` (the generated diff block in
   `maps/carbon-v10-to-v11.md` §1.1 shows the current values). Installing
   "the latest" makes the migration non-reproducible and has pulled in
   versions whose requirements the project cannot meet.
4. **Icon package-presence invariant.** Whenever ANY source file imports
   icons — `from '@carbon/icons-react'` or `from '@carbon/react/icons'` —
   `@carbon/icons-react` MUST be a direct dependency at the pinned range
   (§8 explains why the package must not be removed even under the
   re-export path). "Not added" is valid only when zero icon imports exist
   project-wide. Never record an icon-import style in `MIGRATION_FACTS.md`
   while omitting the package — the contradiction strands every icon import
   and invites the next unit to "repair" it with `@latest` + a React bump.

---

## 1. SCSS baseline & styling  (MANDATORY)

**(MANDATORY) Carbon v11 React styles are consumed as SCSS — never pre-compiled CSS.** 

The app SCSS entry (`src/styles.scss`, `global.scss`, `App.scss` — any
project-consistent name), imported from the app entry module before component
imports:

```scss
@use '@carbon/react' with (
  $font-path: '@ibm/plex'   // IBM Plex @font-face URLs resolve via the package
);
```

- **`@use '@carbon/react'` is REQUIRED.** It is the only line that emits
  *compiled CSS* — every component's styles, the reset, type, and the IBM
  Plex `@font-face` rules. Without it, all Carbon components render
  completely unstyled.
- **Token subpaths are OPTIONAL and emit no CSS.** `@use '@carbon/react/scss/theme' as *`,
  `.../scss/spacing`, `.../scss/type`, `.../scss/breakpoint`, `.../scss/motion`,
  `.../scss/grid`, etc. only expose SCSS variables / mixins for *your own*
  custom SCSS. Add one **only** when an editable `.scss` file references that
  token family. An unused token `@use` is noise.
- **Never import pre-compiled CSS.** `import '@carbon/styles/css/styles.css'`
  (or any `.css` / pre-built artifact) bakes webpack-era `~@ibm/plex/...`
  `@font-face` URLs that Vite / Dart Sass cannot resolve — IBM Plex 404s at
  runtime and the app falls back to a system typeface.
- **Never add a font CDN.** No `<link href="…fonts…">`, no Google-Fonts
  `@import`. `@use '@carbon/react'` already delivers IBM Plex.
- **Carbon Charts:** `@use '@carbon/charts/scss' as charts;` — the SCSS
  source. NOT `@carbon/charts/styles/styles.scss` (pre-compiled; bakes the
  same unresolvable font URLs). Verify the exact subpath against the
  installed `@carbon/charts` package `exports` field.
- **Theme config takes a map variable, never a string.** If you configure
  the theme in SCSS — `@use '@carbon/styles/scss/theme' with ($theme: …)` —
  `$theme` must be a theme **map variable** (`$white`, `$g10`, `$g90`,
  `$g100`), imported first from `@carbon/styles/scss/themes`. `$theme: 'white'`
  (a string) fails to compile: `$map2: "white" is not a map`. (This is the
  SCSS config — distinct from the React `<Theme theme="white">` component,
  which *does* take a string.)
- **No inline styles in JSX/TSX.** Style via the `className` prop + an SCSS
  class. Inline `style={{}}` is permitted only for genuinely dynamic values
  that cannot be predetermined. Token *strings* never resolve in inline
  styles — `style={{ margin: '$spacing-05' }}` silently does nothing.
- Sass must resolve `node_modules` — add it to the bundler's Sass
  `includePaths` (`css.preprocessorOptions.scss.includePaths: ['node_modules']`
  for Vite).

---

## 2. Accessibility-mandatory props

Carbon v11 components accept props that are **optional in TypeScript** —
omitting one is no build error and no console warning — but **mandatory for
an accessible component**. Omit one and the control ships silently
inaccessible: no programmatic label, no accessible name. **Preserve** every
such prop the source already had; **supply** it on any component you author
or substitute.

| Component | a11y-activating prop(s) | Omitted → |
|---|---|---|
| `Button` icon-only (`hasIconOnly`) | `iconDescription` | no accessible name |
| `IconButton` | `label` | no accessible name |
| `TextInput` / `TextArea` / `Select` / `Search` / `Slider` | `labelText` | control has no programmatic label |
| `Checkbox` / `RadioButton` | `labelText` | no label |
| `NumberInput` | `label` | no label |
| `Toggle` | `labelText` + `labelA` + `labelB` | state change not announced |
| `Modal` / `ComposedModal` | `modalHeading` (or `ModalHeader` title) | dialog has no accessible name |
| `FileUploader` | `labelTitle` + `labelDescription` | upload control unlabeled |
| `InlineNotification` / `ToastNotification` | `title` | alert content not announced |

- A real `<label>` / legend is required — a placeholder, an adjacent `<p>`,
  or a bare `aria-label` is **not** a substitute. `aria-label` hides the
  label from sighted users; a placeholder disappears as soon as the user
  types. Use Carbon's `labelText` (it wires `<label for>` to the input id).
- Validation: use `invalid` + `invalidText` (wires `aria-describedby`); never
  convey an error by color alone. Helper text: use `helperText`.
- **Do not over-add ARIA.** Carbon already supplies `role`, `aria-modal`,
  the focus trap, sort announcements, and landmark roles for its own
  components. Do NOT add `role="dialog"` to `Modal`, a second `<nav>` around
  `SideNav`, or `aria-current` to a `Breadcrumb` item — duplicate ARIA
  breaks assistive technology.
- Per WCAG 2.5.3, an `aria-label` on a control with visible text must
  *contain* that text, never replace or contradict it.

---

## 3. Fixed UI Shell header — keep content clear of it 

The Carbon UI Shell `<Header>` is `position: fixed` — removed from document
flow, overlaying the top of the page. Three mitigations, all required when
the app renders a fixed Carbon `<Header>`:

1. **Static offset — use `<Content>`.** Wrap the main content region in
   Carbon's `<Content>` component (from `@carbon/react`) — it applies
   `padding-top: 3rem` automatically and tracks the header height. **Never**
   substitute a hardcoded `margin-top: 48px` / `margin-top: 3rem` pixel
   offset — it silently breaks if the header height changes and is not the
   Carbon composition. (A pre-existing source-side offset that already works
   is not itself a migration target; but when you author or repair the
   shell, use `<Content>`.)
2. **Reset scroll on view/panel navigation.** v11 components scroll
   programmatically on mount (`Tabs` moves the selected tab into view; focus
   and anchor links scroll too) — a freshly-navigated panel can open scrolled
   so its heading sits behind the fixed header. The shell (or router) must
   scroll to the top whenever the active panel/view changes:
   ```tsx
   useEffect(() => { window.scrollTo({ top: 0 }); }, [activeView]);
   ```
3. **`scroll-padding-top` on the scroll root** — so any in-panel
   focus/anchor scroll stops below the header, never behind it:
   ```scss
   html { scroll-padding-top: 3rem; } // = Carbon UI Shell header height (48px)
   ```
   This satisfies **WCAG 2.2 §2.4.11 Focus Not Obscured** — a keyboard-focused
   element must never be fully hidden behind a sticky header. Carbon does not
   handle 2.4.11 automatically.

`SkipToContent` must be the first child of `<Header>`. Give every navigation
landmark a unique `aria-label`.

---

## 4. Layout grid 

Where a page lays out **multiple columns / regions**, the
**Carbon v11 grid is MANDATORY** for that layout — not hand-rolled
`display:grid` / `display:flex` SCSS.

- v11's `<Grid>` is **CSS Grid**. There is **no `<Row>`** — `<Column>` sits
  directly inside `<Grid>`. (To keep v10 flexbox behaviour, opt in explicitly
  with `<FlexGrid><Row><Column>`.)
- **Every `<Column>` needs explicit responsive spans** — `sm`, `md`, `lg`
  (v11 columns do not auto-span). E.g. `<Column sm={4} md={8} lg={16}>`.
- **Grid variants** — Default (32px gutter), `<Grid narrow>` (16px, for
  dense tile/card layouts), `<Grid condensed>` (0px, for data-dense screens).
- **Wrapped rows.** When `<Column>`s wrap onto multiple rows, set `row-gap`
  on the `<Grid>` to match the gutter — Default 32px → `row-gap: $spacing-07`;
  `narrow` 16px → `$spacing-05`; `condensed` 0. Carbon `<Column>`s use
  margins for alignment, so wrapped-row vertical spacing comes from `row-gap`,
  never a `<Column>` `margin-bottom`.
- **Separate `<Grid>` per logical content group** — a header, a tile group,
  and a footer that should not wrap together each get their own `<Grid>`.
  For items that should wrap together inside a column, use a nested `<Grid>`.
- **Exemption — single-component panels.** A panel whose content *is* one
  full-width component (one `DataTable`, one `StructuredList`, one form, one
  `Tile`) does NOT need a grid wrapper — that component is the layout. Do not
  add a pointless single-child `<Grid>`.

---

## 5. Modal / dialog

- **Dismissal callback is `onRequestClose`, not `onClose`.** `Modal` /
  `ComposedModal` fire `onRequestClose` on user dismissal (the X, `Esc`,
  overlay click) and `onRequestSubmit` for the primary action. `Modal` has no
  `onClose` prop — a handler wired to `onClose` silently never fires and the
  modal will not close.
- **`ModalFooter` requires `children` in v11.** A self-closing
  `<ModalFooter primaryButtonText="…" secondaryButtonText="…" />` fails the
  build (`Property 'children' is missing`). Compose `<Button>` children
  explicitly. (The all-in-one `<Modal modalHeading="…" primaryButtonText="…">`
  still works for simple modals.)
- **Floating children inside a `Modal` need `autoAlign`.** A `Dropdown`,
  `ComboBox`, or `Select` rendered inside a `Modal` can open its menu outside
  the viewport — add the `autoAlign` prop so Carbon flips it into view.
- **`data-modal-primary-focus`** on the first focusable input sets initial
  focus when the modal opens.
- Carbon supplies `role="dialog"`, `aria-modal`, the focus trap, and
  return-focus on close — do not add them manually.

---

## 6. DataTable

- **Use Carbon wrapper components, never raw HTML table elements.** v11's
  `DataTable` render prop hands you `getTableProps` / `getHeaderProps` /
  `getRowProps` / `getCellProps`; these return Carbon-internal props
  (`sortDirection`, `isSortHeader`, `onExpand`) that are valid **only** on
  Carbon's wrappers. Spreading them onto raw `<table>` / `<th>` / `<tr>` /
  `<td>` leaks invalid attributes and throws React console errors.

  | Raw HTML | Carbon v11 |
  |---|---|
  | `<table {...getTableProps()}>` | `<Table {...getTableProps()}>` |
  | `<thead>` | `<TableHead>` |
  | `<th {...getHeaderProps({header})}>` | `<TableHeader {...getHeaderProps({header})}>` |
  | `<tbody>` | `<TableBody>` |
  | `<tr {...getRowProps({row})}>` | `<TableRow {...getRowProps({row})}>` |
  | `<td>` | `<TableCell>` |

- **Do not hand-author the render-prop type.** `DataTable` already types its
  `children` render prop. A locally-declared `interface DataTableRenderProps`
  never structurally matches Carbon's generic and fails the build — leave the
  render-prop parameter **un-annotated** and let TypeScript infer it. If you
  need the type by name, import the real one: `import type { DataTableRenderProps } from '@carbon/react'`.

---

## 7. DOM correctness (runtime console errors)

These produce no build error but throw React console errors at runtime.

1. **No interactive/popover component inside a `<p>`.** `IconButton`,
   `Tooltip`, `Toggletip`, `DefinitionTooltip`, inline `CodeSnippet` render a
   `<div>`/`<span>` subtree — and a `<div>` cannot be a descendant of `<p>`
   (`validateDOMNesting` error). Change the wrapping `<p>` to a `<div>`.
2. **No double-labelling.** A control inside `<FormGroup legendText="X">`
   must not also set `labelText="X"` — the label renders twice. Keep one.
3. **Keyboard-only focus.** Style focus with `:focus-visible`, not `:focus`.
   Never `outline: none` / `outline: 0` on `:focus` — that removes the
   visible focus indicator (fails WCAG 2.4.7). Replace, don't remove.
4. A non-interactive element (`<div>`, `<span>`) with an `onClick` must be a
   native interactive element, or carry all of `role`, `tabIndex={0}`, and an
   `onKeyDown` handler. Prefer a real `<button>`.

---

## 8. Icons

- **Never invent an icon name.** Verify every `@carbon/icons-react` export
  against the installed package via the `carbon-builder` skill or Carbon MCP
  `code_search` (`asset_type: "icon"`) before writing the import. Names that
  look right from memory are frequently wrong (`SatisfiedFace` →
  `FaceSatisfiedFilled`; `WinLossChart` → `ChartWinLoss`).
- **Size is a prop, not part of the name.** v11: `<Add size={16} />`. There
  is no `Add16` / `Close20` export — the size-suffixed v10 names are gone.
- **Import from `@carbon/icons-react`, not `@carbon/react/icons`.** The
  two paths look equivalent (`@carbon/react/icons/index.d.ts` literally
  says `export * from '@carbon/icons-react'`), but if `@carbon/icons-react`
  is removed from `package.json` the runtime resolves via the nested
  `@carbon/react/node_modules/@carbon/icons-react` while `tsc` cannot
  reliably resolve every bare name through that nested copy — every icon
  import then fails type-check (TS2305 / TS2724). Keep `@carbon/icons-react`
  as a direct dependency and import from it.
- Carbon icon components accept `aria-label` / `aria-hidden` directly.

---

## 9. Component selection

- **`Tag` classifies; it does not communicate status.** Use `Tag` for
  categories / labels / keywords. For state ("what is happening?") use
  `IconIndicator` or `ShapeIndicator` with a `kind` prop (`failed`,
  `warning`, `succeeded`, `in-progress`, …). Never a colored `Tag` for
  status — colour alone is not an accessible status signal.
- **`InlineNotification` vs `ToastNotification`.** `InlineNotification` —
  persistent, in-context feedback tied to a page region. `ToastNotification`
  — transient, positioned, auto-dismissed system events (set `timeout`).
- **`PasswordInput`**, not `<TextInput type="password">` — it ships the
  show/hide toggle.
- Horizontal tabs use `Tabs` + `TabList`; vertical tabs use `TabsVertical` +
  `TabListVertical` — never mix the two sets.
- Do not use unstable / preview / `@carbon/labs-react` components unless the
  source already depends on them or the task explicitly asks.

---

## 10. Self-check before declaring a unit done (MANDATORY)

(MANDATORY) Confirm, for every file you authored or changed and FIX if observed:

- [ ] SCSS entry `@use`s `@carbon/react`; no `.css` / pre-compiled Carbon
      import anywhere; no font CDN link.
- [ ] Every icon-only `Button` / `IconButton` and every input has its
      a11y-activating prop (§2).
- [ ] If a fixed `<Header>` is rendered: `<Content>` (or an equivalent
      working offset), scroll-reset on nav, and `scroll-padding-top` (§3).
- [ ] Multi-column layouts use the Carbon v11 grid with explicit spans (§4).
- [ ] Modals use `onRequestClose`; `ModalFooter` has children (§5).
- [ ] No raw `<table>` carrying DataTable render props (§6).
- [ ] No interactive component inside `<p>`; `:focus-visible` not `:focus` (§7).
- [ ] Every Carbon import name was verified against the installed package (§0).
