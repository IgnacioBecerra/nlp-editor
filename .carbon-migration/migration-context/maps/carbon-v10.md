# Carbon React v10 → Carbon React v11 Component Reference

> Source: carbon-react-v10
> Target: carbon-react-v11
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

> **STOP — for a `carbon-version-upgrade` job (v10 → v11), load
> [`maps/carbon-v10-to-v11.md`](./carbon-v10-to-v11.md) instead.**
>
> That file is the authoritative, step-by-step migration playbook
> (dependency sync, color tokens, CSS class prefix, TypeScript types,
> icons, component APIs, build-verification gate).
>
> This file is a **per-component reference matrix only** — loaded
> by carbon-v10-to-v11.md §7.9 when the agent needs an entry for a
> specific component whose API changed (e.g. Toggle, Slider,
> SelectableTile prop renames). It does NOT cover dependency sync,
> color tokens, prefix migration, or build verification.

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| Accordion | Accordion + AccordionItem | low | mapped |
| Button | Button | low | mapped |
| Checkbox | Checkbox | low | mapped |
| ClickableTile | ClickableTile | low | mapped |
| ComboBox | ComboBox | low | mapped |
| ContentSwitcher | ContentSwitcher + Switch | low | mapped |
| DataTable | DataTable | medium | mapped |
| DatePicker | DatePicker + DatePickerInput | low | mapped |
| Dropdown | Dropdown | low | mapped |
| ExpandableTile | ExpandableTile + TileAboveTheFoldContent + TileBelowTheFoldContent | low | mapped |
| FileUploader | FileUploader | low | mapped |
| FormGroup | FormGroup | low | mapped |
| Grid | Grid + Column | medium | mapped |
| Header | Header + HeaderName + HeaderNavigation | low | mapped |
| InlineLoading | InlineLoading | low | mapped |
| InlineNotification | InlineNotification | medium | mapped |
| Loading | Loading | low | mapped |
| Modal | Modal | low | mapped |
| MultiSelect | MultiSelect | low | mapped |
| NumberInput | NumberInput | low | mapped |
| OverflowMenu | OverflowMenu + OverflowMenuItem | low | mapped |
| Pagination | Pagination | low | mapped |
| PasswordInput | PasswordInput | low | mapped |
| ProgressBar | ProgressBar | low | mapped |
| ProgressIndicator | ProgressIndicator + ProgressStep | low | mapped |
| RadioButton | RadioButton + RadioButtonGroup | low | mapped |
| Search | Search | low | mapped |
| Select | Select + SelectItem | low | mapped |
| SelectableTile | SelectableTile | low | mapped |
| SideNav | SideNav | low | mapped |
| SkeletonText | SkeletonText | low | mapped |
| Slider | Slider | low | mapped |
| StructuredList | StructuredList | low | mapped |
| Tabs | Tabs + TabList + Tab + TabPanels + TabPanel | high | mapped |
| Tag | Tag | low | mapped |
| TextArea | TextArea | low | mapped |
| TextInput | TextInput | low | mapped |
| Tile | Tile | low | mapped |
| TimePicker | TimePicker + TimePickerSelect | low | mapped |
| ToastNotification | ToastNotification | low | mapped |
| Toggle | Toggle | medium | mapped |
| Tooltip | Tooltip or IconButton with Tooltip | high | mapped |
| TooltipDefinition | DefinitionTooltip | low | mapped |
| TreeView | TreeView + TreeNode | low | mapped |
| Breadcrumb | Breadcrumb + BreadcrumbItem | low | mapped |

---

## Package Changes

| v10 Package | v11 Package |
|-------------|-------------|
| carbon-components-react | @carbon/react |
| carbon-components | @carbon/styles |
| carbon-icons | @carbon/icons-react (already separate) |

## SCSS Migration

**Styles:**
- Before: `@import 'carbon-components/scss/globals/scss/styles.scss';`
- After: `@use '@carbon/react';`

