# Material UI 5 → Carbon React v11 Migration Map

> Source: @mui/material@5
> Target: @carbon/react v11
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference
| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| TextField | TextInput / TextArea / NumberInput / PasswordInput | medium | mapped |
| Select | Dropdown / Select | medium | mapped |
| MenuItem | SelectItem | low | mapped |
| Autocomplete | ComboBox / MultiSelect | medium | partial |
| Checkbox | Checkbox | low | mapped |
| FormControlLabel | — | low | mapped |
| Radio | RadioButton | low | mapped |
| RadioGroup | RadioButtonGroup | low | mapped |
| Switch | Toggle | low | mapped |
| Slider | Slider | low | partial |
| DatePicker | DatePicker | medium | mapped |
| TimePicker | TimePicker | medium | partial |
| DateTimePicker | — | high | custom_required |
| Button | Button | low | mapped |
| IconButton | Button | low | mapped |
| ButtonGroup | ButtonSet | low | mapped |
| Fab | — | high | custom_required |
| LoadingButton | Button + InlineLoading | medium | partial |
| Grid | Grid | medium | mapped |
| Container | Grid | low | mapped |
| Box | — | medium | custom_required |
| Stack | — | low | custom_required |
| Divider | — | low | custom_required |
| Hidden | — | low | custom_required |
| AppBar | Header | high | mapped |
| Toolbar | HeaderNavigation / HeaderGlobalBar | medium | partial |
| Drawer | SideNav | high | partial |
| BottomNavigation | — | high | unsupported |
| Breadcrumbs | Breadcrumb | low | mapped |
| Link | Link | low | mapped |
| Menu | OverflowMenu | medium | partial |
| MobileStepper | — | high | custom_required |
| Pagination | Pagination | medium | mapped |
| SpeedDial | — | high | unsupported |
| Stepper | ProgressIndicator | medium | partial |
| Step | ProgressStep | low | partial |
| Tabs | Tabs | medium | mapped |
| Tab | Tab | low | mapped |
| Accordion | Accordion | low | mapped |
| AccordionSummary | — | low | mapped |
| AccordionDetails | — | low | mapped |
| Card | Tile | medium | partial |
| CardContent | — | low | mapped |
| CardActions | — | low | custom_required |
| CardHeader | — | low | custom_required |
| CardMedia | — | low | custom_required |
| Paper | Layer / Tile | medium | partial |
| Alert | InlineNotification | medium | mapped |
| AlertTitle | — | low | mapped |
| Backdrop | — | medium | custom_required |
| CircularProgress | Loading | low | mapped |
| Dialog | Modal | medium | mapped |
| DialogTitle | — | low | mapped |
| DialogContent | ModalBody | low | mapped |
| DialogActions | ModalFooter | low | mapped |
| LinearProgress | ProgressBar | low | mapped |
| Skeleton | SkeletonText / SkeletonPlaceholder | medium | mapped |
| Snackbar | ToastNotification | medium | mapped |
| SnackbarContent | — | low | mapped |
| Tooltip | Tooltip | medium | mapped |
| Avatar | — | medium | custom_required |
| Badge | Tag | low | partial |
| Chip | Tag / OperationalTag | low | mapped |
| Icon | @carbon/icons-react | medium | partial |
| List | StructuredList | medium | partial |
| ListItem | StructuredListRow | low | partial |
| ListItemText | StructuredListCell | low | partial |
| ListItemIcon | — | low | custom_required |
| Table | DataTable | high | mapped |
| TableHead | TableHead | low | mapped |
| TableBody | TableBody | low | mapped |
| TableRow | TableRow | low | mapped |
| TableCell | TableCell | low | mapped |
| TableFooter | — | low | custom_required |
| DataGrid | DataTable | high | partial |
| Typography | — | medium | custom_required |
| ClickAwayListener | — | medium | custom_required |
| Modal | Modal | low | mapped |
| Popover | Popover | medium | partial |
| Popper | — | high | custom_required |

---

### TextField
**Carbon:** `TextInput` from `@carbon/react`
**Import:** `import { TextInput, TextArea, NumberInput, PasswordInput } from '@carbon/react'`
**Complexity:** medium — MUI TextField is a single component covering many input variants. Carbon has separate components per input type.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| label | labelText | |
| value | value | |
| defaultValue | defaultValue | |
| onChange | onChange | |
| placeholder | placeholder | |
| disabled | disabled | |
| error | invalid | |
| helperText | invalidText / helperText | when invalid use invalidText; otherwise helperText |
| required | — | no direct prop; add to labelText manually |
| fullWidth | — | Carbon inputs are full-width by default |
| size | size | sm/md/lg |
| multiline | — | use TextArea component instead |
| rows | rows | on TextArea |
| type | — | determines which Carbon component to use |
| variant | — | no equivalent |
| InputProps | — | no equivalent |
| InputLabelProps | — | no equivalent |
| FormHelperTextProps | — | no equivalent |
| sx | — | no equivalent |
| id | id | |

**Structural changes:**
1. `type='text'` (default) → TextInput with `labelText` prop
2. `type='number'` → NumberInput; `type='password'` → PasswordInput
3. `multiline` → TextArea; error state: `error` + `helperText` → `invalid={true}` + `invalidText`

**Behavioral differences:**
1. Carbon labels are always above the input (no floating label, standard, or outlined variants)
2. Carbon inputs are full-width by default; control width via container/grid

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Select
**Carbon:** `Dropdown` from `@carbon/react`
**Import:** `import { Dropdown, Select, SelectItem } from '@carbon/react'`
**Complexity:** medium — MUI Select is a controlled form element. Carbon offers Dropdown (custom styled) or Select (native HTML select).
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | selectedItem (Dropdown) or value (Select) | |
| defaultValue | initialSelectedItem (Dropdown) or defaultValue (Select) | |
| onChange | onChange | Dropdown receives {selectedItem}; Select receives event |
| label | label (Dropdown placeholder) or labelText (Select) | |
| disabled | disabled | |
| error | invalid | |
| multiple | — | use MultiSelect component instead |
| displayEmpty | label | shows when no item selected |
| size | size | sm/md/lg |
| variant | — | no equivalent |
| renderValue | itemToString | custom item rendering |
| sx | — | no equivalent |
| MenuProps | — | no equivalent |
| native | — | use Carbon Select component |

**Structural changes:**
1. For custom-styled dropdown: use Carbon Dropdown with `items` array
2. For native HTML select: use Carbon Select with SelectItem children
3. Carbon Dropdown `onChange` returns `{selectedItem}` object

**Behavioral differences:**
1. Carbon Dropdown is not a form element; use Select for forms with native behavior
2. MultiSelect handles multiple selections; ComboBox handles searchable/filterable dropdown

**SCSS:**
```scss
@use '@carbon/react';
```
---

### MenuItem
**Carbon:** `SelectItem` from `@carbon/react`
**Import:** `import { SelectItem } from '@carbon/react'`
**Complexity:** low — For native Select: SelectItem is the direct equivalent. For Dropdown: items are passed as an array, not as components.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value (SelectItem) or id (Dropdown items array) | |
| disabled | disabled | |
| children | text prop (SelectItem) or text field (Dropdown items array) | |
| dense | — | no equivalent |
| divider | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. For Carbon Select: replace `<MenuItem value='x'>Label</MenuItem>` with `<SelectItem value='x' text='Label' />`
2. For Carbon Dropdown: remove MenuItem and pass `items={[{id: 'x', text: 'Label'}]}` to Dropdown
3. For OverflowMenu: use OverflowMenuItem with `itemText` prop

