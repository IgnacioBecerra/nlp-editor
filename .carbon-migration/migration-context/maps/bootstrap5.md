# Bootstrap 5 → Carbon React v11 Migration Map

> Source: bootstrap@5
> Target: @carbon/react v11
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| Container | Grid | medium | mapped |
| Row | Row | low | mapped |
| Col | Column | medium | mapped |
| Navbar | Header | high | mapped |
| Nav | HeaderNavigation | medium | partial |
| NavItem | HeaderMenuItem | low | mapped |
| NavLink | HeaderMenuItem | low | mapped |
| NavbarBrand | HeaderName | low | mapped |
| Breadcrumb | Breadcrumb | low | mapped |
| BreadcrumbItem | BreadcrumbItem | low | mapped |
| Pagination | Pagination | medium | mapped |
| PaginationItem | (none) | low | mapped |
| Tabs | Tabs | medium | mapped |
| Tab | Tab | medium | mapped |
| Button | Button | low | mapped |
| ButtonGroup | ButtonSet | low | mapped |
| CloseButton | Button | low | mapped |
| ToggleButton | Toggle | medium | partial |
| ToggleButtonGroup | (none) | high | partial |
| Form | Form | low | mapped |
| FormGroup | FormGroup | low | mapped |
| FormControl | TextInput | medium | mapped |
| FormLabel | FormLabel | low | mapped |
| FormText | (none) | low | mapped |
| FormSelect | Select | low | mapped |
| FormCheck | Checkbox | low | mapped |
| FormRange | Slider | low | mapped |
| InputGroup | (none) | high | custom_required |
| FloatingLabel | (none) | high | custom_required |
| Card | Tile | medium | partial |
| CardHeader | (none) | low | custom_required |
| CardBody | (none) | low | mapped |
| CardFooter | (none) | low | custom_required |
| CardTitle | (none) | low | custom_required |
| CardText | (none) | low | custom_required |
| ListGroup | StructuredList | medium | partial |
| ListGroupItem | StructuredListRow | medium | partial |
| Table | DataTable | high | mapped |
| Figure | (none) | low | unsupported |
| Image | (none) | low | unsupported |
| Alert | InlineNotification | medium | mapped |
| Toast | ToastNotification | medium | mapped |
| Modal | Modal | medium | mapped |
| ModalHeader | ModalHeader | low | mapped |
| ModalBody | ModalBody | low | mapped |
| ModalFooter | ModalFooter | low | mapped |
| Spinner | Loading | low | mapped |
| ProgressBar | ProgressBar | low | mapped |
| Dropdown | Dropdown | medium | partial |
| DropdownToggle | (none) | low | mapped |
| DropdownMenu | (none) | low | mapped |
| DropdownItem | OverflowMenuItem | low | mapped |
| Tooltip | Tooltip | medium | mapped |
| Popover | Popover | medium | partial |
| Offcanvas | SideNav | high | partial |
| Accordion | Accordion | low | mapped |
| AccordionItem | AccordionItem | low | mapped |
| Badge | Tag | low | mapped |
| Collapse | (none) | medium | custom_required |

---

### Container

**Carbon:** `Grid` from `@carbon/react`
**Import:** `import { Grid, Row, Column } from '@carbon/react'`
**Complexity:** medium — Bootstrap Container maps to Carbon Grid but Carbon uses a 16-column grid by default (also supports 4 and 12 col).
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| fluid | → see Notes | Use Grid without additional props for full-width; default Grid is already responsive |
| className | className | |

**Structural changes:**
1. Replace `<Container>` with `<Grid>` which renders a full-width 16-column grid by default
2. Carbon Grid does not have a 'fluid' prop equivalent — use condensed or fullWidth props on Grid
3. Carbon Grid breakpoints: sm (320px), md (672px), lg (1056px), xlg (1312px), max (1584px)

**Behavioral differences:**
1. Carbon Grid is always 100% width of its context; no fixed-width breakpoints like Bootstrap's .container
2. Carbon uses CSS Grid internally; Bootstrap uses Flexbox

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Row

**Carbon:** `Row` from `@carbon/react`
**Import:** `import { Grid, Row, Column } from '@carbon/react'`
**Complexity:** low — Direct structural equivalent. Row wraps Columns inside a Grid.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| className | className | |
| noGutters | → see Notes | Use condensed prop on Grid instead |

**Structural changes:**
1. Replace `<Row>` with `<Row>` from @carbon/react
2. Row must be a direct child of Grid

**Behavioral differences:**
1. Carbon Row uses CSS Grid rather than Flexbox
2. Gutter control is at the Grid level (condensed, narrow props), not the Row level

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Col

**Carbon:** `Column` from `@carbon/react`
**Import:** `import { Grid, Row, Column } from '@carbon/react'`
**Complexity:** medium — Bootstrap col-* classes map to Carbon Column span props. Column counts differ (12 vs 16). Must recalculate span values.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| xs | sm (out of 4 columns) | |
| sm | sm | |
| md | md (out of 8 columns) | |
| lg | lg (out of 16 columns) | |
| xl | xlg | |
| xxl | max | |
| className | className | |
| offset | → see Notes | Use { span: N, offset: N } object syntax per breakpoint |

**Structural changes:**
1. Replace `<Col xs={6} md={4}>` with `<Column sm={2} md={2} lg={4}>`
2. Carbon uses sm/md/lg/xlg/max props accepting { span: N } or just a number
3. Carbon Column span values are out of 4 (sm), 8 (md), 16 (lg/xlg/max)

**Behavioral differences:**
1. Carbon uses a 16-column grid at lg+ (not 12). Recalculate proportions accordingly.
2. Bootstrap auto-width columns (Col without span) map to Column with no span specified (auto)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Navbar