**Colors:** `@use '@carbon/styles/scss/colors'`
**Motion:** `@use '@carbon/styles/scss/motion'`
**Spacing:** `@use '@carbon/styles/scss/spacing'`
**Typography:** `@use '@carbon/styles/scss/type'`
**Grid:** `@use '@carbon/styles/scss/grid'`

**Config (before):** `$prefix: 'cds'; @import 'path/to/carbon';`
**Config (after):** `@use '@carbon/styles' with ($prefix: 'cds');`

## SCSS Variable Renames

Remove `$carbon--` prefix from all variables. Key renames:
- `$carbon--spacing` → `$spacing`
- `$carbon--font-families` → `$font-families`
- `$carbon--ease-in` → `$ease-in`
- `$duration--fast-01` → `$duration-fast-01`

## Icon Migration

Icons no longer exported with size suffixes. Use `size` prop instead.
- Before: `import { Add32, Add24 } from '@carbon/icons-react'` / `<Add32 />`
- After: `import { Add } from '@carbon/icons-react'` / `<Add size={32} />`

Renamed icons: `AppSwitcher` → `Switcher`, `Delete` → `TrashCan`, `BackToTop` → `UpToTop`

## Removed Components

| Component | Use Instead |
|-----------|-------------|
| Icon | `import { Add } from '@carbon/icons-react'` with size prop |
| ModalWrapper | Modal with controlled open prop |
| Row | Remove Row wrappers (or use FlexGrid + Row) |
| SearchFilterButton | no equivalent |
| SearchLayoutButton | no equivalent |
| ToggleSmall | `<Toggle size="sm" />` |
| ToggleSkeleton | no equivalent |
| ToggleSmallSkeleton | no equivalent |
| TooltipIcon | `import { IconButton } from '@carbon/react'` |
| Toolbar family | no equivalent |

## Renamed Components

| v10 Name | v11 Name | Prop Changes |
|----------|----------|--------------|
| TooltipDefinition | DefinitionTooltip | tooltipText → definition; direction → align |

## New Components in v11

| Component | Notes |
|-----------|-------|
| ActionableNotification | For notifications with interactive elements |
| DefinitionTooltip | Renamed from TooltipDefinition |
| FlexGrid | Maintains v10 flexbox Grid behavior with Row support |
| IconButton | Replaces TooltipIcon |
| Layer | Replaces `light` prop pattern |
| Popover | New low-level popover primitive |
| Stack | Replaces vertical margin patterns in forms |

---

### Accordion

**Carbon:** `Accordion + AccordionItem` from `@carbon/react`
**Import:** `import { Accordion, AccordionItem } from '@carbon/react'`
**Complexity:** low — Mostly stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| size | size (xl removed; accepts sm/md/lg only) | |
| AccordionItem.renderExpando | AccordionItem.renderToggle | |
| AccordionItem.iconDescription | no equivalent | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Accordion size prop no longer accepts 'xl'
2. AccordionItem: renderExpando prop renamed to renderToggle

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Button

**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Size prop values updated; hasIconOnly and small prop deprecated.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| hasIconOnly | no equivalent | use renderIcon + iconDescription alone |
| small | no equivalent | use size="sm" |
| size | size (sm/md/lg/xl/2xl; 'small'/'field'/'default' removed) | |
| iconDescription | iconDescription (required when renderIcon is used) | |
| kind | kind (unchanged) | |
| renderIcon | renderIcon (unchanged) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. hasIconOnly deprecated — use renderIcon + iconDescription alone to create icon-only button
2. small prop removed — use size="sm"
3. Size values 'small', 'field', 'default' removed; use 'sm', 'md', 'lg'

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Checkbox

**Carbon:** `Checkbox` from `@carbon/react`
**Import:** `import { Checkbox } from '@carbon/react'`
**Complexity:** low — onChange signature changed; wrapperClassName removed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| id | id (now required) | |
| wrapperClassName | no equivalent | |
| onChange | onChange (signature changed) | signature changed from (checked, id, event) to (event, { checked, id }) |

**Structural changes:**
(none)

