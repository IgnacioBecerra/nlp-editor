# Bootstrap 5 → IBM Products Migration Map

> Source: bootstrap@5
> Target: ibm-products
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| Navbar | PageHeader | medium | mapped |
| Offcanvas | SidePanel | medium | mapped |
| Modal | CreateModal or Tearsheet | medium | mapped |
| Modal (multi-step wizard) | CreateTearsheet | high | mapped |
| Card | ProductiveCard or ExpressiveCard | medium | mapped |
| Alert (empty state) | EmptyState | medium | mapped |
| Table (data-heavy) | DataSpreadsheet | high | mapped |
| Badge (tag group) | TagSet | medium | mapped |
| Avatar (user) | UserAvatar | low | mapped |
| Error page (404, 403) | HTTPError404 or HTTPError403 or HTTPErrorOther | low | mapped |
| ButtonGroup (overflow) | ButtonSetWithOverflow | medium | mapped |
| Inline edit (custom) | InlineEdit | medium | mapped |
| Delete confirmation modal | DeleteWithConfirmation | low | mapped |

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

IBM Products (@carbon/ibm-products) is a superset of Carbon React v11. All @carbon/react components remain available.

---

### Navbar

**Carbon:** `PageHeader` from `@carbon/ibm-products`
**Import:** `import { PageHeader } from '@carbon/ibm-products'`
**Complexity:** medium — PageHeader is a composite component handling breadcrumb, title, subtitle, actions, and tags in one.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| brand | title | |
| expand | no equivalent | |
| fixed | no equivalent | |

**Structural changes:**
1. PageHeader handles breadcrumb, title, subtitle, page actions and tags
2. Use PageHeader actionBarItems for top-right actions
3. Use PageHeader breadcrumbs for nav breadcrumb

**Behavioral differences:**
1. PageHeader is sticky/scroll-aware by default
2. Breadcrumb collapses on scroll
3. Navigation menu items → use Carbon Header UIShell alongside PageHeader

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Offcanvas

**Carbon:** `SidePanel` from `@carbon/ibm-products`
**Import:** `import { SidePanel } from '@carbon/ibm-products'`
**Complexity:** medium — SidePanel is a slide-in panel with built-in header, body, footer, and action buttons.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| show | open | |
| onHide | onRequestClose | |
| placement | placement (left/right) | |

**Structural changes:**
1. Use open/onRequestClose props
2. Use title, subtitle for panel header
3. Use actions array for footer buttons
4. Body content goes in children

**Behavioral differences:**
1. SidePanel has built-in slide animation
2. Supports step-based navigation with currentStep/onNavigationBack

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Modal

**Carbon:** `CreateModal or Tearsheet` from `@carbon/ibm-products`
**Import:** `import { CreateModal, Tearsheet } from '@carbon/ibm-products'`
**Complexity:** medium — IBM Products offers specialized modal patterns.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| show | open | |
| onHide | onClose | |
| title | title | |
| size | size | |

**Structural changes:**
1. CreateModal: use for create/edit data entry flows
2. Tearsheet: use for wide, complex content modals
3. TearsheetNarrow: use for narrower flows
4. Use Carbon Modal from @carbon/react for simple confirmations

**Behavioral differences:**
1. CreateModal has built-in primaryButtonText/secondaryButtonText/primaryButtonDisabled props
2. Tearsheet supports multi-step via CreateTearsheet

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Modal (multi-step wizard)

**Carbon:** `CreateTearsheet` from `@carbon/ibm-products`
**Import:** `import { CreateTearsheet, CreateTearsheetStep } from '@carbon/ibm-products'`
**Complexity:** high — CreateTearsheet manages multi-step wizard flows with built-in next/back/cancel.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| show | open | |
| onHide | onClose | |

**Structural changes:**
1. Each wizard step is a CreateTearsheetStep component
2. Pass title, description, hasFieldset to each step
3. Use includeStep and disableSubmit for step control

**Behavioral differences:**
1. Built-in step management, back/next/submit buttons
2. Supports step validation before advancing

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Card

