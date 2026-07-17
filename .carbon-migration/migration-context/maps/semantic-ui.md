# Semantic UI → Carbon React v11 Migration Map

> Source: semantic-ui
> Target: carbon-react-v11
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| Button | Button | low | mapped |
| Input | TextInput | low | mapped |
| TextArea | TextArea | low | mapped |
| Checkbox | Checkbox | low | mapped |
| Radio | RadioButton + RadioButtonGroup | low | mapped |
| Dropdown | Dropdown or MultiSelect | medium | mapped |
| Modal | Modal | medium | mapped |
| Popup | Toggletip or Tooltip | medium | partial |
| Accordion | Accordion + AccordionItem | low | mapped |
| Tab | Tabs + TabList + Tab + TabPanels + TabPanel | medium | mapped |
| Message | InlineNotification | low | mapped |
| Table | DataTable | high | mapped |
| Pagination | Pagination | low | mapped |
| Breadcrumb | Breadcrumb + BreadcrumbItem | low | mapped |
| Menu | OverflowMenu / HeaderNavigation | medium | partial |
| Card | Tile / ClickableTile | low | mapped |
| Segment | Tile | low | mapped |
| Loader | Loading | low | mapped |

---

### Button

**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Direct equivalent with prop remapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| primary | kind='primary' | |
| secondary | kind='secondary' | |
| basic | kind='tertiary' | |
| negative | kind='danger' | |
| disabled | disabled | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Semantic 'loading' shorthand needs explicit Carbon loading usage pattern

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Input

**Carbon:** `TextInput` from `@carbon/react`
**Import:** `import { TextInput } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| placeholder | placeholder | |
| value | value | |
| onChange | onChange | |
| disabled | disabled | |

**Structural changes:**
1. Move label wrappers into labelText prop

**Behavioral differences:**
1. Carbon expects explicit helper/invalid text props

**SCSS:**
```scss
@use '@carbon/react'
```

---

### TextArea

**Carbon:** `TextArea` from `@carbon/react`
**Import:** `import { TextArea } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| rows | rows | |
| value | value | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Checkbox

**Carbon:** `Checkbox` from `@carbon/react`
**Import:** `import { Checkbox } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | checked | |
| disabled | disabled | |
| label | labelText | |

**Structural changes:**
1. Ensure id prop is set

**Behavioral differences:**
1. id is required

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Radio

**Carbon:** `RadioButton + RadioButtonGroup` from `@carbon/react`
**Import:** `import { RadioButton, RadioButtonGroup } from '@carbon/react'`
**Complexity:** low — Direct grouped radio equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| onChange | onChange | |

**Structural changes:**
1. Group items in RadioButtonGroup

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Dropdown

**Carbon:** `Dropdown or MultiSelect` from `@carbon/react`
**Import:** `import { Dropdown, MultiSelect } from '@carbon/react'`
**Complexity:** medium — Semantic Dropdown supports many modes; Carbon splits into Dropdown, ComboBox, MultiSelect.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| options | items | |
| multiple | MultiSelect | |
| search | ComboBox | |
| onChange | onChange | |

**Structural changes:**
1. Single select -> Dropdown
2. Searchable -> ComboBox
3. Multiple -> MultiSelect

**Behavioral differences:**
1. Event payloads and item models differ

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Modal

**Carbon:** `Modal` from `@carbon/react`
**Import:** `import { Modal } from '@carbon/react'`
**Complexity:** medium — Semantic compound modal API differs from Carbon prop-driven modal API.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| onClose | onRequestClose | |
| size | size | |

**Structural changes:**
1. Modal.Header -> modalHeading
2. Modal.Content -> children
3. Modal.Actions -> button text/action handlers

**Behavioral differences:**
1. Primary and secondary buttons are configured through props

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Popup

**Carbon:** `Toggletip or Tooltip` from `@carbon/react`
**Import:** `import { Toggletip, Tooltip } from '@carbon/react'`
**Complexity:** medium — Popup trigger patterns differ.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| content | label/content | |
| on | no equivalent | |

**Structural changes:**
1. Use Tooltip for simple hover help
2. Use Toggletip for interactive popup content

**Behavioral differences:**
1. Accessibility behavior is stricter in Carbon

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Accordion

**Carbon:** `Accordion + AccordionItem` from `@carbon/react`
**Import:** `import { Accordion, AccordionItem } from '@carbon/react'`
**Complexity:** low — Direct conceptual mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title | title | |

**Structural changes:**
1. Move title into AccordionItem title prop

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tab

**Carbon:** `Tabs + TabList + Tab + TabPanels + TabPanel` from `@carbon/react`
**Import:** `import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react'`
**Complexity:** medium — Semantic Tab panes need explicit Carbon panel structure.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| activeIndex | selectedIndex | |

**Structural changes:**
1. Separate tab labels from tab panel content
2. Add aria-label to TabList

**Behavioral differences:**
1. Tab keyboard interactions are Carbon defaults

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Message

**Carbon:** `InlineNotification` from `@carbon/react`
**Import:** `import { InlineNotification } from '@carbon/react'`
**Complexity:** low — Semantic message pattern maps directly to notification components.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| success | kind='success' | |
| warning | kind='warning' | |
| error | kind='error' | |
| info | kind='info' | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Table

**Carbon:** `DataTable` from `@carbon/react`
**Import:** `import { DataTable } from '@carbon/react'`
**Complexity:** high — Semantic table markup is direct HTML-like; Carbon DataTable uses structured rows/headers and subcomponents.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| sortable | sortRow (custom) | |

**Structural changes:**
1. Define rows/headers arrays
2. Render through DataTable render prop

**Behavioral differences:**
1. Toolbar/selection/expansion APIs differ

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Pagination

**Carbon:** `Pagination` from `@carbon/react`
**Import:** `import { Pagination } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| activePage | page | |
| totalPages | totalItems + pageSize | |
| onPageChange | onChange | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Carbon uses totalItems/pageSize/page props

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Breadcrumb

**Carbon:** `Breadcrumb + BreadcrumbItem` from `@carbon/react`
**Import:** `import { Breadcrumb, BreadcrumbItem } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| sections | children | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Menu

**Carbon:** `OverflowMenu / HeaderNavigation` from `@carbon/react`
**Import:** `import { OverflowMenu, OverflowMenuItem, HeaderNavigation, HeaderMenuItem } from '@carbon/react'`
**Complexity:** medium — Semantic menu variants map to multiple Carbon components depending on context.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| items | children | |

**Structural changes:**
1. Context/action menu -> OverflowMenu
2. Top navigation menu -> HeaderNavigation

**Behavioral differences:**
1. OverflowMenu and HeaderNavigation have distinct accessibility behavior

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Card

**Carbon:** `Tile / ClickableTile` from `@carbon/react`
**Import:** `import { Tile, ClickableTile } from '@carbon/react'`
**Complexity:** low — Card pattern maps to Tile family.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| onClick | onClick | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Segment

**Carbon:** `Tile` from `@carbon/react`
**Import:** `import { Tile } from '@carbon/react'`
**Complexity:** low — Container segment maps to Tile container.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| padded | no equivalent | |
| raised | no equivalent | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Visual styles controlled by Carbon tokens

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Loader

**Carbon:** `Loading` from `@carbon/react`
**Import:** `import { Loading } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| active | active | |
| inline | no equivalent | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---