**Behavioral differences:**
1. Carbon Dropdown items are data-driven (array), not component-based
2. No divider or icon support in Dropdown items without customization

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Autocomplete
**Carbon:** `ComboBox` from `@carbon/react`
**Import:** `import { ComboBox, MultiSelect } from '@carbon/react'`
**Complexity:** medium — MUI Autocomplete is feature-rich. Carbon ComboBox covers single filterable selection.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| options | items | |
| value | selectedItem | |
| defaultValue | initialSelectedItem | |
| onChange | onChange | receives {selectedItem} |
| inputValue | — | ComboBox manages internal input state |
| multiple | — | use MultiSelect instead |
| freeSolo | — | no equivalent; ComboBox only allows items list |
| getOptionLabel | itemToString | |
| filterOptions | downshiftProps | for custom filtering |
| loading | — | use InlineLoading alongside |
| disabled | disabled | |
| placeholder | placeholder | |
| label | titleText | |
| sx | — | no equivalent |
| renderInput | — | no equivalent |
| renderOption | — | no equivalent |

**Structural changes:**
1. Single selection: use ComboBox with items array and onChange handler
2. Multiple selection: use MultiSelect with `filterable` prop
3. `onChange` receives `{selectedItem}` (not the event)

**Behavioral differences:**
1. Carbon ComboBox does not support free-form text entry (freeSolo)
2. FilterableMultiSelect is the filterable multi-selection variant

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Checkbox
**Carbon:** `Checkbox` from `@carbon/react`
**Import:** `import { Checkbox } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Carbon Checkbox includes its own label.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | checked | |
| defaultChecked | defaultChecked | |
| onChange | onChange | |
| disabled | disabled | |
| indeterminate | indeterminate | |
| color | — | no equivalent |
| size | — | no size prop on Carbon Checkbox |
| icon | — | no equivalent |
| checkedIcon | — | no equivalent |
| sx | — | no equivalent |
| id | id | |

**Structural changes:**
1. Replace `<Checkbox checked={...} onChange={...}>` with `<Checkbox id='...' labelText='...' checked={...} onChange={...} />`
2. No separate FormControlLabel needed — `labelText` is a prop on Checkbox

**Behavioral differences:**
1. Carbon Checkbox requires `id` and `labelText` props
2. No color customization; Carbon Checkbox uses the theme's interactive color

**SCSS:**
```scss
@use '@carbon/react';
```
---

### FormControlLabel
**Carbon:** — (not needed)
**Import:** —
**Complexity:** low — Not needed in Carbon. Carbon form controls include their own label via labelText prop.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| label | labelText | on the control component |
| control | — | the Carbon component itself |
| labelPlacement | — | no equivalent |
| disabled | disabled | on the control component |

**Structural changes:**
1. Remove FormControlLabel wrapper
2. Pass label text via `labelText` prop on the Carbon form control component
3. Example: `<Checkbox labelText='Accept terms' id='terms' checked={...} />`

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Radio
**Carbon:** `RadioButton` from `@carbon/react`
**Import:** `import { RadioButton, RadioButtonGroup } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Must be used inside RadioButtonGroup.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | — | managed by parent RadioButtonGroup |
| value | value | |
| disabled | disabled | |
| color | — | no equivalent |
| size | — | no equivalent |
| icon | — | no equivalent |
| sx | — | no equivalent |
| id | id | |

**Structural changes:**
1. Replace standalone `<Radio>` with `<RadioButton id='...' labelText='...' value='...'>` inside `<RadioButtonGroup>`

**Behavioral differences:**
1. Carbon RadioButton must be a direct child of RadioButtonGroup
2. RadioButtonGroup manages selection state and keyboard navigation

**SCSS:**
```scss
@use '@carbon/react';
```
---

### RadioGroup
**Carbon:** `RadioButtonGroup` from `@carbon/react`
**Import:** `import { RadioButtonGroup, RadioButton } from '@carbon/react'`
**Complexity:** low — Direct equivalent with minor prop renaming.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | valueSelected | |
| defaultValue | defaultSelected | |
| onChange | onChange | |
| name | name | |
| row | orientation | 'horizontal'; default is vertical |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<RadioGroup value={...} onChange={...}>` with `<RadioButtonGroup name='...' valueSelected={...} onChange={...} legendText='...'>`

**Behavioral differences:**
1. Carbon RadioButtonGroup requires `legendText` for accessibility
2. `orientation` prop: 'horizontal' or 'vertical' (default)

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Switch
**Carbon:** `Toggle` from `@carbon/react`
**Import:** `import { Toggle } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Carbon Toggle is the on/off switch component.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | toggled | |
| defaultChecked | defaultToggled | |
| onChange | onToggle | |
| disabled | disabled | |
| size | size | sm/md |
| color | — | no equivalent |
| edge | — | no equivalent |
| inputProps | — | no equivalent |
| sx | — | no equivalent |
| id | id | |

**Structural changes:**
1. Replace `<Switch checked={...} onChange={...}>` with `<Toggle id='...' labelText='...' toggled={...} onToggle={...}>`

**Behavioral differences:**
1. Carbon Toggle requires `id` and `labelText` props
2. `onToggle` receives the new boolean value directly (not an event object)

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Slider
**Carbon:** `Slider` from `@carbon/react`
**Import:** `import { Slider } from '@carbon/react'`
**Complexity:** low — Direct equivalent with minor prop differences.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| defaultValue | value | manage with state |
| onChange | onChange | |
| min | min | |
| max | max | |
| step | step | |
| disabled | disabled | |
| marks | — | no direct equivalent |
| track | — | no equivalent |
| orientation | — | no vertical Slider in Carbon |
| valueLabelDisplay | — | no equivalent |
| getAriaLabel | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Slider value={...} onChange={...} min={0} max={100}>` with `<Slider labelText='...' value={...} onChange={...} min={0} max={100}>`

**Behavioral differences:**
1. Carbon Slider always shows a numeric input alongside the slider track
2. Carbon Slider does not support vertical orientation or range (two-thumb) selection

**SCSS:**
```scss
@use '@carbon/react';
```
---

### DatePicker
**Carbon:** `DatePicker` from `@carbon/react`
**Import:** `import { DatePicker, DatePickerInput } from '@carbon/react'`
**Complexity:** medium — MUI DatePicker requires @mui/x-date-pickers and a date library adapter. Carbon DatePicker uses Flatpickr internally.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | controls Flatpickr |
| onChange | onChange | |
| minDate | minDate | Flatpickr date string or Date object |
| maxDate | maxDate | |
| disabled | disabled | on DatePickerInput |
| format | dateFormat | Flatpickr format string |
| label | labelText | on DatePickerInput |
| views | — | no equivalent |
| openTo | — | no equivalent |
| renderInput | — | use DatePickerInput child component |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<DatePicker value={...} onChange={...} renderInput={(params) => <TextField {...params} />}>` with `<DatePicker onChange={...}><DatePickerInput id='...' labelText='...' placeholder='mm/dd/yyyy' /></DatePicker>`
2. DatePickerInput must be a child of DatePicker
3. For date ranges: use `datePickerType='range'` and two DatePickerInput children

**Behavioral differences:**
1. Carbon DatePicker is powered by Flatpickr and opens a calendar popup
2. Carbon DatePicker does not support month or year-only views

**SCSS:**
```scss
@use '@carbon/react';
```
---

### TimePicker
**Carbon:** `TimePicker` from `@carbon/react`
**Import:** `import { TimePicker, TimePickerSelect } from '@carbon/react'`
**Complexity:** medium — Carbon TimePicker is a text input with AM/PM select. It does not have a clock popup UI like MUI.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| onChange | onChange | |
| ampm | — | use TimePickerSelect child for AM/PM |
| label | labelText | |
| disabled | disabled | |
| sx | — | no equivalent |
| renderInput | — | no equivalent |

**Structural changes:**
1. Replace `<TimePicker value={...} onChange={...}>` with `<TimePicker id='...' labelText='...' value={...} onChange={...}>`
2. Add `<TimePickerSelect id='...'>` child for 12-hour format AM/PM

**Behavioral differences:**
1. Carbon TimePicker is a plain text input — no clock face/wheel UI
2. Validation of time format must be implemented manually

**SCSS:**
```scss
@use '@carbon/react';
```
---

