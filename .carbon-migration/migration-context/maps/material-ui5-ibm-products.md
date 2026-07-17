# @mui/material@5 → IBM Products Migration Map

> Source: @mui/material@5
> Target: ibm-products
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| DataGrid | DataSpreadsheet | high | mapped |
| Dialog (destructive) | DeleteWithConfirmation | low | mapped |
| Stepper (in modal) | CreateTearsheet | high | mapped |
| Drawer | SidePanel | medium | mapped |
| Card | ProductiveCard | medium | mapped |
| AppBar | PageHeader | medium | mapped |
| Chip group | TagSet | medium | mapped |
| Avatar | UserAvatar | low | mapped |
| Dialog (complex content) | Tearsheet | medium | mapped |
| Snackbar (persistent) | ToastNotification | low | mapped |
| Alert (page-level) | InlineNotification | low | mapped |
| LinearProgress | ProgressBar | low | mapped |
| CircularProgress | Loading | low | mapped |

---

## Installation

```
npm install @carbon/react @carbon/ibm-products @carbon/icons-react sass
```

**SCSS:**
```scss
@use '@carbon/react';
@use '@carbon/ibm-products/css/index';
```

Carbon React v11 components remain available for standard components. This map covers IBM Products-specific equivalents for complex MUI patterns.

---

### DataGrid

**Carbon:** `DataSpreadsheet` from `@carbon/ibm-products`
**Import:** `import { DataSpreadsheet } from '@carbon/ibm-products'`
**Complexity:** high — DataSpreadsheet provides spreadsheet-like interactions.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| rows | data | |
| columns | columns | |
| onRowClick | no equivalent | |

**Structural changes:**
1. Pass columns (react-table format) and data arrays
2. Row selection, sorting, filtering handled by DataSpreadsheet

**Behavioral differences:**
1. DataSpreadsheet is for spreadsheet-style editing; use DataTable for read-heavy tables

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Dialog (destructive)

**Carbon:** `DeleteWithConfirmation` from `@carbon/ibm-products`
**Import:** `import { DeleteWithConfirmation } from '@carbon/ibm-products'`
**Complexity:** low — Drop-in destructive confirmation modal.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| onClose | onClose | |
| title | title | |

**Structural changes:**
1. resourceName, bodyText, onDelete, open, onClose props

**Behavioral differences:**
1. User must type resource name to confirm; built-in IBM copy patterns

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Stepper (in modal)

**Carbon:** `CreateTearsheet` from `@carbon/ibm-products`
**Import:** `import { CreateTearsheet, CreateTearsheetStep } from '@carbon/ibm-products'`
**Complexity:** high — CreateTearsheet replaces multi-step Dialog+Stepper patterns with a managed flow.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| activeStep | currentStep (managed internally) | |
| steps | CreateTearsheetStep children | |

**Structural changes:**
1. Each MUI step becomes a CreateTearsheetStep
2. Step validation via disableSubmit prop

**Behavioral differences:**
1. Built-in back/next/submit/cancel; breadcrumb step indicator

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Drawer

**Carbon:** `SidePanel` from `@carbon/ibm-products`
**Import:** `import { SidePanel } from '@carbon/ibm-products'`
**Complexity:** medium — SidePanel is purpose-built for enterprise side panels with header/body/footer/actions.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| onClose | onRequestClose | |
| anchor | placement (left/right) | |
| PaperProps | no equivalent | |

**Structural changes:**
1. title, subtitle for header
2. actions array for footer buttons
3. open/onRequestClose for state

**Behavioral differences:**
1. SidePanel has built-in slide animation and overlay
2. Supports currentStep for multi-step panels

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Card

**Carbon:** `ProductiveCard` from `@carbon/ibm-products`
**Import:** `import { ProductiveCard } from '@carbon/ibm-products'`
**Complexity:** medium — ProductiveCard and ExpressiveCard provide richer patterns than MUI Card.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| elevation | no equivalent | |
| variant | no equivalent | |

**Structural changes:**
1. title, label, caption for header
2. primaryButtonText for action
3. Use ExpressiveCard for editorial content

**Behavioral differences:**
1. Built-in overflow menu, action bar, status indicator support

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### AppBar

**Carbon:** `PageHeader` from `@carbon/ibm-products`
**Import:** `import { PageHeader } from '@carbon/ibm-products'`
**Complexity:** medium — PageHeader is a full-featured page-level header with breadcrumb, title, actions, and tags.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| position | no equivalent | |
| color | no equivalent | |
| elevation | no equivalent | |

**Structural changes:**
1. title, breadcrumbs, actionBarItems, tags, subtitle props
2. Sticky and scroll-collapse behavior built-in

**Behavioral differences:**
1. PageHeader collapses on scroll; handles breadcrumb overflow automatically

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Chip group

**Carbon:** `TagSet` from `@carbon/ibm-products`
**Import:** `import { TagSet } from '@carbon/ibm-products'`
**Complexity:** medium — TagSet handles overflow automatically for groups of tags.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. tags array with {type, label} objects
2. maxVisible for overflow threshold

**Behavioral differences:**
1. Collapses overflow tags into a +N popover

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Avatar

**Carbon:** `UserAvatar` from `@carbon/ibm-products`
**Import:** `import { UserAvatar } from '@carbon/ibm-products'`
**Complexity:** low — Drop-in IBM user avatar.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| src | image | |
| alt | tooltipText | |
| children | no equivalent | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Shows initials from name prop when no image provided

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Dialog (complex content)

**Carbon:** `Tearsheet` from `@carbon/ibm-products`
**Import:** `import { Tearsheet } from '@carbon/ibm-products'`
**Complexity:** medium — Tearsheet is a wide, complex-content modal with title/description/actions.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| onClose | onClose | |
| maxWidth | no equivalent | |

**Structural changes:**
1. title, description, label for header
2. actions array for footer
3. influencer area for left sidebar

**Behavioral differences:**
1. Wide format; supports influencer (left sidebar) for navigation
2. Has built-in header with breadcrumb support

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Snackbar (persistent)

**Carbon:** `ToastNotification` from `@carbon/react`
**Import:** `import { ToastNotification } from '@carbon/react'`
**Complexity:** low — ToastNotification is the direct Carbon equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| message | subtitle | |
| severity | kind (info/success/warning/error) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. ToastNotification has built-in close button and timeout

**SCSS:**
```scss
@use '@carbon/react'
```

---

### Alert (page-level)

**Carbon:** `InlineNotification` from `@carbon/react`
**Import:** `import { InlineNotification } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| severity | kind | |
| title | title | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### LinearProgress

**Carbon:** `ProgressBar` from `@carbon/react`
**Import:** `import { ProgressBar } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| variant | status (active/finished/error) | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---

### CircularProgress

**Carbon:** `Loading` from `@carbon/react`
**Import:** `import { Loading } from '@carbon/react'`
**Complexity:** low — Direct equivalent.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| size | small (boolean for small variant) | |

**Structural changes:**
(none)

**SCSS:**
```scss
@use '@carbon/react'
```

---