**Behavioral differences:**
1. id prop is now required
2. wrapperClassName removed — use className (now applies to outermost element)
3. onChange signature changed from (checked, id, event) to (event, { checked, id })

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ClickableTile

**Carbon:** `ClickableTile` from `@carbon/react`
**Import:** `import { ClickableTile } from '@carbon/react'`
**Complexity:** low — handleClick/handleKeyDown renamed to standard event props.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| handleClick | onClick | |
| handleKeyDown | onKeyDown | |
| light | no equivalent | wrap in <Layer> |

**Structural changes:**
(none)

**Behavioral differences:**
1. handleClick renamed to onClick
2. handleKeyDown renamed to onKeyDown
3. light prop deprecated — wrap in <Layer>

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ComboBox

**Carbon:** `ComboBox` from `@carbon/react`
**Import:** `import { ComboBox } from '@carbon/react'`
**Complexity:** low — id prop now required; className scope changed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| id | id (now required) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. id prop is now required for accessibility
2. light prop deprecated — wrap in <Layer>
3. className now applies to outermost element

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ContentSwitcher

**Carbon:** `ContentSwitcher + Switch` from `@carbon/react`
**Import:** `import { ContentSwitcher, Switch } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| onChange | onChange | |
| selectedIndex | selectedIndex | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Switch subcomponent uses text prop for label content

**SCSS:**
```scss
@use '@carbon/react'
```

---

### DataTable

**Carbon:** `DataTable` from `@carbon/react`
**Import:** `import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch, TableBatchActions, TableBatchAction } from '@carbon/react'`
**Complexity:** medium — TableToolbarSearch prop renames; Table size values updated; shouldShowBorder removed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| Table.shouldShowBorder | no equivalent | |
| Table.size | Table.size (accepts xs/sm/md/lg/xl) | |
| TableToolbar.size | TableToolbar.size (accepts sm/lg) | |
| TableToolbarSearch.persistant | TableToolbarSearch.persistent | typo fixed |
| TableToolbarSearch.placeholderText | TableToolbarSearch.placeholder | |

**Structural changes:**
1. Import all sub-components from @carbon/react

**Behavioral differences:**
1. Table: shouldShowBorder prop removed
2. TableToolbar: size prop accepts sm/lg only

**SCSS:**
```scss
@use '@carbon/react'
```

---

### DatePicker

**Carbon:** `DatePicker + DatePickerInput` from `@carbon/react`
**Import:** `import { DatePicker, DatePickerInput } from '@carbon/react'`
**Complexity:** low — DatePickerInput has minor prop removals.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| DatePickerInput.iconDescription | no equivalent | |
| DatePickerInput.openCalendar | no equivalent | |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. DatePickerInput: iconDescription prop removed
3. DatePickerInput: openCalendar prop removed

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Dropdown

**Carbon:** `Dropdown` from `@carbon/react`
**Import:** `import { Dropdown } from '@carbon/react'`
**Complexity:** low — inline prop replaced with type prop.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| inline | type="inline" | |
| items | items | |
| label | label | |
| itemToString | itemToString | |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. inline prop removed — use type="inline" instead
3. className now applies to outermost element

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ExpandableTile

**Carbon:** `ExpandableTile + TileAboveTheFoldContent + TileBelowTheFoldContent` from `@carbon/react`
**Import:** `import { ExpandableTile, TileAboveTheFoldContent, TileBelowTheFoldContent } from '@carbon/react'`
**Complexity:** low — handleClick renamed; light prop deprecated.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| handleClick | onClick | |
| light | no equivalent | wrap in <Layer> |

**Structural changes:**
(none)

**Behavioral differences:**
1. handleClick renamed to onClick
2. light prop deprecated — wrap in <Layer>

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FileUploader

**Carbon:** `FileUploader` from `@carbon/react`
**Import:** `import { FileUploader, FileUploaderButton, FileUploaderItem, FileUploaderDropContainer } from '@carbon/react'`
**Complexity:** low — iconDescription now required; size values updated; vertical margin removed from FileUploaderButton.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| iconDescription | iconDescription (now required) | |
| FileUploaderButton.size | FileUploaderButton.size (accepts sm/md/lg) | |
| FileUploaderItem.size | FileUploaderItem.size (accepts sm/md/lg) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. iconDescription prop is now required
2. FileUploaderButton: vertical margin no longer included — use <Stack> for spacing
3. FileUploaderButton and FileUploaderItem size accepts sm/md/lg

**SCSS:**
```scss
@use '@carbon/react'
```

---

### FormGroup

**Carbon:** `FormGroup` from `@carbon/react`
**Import:** `import { FormGroup } from '@carbon/react'`
**Complexity:** low — hasMargin removed; use Stack instead.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| hasMargin | no equivalent | use <Stack> for vertical spacing |

**Structural changes:**
(none)

**Behavioral differences:**
1. hasMargin prop removed — use <Stack> for vertical spacing
2. Form and FluidForm: vertical margin for form items no longer included — use <Stack>
3. className now applies to outermost element

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Grid

**Carbon:** `Grid + Column` from `@carbon/react`
**Import:** `import { Grid, Column } from '@carbon/react'`
**Complexity:** medium — Row deprecated; Grid uses CSS Grid by default (not flexbox); Column defaults to 1 col span.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| condensed | condensed | |
| narrow | narrow | |
| fullWidth | fullWidth | |

**Structural changes:**
1. Remove <Row> wrapper — Column sits directly inside Grid
2. Grid now uses CSS Grid instead of flexbox
3. Column no longer auto-spans; defaults to 1 column — explicitly set sm/md/lg/xlg/max props

**Behavioral differences:**
1. Row is deprecated — remove Row wrappers when using Grid
2. CSS Grid replaces flexbox — layout behavior may differ
3. Use FlexGrid (new component) to maintain v10 flexbox Row-based layout

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Header

**Carbon:** `Header + HeaderName + HeaderNavigation` from `@carbon/react`
**Import:** `import { Header, HeaderName, HeaderNavigation, HeaderMenu, HeaderMenuItem, HeaderGlobalBar, HeaderGlobalAction, SkipToContent } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### InlineLoading