**Carbon:** `Header` from `@carbon/react`
**Import:** `import { Header, HeaderContainer, HeaderName, HeaderNavigation, HeaderMenu, HeaderMenuItem, HeaderGlobalBar, HeaderGlobalAction, SkipToContent } from '@carbon/react'`
**Complexity:** high — Bootstrap Navbar is a single flexible component. Carbon splits the header into Header, HeaderName, HeaderNavigation, HeaderGlobalBar, and uses HeaderContainer for responsive behavior.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| expand | → see Notes | Handled automatically by HeaderContainer |
| variant | no equivalent | No equivalent; Carbon Header is always dark by default |
| bg | no equivalent | No equivalent; Carbon uses design tokens for theming |
| fixed | → see Notes | Carbon Header is always fixed-top |
| sticky | → see Notes | Carbon Header is always fixed-top |
| collapseOnSelect | → see Notes | Not applicable |

**Structural changes:**
1. Wrap everything in `<HeaderContainer>` render prop pattern for mobile menu state management
2. Use `<Header aria-label='...'>`
3. Brand goes in `<HeaderName href='/'>[Company]<span> ProductName</span></HeaderName>`

**Behavioral differences:**
1. Carbon Header is always fixed to the top and always dark (g100 theme by default)
2. Mobile responsiveness requires HeaderContainer + SideNav combination

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Nav

**Carbon:** `HeaderNavigation` from `@carbon/react`
**Import:** `import { HeaderNavigation, HeaderMenuItem } from '@carbon/react'`
**Complexity:** medium — Bootstrap Nav is multipurpose (tabs, pills, header nav). Carbon has separate components for each use case.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | → see Notes | tabs → Tabs component; pills → no direct equivalent (use custom styling) |
| fill | → see Notes | Not applicable |
| justify | → see Notes | Not applicable |
| className | className | |

**Structural changes:**
1. For header navigation: use HeaderNavigation with HeaderMenuItem children
2. For tab-style nav: use Tabs, TabList, Tab, TabPanels, TabPanel
3. For standalone link lists: use StructuredList or plain styled links

**Behavioral differences:**
1. Carbon Nav components are purpose-specific and not generic
2. Pill-style nav has no Carbon equivalent; consider Tab or Link patterns

**SCSS:**
```scss
@use '@carbon/react'
```

---

### NavItem

**Carbon:** `HeaderMenuItem` from `@carbon/react`
**Import:** `import { HeaderMenuItem } from '@carbon/react'`
**Complexity:** low — Direct child of HeaderNavigation. Simple replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| active | isCurrentPage | |
| disabled | no equivalent | No equivalent on HeaderMenuItem; omit the item instead |

**Structural changes:**
1. Replace `<NavItem>` wrapper with nothing; NavLink becomes HeaderMenuItem directly

**SCSS:**
```scss
@use '@carbon/react'
```

---

### NavLink

**Carbon:** `HeaderMenuItem` from `@carbon/react`
**Import:** `import { HeaderMenuItem } from '@carbon/react'`
**Complexity:** low — NavLink content maps directly to HeaderMenuItem.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| href | href | |
| active | isCurrentPage | |
| disabled | no equivalent | |
| to | → see Notes | href (if using React Router, pass component prop) |

**Structural changes:**
1. Replace `<NavLink href='...'>` with `<HeaderMenuItem href='...'>`

**Behavioral differences:**
1. HeaderMenuItem does not support disabled state visually

**SCSS:**
```scss
@use '@carbon/react'
```

---

### NavbarBrand

**Carbon:** `HeaderName` from `@carbon/react`
**Import:** `import { HeaderName } from '@carbon/react'`
**Complexity:** low — Direct semantic equivalent for the brand/logo section of the header.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| href | href | |
| className | className | |

**Structural changes:**
1. Replace `<NavbarBrand href='/'>` with `<HeaderName href='/' prefix='IBM'>ProductName</HeaderName>`
2. Carbon HeaderName requires a prefix prop (company name) and slot for product name
3. Wrap product name portion in `<span>` to apply Carbon bold styling

**Behavioral differences:**
1. HeaderName enforces IBM Design Language typography with a prefix and product name pattern
2. Logo images are placed before HeaderName using a custom HeaderGlobalAction or inline img

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Breadcrumb

**Carbon:** `Breadcrumb` from `@carbon/react`
**Import:** `import { Breadcrumb, BreadcrumbItem } from '@carbon/react'`
**Complexity:** low — Very close structural match. Minor prop renaming required.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| listProps | no equivalent | |
| className | className | |

**Structural changes:**
1. Replace `<Breadcrumb>` with `<Breadcrumb>`
2. Replace `<BreadcrumbItem href='...'>` with `<BreadcrumbItem><a href='...'>Label</a></BreadcrumbItem>`
3. Current page item uses isCurrentPage prop on BreadcrumbItem

**Behavioral differences:**
1. Carbon Breadcrumb renders a `<nav aria-label='breadcrumb'>` automatically for accessibility
2. The active/current page item in Carbon uses isCurrentPage and renders as `<span>` not `<a>`

**SCSS:**
```scss
@use '@carbon/react'
```

---

### BreadcrumbItem

**Carbon:** `BreadcrumbItem` from `@carbon/react`
**Import:** `import { BreadcrumbItem } from '@carbon/react'`
**Complexity:** low — Direct equivalent with minor structural adjustment.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| active | isCurrentPage | |
| href | → see Notes | Pass href on inner `<a>` element |
| className | className | |

**Structural changes:**
1. Wrap link text in an `<a>` tag inside BreadcrumbItem rather than using href prop directly

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Pagination

