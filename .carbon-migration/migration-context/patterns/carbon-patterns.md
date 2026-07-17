# Carbon UI Patterns

> Load this file ONLY when: (1) Phase 0 self-scan identifies a UI pattern match in the component scope, OR (2) Phase 2 migration reaches a component matched to a pattern. Do NOT load speculatively.

> **Carbon component names listed in this file are curated as a Carbon-pattern reference — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Pattern Index

| Pattern | ID | Detection Signals | Carbon Components |
|---------|-----|-------------------|-------------------|
| Global Header | global-header | Navbar, Header, NavigationBar | Header, HeaderContainer, HeaderName, HeaderNavigation, HeaderMenuItem, HeaderMenu, HeaderGlobalBar, HeaderGlobalAction, HeaderMenuButton, SkipToContent, SideNav, SideNavItems, SideNavLink |
| Forms | forms | Form, FormGroup, FormControl | Form, FormGroup, TextInput, PasswordInput, NumberInput, TextArea, Select, Dropdown, MultiSelect, ComboBox, Checkbox, RadioButton, RadioButtonGroup, Toggle, DatePicker, FileUploader, Button |
| Dialogs | dialogs | Modal, Dialog, Popup | Modal, ComposedModal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterButton |
| Notifications | notifications | Toast, Alert, Snackbar | ToastNotification, InlineNotification, ActionableNotification, NotificationActionButton |
| Loading | loading | Spinner, Loader, Skeleton | Loading, InlineLoading, SkeletonText, SkeletonPlaceholder, SkeletonIcon |
| Filtering | filtering | Filter, FilterPanel, SearchFilter | TableToolbar, TableToolbarSearch, TableToolbarContent, TableToolbarMenu, TableToolbarAction, MultiSelect, Dropdown, Search, Tag |
| Empty States | empty-states | EmptyState, NoData, NoResults | Tile, Heading, Button, IllustratedMessage |
| Search | search | SearchBar, SearchInput, SearchBox | Search, TableToolbarSearch |
| Login | login | LoginForm, SignIn, AuthForm | TextInput, PasswordInput, Button, Checkbox, InlineNotification, Link |
| Common Actions | common-actions | ActionBar, ActionButtons, CRUDButtons | Button, Modal, OverflowMenu, OverflowMenuItem |
| Disabled States | disabled-states | — | Button, TextInput, Select, Dropdown, Checkbox |
| Disclosures | disclosures | Accordion, Collapsible, Expandable | Accordion, AccordionItem, ExpandableTile, Popover, Toggletip |
| Read-only Inputs | read-only-inputs | ReadOnlyField, ViewField, DisplayField | TextInput, Select, Dropdown, TextArea |
| Text Toolbar | text-toolbar | RichTextEditor, TextEditor, Toolbar | OverflowMenu, Button, IconButton, Tooltip |

---

### Global Header

> Using UI Shell components for within-product and between-product navigation. Covers header zones, skip navigation, mobile responsiveness, and landmark regions.

**Detection signals:**
- Component signals: Navbar, Header, NavigationBar, AppBar, Toolbar, TopBar, TopNav, NavBar, SiteHeader, mat-toolbar, mat-sidenav, mat-sidenav-container
- Text signals: `<nav `, `role="navigation"`, `aria-label.*nav`, `navbar-brand`, `navbar-collapse`, `routerLink`, `routerLinkActive`

**Carbon components:** Header, HeaderContainer, HeaderName, HeaderNavigation, HeaderMenuItem, HeaderMenu, HeaderGlobalBar, HeaderGlobalAction, HeaderMenuButton, SkipToContent, SideNav, SideNavItems, SideNavLink

**Docs:** https://carbondesignsystem.com/patterns/global-header/

**Key principles:**
1. SkipToContent must be the first child of Header for keyboard accessibility
2. Use HeaderContainer render prop pattern to manage isSideNavExpanded state for mobile hamburger menus
3. Strict layout zones: brand and primary nav on the left; global actions (search, notifications, switcher) on the right in HeaderGlobalBar
4. Carbon Header is always fixed-top and uses the g100 (dark) theme by default
5. Give all navigation landmark regions a unique aria-label for assistive technology users
6. HeaderMenu supports one level of flyout sub-navigation via HeaderMenuItem children