**Carbon:** `InlineLoading` from `@carbon/react`
**Import:** `import { InlineLoading } from '@carbon/react'`
**Complexity:** low — success prop deprecated in favor of status enum.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| success | status="finished" | |

**Structural changes:**
(none)

**Behavioral differences:**
1. success prop deprecated — use status="finished" instead
2. status accepts: 'active' | 'inactive' | 'finished' | 'error'

**SCSS:**
```scss
@use '@carbon/react'
```

---

### InlineNotification

**Carbon:** `InlineNotification` from `@carbon/react`
**Import:** `import { InlineNotification } from '@carbon/react'`
**Complexity:** medium — actions prop and interactive children removed; use ActionableNotification for interactive content.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| lowContrast | no equivalent | |
| actions | no equivalent | use ActionableNotification |
| notificationType | no equivalent | |
| kind | kind | |
| title | title | |
| subtitle | subtitle | |

**Structural changes:**
(none)

**Behavioral differences:**
1. lowContrast prop removed
2. actions prop removed — use ActionableNotification for notifications with interactive actions
3. Children can no longer contain interactive elements — use ActionableNotification instead

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Loading

**Carbon:** `Loading` from `@carbon/react`
**Import:** `import { Loading } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Modal

**Carbon:** `Modal` from `@carbon/react`
**Import:** `import { Modal, ComposedModal, ModalHeader, ModalBody, ModalFooter } from '@carbon/react'`
**Complexity:** low — Several props removed; focus management now automatic.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| selectorPrimaryFocus | no equivalent | focus management is now automatic |
| focusTrap | no equivalent | |
| hasForm | no equivalent | |
| iconDescription | no equivalent | |
| open | open | |
| modalHeading | modalHeading | |

**Structural changes:**
(none)

**Behavioral differences:**
1. selectorPrimaryFocus deprecated — focus management is now automatic
2. focusTrap prop removed
3. hasForm prop removed

**SCSS:**
```scss
@use '@carbon/react'
```

---

### MultiSelect

**Carbon:** `MultiSelect` from `@carbon/react`
**Import:** `import { MultiSelect } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. className now applies to outermost element