**Carbon:** `Pagination` from `@carbon/react`
**Import:** `import { Pagination } from '@carbon/react'`
**Complexity:** medium — Bootstrap Pagination is a purely visual list of page links. Carbon Pagination is a stateful controlled component with built-in page size selection and item count display.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| size | size (sm/md/lg) | |
| bsPrefix | no equivalent | |

**Structural changes:**
1. Replace the entire `<Pagination>` + `<PaginationItem>` structure with a single `<Pagination>` component
2. Carbon Pagination is data-driven: pass totalItems, pageSize, pageSizes, page props
3. Handle onChange callback for page and pageSize changes

**Behavioral differences:**
1. Carbon Pagination includes a page size selector by default
2. Carbon shows item count (e.g., '1-10 of 100 items')

**SCSS:**
```scss
@use '@carbon/react'
```

---

### PaginationItem

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** `import { Pagination } from '@carbon/react'`
**Complexity:** low — Not needed — Carbon Pagination renders its own internal page items.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Remove all PaginationItem components; replace the entire pagination structure with a single Carbon `<Pagination>`

**Behavioral differences:**
1. Carbon Pagination manages its own internal item rendering

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tabs

**Carbon:** `Tabs` from `@carbon/react`
**Import:** `import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react'`
**Complexity:** medium — Bootstrap Tabs uses a different structure. Carbon Tabs requires explicit TabList and TabPanels separation.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| defaultActiveKey | defaultSelectedIndex | 0-based index, not key |
| activeKey | selectedIndex | |
| onSelect | onChange | |
| variant | → see Notes | Use contained prop for box-style tabs |
| fill | → see Notes | Use fullWidth on TabList |
| justify | → see Notes | Use fullWidth on TabList |
| id | no equivalent | |

**Structural changes:**
1. Separate tab labels into `<TabList>` and tab content into `<TabPanels>`
2. Structure: `<Tabs><TabList><Tab/></TabList><TabPanels><TabPanel/></TabPanels></Tabs>`
3. Bootstrap auto-links tabs to panes by id; Carbon is index-based

**Behavioral differences:**
1. Carbon Tabs are controlled/uncontrolled via selectedIndex/defaultSelectedIndex
2. Keyboard navigation (arrow keys) is built into Carbon Tabs

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tab

**Carbon:** `Tab` from `@carbon/react`
**Import:** `import { Tab, TabPanel } from '@carbon/react'`
**Complexity:** medium — Bootstrap Tab combines the tab trigger and its panel. Carbon separates the trigger (Tab) from the content (TabPanel).
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| eventKey | no equivalent | |
| title | → see Notes | Tab children (label text) |
| disabled | disabled | |
| tabClassName | → see Notes | className on Tab |

**Structural changes:**
1. Split each Bootstrap `<Tab eventKey='...' title='Label'>content</Tab>` into a `<Tab>` in TabList and a `<TabPanel>` in TabPanels
2. Tab contains only the label; TabPanel contains the content

**Behavioral differences:**
1. Carbon Tab is a pure label; content goes in the corresponding TabPanel by index

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Button

**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Direct equivalent with variant/kind mapping. Bootstrap variant names differ from Carbon kind names.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | kind | see behavioral_differences for mapping |
| size | size | sm → sm; default → md; lg → lg |
| disabled | disabled | |
| href | href (renders as `<a>`) | |
| type | type | |
| onClick | onClick | |
| active | no equivalent | |
| className | className | |

**Structural changes:**
1. Replace variant prop with kind prop
2. Add renderIcon prop for icon buttons instead of nesting icon elements

**Behavioral differences:**
1. Bootstrap variant → Carbon kind: primary→primary, secondary→secondary, danger→danger, outline-primary→tertiary, outline-danger→danger (tertiary), link→ghost
2. Carbon Button sizes: sm, md (default), lg, xl, 2xl

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ButtonGroup

**Carbon:** `ButtonSet` from `@carbon/react`
**Import:** `import { ButtonSet, Button } from '@carbon/react'`
**Complexity:** low — ButtonSet provides horizontal or vertical button grouping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| vertical | stacked | |
| size | → see Notes | Pass size to each Button individually |
| className | className | |

**Structural changes:**
1. Replace `<ButtonGroup>` with `<ButtonSet>`
2. Carbon ButtonSet renders buttons side-by-side without connected borders (unlike Bootstrap which merges borders)

**Behavioral differences:**
1. Carbon ButtonSet does not merge/connect button borders — buttons have individual styling
2. ButtonSet lays out buttons with consistent spacing per Carbon design

**SCSS:**
```scss
@use '@carbon/react'
```

---

### CloseButton