### DateTimePicker
**Carbon:** — (no equivalent)
**Import:** `import { DatePicker, DatePickerInput, TimePicker, TimePickerSelect } from '@carbon/react'`
**Complexity:** high — No single Carbon DateTimePicker component. Must compose DatePicker and TimePicker side by side.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | — | split into date (DatePicker value) and time (TimePicker value) |
| onChange | — | combine onChange handlers from both components |

**Structural changes:**
1. Render DatePicker and TimePicker as separate adjacent fields
2. Combine their values in application state
3. No integrated date-time picker exists in Carbon

**Behavioral differences:**
1. No native datetime picker UI — two separate inputs
2. Date and time must be combined into a datetime value in application code

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Button
**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Direct equivalent with variant/kind mapping.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | kind | contained→primary, outlined→tertiary, text→ghost |
| color | kind | primary→primary, secondary→secondary, error→danger |
| size | size | small→sm, medium→md, large→lg |
| disabled | disabled | |
| href | href | |
| onClick | onClick | |
| startIcon | renderIcon | Carbon puts icon on right by default |
| endIcon | renderIcon | |
| fullWidth | — | wrap in full-width container |
| loading | — | use InlineLoading component |
| sx | — | no equivalent |
| component | — | no equivalent |

**Structural changes:**
1. Replace `variant` prop with `kind` prop
2. Icon buttons: use `hasIconOnly` + `renderIcon` instead of nesting icon as child

**Behavioral differences:**
1. Carbon Button kind mapping: contained→primary, outlined→tertiary, text→ghost
2. Carbon icon-only buttons require `hasIconOnly={true}` and `iconDescription` prop

**SCSS:**
```scss
@use '@carbon/react';
```
---

### IconButton
**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Carbon Button with hasIconOnly prop is the equivalent.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| color | kind | default→ghost, primary→primary, error→danger |
| size | size | small→sm, medium→md, large→lg |
| disabled | disabled | |
| onClick | onClick | |
| edge | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<IconButton onClick={...}><SomeIcon /></IconButton>` with `<Button kind='ghost' hasIconOnly renderIcon={SomeIcon} iconDescription='Action label' onClick={...} />`

**Behavioral differences:**
1. Carbon requires `iconDescription` for accessibility on icon-only buttons
2. Carbon icon-only button with `kind='ghost'` is the closest visual match to MUI IconButton

**SCSS:**
```scss
@use '@carbon/react';
```
---

### ButtonGroup
**Carbon:** `ButtonSet` from `@carbon/react`
**Import:** `import { ButtonSet, Button } from '@carbon/react'`
**Complexity:** low — ButtonSet provides button grouping. Visual style differs (no connected borders).
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | — | pass kind prop to each Button individually |
| color | — | pass kind prop to each Button |
| size | — | pass size prop to each Button |
| orientation | stacked | vertical layout |
| fullWidth | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<ButtonGroup>` with `<ButtonSet>`
2. Pass each Button as a child

**Behavioral differences:**
1. Carbon ButtonSet does not visually connect buttons (no shared borders)
2. ButtonSet applies consistent spacing between buttons

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Fab
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** high — No Carbon equivalent for Floating Action Button. Carbon does not use FAB pattern.
**Status:** custom_required

**Structural changes:**
1. Consider using a Button `kind='primary'` in a fixed-position container
2. Revisit the UX pattern — Carbon does not endorse the FAB pattern in IBM design

**Behavioral differences:**
1. FAB pattern is not part of IBM Carbon design language

**SCSS:**
```scss
@use '@carbon/react';
```
---

### LoadingButton
**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button, InlineLoading } from '@carbon/react'`
**Complexity:** medium — No single LoadingButton in Carbon. Compose Button with InlineLoading.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| loading | — | use InlineLoading with status='active' to replace button content |
| loadingPosition | — | no equivalent |
| loadingIndicator | — | no equivalent |

**Structural changes:**
1. Replace `<LoadingButton loading={...} onClick={...}>` with a Button that conditionally shows InlineLoading
2. Disable the Button while loading
3. Or replace the entire button with `<InlineLoading description='Submitting...' status='active' />`

**Behavioral differences:**
1. InlineLoading supports status: active, inactive, finished, error
2. InlineLoading is typically used adjacent to or replacing the button

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Grid
**Carbon:** `Grid` from `@carbon/react`
**Import:** `import { Grid, Row, Column } from '@carbon/react'`
**Complexity:** medium — MUI Grid uses 12 columns and Flexbox. Carbon Grid uses 16 columns (lg+) and CSS Grid. Column spans need recalculation.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| container | Grid | renders the grid context |
| item | Column | |
| xs | sm | out of 4 |
| sm | sm | |
| md | md | out of 8 |
| lg | lg | out of 16 |
| xl | xlg | |
| spacing | — | use condensed or narrow prop; or Carbon spacing tokens |
| direction | — | no direct equivalent |
| alignItems | — | no direct prop; use className/style |
| justifyContent | — | no direct prop |
| wrap | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Grid container>` with `<Grid>`; wrap column items in `<Row>`
2. Replace `<Grid item xs={6} md={4}>` with `<Column sm={2} md={2} lg={4}>`
3. Carbon column spans: sm (out of 4), md (out of 8), lg/xlg/max (out of 16)

**Behavioral differences:**
1. Carbon Grid uses CSS Grid, not Flexbox
2. Carbon uses 16-column grid at lg+ breakpoints — recalculate all column spans

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Container
**Carbon:** `Grid` from `@carbon/react`
**Import:** `import { Grid } from '@carbon/react'`
**Complexity:** low — Carbon Grid serves as the page-level container.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| maxWidth | — | Carbon Grid respects its own max-width token |
| fixed | — | no equivalent |
| disableGutters | fullWidth | removes column gutters |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Container>` with `<Grid>`
2. Carbon Grid is always full-width of its context with internal max-width at design breakpoints

**Behavioral differences:**
1. Carbon Grid does not have fixed-width breakpoint mode
2. Carbon's max content width is controlled by design tokens

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Box
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** medium — MUI Box is a general-purpose layout primitive that accepts sx props. Carbon has no equivalent — use native HTML elements with Carbon CSS custom properties.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| sx | style or className | with Carbon CSS custom properties |
| component | — | the HTML element itself |
| display | style={{ display: '...' }} | |
| m / p spacing | style={{ margin/padding }} | use var(--cds-spacing-0X) |

**Structural changes:**
1. Replace `<Box sx={{ p: 2, mt: 3 }}>` with a native `<div>` styled using Carbon spacing tokens
2. Use Carbon CSS custom properties: `var(--cds-spacing-05)` instead of MUI `spacing(2)`
3. For display/flexbox layout: use inline styles or CSS classes with Carbon tokens

**Behavioral differences:**
1. No sx prop equivalent in Carbon
2. Use Carbon CSS custom properties (--cds-spacing-*, --cds-color-*) for token-based styling

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Stack
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** low — No Carbon equivalent. Implement with native CSS Flexbox using Carbon spacing tokens.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| direction | flexDirection | in style |
| spacing | gap | using Carbon spacing tokens (var(--cds-spacing-0X)) |
| divider | — | add a Divider component between children |
| alignItems | alignItems | in style |
| justifyContent | justifyContent | in style |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Stack spacing={2} direction='row'>` with a `<div style={{ display: 'flex', gap: 'var(--cds-spacing-05)', flexDirection: 'row' }}>`

