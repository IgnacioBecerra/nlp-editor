# Chakra UI → Carbon React v11 Migration Map

> Source: chakra-ui@2
> Target: carbon-react-v11
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| Box | div (HTML) | low | custom_required |
| Stack | div with CSS flex | low | custom_required |
| HStack | div with CSS flex row | low | custom_required |
| VStack | div with CSS flex column | low | custom_required |
| Grid | Grid + Column | medium | mapped |
| Container | Grid | low | mapped |
| Divider | Divider | low | mapped |
| Button | Button | low | mapped |
| IconButton | Button kind="ghost" with renderIcon | low | mapped |
| Checkbox | Checkbox | low | mapped |
| Radio | RadioButton + RadioButtonGroup | low | mapped |
| Switch | Toggle | low | mapped |
| Select | Dropdown or Select | medium | mapped |
| Input | TextInput | low | mapped |
| Textarea | TextArea | low | mapped |
| NumberInput | NumberInput | low | mapped |
| Slider | Slider | low | mapped |
| Tabs | Tabs + TabList + Tab + TabPanels + TabPanel | low | mapped |
| Accordion | Accordion + AccordionItem | low | mapped |
| Modal | Modal | medium | mapped |
| Drawer | SideNav (or custom panel) | high | partial |
| Tooltip | Tooltip | low | mapped |
| Alert | InlineNotification | low | mapped |
| Progress | ProgressBar | low | mapped |
| Spinner | Loading | low | mapped |
| Skeleton | SkeletonText + SkeletonPlaceholder | low | mapped |
| Badge | Tag | low | mapped |
| Table | DataTable | medium | mapped |
| Breadcrumb | Breadcrumb + BreadcrumbItem | low | mapped |
| Menu | OverflowMenu + OverflowMenuItem | medium | mapped |
| Link | Link | low | mapped |
| Tag (with close) | Tag filter | low | mapped |
| Popover | Popover + PopoverContent | medium | mapped |

---

### Box

**Carbon:** `div (HTML)` from `null`
**Import:** null
**Complexity:** low — Box is a layout primitive.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| as | as (use HTML tag directly) | |
| p/px/py/m/mx/my | no equivalent | |
| color/bg/fontSize | no equivalent | |

**Structural changes:**
1. Remove all Chakra style props
2. Use CSS or Carbon layout classes

**Behavioral differences:**
1. No direct equivalent; use CSS

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Stack

**Carbon:** `div with CSS flex` from `null`
**Import:** null
**Complexity:** low — Replace with CSS flexbox.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| spacing | gap in CSS | |
| direction | flex-direction in CSS | |

**Structural changes:**
1. Use style={{display:'flex', gap:'1rem'}} or CSS class

**SCSS:**
```scss
@use '@carbon/react'
```

---

### HStack

**Carbon:** `div with CSS flex row` from `null`
**Import:** null
**Complexity:** low — Horizontal flexbox.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| spacing | gap | |

**Structural changes:**
1. style={{display:'flex', flexDirection:'row', gap:'...'}}

**SCSS:**
```scss
@use '@carbon/react'
```

---

### VStack

**Carbon:** `div with CSS flex column` from `null`
**Import:** null
**Complexity:** low — Vertical flexbox.
**Status:** custom_required

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| spacing | gap | |

**Structural changes:**
1. style={{display:'flex', flexDirection:'column', gap:'...'}}

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Grid

**Carbon:** `Grid + Column` from `@carbon/react`
**Import:** `import { Grid, Column } from '@carbon/react'`
**Complexity:** medium — Carbon uses a 16-column grid system; Chakra Grid uses CSS Grid directly.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| templateColumns | no equivalent | |
| gap | no equivalent | |

**Structural changes:**
1. Replace Chakra Grid with Carbon Grid + Column
2. Map templateColumns to Column span values

**Behavioral differences:**
1. Carbon Grid is 16-col on large, 8-col on medium, 4-col on small

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Container