**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'
import { Close } from '@carbon/icons-react'`
**Complexity:** low — Rendered as a ghost icon-only Button with a Close icon.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| onClick | onClick | |
| disabled | disabled | |
| variant | no equivalent | |
| className | className | |

**Structural changes:**
1. Replace `<CloseButton onClick={...}>` with `<Button kind='ghost' hasIconOnly renderIcon={Close} iconDescription='Close' onClick={...} />`

**Behavioral differences:**
1. Carbon requires iconDescription for accessibility on icon-only buttons

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ToggleButton

**Carbon:** `Toggle` from `@carbon/react`
**Import:** `import { Toggle } from '@carbon/react'`
**Complexity:** medium — Bootstrap ToggleButton is a checkbox/radio rendered as a button. Carbon's closest equivalent is Toggle for on/off, or Button with toggled state management.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | toggled | |
| onChange | onToggle | |
| value | no equivalent | |
| type | no equivalent | |
| id | id | |

**Structural changes:**
1. For on/off toggle: use `<Toggle id='...' labelText='...' toggled={state} onToggle={handler}>`
2. For button that visually toggles: manage state manually with a Button and aria-pressed

**Behavioral differences:**
1. Carbon Toggle is specifically a binary on/off switch, not a general-purpose toggle button
2. Carbon Toggle renders a switch UI, not a button-shaped UI

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ToggleButtonGroup

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** high — No direct Carbon equivalent. ContentSwitcher is close for exclusive selection.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| type | → see Notes | ContentSwitcher for radio; custom for checkbox |
| value | → see Notes | selectedIndex on ContentSwitcher |
| onChange | → see Notes | onChange on ContentSwitcher |

**Structural changes:**
1. For exclusive selection (radio-like): use ContentSwitcher with Switch components
2. For multi-select toggle buttons: implement custom solution with ButtonSet and aria-pressed state management

**Behavioral differences:**
1. ContentSwitcher only supports exclusive (single) selection
2. No Carbon component for multi-select toggle button groups

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Form

**Carbon:** `Form` from `@carbon/react`
**Import:** `import { Form } from '@carbon/react'`
**Complexity:** low — Direct structural equivalent. Form validation styling differs.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| onSubmit | onSubmit | |
| noValidate | noValidate | |
| validated | no equivalent | Use invalid/invalidText on individual inputs |
| className | className | |

**Structural changes:**
1. Replace `<Form>` with `<Form>`
2. Use Carbon-specific form controls inside (TextInput, Select, Checkbox, etc.)

**Behavioral differences:**
1. Carbon validation state is per-input (invalid prop + invalidText) not form-level
2. Bootstrap's was-validated class has no Carbon equivalent

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FormGroup

**Carbon:** `FormGroup` from `@carbon/react`
**Import:** `import { FormGroup } from '@carbon/react'`
**Complexity:** low — Direct equivalent for grouping related form fields.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| controlId | no equivalent | |
| as | no equivalent | |
| className | className | |

**Structural changes:**
1. Replace `<FormGroup controlId='...'>` with `<FormGroup legendText='Group label'>`

**Behavioral differences:**
1. Carbon FormGroup renders a `<fieldset>` with a `<legend>`; Bootstrap FormGroup renders a `<div>`
2. legendText is required in Carbon FormGroup for accessibility

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FormControl

**Carbon:** `TextInput` from `@carbon/react`
**Import:** `import { TextInput, TextArea, Select, NumberInput } from '@carbon/react'`
**Complexity:** medium — Bootstrap FormControl is a generic input that maps to different Carbon components based on type.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| type | → see Notes | type on TextInput, or determines which component to use |
| value | value | |
| defaultValue | defaultValue | |
| onChange | onChange | |
| placeholder | placeholder | |
| disabled | disabled | |
| readOnly | readOnly | |
| size | size: sm/md/lg | |
| isValid | → see Notes | Use invalid={false} |
| isInvalid | invalid | |
| id | id | |
| className | className | |

**Structural changes:**
1. type='text' / default → TextInput
2. type='number' → NumberInput
3. type='email', 'url', 'tel', 'search', 'password' → TextInput (type='password' → PasswordInput)

**Behavioral differences:**
1. Carbon TextInput includes built-in label; no separate FormLabel needed
2. Carbon shows invalidText below the input when invalid={true}

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FormLabel

**Carbon:** `FormLabel` from `@carbon/react`
**Import:** `import { FormLabel } from '@carbon/react'`
**Complexity:** low — Direct equivalent, though Carbon input components include built-in labels via labelText prop.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| htmlFor | htmlFor | |
| className | className | |
| column | no equivalent | |
| visuallyHidden | no equivalent | |

**Structural changes:**
1. Prefer using the labelText prop on Carbon input components (TextInput, Select, etc.) instead of separate FormLabel
2. Use standalone FormLabel only for custom form control patterns

**Behavioral differences:**
1. Most Carbon inputs render their own label via labelText prop — standalone FormLabel is typically unnecessary

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FormText

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** low — No standalone equivalent; Carbon inputs accept helperText prop directly.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| muted | no equivalent | |
| className | className | |

**Structural changes:**
1. Remove `<FormText>` and use helperText prop on the Carbon input component instead
2. Example: `<TextInput helperText='Helper message' />`

**Behavioral differences:**
1. Carbon helperText renders below the input with consistent styling

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FormSelect

**Carbon:** `Select` from `@carbon/react`
**Import:** `import { Select, SelectItem, SelectItemGroup } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Carbon Select is a native select element with Carbon styling.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value (controlled) | |
| defaultValue | defaultValue | |
| onChange | onChange | |
| disabled | disabled | |
| size | size: sm/md/lg | |
| isValid | no equivalent | |
| isInvalid | invalid | |
| id | id | |
| className | className | |

**Structural changes:**
1. Replace `<FormSelect>` with `<Select labelText='...' id='...'>`
2. Replace `<option>` with `<SelectItem value='...' text='...' />`
3. Replace `<optgroup>` with `<SelectItemGroup label='...'>`

**Behavioral differences:**
1. Carbon Select includes built-in label
2. Use Dropdown from @carbon/react for searchable/filterable select

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FormCheck