**Carbon:** `ProductiveCard or ExpressiveCard` from `@carbon/ibm-products`
**Import:** `import { ProductiveCard } from '@carbon/ibm-products'`
**Complexity:** medium — ProductiveCard and ExpressiveCard offer richer card patterns than Carbon Tile.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| border | no equivalent | |
| className | className | |

**Structural changes:**
1. ProductiveCard: use for data/action-focused cards (has action bar)
2. ExpressiveCard: use for marketing/editorial cards
3. title, caption, label, description props for card content
4. primaryButtonText, primaryButtonHref for primary action

**Behavioral differences:**
1. Built-in overflow menu, action bar, badge support

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Alert (empty state)

**Carbon:** `EmptyState` from `@carbon/ibm-products`
**Import:** `import { EmptyState, ErrorEmptyState, NoDataEmptyState, NoTagsEmptyState, NotFoundEmptyState, UnauthorizedEmptyState } from '@carbon/ibm-products'`
**Complexity:** medium — IBM Products provides semantic empty state components with built-in illustrations.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Use EmptyState for generic empty content areas
2. Use ErrorEmptyState for error states
3. Use NoDataEmptyState when no data to display
4. Use NotFoundEmptyState for 404-like scenarios
5. title, subtitle, action{text, onClick} props

**Behavioral differences:**
1. Built-in IBM-designed illustrations for each empty state type

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Table (data-heavy)

**Carbon:** `DataSpreadsheet` from `@carbon/ibm-products`
**Import:** `import { DataSpreadsheet } from '@carbon/ibm-products'`
**Complexity:** high — DataSpreadsheet supports spreadsheet-like interactions with many columns.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Pass columns and data arrays; use react-table under the hood

**Behavioral differences:**
1. Spreadsheet-style navigation, column resizing, cell editing

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Badge (tag group)

**Carbon:** `TagSet` from `@carbon/ibm-products`
**Import:** `import { TagSet } from '@carbon/ibm-products'`
**Complexity:** medium — TagSet handles overflow automatically — shows N tags and collapses the rest into a +N indicator.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Pass tags array with {type, label} objects
2. Set maxVisible to control overflow threshold

**Behavioral differences:**
1. Auto-overflow with popover for hidden tags

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Avatar (user)

**Carbon:** `UserAvatar` from `@carbon/ibm-products`
**Import:** `import { UserAvatar } from '@carbon/ibm-products'`
**Complexity:** low — Drop-in IBM user avatar with initials fallback.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| src | image | |
| alt | tooltipText | |
| name | name (for initials) | |

**Structural changes:**
(none)

**Behavioral differences:**
1. Shows initials when no image, tooltip with name

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Error page (404, 403)

**Carbon:** `HTTPError404 or HTTPError403 or HTTPErrorOther` from `@carbon/ibm-products`
**Import:** `import { HTTPError404, HTTPError403, HTTPErrorOther } from '@carbon/ibm-products'`
**Complexity:** low — Drop-in HTTP error pages with IBM design and copy.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Pass title, description, errorCodeLabel, links array

**Behavioral differences:**
1. Includes IBM-designed illustration for each error type

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### ButtonGroup (overflow)

**Carbon:** `ButtonSetWithOverflow` from `@carbon/ibm-products`
**Import:** `import { ButtonSetWithOverflow } from '@carbon/ibm-products'`
**Complexity:** medium — Collapses buttons into overflow menu when space is constrained.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Pass buttons array with {label, onClick, kind} objects

**Behavioral differences:**
1. Responsive: collapses to OverflowMenu on narrow widths

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Inline edit (custom)

**Carbon:** `InlineEdit` from `@carbon/ibm-products`
**Import:** `import { InlineEdit } from '@carbon/ibm-products'`
**Complexity:** medium — Click-to-edit inline text field with confirm/cancel.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. value, onSave, onCancel props

**Behavioral differences:**
1. Shows static text until clicked; shows TextInput on focus with save/cancel actions

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Delete confirmation modal

**Carbon:** `DeleteWithConfirmation` from `@carbon/ibm-products`
**Import:** `import { DeleteWithConfirmation } from '@carbon/ibm-products'`
**Complexity:** low — Specialized destructive action confirmation modal.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Pass resourceName, bodyText, onDelete, open, onClose props

**Behavioral differences:**
1. Requires user to type resource name to confirm deletion

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---