---

### Forms

> A group of related input controls that allows users to provide data or configure options. Covers labels, helper text, validation, button placement, and input layout.

**Detection signals:**
- Component signals: Form, FormGroup, FormControl, FormField, TextField, Input, TextInput, Select, Checkbox, Radio, RadioGroup, Textarea, FormItem, FieldSet, LoginForm, SignUpForm, RegistrationForm, mat-form-field, mat-input, mat-select, mat-checkbox, mat-radio-group, mat-slide-toggle
- Text signals: `<form`, `onSubmit`, `handleSubmit`, `formik`, `react-hook-form`, `yup.object`, `zod.object`, `FormGroup(`, `FormControl(`, `FormBuilder`, `ReactiveFormsModule`, `formControlName=`, `[formGroup]`, `(ngSubmit)`, `Validators\\.`

**Carbon components:** Form, FormGroup, TextInput, PasswordInput, NumberInput, TextArea, Select, Dropdown, MultiSelect, ComboBox, Checkbox, RadioButton, RadioButtonGroup, Toggle, DatePicker, FileUploader, Button

**Docs:** https://carbondesignsystem.com/patterns/forms-pattern/

**Key principles:**
1. All inputs require visible labels — use labelText prop, not placeholder text as a label substitute
2. id prop is required on every Carbon input for accessibility label association
3. Use sentence-style capitalization for all label text (only first word capitalized)
4. Helper text is a first-class prop (helperText) — do not render it as a separate element
5. Validation errors are set via the invalid and invalidText props — display inline below the field
6. Primary submit button is always the rightmost button; secondary/cancel button is to its left
7. Use PasswordInput (not TextInput type=password) to provide the built-in visibility toggle

---

### Dialogs

> Prompted when the system needs input from the user or to give the user urgent information concerning their current workflow.

**Detection signals:**
- Component signals: Modal, Dialog, Popup, AlertDialog, Drawer, Sheet, Overlay, LightBox, ConfirmDialog, ConfirmationModal, mat-dialog, MatDialog, MatBottomSheet, cdk-overlay
- Text signals: `<dialog`, `role="dialog"`, `aria-modal`, `show={`, `isOpen`, `open={`, `onClose`, `onHide`, `MatDialog`, `dialog.open(`, `dialogRef`, `CdkDialog`

**Carbon components:** Modal, ComposedModal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterButton

**Docs:** https://carbondesignsystem.com/patterns/dialog-pattern/

**Key principles:**
1. Use Modal for transactional dialogs that require a user decision before continuing
2. Passive modals convey information; transactional modals collect data or confirm destructive actions
3. primaryButtonText and secondaryButtonText are props on Modal — do not compose footer buttons manually unless using ComposedModal
4. Use ComposedModal for full slot-based composition with complex body content
5. Danger actions (delete, remove) use the danger prop on Modal which styles the primary button red
6. Always set a descriptive modalHeading — it is the accessible dialog label

---

### Notifications

> An important method of communicating with users and providing feedback after system or user-initiated events.

**Detection signals:**
- Component signals: Toast, Alert, Snackbar, Notification, Banner, Toaster, FlashMessage, StatusMessage, FeedbackMessage, mat-snack-bar, MatSnackBar
- Text signals: `toast`, `snackbar`, `role="alert"`, `aria-live`, `aria-atomic`, `auto-dismiss`, `autoDismiss`, `MatSnackBar`, `snackBar.open(`

**Carbon components:** ToastNotification, InlineNotification, ActionableNotification, NotificationActionButton

**Docs:** https://carbondesignsystem.com/patterns/notification-pattern/

**Key principles:**
1. Use InlineNotification for persistent, in-context feedback that relates to a specific page region
2. Use ToastNotification for transient, non-blocking system events (auto-dismissed)
3. Set timeout on ToastNotification (3000–6000ms typical); omit for persistent toasts
4. kind prop controls severity: info, success, warning, error
5. Use ActionableNotification when the user needs to take action directly from the notification
6. Do not use role=alert on non-urgent notifications — prefer aria-live=polite

---

### Loading

> Used when information takes an extended amount of time to process and appear on screen.