**Carbon:** `Grid` from `@carbon/react`
**Import:** `import { Grid } from '@carbon/react'`
**Complexity:** low — Grid provides the same content width constraint.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| maxW | no equivalent | |
| centerContent | no equivalent | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Divider

**Carbon:** `Divider` from `@carbon/react`
**Import:** `import { Divider } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| orientation | kind (horizontal/vertical) | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Button

**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Direct equivalent with variant remapping.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant (solid) | kind="primary" | |
| variant (outline) | kind="tertiary" | |
| variant (ghost) | kind="ghost" | |
| variant (link) | kind="ghost" | |
| colorScheme | no equivalent | |
| isLoading | no equivalent | |
| leftIcon | renderIcon | |
| rightIcon | no equivalent | |

**Structural changes:**
(none)

**Behavioral differences:**
1. No colorScheme — use kind for semantic styling
2. Loading state: use Button's built-in loading prop or wrap with Loading

**SCSS:**
```scss
@use '@carbon/react'
```

---

### IconButton

**Carbon:** `Button kind="ghost" with renderIcon` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Use Carbon Button with renderIcon and no children for icon-only button.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| icon | renderIcon | |
| aria-label | iconDescription | |

**Structural changes:**
1. Add iconDescription prop for accessibility

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Checkbox

**Carbon:** `Checkbox` from `@carbon/react`
**Import:** `import { Checkbox } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isChecked | checked | |
| isDisabled | disabled | |
| isIndeterminate | indeterminate | |
| children | labelText | |

**Structural changes:**
(none)

**Behavioral differences:**
1. id prop is required

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Radio

**Carbon:** `RadioButton + RadioButtonGroup` from `@carbon/react`
**Import:** `import { RadioButton, RadioButtonGroup } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| isDisabled | disabled | |

**Structural changes:**
1. Wrap RadioButtons in RadioButtonGroup

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Switch

**Carbon:** `Toggle` from `@carbon/react`
**Import:** `import { Toggle } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isChecked | toggled | |
| isDisabled | disabled | |
| children | labelText | |

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
**Complexity:** medium — Chakra Select wraps HTML select; Carbon Dropdown is custom.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | selectedItem | |
| onChange | onChange | |
| placeholder | label | |

**Structural changes:**
1. Use Dropdown for custom styled, Select for native

**Behavioral differences:**
1. Dropdown is not a native select; items passed as array

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
| isDisabled | disabled | |
| isInvalid | invalid | |
| placeholder | placeholder | |
| value | value | |

**Structural changes:**
(none)

**Behavioral differences:**
1. labelText and helperText are separate props, not children or siblings

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Textarea

**Carbon:** `TextArea` from `@carbon/react`
**Import:** `import { TextArea } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isDisabled | disabled | |
| isInvalid | invalid | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### NumberInput

**Carbon:** `NumberInput` from `@carbon/react`
**Import:** `import { NumberInput } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| min | min | |
| max | max | |
| step | step | |
| value | value | |

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
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| min | min | |
| max | max | |
| step | step | |
| value | value | |
| defaultValue | value | |

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
**Complexity:** low — API is very similar — Chakra also uses TabList/Tab/TabPanels/TabPanel.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| index | selectedIndex | |
| defaultIndex | defaultSelectedIndex | |
| onChange | onChange | |

**Structural changes:**
1. Add aria-label to TabList

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Accordion

**Carbon:** `Accordion + AccordionItem` from `@carbon/react`
**Import:** `import { Accordion, AccordionItem } from '@carbon/react'`
**Complexity:** low — Direct equivalent with slight API difference.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| allowMultiple | align="start" | |
| defaultIndex | no equivalent | |

**Structural changes:**
1. AccordionButton+AccordionPanel → AccordionItem title prop + children

**Behavioral differences:**
1. AccordionItem takes title prop; children are the panel content

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Modal

