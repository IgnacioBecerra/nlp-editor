# Tailwind CSS → Carbon React v11 Migration Map

> Source: tailwind-css
> Target: carbon-react-v11
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| NavBar | Header + HeaderName + HeaderNavigation + HeaderMenuItem | high | mapped |
| Card | Tile | low | mapped |
| Modal | Modal | medium | mapped |
| Button | Button | low | mapped |
| Input (text) | TextInput | low | mapped |
| Textarea | TextArea | low | mapped |
| Select | Dropdown or Select | medium | mapped |
| Checkbox | Checkbox | low | mapped |
| Toggle/Switch | Toggle | low | mapped |
| Alert | InlineNotification | low | mapped |
| Toast notification | ToastNotification | low | mapped |
| Badge | Tag | low | mapped |
| Spinner | Loading | low | mapped |
| ProgressBar | ProgressBar | low | mapped |
| Skeleton | SkeletonText + SkeletonPlaceholder | low | mapped |
| Dropdown menu | OverflowMenu + OverflowMenuItem | medium | mapped |
| Tooltip | Tooltip | medium | mapped |
| Accordion | Accordion + AccordionItem | low | mapped |
| Tabs | Tabs + TabList + Tab + TabPanels + TabPanel | medium | mapped |
| Table | DataTable | medium | mapped |
| Breadcrumbs | Breadcrumb + BreadcrumbItem | low | mapped |
| Pagination | Pagination | low | mapped |
| Sidebar/SideNav | SideNav | medium | mapped |
| File upload | FileUploader | medium | mapped |
| Stepper/Steps | ProgressIndicator + ProgressStep | medium | mapped |
| Grid layout | Grid + Column | medium | mapped |
| Form layout | Form + FormGroup | low | mapped |
| Search input | Search | low | mapped |
| Combobox/Autocomplete (HeadlessUI) | ComboBox | medium | mapped |

---

### NavBar

**Carbon:** `Header + HeaderName + HeaderNavigation + HeaderMenuItem` from `@carbon/react`
**Import:** `import { Header, HeaderName, HeaderNavigation, HeaderMenuItem, HeaderGlobalBar, SkipToContent } from '@carbon/react'`
**Complexity:** high — Tailwind nav is custom-composed; Carbon UIShell has a specific required structure.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Wrap in Header
2. Use HeaderName for logo/brand
3. Use HeaderNavigation > HeaderMenuItem for links

**Behavioral differences:**
1. Carbon UIShell handles mobile hamburger via SideNav integration
2. Theme-aware: inherits Carbon theme automatically

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Card

**Carbon:** `Tile` from `@carbon/react`
**Import:** `import { Tile, ClickableTile, ExpandableTile } from '@carbon/react'`
**Complexity:** low — Tile is the direct Carbon equivalent of a card.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Replace div with rounded shadow with Tile
2. Use ClickableTile for clickable cards

**Behavioral differences:**
1. Theme-aware background; no need for bg-white dark:bg-gray-800 pattern

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Modal

**Carbon:** `Modal` from `@carbon/react`
**Import:** `import { Modal } from '@carbon/react'`
**Complexity:** medium — Carbon Modal replaces fixed-overlay + panel pattern.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Use open prop instead of conditional render
2. modalHeading for title
3. primaryButtonText/secondaryButtonText for actions

**Behavioral differences:**
1. Focus trap, aria, and escape key handled automatically

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Button

**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| class (bg-blue-600) | kind="primary" | |
| class (bg-gray-200) | kind="secondary" | |
| class (bg-red-600) | kind="danger" | |
| class (border border-gray-300) | kind="tertiary" | |
| disabled | disabled | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Color, padding, hover all handled by Carbon tokens

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Input (text)

**Carbon:** `TextInput` from `@carbon/react`
**Import:** `import { TextInput } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| placeholder | placeholder | |
| disabled | disabled | |

**Structural changes:**
1. Move label to labelText prop
2. Move helper text to helperText prop

**Behavioral differences:**
1. No need for ring/focus classes; Carbon handles focus styles

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Textarea

**Carbon:** `TextArea` from `@carbon/react`
**Import:** `import { TextArea } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| rows | rows | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Select

**Carbon:** `Dropdown or Select` from `@carbon/react`
**Import:** `import { Dropdown } from '@carbon/react'`
**Complexity:** medium — Carbon Dropdown is custom-styled; Select is native.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**Behavioral differences:**
1. Dropdown for rich styled; Select for native browser select

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Checkbox

**Carbon:** `Checkbox` from `@carbon/react`
**Import:** `import { Checkbox } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | checked | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Toggle/Switch

**Carbon:** `Toggle` from `@carbon/react`
**Import:** `import { Toggle } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | toggled | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Alert

**Carbon:** `InlineNotification` from `@carbon/react`
**Import:** `import { InlineNotification } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| class (bg-red-100) | kind="error" | |
| class (bg-green-100) | kind="success" | |
| class (bg-yellow-100) | kind="warning" | |
| class (bg-blue-100) | kind="info" | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Toast notification

**Carbon:** `ToastNotification` from `@carbon/react`
**Import:** `import { ToastNotification } from '@carbon/react'`
**Complexity:** low — Direct replacement.
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

### Badge

**Carbon:** `Tag` from `@carbon/react`
**Import:** `import { Tag } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| class (bg-blue-100 text-blue-800) | type="blue" | |
| class (bg-gray-100) | type="gray" | |
| class (bg-green-100) | type="green" | |
| class (bg-red-100) | type="red" | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Spinner