**Detection signals:**
- Component signals: Spinner, Loader, Skeleton, Loading, CircularProgress, LinearProgress, ProgressIndicator, LoadingState, Shimmer, mat-progress-bar, mat-progress-spinner
- Text signals: `isLoading`, `isFetching`, `loading &&`, `loading ?`, `skeleton`, `shimmer`, `aria-busy`, `\\| async`

**Carbon components:** Loading, InlineLoading, SkeletonText, SkeletonPlaceholder, SkeletonIcon

**Docs:** https://carbondesignsystem.com/patterns/loading-pattern/

**Key principles:**
1. Use Loading (full-page overlay spinner) for blocking operations where the UI is unavailable
2. Use InlineLoading for inline async actions on buttons or within a form section
3. Use Skeleton components at page-load time to render placeholder shapes before data arrives — reduces perceived latency
4. Never block the entire UI for background operations; prefer InlineLoading
5. Set aria-label on Loading to provide accessible context for screen reader users

---

### Filtering

> The mechanism by which a user adds or removes data items from a displayed data set.

**Detection signals:**
- Component signals: Filter, FilterPanel, SearchFilter, DataFilter, FilterBar, FilterChip, FilterTag, ActiveFilter
- Text signals: `setFilter`, `filteredData`, `filterBy`, `activeFilters`, `clearFilters`, `TableToolbar`, `filterItems`

**Carbon components:** TableToolbar, TableToolbarSearch, TableToolbarContent, TableToolbarMenu, TableToolbarAction, MultiSelect, Dropdown, Search, Tag

**Docs:** https://carbondesignsystem.com/patterns/filtering/

**Key principles:**
1. Filtering belongs inside TableToolbar when paired with a DataTable
2. Use MultiSelect for multi-value filter dimensions; Dropdown for single-value
3. Display active filters as dismissible Tags below the toolbar so users see what is applied
4. Batch actions and filtering share TableToolbarContent — use TableBatchActions for row-level actions
5. Search within table data uses TableToolbarSearch, not the standalone Search component

---

### Empty States

> How to address moments in an app where there is no data to display to the user.

**Detection signals:**
- Component signals: EmptyState, NoData, NoResults, Placeholder, ZeroState, EmptyView, BlankSlate, NothingHere
- Text signals: `empty state`, `no data`, `no results`, `nothing here`, `.length === 0`, `items.length < 1`, `data === null`

**Carbon components:** Tile, Heading, Button, IllustratedMessage

**Docs:** https://carbondesignsystem.com/patterns/empty-states-pattern/

**Key principles:**
1. Always provide an action path to exit the empty state (e.g. Create, Upload, Invite, Refresh)
2. Canonical structure: icon/illustration + heading + body copy + CTA Button, composed inside a Tile
3. Differentiate between first-use empty (no data yet) and no-results empty (filter returned nothing)
4. For no-results states, offer a 'Clear filters' action that resets the filter to reveal existing data

---

### Search

> An intuitive method of discovery, offering users a way to explore a website or application using keywords.

**Detection signals:**
- Component signals: SearchBar, SearchInput, SearchBox, GlobalSearch, SearchField, QuickSearch
- Text signals: `searchQuery`, `onSearch`, `type="search"`, `input.*search`, `placeholder.*search`

**Carbon components:** Search, TableToolbarSearch

**Docs:** https://carbondesignsystem.com/patterns/search-pattern/

**Key principles:**
1. Use the standalone Search component for global or section-level keyword discovery
2. Use TableToolbarSearch for searching/filtering within a DataTable — it is scoped to table data
3. Search includes a built-in clear (×) button — do not add a custom clear icon
4. Search is always persistent (always-visible) — expandable search patterns require custom composition

---

### Login

> Allows a user to gain access to an application by entering their user ID and password.

**Detection signals:**
- Component signals: LoginForm, SignIn, AuthForm, LoginPage, SignInPage, LoginCard, AuthCard
- Text signals: `password`, `username.*login`, `email.*login`, `sign.*in`, `log.*in`, `type="password"`

**Carbon components:** TextInput, PasswordInput, Button, Checkbox, InlineNotification, Link

**Docs:** https://carbondesignsystem.com/patterns/login-pattern/