**Behavioral differences:**
1. No Carbon Stack component — use native CSS Flexbox
2. Carbon spacing tokens: --cds-spacing-01 (2px) through --cds-spacing-13 (128px)

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Divider
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** low — No Carbon Divider component. Use native HTML hr or CSS border.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| orientation | — | use CSS for vertical dividers |
| variant | — | no equivalent |
| textAlign | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Divider>` with `<hr>` styled using Carbon border color token
2. CSS: `border-top: 1px solid var(--cds-border-subtle-01)`

**Behavioral differences:**
1. No built-in text-within-divider pattern in Carbon

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Hidden
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** low — No Carbon equivalent. Use CSS media queries with Carbon breakpoint tokens.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| xsDown | — | @include bp.breakpoint-down(sm) |
| smDown | — | @include bp.breakpoint-down(md) |
| mdDown | — | @include bp.breakpoint-down(lg) |
| lgDown | — | @include bp.breakpoint-down(xlg) |
| smUp | — | @include bp.breakpoint-up(sm) |
| mdUp | — | @include bp.breakpoint-up(md) |
| lgUp | — | @include bp.breakpoint-up(lg) |

**Structural changes:**
1. Replace `<Hidden smDown>` with CSS: `@media (max-width: 671px) { display: none; }`
2. Use Carbon breakpoint SCSS mixins: `@use '@carbon/react/scss/breakpoint' as bp;`

**Behavioral differences:**
1. No React component equivalent — use CSS only

**SCSS:**
```scss
@use '@carbon/react/scss/breakpoint' as bp;
```
---

### AppBar
**Carbon:** `Header` from `@carbon/react`
**Import:** `import { Header, HeaderContainer, HeaderName, HeaderNavigation, HeaderGlobalBar, SkipToContent } from '@carbon/react'`
**Complexity:** high — MUI AppBar is a simple positioned box. Carbon Header is a full shell component with specific zones and mobile behavior built in.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| position | — | Carbon Header is always fixed-top |
| color | — | Carbon Header is always dark (g100) |
| elevation | — | no equivalent |
| enableColorOnDark | — | no equivalent |
| sx | — | no equivalent |
| component | — | no equivalent |

**Structural changes:**
1. Replace `<AppBar position='fixed'><Toolbar>...</Toolbar></AppBar>` with the Carbon Header shell pattern
2. Use HeaderContainer render prop for responsive mobile menu
3. Always include SkipToContent as first Header child for accessibility

**Behavioral differences:**
1. Carbon Header is always fixed to the top and always uses dark theming
2. Toolbar content is split into HeaderNavigation (left/center) and HeaderGlobalBar (right)

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Toolbar
**Carbon:** `HeaderNavigation` / `HeaderGlobalBar` from `@carbon/react`
**Import:** `import { HeaderNavigation, HeaderGlobalBar } from '@carbon/react'`
**Complexity:** medium — Toolbar content is split into Carbon's specific header zones.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | — | no equivalent |
| disableGutters | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Nav links inside Toolbar → HeaderNavigation with HeaderMenuItem children
2. Icon actions (search, profile, etc.) inside Toolbar → HeaderGlobalBar with HeaderGlobalAction children
3. Title inside Toolbar → HeaderName

**Behavioral differences:**
1. Carbon Header has fixed layout zones — no arbitrary Flexbox arrangement of header content

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Drawer
**Carbon:** `SideNav` from `@carbon/react`
**Import:** `import { SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem } from '@carbon/react'`
**Complexity:** high — MUI Drawer is a general-purpose panel from any side. Carbon SideNav is a left-side navigation rail.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | expanded | |
| onClose | onSideNavBlur | or custom close handler |
| anchor | — | SideNav only supports left anchor |
| variant | isRail | icon-only collapsed state |
| PaperProps | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. For navigation drawers: use SideNav with SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem
2. SideNav integrates with HeaderContainer for mobile expand/collapse
3. For non-navigation drawers: implement a custom panel component with fixed positioning and focus trapping

**Behavioral differences:**
1. Carbon SideNav is only left-side
2. Carbon SideNav is a navigation component — not for arbitrary content

**SCSS:**
```scss
@use '@carbon/react';
```
---

### BottomNavigation
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** high — No Carbon equivalent. Carbon does not have a bottom navigation bar pattern.
**Status:** unsupported

**Structural changes:**
1. Consider using Carbon Tabs at the bottom of the screen with custom positioning
2. Or implement a custom fixed-bottom navigation using Carbon design tokens

**Behavioral differences:**
1. Bottom navigation is not part of IBM Carbon design language

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Breadcrumbs
**Carbon:** `Breadcrumb` from `@carbon/react`
**Import:** `import { Breadcrumb, BreadcrumbItem } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Minor structural adjustment for current page item.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| separator | — | no equivalent |
| maxItems | — | no direct equivalent; render conditionally |
| itemsBeforeCollapse | — | no equivalent |
| itemsAfterCollapse | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Breadcrumbs><Link href='/'>Home</Link><Typography>Page</Typography></Breadcrumbs>` with `<Breadcrumb><BreadcrumbItem><a href='/'>Home</a></BreadcrumbItem><BreadcrumbItem isCurrentPage>Page</BreadcrumbItem></Breadcrumb>`

**Behavioral differences:**
1. Carbon Breadcrumb wraps in `<nav aria-label='breadcrumb'>` automatically
2. Current page item uses `isCurrentPage` prop and renders as `<span>`

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Link
**Carbon:** `Link` from `@carbon/react`
**Import:** `import { Link } from '@carbon/react'`
**Complexity:** low — Direct equivalent for styled text links.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| href | href | |
| underline | — | Carbon Link is always underlined by default |
| color | — | no color prop; Carbon Link uses theme's link color |
| variant | — | no equivalent |
| sx | — | no equivalent |
| component | — | no equivalent |

**Structural changes:**
1. Replace `<Link href='...' underline='hover'>` with `<Link href='...'>`

**Behavioral differences:**
1. Carbon Link always renders with IBM Design Language link styling
2. `inline` prop is available for links embedded within body text

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Menu
**Carbon:** `OverflowMenu` from `@carbon/react`
**Import:** `import { OverflowMenu, OverflowMenuItem } from '@carbon/react'`
**Complexity:** medium — MUI Menu is an open/close positioned popover containing MenuItems. Carbon OverflowMenu is self-contained with a built-in trigger.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | — | managed internally by OverflowMenu |
| anchorEl | — | no equivalent |
| onClose | onClose | |
| anchorOrigin | direction | |
| transformOrigin | — | no equivalent |
| sx | — | no equivalent |
| PaperProps | — | no equivalent |

**Structural changes:**
1. Replace `<Menu anchorEl={...} open={...} onClose={...}><MenuItem>...</MenuItem></Menu>` with `<OverflowMenu><OverflowMenuItem itemText='...' onClick={...} /></OverflowMenu>`
2. OverflowMenu manages its own open/close state
3. For custom trigger button menus: use MenuButton from @carbon/react

**Behavioral differences:**
1. OverflowMenu manages its own state — no controlled open/close from parent
2. Use OverflowMenu for icon-triggered contextual menus

**SCSS:**
```scss
@use '@carbon/react';
```
---

### MobileStepper
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** high — No Carbon equivalent. Carbon ProgressIndicator is for desktop step tracking, not mobile dot-style stepper.
**Status:** custom_required

**Structural changes:**
1. Use Carbon ProgressIndicator for step-tracking patterns
2. For dot-style mobile navigation: implement custom with styled dots and Carbon Button for prev/next

**Behavioral differences:**
1. No mobile stepper pattern in Carbon design system

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Pagination
**Carbon:** `Pagination` from `@carbon/react`
**Import:** `import { Pagination } from '@carbon/react'`
**Complexity:** medium — MUI Pagination is a page-number component. Carbon Pagination is a data-driven component with page size selection.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| count | — | derived from totalItems/pageSize |
| page | page | |
| onChange | onChange | receives {page, pageSize} |
| defaultPage | page | set initial page |
| color | — | no equivalent |
| shape | — | no equivalent |
| variant | — | no equivalent |
| size | size | sm/md/lg |
| siblingCount | — | no equivalent |
| boundaryCount | — | no equivalent |
| showFirstButton | — | no equivalent |
| showLastButton | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Pagination count={10} page={...} onChange={...}>` with `<Pagination totalItems={100} pageSize={10} pageSizes={[10, 20, 50]} page={...} onChange={...}>`

**Behavioral differences:**
1. Carbon Pagination requires `totalItems` and `pageSize` props
2. Carbon Pagination includes a page size selector by default and shows an item count label

**SCSS:**
```scss
@use '@carbon/react';
```
---

### SpeedDial
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** high — No Carbon equivalent. Speed Dial pattern is not part of IBM Carbon design language.
**Status:** unsupported