**SCSS:**
```scss
@use '@carbon/react'
```

---

### NumberInput

**Carbon:** `NumberInput` from `@carbon/react`
**Import:** `import { NumberInput } from '@carbon/react'`
**Complexity:** low — isMobile removed; onChange signature changed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| isMobile | no equivalent | |
| onChange | onChange (signature changed) | signature changed to (event, { value, direction }) |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. isMobile prop removed
3. onChange signature changed to (event, { value, direction })

**SCSS:**
```scss
@use '@carbon/react'
```

---

### OverflowMenu

**Carbon:** `OverflowMenu + OverflowMenuItem` from `@carbon/react`
**Import:** `import { OverflowMenu, OverflowMenuItem } from '@carbon/react'`
**Complexity:** low — light prop deprecated; OverflowMenuItem primaryFocus removed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| OverflowMenuItem.primaryFocus | no equivalent | use selectorPrimaryFocus on parent OverflowMenu |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. OverflowMenuItem: primaryFocus prop removed — use selectorPrimaryFocus on parent OverflowMenu

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Pagination

**Carbon:** `Pagination` from `@carbon/react`
**Import:** `import { Pagination } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### PasswordInput

**Carbon:** `PasswordInput` from `@carbon/react`
**Import:** `import { PasswordInput } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| size | size (accepts sm/md/lg) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. TextInput.PasswordInput and TextInput.ControlledPasswordInput sub-exports removed — import PasswordInput directly
2. light prop deprecated — wrap in <Layer>
3. size accepts sm/md/lg

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ProgressBar

**Carbon:** `ProgressBar` from `@carbon/react`
**Import:** `import { ProgressBar } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ProgressIndicator

**Carbon:** `ProgressIndicator + ProgressStep` from `@carbon/react`
**Import:** `import { ProgressIndicator, ProgressStep } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### RadioButton

**Carbon:** `RadioButton + RadioButtonGroup` from `@carbon/react`
**Import:** `import { RadioButton, RadioButtonGroup } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**Behavioral differences:**
1. RadioButtonGroup: className now applies to outermost element

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Search

**Carbon:** `Search` from `@carbon/react`
**Import:** `import { Search } from '@carbon/react'`
**Complexity:** low — Several prop renames and size value changes.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| placeHolderText | placeholder | |
| small | no equivalent | use size="sm" |
| size | size (values changed: lg→md, xl→lg; use sm/md/lg) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. placeHolderText renamed to placeholder
3. small prop removed — use size="sm"

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Select

**Carbon:** `Select + SelectItem` from `@carbon/react`
**Import:** `import { Select, SelectItem } from '@carbon/react'`
**Complexity:** low — iconDescription removed; size values updated.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| iconDescription | no equivalent | |
| size | size (accepts sm/md/lg) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. iconDescription prop removed
3. size accepts sm/md/lg

**SCSS:**
```scss
@use '@carbon/react'
```

---

### SelectableTile

**Carbon:** `SelectableTile` from `@carbon/react`
**Import:** `import { SelectableTile } from '@carbon/react'`
**Complexity:** low — handleClick/handleKeyDown renamed; iconDescription removed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| handleClick | onClick | |
| handleKeyDown | onKeyDown | |
| iconDescription | no equivalent | |

**Structural changes:**
(none)

**Behavioral differences:**
1. handleClick renamed to onClick
2. handleKeyDown renamed to onKeyDown
3. iconDescription prop removed

**SCSS:**
```scss
@use '@carbon/react'
```

---

### SideNav

**Carbon:** `SideNav` from `@carbon/react`
**Import:** `import { SideNav, SideNavItems, SideNavItem, SideNavLink, SideNavMenu, SideNavMenuItem } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### SkeletonText