**Carbon:** `Checkbox` from `@carbon/react`
**Import:** `import { Checkbox } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Carbon Checkbox includes its own label.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| type | → see Notes | Determines component: checkbox→Checkbox, radio→RadioButton, switch→Toggle |
| checked | checked | |
| defaultChecked | defaultChecked | |
| onChange | onChange | |
| label | labelText | |
| disabled | disabled | |
| inline | no equivalent | |
| id | id | |

**Structural changes:**
1. For type='checkbox': use `<Checkbox id='...' labelText='...' checked={...} onChange={...}>`
2. For type='radio': use `<RadioButton id='...' labelText='...' value='...'>` inside `<RadioButtonGroup>`
3. For type='switch': use `<Toggle id='...' labelText='...'>`

**Behavioral differences:**
1. Carbon Checkbox includes indeterminate state support
2. Carbon RadioButton must be used inside RadioButtonGroup for proper keyboard navigation

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FormRange

**Carbon:** `Slider` from `@carbon/react`
**Import:** `import { Slider } from '@carbon/react'`
**Complexity:** low — Direct equivalent with enriched Carbon functionality.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| min | min | |
| max | max | |
| step | step | |
| value | value | |
| defaultValue | → see Notes | value (uncontrolled not well supported; manage state) |
| disabled | disabled | |
| id | id | |

**Structural changes:**
1. Replace `<FormRange>` with `<Slider labelText='...' min={0} max={100} value={...} onChange={...}>`

**Behavioral differences:**
1. Carbon Slider shows min/max labels and a numeric input by default
2. Carbon Slider supports formatLabel for custom label formatting

**SCSS:**
```scss
@use '@carbon/react'
```

---

### InputGroup

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** high — No direct Carbon equivalent. Carbon inputs have built-in icon slots and helper text patterns.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. For text input with prepended/appended icon: use renderIcon or the input's built-in icon slots
2. For input + button combination: use Search component or custom layout
3. For currency/prefix text: use TextInput with placeholder or helperText

**Behavioral differences:**
1. Carbon's design system does not include an InputGroup pattern
2. Icon addons are handled via renderIcon prop on supported inputs

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FloatingLabel

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** high — Carbon does not use floating label pattern. Carbon labels are always above the input.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| label | → see Notes | labelText on TextInput |
| controlId | → see Notes | id on TextInput |

**Structural changes:**
1. Remove FloatingLabel wrapper
2. Use Carbon TextInput with labelText prop — label renders above the input
3. Use placeholder for inline hint text within the input field

**Behavioral differences:**
1. Carbon enforces labels above inputs for accessibility and scannability
2. Floating labels (animated labels inside input fields) are not part of Carbon design

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Card

**Carbon:** `Tile` from `@carbon/react`
**Import:** `import { Tile, ClickableTile, ExpandableTile, SelectableTile } from '@carbon/react'`
**Complexity:** medium — Carbon Tile is the closest equivalent but lacks header/footer sections. Content structure must be implemented manually.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| bg | no equivalent | |
| border | no equivalent | |
| text | no equivalent | |
| className | className | |

**Structural changes:**
1. Static cards: use `<Tile>` with custom content structure inside
2. Clickable cards: use `<ClickableTile href='...'>` or `<ClickableTile onClick={...}>`
3. Expandable cards: use `<ExpandableTile>`

**Behavioral differences:**
1. Carbon Tile does not have built-in image, header, or footer subcomponents
2. Tile light prop renders with a white background in g10 theme contexts

**SCSS:**
```scss
@use '@carbon/react'
```

---

### CardHeader

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** low — No Carbon equivalent — implement as a styled div or heading inside Tile.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Replace `<CardHeader>` with a `<div>` or `<h4>` element inside `<Tile>`
2. Apply Carbon type tokens via className: $cds-heading-02 etc.

**Behavioral differences:**
1. No built-in header section in Carbon Tile

**SCSS:**
```scss
@use '@carbon/react'
```

---

### CardBody

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** low — No Carbon equivalent — the entire Tile is the body.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Place CardBody content directly inside `<Tile>`

**SCSS:**
```scss
@use '@carbon/react'
```

---

### CardFooter

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** low — No Carbon equivalent — implement as a styled div at the bottom of Tile.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Replace `<CardFooter>` with a `<div>` positioned at the bottom of `<Tile>` using CSS flexbox

**SCSS:**
```scss
@use '@carbon/react'
```

---

### CardTitle

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** low — No Carbon equivalent — use a heading element inside Tile.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Replace `<CardTitle>` with `<h4 className='cds--heading-02'>title text</h4>` inside Tile

**SCSS:**
```scss
@use '@carbon/react'
```

---

### CardText

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** low — No Carbon equivalent — use a paragraph element inside Tile.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Replace `<CardText>` with `<p className='cds--body-01'>text content</p>`

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ListGroup

**Carbon:** `StructuredList` from `@carbon/react`
**Import:** `import { StructuredList, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell, StructuredListInput } from '@carbon/react'`
**Complexity:** medium — Bootstrap ListGroup is a simple styled list. Carbon StructuredList has a more formal data-oriented structure with optional selection.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | no equivalent | |
| horizontal | no equivalent | |
| numbered | no equivalent | |
| className | className | |

**Structural changes:**
1. Replace `<ListGroup>` with `<StructuredList>`
2. Wrap items in `<StructuredListBody>`
3. Each item becomes a `<StructuredListRow>` with `<StructuredListCell>` children

**Behavioral differences:**
1. StructuredList expects tabular-like data with cells
2. For simple styled links list: consider using plain `<ul>` with Carbon CSS tokens instead

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ListGroupItem

**Carbon:** `StructuredListRow` from `@carbon/react`
**Import:** `import { StructuredListRow, StructuredListCell } from '@carbon/react'`
**Complexity:** medium — Each ListGroupItem becomes a StructuredListRow with one or more StructuredListCell children.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| action | no equivalent | |
| href | → see Notes | Wrap cell content in `<a>` |
| active | no equivalent | |
| disabled | no equivalent | |
| variant | no equivalent | |

**Structural changes:**
1. Replace `<ListGroupItem>` with `<StructuredListRow><StructuredListCell>content</StructuredListCell></StructuredListRow>`

**Behavioral differences:**
1. StructuredListRow has no built-in active/disabled state styling

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Table

**Carbon:** `DataTable` from `@carbon/react`
**Import:** `import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer } from '@carbon/react'`
**Complexity:** high — Bootstrap Table is a plain HTML table with CSS classes. Carbon DataTable is a full data management component with sorting, filtering, and selection built in.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| striped | → see Notes | Use isSortable+alternateRowColor or built-in DataTable styling |
| bordered | no equivalent | |
| hover | no equivalent | |
| size | size: xs/sm/md/lg/xl | |
| responsive | no equivalent | |
| variant | no equivalent | |
| className | className | |

**Structural changes:**
1. Wrap all table content in `<DataTable rows={rowData} headers={headerData}>`
2. Use render prop pattern: `{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (...)}`
3. DataTable manages sorting, filtering, selection state automatically

**Behavioral differences:**
1. Carbon DataTable requires structured row/header data objects with id fields
2. Sort state, row selection, and expansion are managed by DataTable via render props
3. For simple static tables without data management: use Table/TableHead/TableBody/TableRow/TableHeader/TableCell directly without DataTable wrapper

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Figure

**Carbon:** (no direct equivalent) from (none)
**Import:** None
**Complexity:** low — No Carbon equivalent — use native HTML figure/figcaption elements.
**Status:** unsupported

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Keep `<figure>` and `<figcaption>` as native HTML elements
2. Apply Carbon type tokens to figcaption for consistent typography

**SCSS:**
```scss
None
```

---

### Image

**Carbon:** (no direct equivalent) from (none)
**Import:** None
**Complexity:** low — No Carbon equivalent — use native HTML img element.
**Status:** unsupported

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| fluid | → see Notes | style={{ maxWidth: '100%', height: 'auto' }} |
| rounded | → see Notes | style={{ borderRadius: '50%' }} |
| thumbnail | no equivalent | |
| src | src | |
| alt | alt | |

**Structural changes:**
1. Replace `<Image fluid>` with `<img style={{ maxWidth: '100%' }} />`
2. Replace `<Image rounded>` with `<img style={{ borderRadius: '50%' }} />` for circular images

**Behavioral differences:**
1. Carbon has no image component — use native img with Carbon design token values for borders/radii

**SCSS:**
```scss
None
```

---

### Alert

**Carbon:** `InlineNotification` from `@carbon/react`
**Import:** `import { InlineNotification } from '@carbon/react'`
**Complexity:** medium — Bootstrap Alert is flexible inline content. Carbon InlineNotification has a defined structure with title and subtitle.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | kind | success→success, danger→error, warning→warning, info→info, primary→info, secondary→info |
| dismissible | → see Notes | Add onCloseButtonClick prop |
| show | → see Notes | Conditionally render the component |
| onClose | onCloseButtonClick | |
| className | className | |

**Structural changes:**
1. Replace `<Alert variant='...'>` with `<InlineNotification kind='...' title='...' subtitle='...' />`
2. Alert children become the subtitle prop (or use lowContrast variant)
3. Dismissible alerts: add onCloseButtonClick prop

**Behavioral differences:**
1. Carbon InlineNotification has title + subtitle structure (not arbitrary children for styled variants)
2. Carbon also offers ToastNotification for transient alerts and ActionableNotification for interactive alerts

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Toast

**Carbon:** `ToastNotification` from `@carbon/react`
**Import:** `import { ToastNotification } from '@carbon/react'`
**Complexity:** medium — Carbon ToastNotification covers the toast pattern but requires a container for positioning.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| show | → see Notes | Conditional rendering |
| onClose | onCloseButtonClick | |
| autohide | → see Notes | Use timeout prop (milliseconds) |
| delay | timeout | |
| bg | kind | |
| animation | no equivalent | |

**Structural changes:**
1. Replace `<Toast show={...} onClose={...}>` with `<ToastNotification kind='...' title='...' subtitle='...' caption='...' timeout={3000}>`
2. Manage visibility with conditional rendering or timeout prop
3. Position using a fixed container div (Carbon does not provide a toast container)

**Behavioral differences:**
1. Carbon ToastNotification does not auto-stack multiple toasts — implement a toast queue manually
2. Carbon provides no ToastContainer equivalent — position with CSS

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Modal

**Carbon:** `Modal` from `@carbon/react`
**Import:** `import { Modal } from '@carbon/react'`
**Complexity:** medium — Carbon Modal is a single component with built-in header, body, and footer via props.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| show | open | |
| onHide | onRequestClose | |
| size | size: xs/sm/md/lg | |
| centered | → see Notes | No direct equivalent (Carbon modals are vertically centered by default) |
| backdrop | → see Notes | preventCloseOnClickOutside (inverted) |
| keyboard | no equivalent | |
| scrollable | no equivalent | |
| fullscreen | no equivalent | |
| animation | no equivalent | |

**Structural changes:**
1. Replace `<Modal show={...} onHide={...}>` with `<Modal open={...} onRequestClose={...} modalHeading='...' primaryButtonText='...' secondaryButtonText='...'>`
2. Modal children become the modal body content
3. Header and footer are controlled via props, not subcomponents

**Behavioral differences:**
1. Carbon Modal handles focus trapping and aria attributes automatically
2. Carbon Modal does not use ModalHeader/ModalBody/ModalFooter subcomponents by default — all via props

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ModalHeader

**Carbon:** `ModalHeader` from `@carbon/react`
**Import:** `import { ComposedModal, ModalHeader, ModalBody, ModalFooter } from '@carbon/react'`
**Complexity:** low — Available in ComposedModal pattern. Use modalHeading prop on Modal for simple cases.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| closeButton | → see Notes | Carbon always shows close button by default |
| className | className | |

**Structural changes:**
1. For ComposedModal pattern: `<ComposedModal><ModalHeader title='...' /><ModalBody>...</ModalBody><ModalFooter></ModalFooter></ComposedModal>`
2. ModalHeader accepts title and label props

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ModalBody

**Carbon:** `ModalBody` from `@carbon/react`
**Import:** `import { ModalBody } from '@carbon/react'`
**Complexity:** low — Direct equivalent in ComposedModal pattern.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| className | className | |

**Structural changes:**
1. Use inside `<ComposedModal>` pattern

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ModalFooter

**Carbon:** `ModalFooter` from `@carbon/react`
**Import:** `import { ModalFooter } from '@carbon/react'`
**Complexity:** low — Direct equivalent in ComposedModal pattern. Accepts primaryButtonText/secondaryButtonText props.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| className | className | |

**Structural changes:**
1. Use `<ModalFooter primaryButtonText='...' secondaryButtonText='...' onRequestClose={...} onRequestSubmit={...} />`

**Behavioral differences:**
1. ModalFooter renders its own buttons based on text props — do not pass Button children

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Spinner

**Carbon:** `Loading` from `@carbon/react`
**Import:** `import { Loading } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Carbon Loading is a circular spinner.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| animation | no equivalent | |
| size | → see Notes | small (boolean) |
| variant | no equivalent | |
| role | → see Notes | description (for screen readers) |

