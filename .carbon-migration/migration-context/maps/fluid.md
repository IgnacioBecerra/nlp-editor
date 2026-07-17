# Fluid → Carbon React v11 Migration Map

> Source: fluid
> Target: carbon-react-v11
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| button | Button | low | mapped |
| link | Link | low | mapped |
| text-input | TextInput | low | mapped |
| textarea | TextArea | low | mapped |
| select | Dropdown | medium | mapped |
| checkbox | Checkbox | low | mapped |
| radio-group | RadioButtonGroup + RadioButton | low | mapped |
| toggle | Toggle | low | mapped |
| tabs | Tabs + TabList + Tab + TabPanels + TabPanel | medium | mapped |
| modal | Modal | medium | mapped |
| notification | InlineNotification | low | mapped |
| toast | ToastNotification | low | mapped |
| accordion | Accordion + AccordionItem | low | mapped |
| breadcrumb | Breadcrumb + BreadcrumbItem | low | mapped |
| table | DataTable | high | mapped |
| card | Tile / ClickableTile | low | mapped |
| tag | Tag | low | mapped |
| loading | Loading | low | mapped |

---

### button

**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Direct semantic equivalent with mostly prop-level remapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | kind | |
| disabled | disabled | |
| onClick | onClick | |

**Structural changes:**
1. Replace Fluid button variant tokens with Carbon kind values

**Behavioral differences:**
1. Carbon kind values differ from Fluid variant names

**SCSS:**
```scss
@use '@carbon/react'
```

---

### link

**Carbon:** `Link` from `@carbon/react`
**Import:** `import { Link } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| href | href | |
| target | target | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### text-input

**Carbon:** `TextInput` from `@carbon/react`
**Import:** `import { TextInput } from '@carbon/react'`
**Complexity:** low — Direct form control equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| onInput | onChange | |
| placeholder | placeholder | |

**Structural changes:**
1. Move helper/error messaging to helperText/invalidText props

**Behavioral differences:**
1. Carbon requires explicit labelText for accessibility

**SCSS:**
```scss
@use '@carbon/react'
```

---

### textarea

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

### select

**Carbon:** `Dropdown` from `@carbon/react`
**Import:** `import { Dropdown } from '@carbon/react'`
**Complexity:** medium — Fluid select patterns vary between native and custom; Carbon Dropdown is custom.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| options | items | |
| onChange | onChange | |
| value | selectedItem | |

**Structural changes:**
1. Map option collections to items array
2. Use itemToString and selectedItem patterns

**Behavioral differences:**
1. Carbon Dropdown is not native select behavior

**SCSS:**
```scss
@use '@carbon/react'
```

---

### checkbox

**Carbon:** `Checkbox` from `@carbon/react`
**Import:** `import { Checkbox } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | checked | |
| onChange | onChange | |
| label | labelText | |

**Structural changes:**
1. Ensure unique id per checkbox

**Behavioral differences:**
1. id prop is required in Carbon

**SCSS:**
```scss
@use '@carbon/react'
```

---

### radio-group

**Carbon:** `RadioButtonGroup + RadioButton` from `@carbon/react`
**Import:** `import { RadioButtonGroup, RadioButton } from '@carbon/react'`
**Complexity:** low — Equivalent grouped radio pattern.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| onChange | onChange | |

**Structural changes:**
1. Flatten nested option wrappers into RadioButtonGroup children

**SCSS:**
```scss
@use '@carbon/react'
```

---

### toggle

**Carbon:** `Toggle` from `@carbon/react`
**Import:** `import { Toggle } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | toggled | |
| onChange | onToggle | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Carbon Toggle emits different event payload shape

**SCSS:**
```scss
@use '@carbon/react'
```

---

### tabs

**Carbon:** `Tabs + TabList + Tab + TabPanels + TabPanel` from `@carbon/react`
**Import:** `import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react'`
**Complexity:** medium — Requires restructuring to explicit content panel separation.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| activeIndex | selectedIndex | |
| onTabChange | onChange | |

**Structural changes:**
1. Separate tab triggers from panel content

**Behavioral differences:**
1. TabList requires aria-label

**SCSS:**
```scss
@use '@carbon/react'
```

---

### modal

**Carbon:** `Modal` from `@carbon/react`
**Import:** `import { Modal } from '@carbon/react'`
**Complexity:** medium — Fluid compound modal APIs differ from Carbon prop-driven modal API.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isOpen | open | |
| onClose | onRequestClose | |

**Structural changes:**
1. Map heading/body/footer sections into modalHeading + children + action props

**Behavioral differences:**
1. Primary and secondary actions are configured via props

**SCSS:**
```scss
@use '@carbon/react'
```

---

### notification

**Carbon:** `InlineNotification` from `@carbon/react`
**Import:** `import { InlineNotification } from '@carbon/react'`
**Complexity:** low — Same semantic pattern.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| type | kind | |
| message | subtitle | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Use Carbon kind values info|success|warning|error

**SCSS:**
```scss
@use '@carbon/react'
```

---

### toast

**Carbon:** `ToastNotification` from `@carbon/react`
**Import:** `import { ToastNotification } from '@carbon/react'`
**Complexity:** low — Direct mapping for transient notifications.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| type | kind | |
| title | title | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### accordion

**Carbon:** `Accordion + AccordionItem` from `@carbon/react`
**Import:** `import { Accordion, AccordionItem } from '@carbon/react'`
**Complexity:** low — Direct conceptual equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title | title | |
| expanded | open | |

**Structural changes:**
1. Move item labels to AccordionItem title prop

**SCSS:**
```scss
@use '@carbon/react'
```

---

### breadcrumb

**Carbon:** `Breadcrumb + BreadcrumbItem` from `@carbon/react`
**Import:** `import { Breadcrumb, BreadcrumbItem } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| items | children | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Carbon current item set with isCurrentPage on final item

**SCSS:**
```scss
@use '@carbon/react'
```

---

### table

**Carbon:** `DataTable` from `@carbon/react`
**Import:** `import { DataTable } from '@carbon/react'`
**Complexity:** high — Data table composition and render-prop API differ significantly.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| columns | headers | |
| data | rows | |

**Structural changes:**
1. Define rows and headers arrays
2. Compose DataTable subcomponents inside render function

**Behavioral differences:**
1. Sorting/filtering/selection APIs are Carbon-specific

**SCSS:**
```scss
@use '@carbon/react'
```

---

### card

**Carbon:** `Tile / ClickableTile` from `@carbon/react`
**Import:** `import { Tile, ClickableTile } from '@carbon/react'`
**Complexity:** low — Card pattern maps to Tile family.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| onClick | onClick | |
| href | href (ClickableTile) | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### tag

**Carbon:** `Tag` from `@carbon/react`
**Import:** `import { Tag } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| kind | type | |
| label | children | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Tag type values differ from Fluid token names

**SCSS:**
```scss
@use '@carbon/react'
```

---

### loading

**Carbon:** `Loading` from `@carbon/react`
**Import:** `import { Loading } from '@carbon/react'`
**Complexity:** low — Direct mapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| active | active | |
| small | small | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---