**Structural changes:**
1. Revisit the UX pattern — consider using an OverflowMenu or a set of Buttons
2. No Carbon component equivalent available

**Behavioral differences:**
1. Speed Dial is not part of IBM Carbon design language

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Stepper
**Carbon:** `ProgressIndicator` from `@carbon/react`
**Import:** `import { ProgressIndicator, ProgressStep } from '@carbon/react'`
**Complexity:** medium — MUI Stepper is a form wizard component with step content. Carbon ProgressIndicator is a visual indicator only.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| activeStep | currentIndex | |
| orientation | vertical | boolean prop for vertical layout |
| alternativeLabel | — | no equivalent |
| nonLinear | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Stepper activeStep={...}>` with `<ProgressIndicator currentIndex={...}>`
2. Replace `<Step><StepLabel>...</StepLabel></Step>` with `<ProgressStep label='...' description='...' />`
3. Step content (panel content) must be rendered separately based on currentIndex state

**Behavioral differences:**
1. Carbon ProgressIndicator is a status indicator only — no built-in step content panels
2. Step navigation must be implemented with separate state and Next/Back buttons

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Step
**Carbon:** `ProgressStep` from `@carbon/react`
**Import:** `import { ProgressStep } from '@carbon/react'`
**Complexity:** low — Direct equivalent for step definition within ProgressIndicator.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| completed | complete | prop on ProgressStep |
| disabled | disabled | |
| expanded | — | no equivalent |
| optional | secondaryLabel | for optional text |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Step><StepLabel>Step 1</StepLabel><StepContent>...</StepContent></Step>` with `<ProgressStep label='Step 1' description='Optional description' />`
2. Step content goes in a separate panel outside ProgressIndicator

**Behavioral differences:**
1. ProgressStep has no built-in content slot

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Tabs
**Carbon:** `Tabs` from `@carbon/react`
**Import:** `import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react'`
**Complexity:** medium — MUI Tabs uses Tab value-based selection. Carbon Tabs uses index-based selection and requires explicit TabList/TabPanels separation.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | selectedIndex | 0-based integer |
| defaultValue | defaultSelectedIndex | |
| onChange | onChange | receives index |
| orientation | — | no vertical tabs in Carbon line variant |
| variant | contained | prop on TabList for box-style; default is line |
| scrollButtons | scrollable | prop on TabList |
| visibleScrollbar | — | no equivalent |
| textColor | — | no equivalent |
| indicatorColor | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Separate MUI Tab labels and TabPanel content into Carbon TabList and TabPanels
2. Structure: `<Tabs><TabList><Tab/></TabList><TabPanels><TabPanel/></TabPanels></Tabs>`
3. Carbon is index-based, not value-based

**Behavioral differences:**
1. Carbon Tabs is index-based (not value-based)
2. No vertical Tab orientation in Carbon

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Tab
**Carbon:** `Tab` from `@carbon/react`
**Import:** `import { Tab, TabPanel } from '@carbon/react'`
**Complexity:** low — Tab label → Carbon Tab; panel content → Carbon TabPanel (separate structure).
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| label | Tab children | |
| value | — | no equivalent |
| disabled | disabled | |
| icon | — | no icon prop on Carbon Tab |
| iconPosition | — | no equivalent |
| wrapped | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Split: MUI Tab (label only) → Carbon Tab in TabList
2. MUI TabPanel (content) → Carbon TabPanel in TabPanels
3. Carbon Tab only contains the label; content goes in the sibling TabPanel

**SCSS:**
```scss
@use '@carbon/react';
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
| expanded | open | on AccordionItem |
| defaultExpanded | — | no direct prop; use open on AccordionItem |
| onChange | onChange | on AccordionItem |
| disabled | disabled | on AccordionItem |
| disableGutters | — | no equivalent |
| square | — | no equivalent |
| elevation | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Accordion>` with `<Accordion>`
2. Replace `<AccordionSummary><Typography>Title</Typography></AccordionSummary><AccordionDetails>content</AccordionDetails>` with `<AccordionItem title='Title'>content</AccordionItem>`

**Behavioral differences:**
1. Carbon AccordionItem title is a prop (not AccordionSummary children)
2. Carbon Accordion allows multiple items open simultaneously

**SCSS:**
```scss
@use '@carbon/react';
```
---

### AccordionSummary
**Carbon:** — (not needed)
**Import:** —
**Complexity:** low — Not needed — Carbon AccordionItem takes a title prop directly.
**Status:** mapped

**Structural changes:**
1. Remove AccordionSummary; pass its text content as the `title` prop on AccordionItem

**SCSS:**
```scss
@use '@carbon/react';
```
---

### AccordionDetails
**Carbon:** — (not needed)
**Import:** —
**Complexity:** low — Not needed — AccordionItem children serve as the panel content.
**Status:** mapped

**Structural changes:**
1. Remove AccordionDetails wrapper; place content directly inside AccordionItem

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Card
**Carbon:** `Tile` from `@carbon/react`
**Import:** `import { Tile, ClickableTile, ExpandableTile, SelectableTile } from '@carbon/react'`
**Complexity:** medium — MUI Card is composed with CardContent, CardActions, CardHeader, CardMedia. Carbon Tile is a single-layer container without built-in subcomponents.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| raised | — | no equivalent |
| elevation | — | no equivalent |
| variant | — | no equivalent |
| square | — | no equivalent |
| sx | — | no equivalent |
| component | — | no equivalent |

**Structural changes:**
1. Static informational card → Tile; clickable card → ClickableTile; expandable → ExpandableTile
2. CardContent, CardActions, CardHeader → plain HTML structure inside Tile
3. CardMedia → img element inside Tile

**Behavioral differences:**
1. Carbon Tile has no built-in header, footer, media, or action zone subcomponents
2. ClickableTile handles hover/focus states for interactive tiles

**SCSS:**
```scss
@use '@carbon/react';
```
---

### CardContent
**Carbon:** — (not needed)
**Import:** —
**Complexity:** low — No equivalent — place content directly inside Tile.
**Status:** mapped

**Structural changes:**
1. Remove CardContent wrapper; place content directly inside Tile

**SCSS:**
```scss
@use '@carbon/react';
```
---

### CardActions
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** low — No equivalent — use a ButtonSet or flexbox div at the bottom of Tile.
**Status:** custom_required

**Structural changes:**
1. Replace `<CardActions>` with `<div style={{ display: 'flex', gap: 'var(--cds-spacing-03)' }}>`
2. Place Button components inside

**SCSS:**
```scss
@use '@carbon/react';
```
---

### CardHeader
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** low — No equivalent — implement with HTML headings inside Tile.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title | — | h4 or similar heading inside Tile |
| subheader | — | p element inside Tile |
| avatar | — | inline img or Avatar-like element |
| action | — | Button or IconButton at the end |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<CardHeader title='...' subheader='...'>` with HTML headings inside Tile
2. Example: `<h4 className='cds--heading-02'>Title</h4><p className='cds--body-02'>Subheader</p>`

**SCSS:**
```scss
@use '@carbon/react';
```
---

### CardMedia
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** low — No equivalent — use native img or video element inside Tile.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| image | src | on img |
| alt | alt | |
| component | — | HTML element type |
| height | style={{ height: '...' }} | |

**Structural changes:**
1. Replace `<CardMedia component='img' image='...' alt='...'>` with `<img src='...' alt='...' style={{ width: '100%' }} />`

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Paper
**Carbon:** `Layer` from `@carbon/react`
**Import:** `import { Layer, Tile } from '@carbon/react'`
**Complexity:** medium — MUI Paper is an elevation surface. Carbon uses Layer for layering tokens or Tile for contained surfaces.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| elevation | Layer level | 0=base, 1=layer-01, 2=layer-02, 3=layer-03 |
| variant | Tile | for 'outlined' variant; Layer for elevation |
| square | — | no equivalent |
| sx | — | no equivalent |
| component | — | no equivalent |

**Structural changes:**
1. For layered surfaces: use Layer to apply the correct token layer (01, 02, 03)
2. For contained card-like surfaces: use Tile
3. Carbon does not use shadow elevation — it uses layer tokens for depth

**Behavioral differences:**
1. Carbon uses layer color tokens (not shadows) to convey elevation
2. Layer component updates all child component token values for correct layered styling

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Alert
**Carbon:** `InlineNotification` from `@carbon/react`
**Import:** `import { InlineNotification, ActionableNotification } from '@carbon/react'`
**Complexity:** medium — MUI Alert is flexible inline content. Carbon InlineNotification has a defined structure with title and subtitle slots.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| severity | kind | error→error, warning→warning, info→info, success→success |
| variant | lowContrast | boolean for filled/standard vs outlined look |
| onClose | onCloseButtonClick | |
| action | — | use ActionableNotification with actionButtonLabel prop |
| icon | — | no equivalent |
| color | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Alert severity='error'>{message}</Alert>` with `<InlineNotification kind='error' title='Error' subtitle={message} />`
2. For alerts with action buttons: use ActionableNotification
3. Dismissible: add `onCloseButtonClick` prop