**Carbon:** `Modal` from `@carbon/react`
**Import:** `import { Modal } from '@carbon/react'`
**Complexity:** medium — Carbon Modal uses flat prop-based API instead of compound components.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isOpen | open | |
| onClose | onRequestClose | |
| size | size (sm/md/lg) | |

**Structural changes:**
1. Use open/onRequestClose props
2. modalHeading + modalLabel for header
3. primaryButtonText + secondaryButtonText for actions

**Behavioral differences:**
1. Footer buttons controlled via props, not children

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Drawer

**Carbon:** `SideNav (or custom panel)` from `@carbon/react`
**Import:** `import { SideNav } from '@carbon/react'`
**Complexity:** high — Carbon doesn't have a generic Drawer.
**Status:** partial

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isOpen | expanded | |
| placement | no equivalent | |

**Structural changes:**
(none)

**Behavioral differences:**
1. For content panels, consider IBM Products SidePanel

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tooltip

**Carbon:** `Tooltip` from `@carbon/react`
**Import:** `import { Tooltip } from '@carbon/react'`
**Complexity:** low — Direct equivalent with slight API difference.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| label | children (content) | |
| placement | align | |

**Structural changes:**
1. Wrap trigger in Tooltip; content in a div child

**Behavioral differences:**
1. Carbon Tooltip wraps trigger element as child

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Alert

**Carbon:** `InlineNotification` from `@carbon/react`
**Import:** `import { InlineNotification } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| status (error) | kind="error" | |
| status (success) | kind="success" | |
| status (warning) | kind="warning" | |
| status (info) | kind="info" | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Progress

**Carbon:** `ProgressBar` from `@carbon/react`
**Import:** `import { ProgressBar } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| hasStripe | no equivalent | |

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
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| size (sm) | small (boolean) | |

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
**Complexity:** low — Direct equivalents.
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

### Badge

**Carbon:** `Tag` from `@carbon/react`
**Import:** `import { Tag } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| colorScheme | type (blue/gray/green/red/teal/cyan/purple/magenta/warm-gray/cool-gray) | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Table

**Carbon:** `DataTable` from `@carbon/react`
**Import:** `import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react'`
**Complexity:** medium — Carbon DataTable uses a render prop pattern.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Use DataTable with headers/rows props and render prop

**Behavioral differences:**
1. Carbon DataTable manages sorting, selection, and batch actions

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Breadcrumb

**Carbon:** `Breadcrumb + BreadcrumbItem` from `@carbon/react`
**Import:** `import { Breadcrumb, BreadcrumbItem } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
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

### Menu

**Carbon:** `OverflowMenu + OverflowMenuItem` from `@carbon/react`
**Import:** `import { OverflowMenu, OverflowMenuItem } from '@carbon/react'`
**Complexity:** medium — Chakra Menu is a generic dropdown menu; Carbon OverflowMenu is the equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isOpen | open (managed internally) | |
| onClose | no equivalent | |

**Structural changes:**
1. MenuButton → OverflowMenu trigger (custom via renderIcon)
2. MenuItem → OverflowMenuItem

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Link

**Carbon:** `Link` from `@carbon/react`
**Import:** `import { Link } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isExternal | no equivalent | |
| href | href | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Tag (with close)

**Carbon:** `Tag filter` from `@carbon/react`
**Import:** `import { Tag } from '@carbon/react'`
**Complexity:** low — Use Tag with filter prop for dismissible tags.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| onClose | onClose (when filter=true) | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Popover

**Carbon:** `Popover + PopoverContent` from `@carbon/react`
**Import:** `import { Popover, PopoverContent } from '@carbon/react'`
**Complexity:** medium — Similar API but Carbon Popover wraps the trigger.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| isOpen | open | |
| placement | align | |

**Structural changes:**
1. Wrap trigger in Popover
2. PopoverContent for panel content

**SCSS:**
```scss
@use '@carbon/react'
```

---
