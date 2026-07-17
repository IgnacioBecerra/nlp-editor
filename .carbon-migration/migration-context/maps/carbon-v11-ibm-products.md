# Carbon React v11 → IBM Products Migration Map

> Source: carbon-react-v11
> Target: ibm-products
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


> **2026-06 verification + source-package keying (consumed by carbon-v10-to-v11.md §1.4 "Re-export dead-ends").** This map is the **successor lookup** the v10→v11 re-export-dead-end rule consults, keyed by the source package whose names were dropped. Two MANDATORY caveats before code-gen:
> - **Verify each target name AND its feature-flag/canary status** via `carbon-builder` / Carbon MCP. Some `@carbon/ibm-products` components are canary and need enablement (`pkg.component.<Name> = true`) or they render nothing. Rows tagged `⚠️ verify` below were not confirmable as top-level named exports at review time — confirm, or downgrade that name to a render-safe stub (Bucket C).
> - **`HTTPError404 / HTTPError403 / HTTPErrorOther` are DEPRECATED** in `@carbon/ibm-products` (removal-bound). Use **`FullPageError`** instead — targeting a deprecated export merely re-creates a future re-export dead-end.
>
> **CD/AI (`@carbon/ibm-cloud-cognitive-cdai`) `Ide*` → v11 lookup** (worked example of §1.4 Bucket A/B; verify each before code-gen): `IdeButton`→`Button` (core), `IdeDataTable`→`DataTable` (core), `IdeSideNavLink`→`SideNavLink` (core), `IdeSideNavMenu`→`SideNavMenu` (core), `IdeNavigation`→`SideNav` (core — wrap if the original was a data-driven composite), `IdeEmptyState`→`EmptyState`, `IdeHTTPErrors`→`FullPageError`, `IdeSlideOverPanel`→`SidePanel`/`Tearsheet`, `IdePageHeader`→`PageHeader`, `IdeCreate`→`CreateTearsheet`, `IdeCard`→`ProductiveCard`/`ExpressiveCard`, `IdeAPIKeyGeneration`→`APIKeyModal`. No 1:1 successor → Bucket C render-safe stub: `IdeHome`, `IdeImporting`, `IdeAutoSave`, `IdeManualSave`, `IdeRemove`, `IdePageContent`, and `IdeCreateStep` (verify whether a `CreateTearsheet` child-step export exists before importing it separately).

## Quick Reference

| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| Custom page header (Header + Breadcrumb + title) | PageHeader | medium | mapped |
| Custom side panel (SideNav used as drawer) | SidePanel | medium | mapped |
| Modal (data entry create flow) | CreateModal | medium | mapped |
| Multi-step Modal (custom Stepper + Modal) | CreateTearsheet | high | mapped |
| Full-page wizard | CreateFullPage | high | mapped |
| Large content Modal | Tearsheet | medium | mapped |
| Custom Card pattern (Tile + custom actions) | ProductiveCard or ExpressiveCard | medium | mapped |
| Custom empty state | EmptyState | low | mapped |
| Custom tag overflow | TagSet | low | mapped |
| Inline editing | InlineEdit | medium | ⚠️ verify export |
| Custom user avatar | UserAvatar | low | mapped |
| HTTP error pages | FullPageError (NOT the deprecated HTTPError404/403/Other) | low | mapped |
| Delete confirmation | DeleteWithConfirmation | low | ⚠️ verify export |
| Status icon | StatusIcon | low | mapped |

---

## Installation

```
npm install @carbon/ibm-products
```

**SCSS addition:**
```scss
@use '@carbon/react';
@use '@carbon/ibm-products/css/index';
```

Do NOT remove `@carbon/react` — IBM Products re-exports all Carbon components. Add `@carbon/ibm-products` alongside it.

---

### Custom page header (Header + Breadcrumb + title)

**Carbon:** `PageHeader` from `@carbon/ibm-products`
**Import:** `import { PageHeader } from '@carbon/ibm-products'`
**Complexity:** medium — PageHeader manages breadcrumb, title, subtitle, actionBarItems, and tags with responsive scroll behaviour.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Remove manual Breadcrumb + Header composition
2. Pass breadcrumbs array, title, subtitle to PageHeader
3. Pass actionBarItems for toolbar actions (replaces custom Header actions)

**Behavioral differences:**
1. Sticky header collapses breadcrumb on scroll
2. Auto-wraps long titles
3. Handles responsive overflow of action items

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Custom side panel (SideNav used as drawer)

**Carbon:** `SidePanel` from `@carbon/ibm-products`
**Import:** `import { SidePanel } from '@carbon/ibm-products'`
**Complexity:** medium — SidePanel provides a managed slide-in panel with header, body, footer, and action buttons.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Replace custom SideNav-as-panel with SidePanel
2. title, subtitle for header
3. actions[] for footer action buttons
4. open/onRequestClose for state management

**Behavioral differences:**
1. Overlay and focus trap built-in
2. Slide animation built-in
3. Multi-step support via currentStep/onNavigationBack

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Modal (data entry create flow)

**Carbon:** `CreateModal` from `@carbon/ibm-products`
**Import:** `import { CreateModal } from '@carbon/ibm-products'`
**Complexity:** medium — CreateModal enforces IBM create-flow patterns with built-in submit/cancel buttons and loading state.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. title, description, primaryButtonText, secondaryButtonText props
2. onRequestClose, onRequestSubmit handlers
3. disableSubmit for form validation