**Behavioral differences:**
1. Carbon InlineNotification uses title + subtitle structure
2. `lowContrast` prop renders a less prominent notification

**SCSS:**
```scss
@use '@carbon/react';
```
---

### AlertTitle
**Carbon:** — (not needed)
**Import:** —
**Complexity:** low — Not needed — Carbon InlineNotification accepts title as a prop.
**Status:** mapped

**Structural changes:**
1. Remove AlertTitle; pass its text as the `title` prop on InlineNotification

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Backdrop
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** medium — No standalone Backdrop component. Carbon Modal and Loading include their own overlay when needed.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | — | conditional rendering |
| onClick | — | onClick handler on overlay div |
| invisible | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. For loading overlay: use Loading component with `withOverlay={true}` (default)
2. For modal overlay: use Modal which includes backdrop automatically
3. For custom backdrop: implement a fixed-position div with Carbon overlay background token

**Behavioral differences:**
1. Carbon Loading has built-in full-page overlay
2. No standalone Backdrop component in Carbon

**SCSS:**
```scss
@use '@carbon/react';
```
---

### CircularProgress
**Carbon:** `Loading` from `@carbon/react`
**Import:** `import { Loading } from '@carbon/react'`
**Complexity:** low — Direct equivalent for circular loading indicator.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| size | small | boolean, renders smaller spinner |
| value | — | no determinate state in Carbon Loading |
| variant | withOverlay | indeterminate→withOverlay={false} for inline |
| color | — | no equivalent |
| thickness | — | no equivalent |
| disableShrink | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<CircularProgress />` with `<Loading />`
2. Replace `<CircularProgress size={20} />` with `<Loading small />`
3. For inline loading: use InlineLoading component instead

**Behavioral differences:**
1. Carbon Loading is indeterminate only (no determinate/progress variant)
2. Carbon Loading overlays the full page by default (`withOverlay={true}`)

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Dialog
**Carbon:** `Modal` from `@carbon/react`
**Import:** `import { Modal, ComposedModal, ModalHeader, ModalBody, ModalFooter } from '@carbon/react'`
**Complexity:** medium — MUI Dialog uses DialogTitle/DialogContent/DialogActions subcomponents. Carbon Modal consolidates these into props or uses ComposedModal.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| onClose | onRequestClose | |
| maxWidth | size | xs/sm/md/lg |
| fullWidth | — | no equivalent |
| fullScreen | — | no equivalent |
| disableEscapeKeyDown | preventCloseOnClickOutside | similar effect |
| PaperProps | — | no equivalent |
| TransitionProps | — | no equivalent |
| scroll | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Dialog open={...} onClose={...}>` with `<Modal open={...} onRequestClose={...} modalHeading='...' primaryButtonText='...' secondaryButtonText='...'>`
2. Dialog children become Modal body content
3. For complex layouts: use ComposedModal + ModalHeader + ModalBody + ModalFooter

**Behavioral differences:**
1. Carbon Modal handles focus trapping automatically
2. `passiveModal` prop for informational modals (no action buttons)

**SCSS:**
```scss
@use '@carbon/react';
```
---

### DialogTitle
**Carbon:** — (not needed)
**Import:** —
**Complexity:** low — Not needed — use modalHeading prop on Modal or title prop on ModalHeader.
**Status:** mapped

**Structural changes:**
1. Remove DialogTitle; pass its text as `modalHeading` prop on Modal
2. Or use ModalHeader with `title` prop in ComposedModal pattern

**SCSS:**
```scss
@use '@carbon/react';
```
---

### DialogContent
**Carbon:** `ModalBody` from `@carbon/react`
**Import:** `import { ModalBody } from '@carbon/react'`
**Complexity:** low — Direct equivalent in ComposedModal pattern. Or pass content as Modal children.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| dividers | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. For simple Modal: place content directly as Modal children
2. For ComposedModal: wrap content in ModalBody

**SCSS:**
```scss
@use '@carbon/react';
```
---

### DialogActions
**Carbon:** `ModalFooter` from `@carbon/react`
**Import:** `import { ModalFooter } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Or use primaryButtonText/secondaryButtonText props on Modal.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| disableSpacing | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. For simple Modal: use `primaryButtonText` and `secondaryButtonText` props
2. For ComposedModal: use ModalFooter with `onRequestClose`/`onRequestSubmit` props

**Behavioral differences:**
1. ModalFooter renders its own buttons based on text props

**SCSS:**
```scss
@use '@carbon/react';
```
---

### LinearProgress
**Carbon:** `ProgressBar` from `@carbon/react`
**Import:** `import { ProgressBar } from '@carbon/react'`
**Complexity:** low — Direct equivalent with minor prop renaming.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| variant | status | determinate→active; indeterminate not supported |
| valueBuffer | — | no equivalent |
| color | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<LinearProgress variant='determinate' value={50}>` with `<ProgressBar label='...' value={50} max={100} />`

**Behavioral differences:**
1. Carbon ProgressBar is determinate only (no indeterminate mode)
2. Carbon ProgressBar requires a `label` prop

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Skeleton
**Carbon:** `SkeletonText` from `@carbon/react`
**Import:** `import { SkeletonText, SkeletonPlaceholder, SkeletonIcon } from '@carbon/react'`
**Complexity:** medium — MUI Skeleton handles all types of skeleton content. Carbon has separate components for different skeleton patterns.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | — | text→SkeletonText, rectangular→SkeletonPlaceholder, circular→SkeletonIcon |
| width | style | |
| height | style | |
| animation | — | Carbon skeleton animation is always on (pulse) |
| sx | — | no equivalent |

**Structural changes:**
1. Text content skeleton → SkeletonText (`lineCount` prop for multiple lines)
2. Image/block placeholder → SkeletonPlaceholder; icon placeholder → SkeletonIcon
3. For component-level skeletons: individual Carbon components have a Skeleton variant