**Carbon:** `Loading` from `@carbon/react`
**Import:** `import { Loading } from '@carbon/react'`
**Complexity:** low — Direct replacement.
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

### ProgressBar

**Carbon:** `ProgressBar` from `@carbon/react`
**Import:** `import { ProgressBar } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| style (width %) | value (0-100) | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Skeleton

**Carbon:** `SkeletonText + SkeletonPlaceholder` from `@carbon/react`
**Import:** `import { SkeletonText, SkeletonPlaceholder } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Use SkeletonText for text lines, SkeletonPlaceholder for blocks

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Dropdown menu

**Carbon:** `OverflowMenu + OverflowMenuItem` from `@carbon/react`
**Import:** `import { OverflowMenu, OverflowMenuItem } from '@carbon/react'`
**Complexity:** medium — Replace custom absolute-positioned dropdown with OverflowMenu.
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

### Tooltip

**Carbon:** `Tooltip` from `@carbon/react`
**Import:** `import { Tooltip } from '@carbon/react'`
**Complexity:** medium — Replace relative+group+hover pattern with Tooltip component.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| class (top/bottom/left/right) | align prop | |

**Structural changes:**
1. Wrap trigger in Tooltip
2. Content as Tooltip children

**Behavioral differences:**
1. Focus and keyboard navigation built-in

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Accordion

**Carbon:** `Accordion + AccordionItem` from `@carbon/react`
**Import:** `import { Accordion, AccordionItem } from '@carbon/react'`
**Complexity:** low — Direct replacement for disclosure/collapse patterns.
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

### Tabs

**Carbon:** `Tabs + TabList + Tab + TabPanels + TabPanel` from `@carbon/react`
**Import:** `import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react'`
**Complexity:** medium — Replace flex border-b pattern with Carbon Tabs.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**Behavioral differences:**
1. ARIA roles, keyboard navigation built-in

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Table

**Carbon:** `DataTable` from `@carbon/react`
**Import:** `import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react'`
**Complexity:** medium — Replace plain HTML table + Tailwind with DataTable render prop pattern.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Pass headers and rows arrays to DataTable
2. Use render prop to render Table, TableHead, etc.

**Behavioral differences:**
1. Built-in sorting, selection, batch actions

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Breadcrumbs

**Carbon:** `Breadcrumb + BreadcrumbItem` from `@carbon/react`
**Import:** `import { Breadcrumb, BreadcrumbItem } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**Behavioral differences:**
1. Separator rendered by Carbon automatically

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Pagination

**Carbon:** `Pagination` from `@carbon/react`
**Import:** `import { Pagination } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| page | page | |
| totalItems | totalItems | |
| pageSize | pageSize | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Sidebar/SideNav

**Carbon:** `SideNav` from `@carbon/react`
**Import:** `import { SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem } from '@carbon/react'`
**Complexity:** medium — Replace fixed-width sidebar div with SideNav.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| expanded | expanded | |

**Structural changes:**
(none)

**Behavioral differences:**
1. SideNav handles expand/collapse animation

**SCSS:**
```scss
@use '@carbon/react'
```

---

### File upload

**Carbon:** `FileUploader` from `@carbon/react`
**Import:** `import { FileUploader } from '@carbon/react'`
**Complexity:** medium — Carbon FileUploader replaces custom drag-drop input patterns.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**Behavioral differences:**
1. Drag-drop zone, file status, multiple file support built-in

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Stepper/Steps

**Carbon:** `ProgressIndicator + ProgressStep` from `@carbon/react`
**Import:** `import { ProgressIndicator, ProgressStep } from '@carbon/react'`
**Complexity:** medium — Replace ordered list with circles pattern.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Use currentIndex prop to control active step

**Behavioral differences:**
1. Complete/current/upcoming states built-in

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Grid layout

**Carbon:** `Grid + Column` from `@carbon/react`
**Import:** `import { Grid, Column } from '@carbon/react'`
**Complexity:** medium — Replace grid-cols-12 with Carbon's 16-column grid.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| col-span-6 | lg={8} (out of 16) | |
| col-span-4 | lg={4} | |

**Structural changes:**
1. Remove gap utility classes; Carbon Grid handles spacing

**Behavioral differences:**
1. Carbon uses 4-col (sm) / 8-col (md) / 16-col (lg) breakpoints

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Form layout

**Carbon:** `Form + FormGroup` from `@carbon/react`
**Import:** `import { Form, FormGroup } from '@carbon/react'`
**Complexity:** low — Carbon Form provides semantic structure.
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

### Search input

**Carbon:** `Search` from `@carbon/react`
**Import:** `import { Search } from '@carbon/react'`
**Complexity:** low — Direct replacement.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**Behavioral differences:**
1. Built-in clear button

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Combobox/Autocomplete (HeadlessUI)

**Carbon:** `ComboBox` from `@carbon/react`
**Import:** `import { ComboBox } from '@carbon/react'`
**Complexity:** medium — HeadlessUI Combobox → Carbon ComboBox with built-in filtering.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. items array instead of options composition
2. filterItems prop for custom filter

**SCSS:**
```scss
@use '@carbon/react'
```

---