**Behavioral differences:**
1. Built-in create-flow UX; primary button shows inline loading on submit

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Multi-step Modal (custom Stepper + Modal)

**Carbon:** `CreateTearsheet` from `@carbon/ibm-products`
**Import:** `import { CreateTearsheet, CreateTearsheetStep } from '@carbon/ibm-products'`
**Complexity:** high — Replaces Modal + ProgressIndicator + custom step management with a managed wizard.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Wrap each step's content in a CreateTearsheetStep
2. Pass title, description, hasFieldset to each step
3. Validation per step via disableSubmit

**Behavioral differences:**
1. Back/Next/Submit/Cancel built-in
2. Step breadcrumb indicator built-in

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Full-page wizard

**Carbon:** `CreateFullPage` from `@carbon/ibm-products`
**Import:** `import { CreateFullPage, CreateFullPageStep } from '@carbon/ibm-products'`
**Complexity:** high — Full-page creation flow with left-side step navigation.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. Each step is a CreateFullPageStep
2. Left panel shows step navigation

**Behavioral differences:**
1. Full viewport; step navigation on left; confirmation step built-in

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Large content Modal

**Carbon:** `Tearsheet` from `@carbon/ibm-products`
**Import:** `import { Tearsheet } from '@carbon/ibm-products'`
**Complexity:** medium — Wide tearsheet for complex content that doesn't fit a standard Modal.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| onClose | onClose | |

**Structural changes:**
1. title, description, label for header
2. actions[] for footer
3. influencer slot for left sidebar

**Behavioral differences:**
1. Wide format (default half-viewport)
2. Influencer left sidebar for navigation or context

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Custom Card pattern (Tile + custom actions)

**Carbon:** `ProductiveCard or ExpressiveCard` from `@carbon/ibm-products`
**Import:** `import { ProductiveCard, ExpressiveCard } from '@carbon/ibm-products'`
**Complexity:** medium — IBM Products cards provide richer patterns than Carbon Tile.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. title, label, caption for header section
2. primaryButtonText/onClick for primary action
3. overflowActions for kebab menu

**Behavioral differences:**
1. Built-in overflow menu, action bar, badge, and clickable-card variants

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Custom empty state

**Carbon:** `EmptyState` from `@carbon/ibm-products`
**Import:** `import { EmptyState, ErrorEmptyState, NoDataEmptyState, NoTagsEmptyState, NotFoundEmptyState, UnauthorizedEmptyState } from '@carbon/ibm-products'`
**Complexity:** low — Drop-in semantic empty states replace custom illustration+text patterns.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. title, subtitle, action{text, onClick} props
2. Pick the semantic variant matching the context

**Behavioral differences:**
1. Built-in IBM-designed illustrations

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Custom tag overflow

**Carbon:** `TagSet` from `@carbon/ibm-products`
**Import:** `import { TagSet } from '@carbon/ibm-products'`
**Complexity:** low — Auto-overflow tag list.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. tags array with {type, label}
2. maxVisible for overflow threshold

**Behavioral differences:**
1. Hidden tags shown in popover on +N click

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Inline editing

**Carbon:** `InlineEdit` from `@carbon/ibm-products`
**Import:** `import { InlineEdit } from '@carbon/ibm-products'`
**Complexity:** medium — Click-to-edit with save/cancel actions built-in.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. value, onSave, onCancel, labelText props

**Behavioral differences:**
1. Displays static text until clicked; becomes TextInput with save/cancel

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Custom user avatar

**Carbon:** `UserAvatar` from `@carbon/ibm-products`
**Import:** `import { UserAvatar } from '@carbon/ibm-products'`
**Complexity:** low — Drop-in IBM user avatar with initials fallback.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**Behavioral differences:**
1. Initials from name when no image
2. Tooltip with name

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### HTTP error pages

**Carbon:** `FullPageError` from `@carbon/ibm-products`
**Import:** `import { FullPageError } from '@carbon/ibm-products'`
**Complexity:** low — Drop-in IBM full-page error.
**Status:** mapped — ⚠️ `HTTPError404 / HTTPError403 / HTTPErrorOther` are DEPRECATED/removal-bound in `@carbon/ibm-products`; use `FullPageError` (pass the error kind/status via its props). Verify props via `carbon-builder`.

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**Behavioral differences:**
1. IBM-designed illustrations
2. Links array for navigation options

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Delete confirmation

**Carbon:** `DeleteWithConfirmation` from `@carbon/ibm-products`
**Import:** `import { DeleteWithConfirmation } from '@carbon/ibm-products'`
**Complexity:** low — Specialized destructive confirmation modal.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
(none)

**Behavioral differences:**
1. User must type resource name; enforces IBM delete patterns

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---

### Status icon

**Carbon:** `StatusIcon` from `@carbon/ibm-products`
**Import:** `import { StatusIcon } from '@carbon/ibm-products'`
**Complexity:** low — Semantic status icons with built-in accessibility.
**Status:** mapped

**Prop map:**

| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|

**Structural changes:**
1. kind (fatal/critical/major/minor/warning/info/normal/success), size, description props

**Behavioral differences:**
1. Includes accessible description label

**SCSS:**
```scss
@use '@carbon/react'
@use '@carbon/ibm-products/css/index'
```

---