**Behavioral differences:**
1. Carbon provides skeleton-specific variants of its own components (e.g., ButtonSkeleton, TextInputSkeleton)
2. SkeletonText `heading` prop renders a wider heading-style skeleton

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Snackbar
**Carbon:** `ToastNotification` from `@carbon/react`
**Import:** `import { ToastNotification } from '@carbon/react'`
**Complexity:** medium — MUI Snackbar is a lightweight positioned toast. Carbon ToastNotification is richer with title/subtitle/caption structure.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | — | conditional rendering |
| onClose | onCloseButtonClick | |
| message | subtitle | |
| autoHideDuration | timeout | milliseconds |
| anchorOrigin | — | position via CSS on container element |
| action | — | no equivalent |
| SnackbarContentProps | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Snackbar open={...} onClose={...} message='...' autoHideDuration={6000}>` with `<ToastNotification kind='info' title='...' subtitle='...' caption={timestamp} timeout={6000} onCloseButtonClick={...} />`
2. Manage visibility via conditional rendering
3. Position with a fixed container div (Carbon provides no notification container)

**Behavioral differences:**
1. Carbon ToastNotification is richer — requires title, subtitle, and optionally caption
2. Carbon ToastNotification does not auto-stack — implement a notification queue manually

**SCSS:**
```scss
@use '@carbon/react';
```
---

### SnackbarContent
**Carbon:** — (not needed)
**Import:** —
**Complexity:** low — Not needed — use ToastNotification props directly.
**Status:** mapped

**Structural changes:**
1. Pass message/action content directly as ToastNotification `title`/`subtitle` props

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Tooltip
**Carbon:** `Tooltip` from `@carbon/react`
**Import:** `import { Tooltip } from '@carbon/react'`
**Complexity:** medium — Carbon Tooltip wraps its trigger as a child element. MUI Tooltip also uses children-as-trigger but has richer positioning API.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title | label | |
| placement | align | top/bottom/left/right/top-start/top-end etc. |
| open | open | |
| disableHoverListener | — | no equivalent |
| disableFocusListener | — | no equivalent |
| disableTouchListener | — | no equivalent |
| enterDelay | enterDelayMs | |
| leaveDelay | leaveDelayMs | |
| arrow | — | no equivalent |
| componentsProps | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Tooltip title='Info text'><Button>Hover</Button></Tooltip>` with `<Tooltip label='Info text' align='bottom'><Button>Hover</Button></Tooltip>`
2. Carbon Tooltip child must be a focusable element

**Behavioral differences:**
1. Carbon Tooltip also offers Toggletip (click-activated, supports interactive content)
2. Carbon Tooltip does not support rich HTML content in `label` prop — use Toggletip for that

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Avatar
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** medium — No Carbon Avatar component. Implement with an img or initials-based div using Carbon design tokens.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| src | src | on img |
| alt | alt | on img |
| children | — | inner content of styled div |
| variant | — | circular→border-radius:50% |
| sx | — | no equivalent |

**Structural changes:**
1. For image avatars: use `<img>` with `border-radius: 50%` and Carbon sizing tokens
2. For initials avatars: use a styled div with background color from Carbon tag/color tokens
3. Carbon's HeaderGlobalAction can display a user avatar in the header

**Behavioral differences:**
1. No Carbon Avatar component — custom implementation required

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Badge
**Carbon:** `Tag` from `@carbon/react`
**Import:** `import { Tag } from '@carbon/react'`
**Complexity:** low — Carbon Tag covers Badge labeling use cases. Positioned count badges need custom CSS.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| badgeContent | Tag children | |
| color | type | primary→blue, error→red, warning→magenta, success→green |
| variant | — | dot→use custom styled span |
| invisible | — | conditional rendering |
| max | — | no built-in max; handle in application code |
| showZero | — | no equivalent |
| anchorOrigin | — | position via CSS on wrapper element |
| overlap | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. For label badges: replace `<Badge badgeContent='New' color='primary'>` with `<Tag type='blue'>New</Tag>`
2. For numeric count badges (positioned on icons): implement custom CSS positioning with a Tag or styled span

**Behavioral differences:**
1. Carbon Tag is an inline label, not a positioned overlay
2. Positioned badge-on-icon pattern requires custom CSS

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Chip
**Carbon:** `Tag` from `@carbon/react`
**Import:** `import { Tag, OperationalTag } from '@carbon/react'`
**Complexity:** low — Carbon Tag covers the Chip use case for labels and dismissible tags.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| label | Tag children | |
| onDelete | onClose | |
| color | type | default→gray, primary→blue, secondary→gray |
| variant | — | outlined→outline type on Tag; filled→default Tag |
| avatar | — | no equivalent |
| icon | — | no equivalent |
| deleteIcon | — | no equivalent |
| clickable | — | use OperationalTag for clickable tags |
| onClick | onClick | on OperationalTag |
| disabled | — | no equivalent |
| size | size | sm/md |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Chip label='Label' onDelete={...}>` with `<Tag type='blue' onClose={...}>Label</Tag>`
2. For clickable chips: use `<OperationalTag>` or a Tag inside a button

**Behavioral differences:**
1. Carbon Tag types: gray, blue, cyan, teal, green, magenta, purple, red, warm-gray, cool-gray, high-contrast, outline
2. OperationalTag is the interactive/clickable variant

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Icon
**Carbon:** — from `@carbon/icons-react`
**Import:** `import { IconName } from '@carbon/icons-react'`
**Complexity:** medium — MUI uses Material icons via @mui/icons-material. Carbon has its own icon library @carbon/icons-react with different icon names and sizes.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| fontSize | size | 16/20/24/32 |
| color | style={{ fill: 'currentColor' }} | or CSS |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `import { SomeIcon } from '@mui/icons-material'` with `import { SomeName } from '@carbon/icons-react'`
2. Carbon icons are React components: `<Add size={16} />` or `<Add size={20} />`
3. Carbon icon sizes: 16, 20, 24, 32

**Behavioral differences:**
1. Carbon icons are SVG React components from @carbon/icons-react
2. Icon names differ from Material — check carbon icon library

**SCSS:**
---

### List
**Carbon:** `StructuredList` from `@carbon/react`
**Import:** `import { StructuredList, StructuredListBody, StructuredListRow, StructuredListCell } from '@carbon/react'`
**Complexity:** medium — MUI List is a flexible list container. Carbon StructuredList is more formal and tabular.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| dense | — | no direct equivalent |
| disablePadding | — | no equivalent |
| subheader | — | use StructuredListHead with StructuredListRow for header row |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<List>` with `<StructuredList>`; wrap all items in `<StructuredListBody>`
2. Each item becomes a `<StructuredListRow>` with `<StructuredListCell>` children
3. For simple unordered lists: use native ul/li with Carbon type tokens instead

**Behavioral differences:**
1. StructuredList is oriented toward tabular data
2. For simple navigation/link lists: use plain styled lists with Carbon typography tokens

**SCSS:**
```scss
@use '@carbon/react';
```
---

### ListItem
**Carbon:** `StructuredListRow` from `@carbon/react`
**Import:** `import { StructuredListRow, StructuredListCell } from '@carbon/react'`
**Complexity:** low — Each ListItem maps to a StructuredListRow.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| dense | — | no equivalent |
| disableGutters | — | no equivalent |
| divider | — | no equivalent |
| alignItems | — | no equivalent |
| selected | — | no equivalent |
| button | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<ListItem>` with `<StructuredListRow>`
2. Wrap content in `<StructuredListCell>`

**SCSS:**
```scss
@use '@carbon/react';
```
---

### ListItemText
**Carbon:** `StructuredListCell` from `@carbon/react`
**Import:** `import { StructuredListCell } from '@carbon/react'`
**Complexity:** low — Primary text maps to StructuredListCell content. Secondary text is a separate cell or spans.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| primary | StructuredListCell children | first cell |
| secondary | StructuredListCell children | second cell |
| primaryTypographyProps | — | no equivalent |
| secondaryTypographyProps | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<ListItemText primary='Main' secondary='Sub'>` with `<StructuredListCell>Main</StructuredListCell><StructuredListCell>Sub</StructuredListCell>`

**SCSS:**
```scss
@use '@carbon/react';
```
---

### ListItemIcon
**Carbon:** — (no equivalent)
**Import:** `import { StructuredListCell } from '@carbon/react'`
**Complexity:** low — No Carbon equivalent — place a Carbon icon inside a StructuredListCell.
**Status:** custom_required

**Structural changes:**
1. Replace `<ListItemIcon><SomeIcon /></ListItemIcon>` with `<StructuredListCell><SomeIcon size={16} /></StructuredListCell>`

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Table
**Carbon:** `DataTable` from `@carbon/react`
**Import:** `import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer } from '@carbon/react'`
**Complexity:** high — MUI Table is a structural HTML table. Carbon DataTable is a full-featured data management component with render props.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| size | size | xs/sm/md/lg/xl on DataTable |
| stickyHeader | sticky | prop on TableContainer |
| padding | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Wrap in `<DataTable rows={rowsArray} headers={headersArray}>`
2. Use render prop: `{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (...)}`
3. Build table structure using DataTable primitives: Table, TableHead, TableRow, TableHeader, TableBody, TableCell