**Carbon:** `SkeletonText` from `@carbon/react`
**Import:** `import { SkeletonText, SkeletonPlaceholder, SkeletonIcon, SkeletonButton } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Slider

**Carbon:** `Slider` from `@carbon/react`
**Import:** `import { Slider } from '@carbon/react'`
**Complexity:** low — ariaLabelInput now required; stepMuliplier typo fixed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| stepMuliplier | stepMultiplier | typo fixed |
| ariaLabelInput | ariaLabelInput (now required) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. stepMuliplier (typo) renamed to stepMultiplier
3. ariaLabelInput is now required for accessibility

**SCSS:**
```scss
@use '@carbon/react'
```

---

### StructuredList

**Carbon:** `StructuredList` from `@carbon/react`
**Import:** `import { StructuredList, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell, StructuredListInput } from '@carbon/react'`
**Complexity:** low — StructuredListWrapper border removed; minor deprecations on sub-components.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| StructuredListWrapper.border | no equivalent | |
| StructuredListRow.label | StructuredListRow.label (deprecated) | |
| StructuredListInput.defaultChecked | StructuredListInput.defaultChecked (deprecated) | |
| StructuredListInput.value | StructuredListInput.value (deprecated) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. StructuredListWrapper: border prop removed
2. StructuredListRow: label prop deprecated
3. StructuredListInput: defaultChecked and value props deprecated

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tabs

**Carbon:** `Tabs + TabList + Tab + TabPanels + TabPanel` from `@carbon/react`
**Import:** `import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react'`
**Complexity:** high — BREAKING: v11 Tabs API completely restructured.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| label | no equivalent | Tab children ARE the label |
| selected | selectedIndex (on Tabs) | |
| type | no equivalent | use contained prop on TabList |
| hidden | no equivalent | |
| tabContentClassName | no equivalent | |
| renderAnchor | no equivalent | |
| renderButton | no equivalent | |
| renderContent | no equivalent | |
| onClick | onChange (on Tabs) | |

**Structural changes:**
1. Wrap tab labels in TabList with aria-label
2. Tab children ARE the label (label prop removed)
3. Move tab content from Tab children into TabPanel
4. Wrap all TabPanels in TabPanels container
5. For contained tabs: use <TabList contained> instead of type='container' on Tabs

**Behavioral differences:**
1. v10: `<Tabs><Tab label='X'>content</Tab></Tabs>`
2. v11: `<Tabs><TabList aria-label='...'><Tab>X</Tab></TabList><TabPanels><TabPanel>content</TabPanel></TabPanels></Tabs>`

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tag

**Carbon:** `Tag` from `@carbon/react`
**Import:** `import { Tag } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| filter | filter | |
| type | type | |
| title | title | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### TextArea

**Carbon:** `TextArea` from `@carbon/react`
**Import:** `import { TextArea } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. className now applies to outermost element

**SCSS:**
```scss
@use '@carbon/react'
```

---

### TextInput

**Carbon:** `TextInput` from `@carbon/react`
**Import:** `import { TextInput } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| labelText | labelText | |
| helperText | helperText | |
| invalid | invalid | |
| invalidText | invalidText | |
| size | size (accepts sm/md/lg) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. TextInput.PasswordInput and TextInput.ControlledPasswordInput sub-exports removed
3. size accepts sm/md/lg

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tile

**Carbon:** `Tile` from `@carbon/react`
**Import:** `import { Tile } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>

**SCSS:**
```scss
@use '@carbon/react'
```

---

### TimePicker

**Carbon:** `TimePicker + TimePickerSelect` from `@carbon/react`
**Import:** `import { TimePicker, TimePickerSelect } from '@carbon/react'`
**Complexity:** low — TimePickerSelect had minor prop removals; light deprecated.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| light | no equivalent | wrap in <Layer> |
| TimePickerSelect.iconDescription | no equivalent | |
| TimePickerSelect.hideLabel | no equivalent | |

**Structural changes:**
(none)

**Behavioral differences:**
1. light prop deprecated — wrap in <Layer>
2. TimePickerSelect: iconDescription prop removed
3. TimePickerSelect: hideLabel prop removed