**Structural changes:**
1. Replace `<Spinner animation='border'>` with `<Loading />`
2. Replace `<Spinner animation='grow'>` with `<Loading small />` or `<InlineLoading />`

**Behavioral differences:**
1. Carbon Loading overlays a full page by default; use withOverlay={false} for inline usage
2. InlineLoading from @carbon/react is better for inline/button loading states

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ProgressBar

**Carbon:** `ProgressBar` from `@carbon/react`
**Import:** `import { ProgressBar } from '@carbon/react'`
**Complexity:** low — Direct equivalent with minor prop renaming.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| now | value | |
| min | → see Notes | No direct equivalent (Carbon ProgressBar always starts at 0) |
| max | max | |
| label | label | |
| visuallyHidden | hideLabel | |
| striped | no equivalent | |
| animated | no equivalent | |
| variant | → see Notes | status: active→active, success→finished, danger→error |

**Structural changes:**
1. Replace `<ProgressBar now={50} max={100}>` with `<ProgressBar value={50} max={100} label='...' />`

**Behavioral differences:**
1. Carbon ProgressBar requires a label prop for accessibility
2. No striped or animated variants in Carbon

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Dropdown

**Carbon:** `Dropdown` from `@carbon/react`
**Import:** `import { Dropdown } from '@carbon/react'`
**Complexity:** medium — Bootstrap Dropdown is an action menu trigger. Carbon has Dropdown (form select pattern) and OverflowMenu (action menu pattern) — they serve different use cases.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| show | → see Notes | open (on Dropdown or OverflowMenu) |
| onToggle | onToggle | |
| drop | → see Notes | direction on OverflowMenu |
| align | direction | |
| autoClose | no equivalent | |
| className | className | |