**Behavioral differences:**
1. Carbon DataTable manages sorting, selection, and expansion via render props
2. Carbon DataTable requires rows with `id` fields

**SCSS:**
```scss
@use '@carbon/react';
```
---

### TableHead
**Carbon:** `TableHead` from `@carbon/react`
**Import:** `import { TableHead } from '@carbon/react'`
**Complexity:** low — Direct structural equivalent within DataTable render prop.
**Status:** mapped

**Structural changes:**
1. Use TableHead inside the DataTable render prop function

**SCSS:**
```scss
@use '@carbon/react';
```
---

### TableBody
**Carbon:** `TableBody` from `@carbon/react`
**Import:** `import { TableBody } from '@carbon/react'`
**Complexity:** low — Direct structural equivalent.
**Status:** mapped

**Structural changes:**
1. Use TableBody inside the DataTable render prop function

**SCSS:**
```scss
@use '@carbon/react';
```
---

### TableRow
**Carbon:** `TableRow` from `@carbon/react`
**Import:** `import { TableRow } from '@carbon/react'`
**Complexity:** low — Direct structural equivalent. Spread getRowProps() from DataTable render prop for accessibility.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| selected | — | managed by DataTable selection state |
| hover | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Use `<TableRow {...getRowProps({ row })}>` inside DataTable render prop

**SCSS:**
```scss
@use '@carbon/react';
```
---

### TableCell
**Carbon:** `TableCell` from `@carbon/react`
**Import:** `import { TableCell, TableHeader } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Header cells use TableHeader component.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| align | — | no direct prop; use className/style |
| colSpan | colSpan | |
| rowSpan | rowSpan | |
| padding | — | no equivalent |
| size | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Data cells: use TableCell
2. Header cells: use TableHeader with `{...getHeaderProps({ header })}` spread

**SCSS:**
```scss
@use '@carbon/react';
```
---

### TableFooter
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** low — No Carbon TableFooter component. Use a standard tfoot element or place Pagination below the table.
**Status:** custom_required

**Structural changes:**
1. For pagination: place Pagination component below the DataTable
2. For footer row: use a native `<tfoot><tr><td>` inside the Carbon Table component

**SCSS:**
```scss
@use '@carbon/react';
```
---

### DataGrid
**Carbon:** `DataTable` from `@carbon/react`
**Import:** `import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer, TableToolbar, Pagination } from '@carbon/react'`
**Complexity:** high — MUI DataGrid is a feature-rich grid with virtualization, editing, and advanced filtering. Carbon DataTable covers sorting, filtering, selection, and pagination but not virtualization or inline editing.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| rows | rows | array of objects with id field |
| columns | headers | array of {key, header} objects |
| pageSize | pageSize | on Pagination |
| rowsPerPageOptions | pageSizes | on Pagination |
| checkboxSelection | selectionType | on DataTable |
| sortModel | — | use isSortable and manage sort state |
| filterModel | — | use TableToolbar search |
| onRowClick | onRowClick | on DataTable |
| loading | — | use Loading or InlineLoading externally |
| sx | — | no equivalent |

**Structural changes:**
1. Replace DataGrid with DataTable using render prop pattern
2. Add TableToolbar for search/filter bar; add Pagination component for pagination
3. Sorting: use `isSortable` prop and `getSortHeaderProps`

**Behavioral differences:**
1. Carbon DataTable does not support virtualization for large datasets
2. No inline cell editing or column resizing in Carbon DataTable

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Typography
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** medium — Carbon does not have a Typography component. Use semantic HTML elements with Carbon type CSS custom properties or SCSS type mixins.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| variant | — | h1→cds--heading-07, body1→cds--body-02, caption→cds--label-01; see → Notes |
| component | — | use the actual HTML element directly |
| align | style={{ textAlign: '...' }} | |
| color | — | use var(--cds-text-primary), var(--cds-text-secondary) |
| gutterBottom | style={{ marginBottom: 'var(--cds-spacing-05)' }} | |
| noWrap | style | overflow:hidden, textOverflow:ellipsis, whiteSpace:nowrap |
| paragraph | — | use p element directly |
| sx | — | no equivalent |

**Notes:** variant mapping: h1→cds--heading-07, h2→cds--heading-06, h3→cds--heading-05, h4→cds--heading-04, h5→cds--heading-03, h6→cds--heading-02, body1→cds--body-02, body2→cds--body-01, caption→cds--label-01, subtitle1→cds--body-02, overline→cds--label-01

**Structural changes:**
1. Replace `<Typography variant='h1'>` with `<h1 className='cds--heading-07'>`
2. Replace `<Typography variant='body1'>` with `<p className='cds--body-01'>`
3. Or use Carbon SCSS type mixins: `@include type.type-style('heading-07')`

**Behavioral differences:**
1. No Carbon Typography component — use HTML semantic elements with Carbon type classes
2. Carbon type scale: productive and expressive variants available

**SCSS:**
```scss
@use '@carbon/react/scss/type' as type;
```
---

### ClickAwayListener
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** medium — No Carbon equivalent. Implement click-outside behavior manually using a useEffect and document event listener.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| onClickAway | — | custom event handler on document |
| mouseEvent | — | no equivalent |
| touchEvent | — | no equivalent |

**Structural changes:**
1. Replace `<ClickAwayListener onClickAway={handler}>` with a custom hook or ref-based document click listener
2. Use useEffect with document.addEventListener('mousedown', handler) and cleanup on unmount

**Behavioral differences:**
1. No Carbon component — custom implementation required

**SCSS:**
---

### Modal
**Carbon:** `Modal` from `@carbon/react`
**Import:** `import { Modal } from '@carbon/react'`
**Complexity:** low — Direct equivalent. Carbon Modal manages focus trapping and ARIA automatically.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| onClose | onRequestClose | |
| children | — | Modal body children |
| disableBackdropClick | preventCloseOnClickOutside | |
| disableEscapeKeyDown | — | no equivalent |
| keepMounted | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Replace `<Modal open={...} onClose={...}>` with `<Modal open={...} onRequestClose={...} modalHeading='...'>`
2. Children become the modal body content

**Behavioral differences:**
1. Carbon Modal handles focus trapping, scroll locking, and ARIA attributes automatically
2. Use `passiveModal` for no-action informational modals

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Popover
**Carbon:** `Popover` from `@carbon/react`
**Import:** `import { Popover, PopoverContent } from '@carbon/react'`
**Complexity:** medium — Carbon Popover is a positioning primitive. Toggletip may be more appropriate for interactive content.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| anchorEl | — | no equivalent |
| onClose | — | custom handler |
| anchorOrigin | align | |
| transformOrigin | — | no equivalent |
| PaperProps | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Wrap trigger and PopoverContent together: `<Popover open={...} align='bottom'>triggerElement<PopoverContent>content</PopoverContent></Popover>`
2. Manage open state with useState; add click-outside listener to close

**Behavioral differences:**
1. Carbon Popover is a primitive — does not auto-manage open/close
2. Toggletip is the preferred Carbon component for accessible interactive overlays

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Popper
**Carbon:** — (no equivalent)
**Import:** `import { Popover, PopoverContent } from '@carbon/react'`
**Complexity:** high — MUI Popper uses Popper.js for arbitrary positioned overlays. Carbon Popover is the closest primitive.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | on Popover |
| anchorEl | — | no equivalent |
| placement | align | on Popover |
| transition | — | no equivalent |
| modifiers | — | no equivalent |
| sx | — | no equivalent |

**Structural changes:**
1. Use Carbon Popover for simple positioned overlays
2. For complex floating UI needs: consider @floating-ui/react (the underlying library Popper.js migrated to)

**Behavioral differences:**
1. Carbon Popover is not a full-featured positioning engine like Popper.js
2. For complex positioning requirements: use @floating-ui/react directly

**SCSS:**
```scss
@use '@carbon/react';
```
---