**SCSS:**
```scss
@use '@carbon/react'
```

---

### ToastNotification

**Carbon:** `ToastNotification` from `@carbon/react`
**Import:** `import { ToastNotification } from '@carbon/react'`
**Complexity:** low — Interactive children no longer allowed; notificationType removed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| lowContrast | no equivalent | |
| notificationType | no equivalent | |
| timeout | timeout (still valid) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. lowContrast prop removed
2. notificationType prop removed
3. Children can no longer contain interactive elements — use ActionableNotification

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Toggle

**Carbon:** `Toggle` from `@carbon/react`
**Import:** `import { Toggle } from '@carbon/react'`
**Complexity:** medium — BREAKING: Toggle restructured from checkbox input to button with role=switch.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| onChange | no equivalent | use onClick instead |
| labelA | labelA (now optional, defaults to 'Off') | |
| labelB | labelB (now optional, defaults to 'On') | |
| labelText | labelText | |
| toggled | toggled | |
| defaultToggled | defaultToggled | |

**Structural changes:**
1. Internal implementation changed from <input type='checkbox'> to <button role='switch'>
2. Use onClick instead of onChange for change events
3. Use size='sm' to replace ToggleSmall

**Behavioral differences:**
1. onChange removed — use onClick for interaction handling
2. onClick added as the primary event handler
3. labelA and labelB are now optional — default to 'Off' / 'On'

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tooltip

**Carbon:** `Tooltip or IconButton with Tooltip` from `@carbon/react`
**Import:** `import { Tooltip, DefinitionTooltip, IconButton } from '@carbon/react'`
**Complexity:** high — BREAKING: Tooltip API completely restructured in v11.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| triggerText | no equivalent | |
| showIcon | no equivalent | |
| iconName | no equivalent | |
| focusTrap | no equivalent | |
| renderIcon | no equivalent | |
| selectorPrimaryFocus | no equivalent | |
| tooltipBodyId | no equivalent | |
| tooltipId | no equivalent | |
| triggerClassName | no equivalent | |
| iconDescription | no equivalent | |
| direction | align (merged with align prop) | |
| align | align | |

**Structural changes:**
1. Interactive tooltips → use Tooltip with trigger element as children
2. Definition tooltips → use DefinitionTooltip (renamed from TooltipDefinition) with definition prop
3. Icon tooltips → use IconButton with built-in tooltip via label prop

**Behavioral differences:**
1. Tooltip v11 accepts an interactive child element as the trigger
2. triggerText, showIcon, iconName, focusTrap, renderIcon, selectorPrimaryFocus all removed
3. direction and align props merged into single align prop

**SCSS:**
```scss
@use '@carbon/react'
```

---

### TooltipDefinition

**Carbon:** `DefinitionTooltip` from `@carbon/react`
**Import:** `import { DefinitionTooltip } from '@carbon/react'`
**Complexity:** low — Renamed component with one prop rename.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| tooltipText | definition | |
| direction | align | |

**Structural changes:**
1. Renamed from TooltipDefinition to DefinitionTooltip

**Behavioral differences:**
1. Component renamed from TooltipDefinition to DefinitionTooltip
2. tooltipText prop renamed to definition
3. direction prop merged into align

**SCSS:**
```scss
@use '@carbon/react'
```

---

### TreeView

**Carbon:** `TreeView + TreeNode` from `@carbon/react`
**Import:** `import { TreeView, TreeNode } from '@carbon/react'`
**Complexity:** low — Stable.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Breadcrumb

**Carbon:** `Breadcrumb + BreadcrumbItem` from `@carbon/react`
**Import:** `import { Breadcrumb, BreadcrumbItem } from '@carbon/react'`
**Complexity:** low — isCurrentPage prop removed.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isCurrentPage | no equivalent | use aria-current='page' on the anchor inside BreadcrumbItem |

**Structural changes:**
(none)

**Behavioral differences:**
1. isCurrentPage prop removed — use aria-current='page' on the anchor inside BreadcrumbItem instead

**SCSS:**
```scss
@use '@carbon/react'
```

---