**Structural changes:**
1. For action menus (open on click, show commands): use `<OverflowMenu>` with `<OverflowMenuItem>` children
2. For selection dropdowns (select a value): use `<Dropdown items={[...]} label='...' onChange={...}>`
3. Dropdown requires items array with id/text or custom itemToString

**Behavioral differences:**
1. Carbon Dropdown is primarily a form control (single value selection), not an action menu
2. Use OverflowMenu for action/contextual menus

**SCSS:**
```scss
@use '@carbon/react'
```

---

### DropdownToggle

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** `import { OverflowMenu } from '@carbon/react'`
**Complexity:** low — Trigger is built into OverflowMenu; no separate toggle component needed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. OverflowMenu renders its own trigger button
2. For custom triggers: use MenuButton with custom trigger

**Behavioral differences:**
1. OverflowMenu trigger is the three-dot (ellipsis) icon by default

**SCSS:**
```scss
@use '@carbon/react'
```

---

### DropdownMenu

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** `import { OverflowMenu } from '@carbon/react'`
**Complexity:** low — Menu is built into OverflowMenu; no separate menu container component needed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| align | → see Notes | direction (top/bottom/left/right) |
| show | open | |

**Structural changes:**
1. OverflowMenu renders its own menu panel containing OverflowMenuItem children
2. Pass OverflowMenuItem elements as children of OverflowMenu

**SCSS:**
```scss
@use '@carbon/react'
```

---

### DropdownItem

**Carbon:** `OverflowMenuItem` from `@carbon/react`
**Import:** `import { OverflowMenuItem } from '@carbon/react'`
**Complexity:** low — Direct equivalent for action menu items.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| href | href | |
| onClick | onClick | |
| active | isSelected | |
| disabled | disabled | |
| as | no equivalent | |
| divider | hasDivider | |

**Structural changes:**
1. Replace `<DropdownItem onClick={...}>` with `<OverflowMenuItem itemText='...' onClick={...}>`

**Behavioral differences:**
1. OverflowMenuItem uses itemText prop for label text (not children)
2. Danger/destructive items: use isDelete prop

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tooltip