**Key principles:**
1. Use PasswordInput (not TextInput type=password) — provides built-in show/hide password toggle
2. Display authentication errors as InlineNotification above the form, not inline under individual fields
3. Remember me option uses Checkbox
4. Forgot password uses a Link placed below the PasswordInput field
5. Submit button uses kind=primary and should be full-width on mobile viewports

---

### Common Actions

> Frequently used actions that appear multiple times across different components and workflows (Save, Edit, Delete, Cancel, Add).

**Detection signals:**
- Component signals: ActionBar, ActionButtons, CRUDButtons, ToolbarActions, RowActions
- Text signals: `onSave`, `onDelete`, `onEdit`, `onCancel`, `handleDelete`, `handleSave`, `confirmDelete`

**Carbon components:** Button, Modal, OverflowMenu, OverflowMenuItem

**Docs:** https://carbondesignsystem.com/patterns/common-actions/

**Key principles:**
1. Delete actions always require a confirmation Modal with a danger-styled primary button
2. Primary action is the rightmost button in a button group; secondary/cancel is to its left
3. Destructive actions use kind=danger for high-emphasis or kind=danger-ghost for low-emphasis
4. Multiple row-level actions (3+) belong in an OverflowMenu to avoid toolbar clutter
5. Edit in place uses InlineEdit patterns; complex edits open a Modal or slide-in panel

---

### Disabled States

> Used to completely remove the interactive function of a component.

**Detection signals:**
- Component signals: —
- Text signals: `disabled={`, `isDisabled`, `aria-disabled`, `disabled &&`, `readOnly`

**Carbon components:** Button, TextInput, Select, Dropdown, Checkbox

**Docs:** https://carbondesignsystem.com/patterns/disabled-states/

**Key principles:**
1. Use the disabled prop directly on Carbon components — do not wrap in a disabled div
2. For inputs that should appear filled but not editable, prefer readOnly over disabled for accessibility
3. Tooltips on disabled buttons require a wrapper element since disabled buttons do not fire mouse events

---

### Disclosures

> Used to disclose additional content or information about part of a UI.

**Detection signals:**
- Component signals: Accordion, Collapsible, Expandable, ShowMore, ToggleSection, ExpandableTile, Details, Summary
- Text signals: `isExpanded`, `isOpen`, `expanded`, `<details`, `<summary`, `show more`, `show less`

**Carbon components:** Accordion, AccordionItem, ExpandableTile, Popover, Toggletip

**Docs:** https://carbondesignsystem.com/patterns/disclosures-pattern/

**Key principles:**
1. Use Accordion for multiple independent collapsible sections
2. Use ExpandableTile for disclosing additional detail below a card/tile surface
3. Use Popover for transient overlay disclosures triggered by a button or icon
4. Use Toggletip (not Tooltip) for interactive disclosed content — Tooltip is presentation-only

---

### Read-only Inputs

> Inputs for form components that users can review but not modify.

**Detection signals:**
- Component signals: ReadOnlyField, ViewField, DisplayField, StaticInput
- Text signals: `readOnly`, `readonly`, `read-only`, `view-only`, `non-editable`

**Carbon components:** TextInput, Select, Dropdown, TextArea

**Docs:** https://carbondesignsystem.com/patterns/read-only-states-pattern/

**Key principles:**
1. Use readOnly prop (not disabled) on Carbon inputs when the value should be visible but not editable
2. readOnly inputs are still focusable and copyable — important for user experience
3. readOnly is distinct from disabled: disabled removes the value from form submission; readOnly does not

---

### Text Toolbar

> A set of buttons and menus that allows users to edit and format text.

**Detection signals:**
- Component signals: RichTextEditor, TextEditor, Toolbar, FormatToolbar, EditorToolbar, WYSIWYG
- Text signals: `bold`, `italic`, `underline`, `text-formatting`, `richtext`, `wysiwyg`, `quill`, `slate`, `tiptap`, `draft-js`

**Carbon components:** OverflowMenu, Button, IconButton, Tooltip

**Docs:** https://carbondesignsystem.com/patterns/text-toolbar/

**Key principles:**
1. Carbon does not ship a rich text editor — compose using Carbon Button/IconButton for the toolbar
2. Group related formatting actions using an OverflowMenu when horizontal space is limited
3. Each toolbar action button requires a Tooltip for icon-only buttons

---