**Carbon:** `Tooltip` from `@carbon/react`
**Import:** `import { Tooltip } from '@carbon/react'`
**Complexity:** medium — Carbon Tooltip wraps a trigger element. The structure differs from Bootstrap's trigger-on-target approach.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title | label | |
| placement | align: top/bottom/left/right/top-start/top-end/etc. | |
| trigger | no equivalent | |
| delay | no equivalent | |
| show | open | |
| onToggle | no equivalent | |
| id | no equivalent | |

**Structural changes:**
1. Wrap the trigger element in `<Tooltip label='tooltip text' align='bottom'>`
2. The immediate child of Tooltip is the trigger element
3. Example: `<Tooltip label='More info'><Button>Hover me</Button></Tooltip>`

**Behavioral differences:**
1. Carbon Tooltip is hover/focus activated on the child element
2. Carbon also has Toggletip for interactive/rich content tooltips

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Popover

**Carbon:** `Popover` from `@carbon/react`
**Import:** `import { Popover, PopoverContent } from '@carbon/react'`
**Complexity:** medium — Carbon Popover is a lower-level positioning primitive. Carbon Toggletip may be more appropriate for interactive content.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title | → see Notes | No title prop; render heading inside PopoverContent |
| content | → see Notes | PopoverContent children |
| placement | align | |
| trigger | no equivalent | |
| show | open | |

**Structural changes:**
1. Wrap trigger in `<Popover open={...} align='bottom'>`
2. Place content in `<PopoverContent>` as a sibling to the trigger
3. Manage open state manually via state variable

**Behavioral differences:**
1. Carbon Popover does not include a title header section
2. Click-outside behavior requires ClickOutside listener implementation

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Offcanvas

**Carbon:** `SideNav` from `@carbon/react`
**Import:** `import { SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem } from '@carbon/react'`
**Complexity:** high — Bootstrap Offcanvas is a general-purpose drawer from any edge. Carbon SideNav is specifically a navigation rail. For general drawer functionality, a custom solution is needed.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| show | expanded | |
| onHide | → see Notes | onSideNavBlur or custom state management |
| placement | → see Notes | SideNav is always on the left side |
| scroll | no equivalent | |
| backdrop | no equivalent | |

**Structural changes:**
1. For navigation drawers: use SideNav with SideNavItems, SideNavLink, SideNavMenu
2. For general content drawers: implement a custom panel with positioning and focus trapping
3. SideNav integrates with HeaderContainer for mobile responsiveness

**Behavioral differences:**
1. Carbon SideNav is a navigation component, not a general-purpose drawer
2. SideNav only supports left-side placement

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Accordion

**Carbon:** `Accordion` from `@carbon/react`
**Import:** `import { Accordion, AccordionItem } from '@carbon/react'`
**Complexity:** low — Direct structural equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| defaultActiveKey | → see Notes | No equivalent; Carbon Accordion is always-closed by default unless open prop set on AccordionItem |
| activeKey | → see Notes | Use open prop on individual AccordionItem |
| onSelect | → see Notes | onChange on individual AccordionItem |
| flush | no equivalent | |
| alwaysOpen | no equivalent | |

**Structural changes:**
1. Replace `<Accordion defaultActiveKey='0'>` with `<Accordion>`
2. Replace `<Accordion.Item eventKey='...'>` with `<AccordionItem title='...'>`
3. Content goes directly inside AccordionItem

**Behavioral differences:**
1. Carbon Accordion can have multiple items open simultaneously by default
2. Individual AccordionItem has open prop for controlled state

**SCSS:**
```scss
@use '@carbon/react'
```

---

### AccordionItem

**Carbon:** `AccordionItem` from `@carbon/react`
**Import:** `import { AccordionItem } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Title is a prop instead of a subcomponent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| eventKey | no equivalent | |
| title text | → see Notes | title prop on AccordionItem |

**Structural changes:**
1. Replace `<Accordion.Item><Accordion.Header><Accordion.Button>Title</Accordion.Button></Accordion.Header><Accordion.Body>content</Accordion.Body></Accordion.Item>` with `<AccordionItem title='Title'>content</AccordionItem>`

**Behavioral differences:**
1. AccordionItem title is a string or element passed via title prop
2. open prop controls expanded state

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Badge

**Carbon:** `Tag` from `@carbon/react`
**Import:** `import { Tag } from '@carbon/react'`
**Complexity:** low — Carbon Tag covers Badge use cases with semantic kind variants.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| bg | type | primary→blue, secondary→gray, success→green, danger→red, warning→magenta, info→teal, light→gray, dark→gray |
| pill | no equivalent | |
| text | no equivalent | |
| className | className | |

**Structural changes:**
1. Replace `<Badge bg='primary'>3</Badge>` with `<Tag type='blue'>3</Tag>`
2. For notification count badges: Tag renders inline and can contain numeric content

**Behavioral differences:**
1. Carbon Tag types: gray, blue, cyan, teal, green, magenta, purple, red, warm-gray, cool-gray, high-contrast, outline
2. Carbon Tag can be dismissible (filter Tag) with onClose prop

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Collapse

**Carbon:** (no direct equivalent) from `@carbon/react`
**Import:** None
**Complexity:** medium — No direct Carbon equivalent for generic animated collapse. Use conditional rendering or AccordionItem for content that collapses.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| in | → see Notes | Conditional rendering (render children when true) |
| timeout | no equivalent | |
| dimension | no equivalent | |

**Structural changes:**
1. For accordion-style collapsible sections: use AccordionItem
2. For show/hide panels: use conditional rendering with CSS transition
3. No built-in collapse animation component in Carbon

**Behavioral differences:**
1. Carbon has no animated collapse/expand utility component
2. AccordionItem handles collapse within the accordion pattern

**SCSS:**
```scss
@use '@carbon/react'
```

---
