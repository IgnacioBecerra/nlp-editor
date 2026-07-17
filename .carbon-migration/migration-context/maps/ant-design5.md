# Ant Design 5 → Carbon React v11 Migration Map

> Source: ant-design@5
> Target: @carbon/react v11
> Last updated: 2026-03
> Docs: https://react.carbondesignsystem.com

**LOAD RULE:** Load this file only when source_framework matches this map per INDEX.md. Load ONCE per session.

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Quick Reference
| Component | Carbon Equivalent | Complexity | Status |
|-----------|-------------------|------------|--------|
| Button | Button | low | mapped |
| ButtonGroup | Button | low | partial |
| Input | TextInput | low | mapped |
| Input.TextArea | TextArea | low | mapped |
| Input.Password | PasswordInput | low | mapped |
| Input.Search | Search | low | mapped |
| InputNumber | NumberInput | low | mapped |
| Select | Dropdown | medium | mapped |
| AutoComplete | ComboBox | medium | mapped |
| Checkbox | Checkbox | low | mapped |
| Checkbox.Group | CheckboxGroup | low | mapped |
| Radio | RadioButton | low | mapped |
| Radio.Group | RadioButtonGroup | low | mapped |
| Switch | Toggle | low | mapped |
| Slider | Slider | medium | partial |
| DatePicker | DatePicker | medium | mapped |
| RangePicker | DatePicker | medium | mapped |
| TimePicker | TimePicker | medium | partial |
| Upload | FileUploader | high | partial |
| Form | Form | high | partial |
| Table | DataTable | high | mapped |
| Modal | Modal | medium | mapped |
| Drawer | SideNav | high | custom_required |
| Notification | ToastNotification | medium | partial |
| message | ToastNotification | medium | partial |
| Alert | InlineNotification | low | mapped |
| Tooltip | Tooltip | low | mapped |
| Popover | Popover | medium | mapped |
| Tabs | Tabs | medium | mapped |
| Collapse | Accordion | low | mapped |
| Breadcrumb | Breadcrumb | low | mapped |
| Pagination | Pagination | low | mapped |
| Progress | ProgressBar | low | mapped |
| Spin | Loading | low | mapped |
| Skeleton | SkeletonText | low | mapped |
| Menu | SideNav | high | partial |
| Dropdown | OverflowMenu | medium | partial |
| Cascader | — | custom | custom_required |
| TreeSelect | — | custom | custom_required |
| Tree | TreeView | medium | partial |
| Tag | Tag | low | mapped |
| Badge | — | custom | custom_required |
| Avatar | — | custom | unsupported |
| Steps | ProgressIndicator | low | mapped |
| Timeline | StructuredList | custom | custom_required |
| Card | Tile | low | mapped |
| List | StructuredList | medium | mapped |
| Divider | Divider | low | mapped |
| Typography.Title | — | low | unsupported |
| Layout | Grid | high | partial |

---

### Button
**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — Direct prop mapping with minor variant renaming.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| type | kind | |
| danger | kind | set to 'danger' |
| disabled | disabled | |
| loading | — | no equivalent |
| size | size | |
| icon | renderIcon | |
| block | — | no equivalent |
| ghost | — | no equivalent |
| href | href | |
| htmlType | type | |
| shape | — | no equivalent |
| onClick | onClick | |

**Structural changes:**
1. Replace `type='primary'` with `kind='primary'`
2. Replace `type='default'` with `kind='secondary'`
3. Replace `type='dashed'` with `kind='tertiary'` (closest visual match)

**Behavioral differences:**
1. Carbon Button does not support 'loading' state natively; manage externally
2. Carbon icon-only buttons use IconButton, not Button with icon prop alone

**SCSS:**
```scss
@use '@carbon/react';
```
---

### ButtonGroup
**Carbon:** `Button` from `@carbon/react`
**Import:** `import { Button } from '@carbon/react'`
**Complexity:** low — No dedicated ButtonGroup in Carbon; use inline flex layout with Button components.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| size | — | no equivalent |
| shape | — | no equivalent |
| ghost | — | no equivalent |

**Structural changes:**
1. Replace ButtonGroup wrapper with a div using inline flex layout
2. Each child Button maps individually
3. Remove size, shape, ghost props from group level — apply per button

**Behavioral differences:**
1. Carbon has no ButtonGroup concept; buttons are standalone or composed with CSS
2. No shared border-radius collapse between adjacent buttons

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Input
**Carbon:** `TextInput` from `@carbon/react`
**Import:** `import { TextInput } from '@carbon/react'`
**Complexity:** low — Direct prop mapping. Label and helper text are props in Carbon, not sibling components.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| defaultValue | defaultValue | |
| disabled | disabled | |
| placeholder | placeholder | |
| size | size | |
| prefix | — | no equivalent |
| suffix | — | no equivalent |
| addonBefore | — | no equivalent |
| addonAfter | — | no equivalent |
| allowClear | — | no equivalent |
| bordered | — | no equivalent |
| maxLength | maxCount | |
| showCount | — | no equivalent |
| onChange | onChange | |
| onPressEnter | onKeyDown | |

**Structural changes:**
1. Move Form.Item label text to `labelText` prop on TextInput
2. Move Form.Item help text to `helperText` prop
3. Replace `status='error'` pattern with `invalid={true}` and `invalidText='...'`

**Behavioral differences:**
1. Carbon TextInput does not support inline addons (addonBefore/addonAfter)
2. Carbon enforces a label — set labelText or hideLabel={true}

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Input.TextArea
**Carbon:** `TextArea` from `@carbon/react`
**Import:** `import { TextArea } from '@carbon/react'`
**Complexity:** low — Near 1:1 mapping. Auto-resize behavior differs.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| defaultValue | defaultValue | |
| disabled | disabled | |
| placeholder | placeholder | |
| rows | rows | |
| autoSize | — | no equivalent |
| allowClear | — | no equivalent |
| showCount | — | no equivalent |
| maxLength | maxCount | |
| onChange | onChange | |

**Structural changes:**
1. Replace `autoSize` prop with `rows` prop (fixed height)
2. Move label and help text from Form.Item to `labelText` and `helperText` props

**Behavioral differences:**
1. Carbon TextArea has no auto-resize behavior
2. Carbon enforces a label

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Input.Password
**Carbon:** `PasswordInput` from `@carbon/react`
**Import:** `import { PasswordInput } from '@carbon/react'`
**Complexity:** low — Carbon has a dedicated PasswordInput with built-in visibility toggle.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| disabled | disabled | |
| placeholder | placeholder | |
| visibilityToggle | — | no equivalent |
| iconRender | — | no equivalent |
| onChange | onChange | |

**Structural changes:**
1. Replace Input.Password with PasswordInput
2. Remove `visibilityToggle` prop — Carbon provides this natively
3. Move label to `labelText` prop

**Behavioral differences:**
1. Carbon PasswordInput always shows visibility toggle; cannot be hidden

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Input.Search
**Carbon:** `Search` from `@carbon/react`
**Import:** `import { Search } from '@carbon/react'`
**Complexity:** low — Carbon has a dedicated Search component. enterButton equivalent handled differently.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| placeholder | placeholder | |
| enterButton | — | no equivalent |
| loading | — | no equivalent |
| onSearch | onChange | |
| allowClear | closeButton | |

**Structural changes:**
1. Replace Input.Search with Search
2. Remove `enterButton` prop — Carbon Search uses onKeyDown
3. Replace `onSearch` with `onChange` and `onKeyDown`

**Behavioral differences:**
1. Carbon Search does not have an enter-button variant; search triggers on input change or Enter key

**SCSS:**
```scss
@use '@carbon/react';
```
---

### InputNumber
**Carbon:** `NumberInput` from `@carbon/react`
**Import:** `import { NumberInput } from '@carbon/react'`
**Complexity:** low — Direct mapping. Formatter/parser props have no Carbon equivalent.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| defaultValue | defaultValue | |
| min | min | |
| max | max | |
| step | step | |
| disabled | disabled | |
| precision | — | no equivalent |
| formatter | — | no equivalent |
| parser | — | no equivalent |
| onChange | onChange | |

**Structural changes:**
1. Replace InputNumber with NumberInput
2. Replace formatter/parser with manual formatting outside the component
3. Move label to `labelText` prop

**Behavioral differences:**
1. Carbon NumberInput does not support custom number formatting
2. Carbon enforces integer-like stepping UI; decimal inputs are supported but UI is minimal

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Select
**Carbon:** `Dropdown` from `@carbon/react`
**Import:** `import { Dropdown } from '@carbon/react'`
**Complexity:** medium — Carbon Dropdown uses an items array, not child Option components. showSearch maps to ComboBox instead.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | selectedItem | |
| defaultValue | initialSelectedItem | |
| options | items | |
| disabled | disabled | |
| placeholder | label | |
| showSearch | — | no equivalent; use ComboBox |
| filterOption | — | no equivalent |
| mode | — | no equivalent; use MultiSelect |
| allowClear | — | no equivalent |
| loading | — | no equivalent |
| onChange | onChange | |
| onSearch | — | no equivalent |
| dropdownRender | — | no equivalent |
| size | size | |

**Structural changes:**
1. Replace Select with Dropdown for non-searchable selects
2. Replace `Select` with `showSearch={true}` with ComboBox
3. Convert children Option components to an items array: `items=[{id, label}]`

**Behavioral differences:**
1. Carbon Dropdown is not searchable; use ComboBox for search
2. Multi-select requires MultiSelect component, not a mode prop

**SCSS:**
```scss
@use '@carbon/react';
```
---

### AutoComplete
**Carbon:** `ComboBox` from `@carbon/react`
**Import:** `import { ComboBox } from '@carbon/react'`
**Complexity:** medium — ComboBox provides filterable selection. AutoComplete's free-text-with-suggestions pattern maps well.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | selectedItem | |
| options | items | |
| dataSource | items | |
| disabled | disabled | |
| placeholder | placeholder | |
| filterOption | shouldFilterItem | |
| onSelect | onChange | |
| onSearch | onInputChange | |
| onChange | onInputChange | |

**Structural changes:**
1. Replace AutoComplete with ComboBox
2. Convert options/dataSource to items array
3. Replace `onSelect` and `onSearch` with `onChange` and `onInputChange`

**Behavioral differences:**
1. Carbon ComboBox always filters from items list; pure free-text input requires TextInput
2. ComboBox selection clears input on close if no match

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Checkbox
**Carbon:** `Checkbox` from `@carbon/react`
**Import:** `import { Checkbox } from '@carbon/react'`
**Complexity:** low — Direct mapping. Indeterminate state is supported in Carbon.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | checked | |
| defaultChecked | defaultChecked | |
| disabled | disabled | |
| indeterminate | indeterminate | |
| onChange | onChange | |
| children | labelText | |

**Structural changes:**
1. Replace `checked` with `checked`
2. Replace `indeterminate` with `indeterminate`
3. Move label text from children to `labelText` prop

**Behavioral differences:**
1. Carbon Checkbox requires labelText prop; inline children text is not used

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Checkbox.Group
**Carbon:** `CheckboxGroup` from `@carbon/react`
**Import:** `import { CheckboxGroup, Checkbox } from '@carbon/react'`
**Complexity:** low — Use CheckboxGroup wrapper with individual Checkbox children.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | — | no equivalent; manage per Checkbox |
| defaultValue | — | no equivalent |
| options | — | no equivalent; convert to JSX children |
| disabled | disabled | |
| onChange | — | no equivalent; manage per Checkbox |

**Structural changes:**
1. Replace Checkbox.Group with CheckboxGroup
2. Convert options array to individual Checkbox components
3. Move group label to `legendText` on CheckboxGroup

**Behavioral differences:**
1. Carbon CheckboxGroup is a layout wrapper; state management is done per Checkbox
2. No built-in group-level onChange; manage selected values in component state

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Radio
**Carbon:** `RadioButton` from `@carbon/react`
**Import:** `import { RadioButton } from '@carbon/react'`
**Complexity:** low — Direct mapping within a RadioButtonGroup.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| checked | checked | |
| disabled | disabled | |
| children | labelText | |
| onChange | onChange | |

**Structural changes:**
1. Wrap Radio buttons in RadioButtonGroup
2. Replace `value` with `value`
3. Move label to `labelText` prop

**Behavioral differences:**
1. Carbon RadioButton must be inside RadioButtonGroup for proper a11y

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Radio.Group
**Carbon:** `RadioButtonGroup` from `@carbon/react`
**Import:** `import { RadioButtonGroup, RadioButton } from '@carbon/react'`
**Complexity:** low — RadioButtonGroup is a direct match. Options array pattern needs to be converted to JSX children.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | valueSelected | |
| defaultValue | defaultSelected | |
| disabled | disabled | |
| options | — | no equivalent; use RadioButton children |
| onChange | onChange | |
| name | name | |

**Structural changes:**
1. Replace Radio.Group with RadioButtonGroup
2. Replace options array with RadioButton children
3. Replace `onChange(e)` with `onChange(value, name, e)`

**Behavioral differences:**
1. Carbon onChange signature is (value, name, event) not (event)
2. No options array support; must use RadioButton children

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Switch
**Carbon:** `Toggle` from `@carbon/react`
**Import:** `import { Toggle } from '@carbon/react'`
**Complexity:** low — Direct mapping. Carbon Toggle uses labelText, labelA, labelB for on/off labels.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| checked | toggled | |
| defaultChecked | defaultToggled | |
| disabled | disabled | |
| loading | — | no equivalent |
| checkedChildren | labelB | |
| unCheckedChildren | labelA | |
| size | size | |
| onChange | onToggle | |

**Structural changes:**
1. Replace Switch with Toggle
2. Replace `checked` with `toggled`
3. Replace `checkedChildren`/`unCheckedChildren` with `labelA` (off) and `labelB` (on)

**Behavioral differences:**
1. Carbon Toggle onToggle receives (checked, id, event) not (checked, event)

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Slider
**Carbon:** `Slider` from `@carbon/react`
**Import:** `import { Slider } from '@carbon/react'`
**Complexity:** medium — Carbon Slider requires labelText and explicit min/max labels. Range slider uses an unstable API.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| defaultValue | value | |
| min | min | |
| max | max | |
| step | step | |
| disabled | disabled | |
| marks | — | no equivalent |
| range | — | no equivalent |
| tooltip | — | no equivalent |
| onChange | onChange | |
| onAfterChange | — | no equivalent |

**Structural changes:**
1. Replace Slider with Carbon Slider
2. Add `labelText` prop for accessibility
3. Replace `marks` with `minLabel`/`maxLabel`

**Behavioral differences:**
1. Carbon Slider has no range mode in the stable API
2. No custom marks; use minLabel and maxLabel for endpoints only

**SCSS:**
```scss
@use '@carbon/react';
```
---

### DatePicker
**Carbon:** `DatePicker` from `@carbon/react`
**Import:** `import { DatePicker, DatePickerInput } from '@carbon/react'`
**Complexity:** medium — Carbon DatePicker wraps DatePickerInput. Uses flatpickr under the hood. Date format and locale differ.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| defaultValue | value | |
| format | dateFormat | flatpickr syntax |
| disabled | disabled | |
| disabledDate | — | no equivalent; use minDate/maxDate |
| open | — | no equivalent |
| placeholder | — | no equivalent; set on DatePickerInput |
| onChange | onChange | |
| onOk | — | no equivalent |
| picker | — | no equivalent |
| showTime | — | no equivalent |

**Structural changes:**
1. Wrap DatePickerInput inside DatePicker
2. Replace `value` with `value` on DatePicker
3. Replace `format` prop with `dateFormat` using flatpickr syntax

**Behavioral differences:**
1. Carbon DatePicker uses flatpickr date format tokens, not moment/dayjs tokens
2. showTime is not supported; use TimePicker separately

**SCSS:**
```scss
@use '@carbon/react';
```
---

### RangePicker
**Carbon:** `DatePicker` from `@carbon/react`
**Import:** `import { DatePicker, DatePickerInput } from '@carbon/react'`
**Complexity:** medium — Carbon DatePicker supports datePickerType='range' with two DatePickerInput children.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| defaultValue | value | |
| format | dateFormat | |
| disabled | disabled | |
| disabledDate | — | no equivalent |
| onChange | onChange | |
| separator | — | no equivalent |

**Structural changes:**
1. Replace RangePicker with `DatePicker datePickerType='range'`
2. Add two DatePickerInput children (start and end)
3. Convert [start, end] value tuple to separate values

**Behavioral differences:**
1. Carbon range picker is two separate inputs visually linked by DatePicker
2. No separator customization

**SCSS:**
```scss
@use '@carbon/react';
```
---

### TimePicker
**Carbon:** `TimePicker` from `@carbon/react`
**Import:** `import { TimePicker, TimePickerSelect } from '@carbon/react'`
**Complexity:** medium — Carbon TimePicker is a text input with an AM/PM select; Ant Design uses a scrollable time wheel.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| value | value | |
| defaultValue | value | |
| format | — | no equivalent |
| disabled | disabled | |
| use12Hours | — | no equivalent |
| minuteStep | — | no equivalent |
| onChange | onChange | |
| onOk | — | no equivalent |

**Structural changes:**
1. Replace TimePicker with Carbon TimePicker + TimePickerSelect for AM/PM
2. Time value is a string, not a dayjs/moment object
3. No time-wheel UI; Carbon TimePicker is a text-based input

**Behavioral differences:**
1. Carbon TimePicker has no scrollable time picker UI
2. AM/PM is a separate TimePickerSelect component

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Upload
**Carbon:** `FileUploader` from `@carbon/react`
**Import:** `import { FileUploader } from '@carbon/react'`
**Complexity:** high — Ant Design Upload handles upload state internally with action prop. Carbon FileUploader is purely UI — upload logic must be implemented separately.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| action | — | no equivalent |
| accept | accept | |
| multiple | multiple | |
| disabled | disabled | |
| fileList | — | no equivalent |
| onChange | — | no equivalent |
| beforeUpload | — | no equivalent |
| customRequest | — | no equivalent |
| listType | — | no equivalent |
| showUploadList | — | no equivalent |
| maxCount | — | no equivalent |
| directory | — | no equivalent |

**Structural changes:**
1. Replace Upload with FileUploader
2. Remove action, customRequest, beforeUpload — implement upload logic manually
3. Replace `listType='dragger'` with FileUploaderDropContainer

**Behavioral differences:**
1. Carbon FileUploader has no built-in upload mechanism
2. File list and upload progress must be managed with FileUploaderItem components

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Form
**Carbon:** `Form` from `@carbon/react`
**Import:** `import { Form } from '@carbon/react'`
**Complexity:** high — Ant Design Form includes built-in validation, field registration, and watch via Form.useForm(). Carbon Form is a plain HTML form wrapper — validation must be handled externally (e.g. react-hook-form).
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| form | — | no equivalent |
| initialValues | — | no equivalent |
| layout | — | no equivalent |
| onFinish | onSubmit | |
| onFinishFailed | — | no equivalent |
| onValuesChange | — | no equivalent |
| validateTrigger | — | no equivalent |
| preserve | — | no equivalent |

**Structural changes:**
1. Replace Form with Carbon Form
2. Remove Form.useForm() — use react-hook-form or manual state
3. Remove Form.Item wrappers — move label/help/error to each Carbon input component's props

**Behavioral differences:**
1. Carbon has no form field registration or validation system
2. Each Carbon input handles its own invalid state via `invalid` and `invalidText` props

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Table
**Carbon:** `DataTable` from `@carbon/react`
**Import:** `import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react'`
**Complexity:** high — Carbon DataTable uses a render-prop pattern with headers/rows data arrays, very different from Ant Design's columns/dataSource declarative API.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| columns | headers | |
| dataSource | rows | |
| rowKey | — | no equivalent |
| pagination | — | no equivalent; use Pagination |
| rowSelection | — | no equivalent; use built-in selection |
| loading | — | no equivalent |
| scroll | — | no equivalent |
| expandable | — | no equivalent; use expandedRows |
| onChange | — | no equivalent |
| size | size | |
| bordered | — | no equivalent |
| showHeader | — | no equivalent |

**Structural changes:**
1. Convert columns array to headers array: `[{key, header}]`
2. Convert dataSource to rows array: `[{id, ...fieldValues}]`
3. Replace Table with DataTable render-prop component

**Behavioral differences:**
1. Carbon DataTable uses render props, not columns/dataSource declarative API
2. Pagination is a separate Pagination component, not a table prop

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Modal
**Carbon:** `Modal` from `@carbon/react`
**Import:** `import { Modal } from '@carbon/react'`
**Complexity:** medium — Similar concept but Carbon Modal uses open/onClose with ModalHeader/Body/Footer subcomponents.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | open | |
| visible | open | |
| title | modalHeading | |
| onOk | onRequestSubmit | |
| onCancel | onRequestClose | |
| footer | — | no equivalent |
| width | — | no equivalent; use size prop |
| centered | — | no equivalent |
| maskClosable | preventCloseOnClickOutside | |
| destroyOnClose | — | no equivalent |
| closable | — | no equivalent |
| okText | primaryButtonText | |
| cancelText | secondaryButtonText | |
| confirmLoading | — | no equivalent |

**Structural changes:**
1. Replace `visible`/`open` with `open`
2. Replace `onCancel` with `onRequestClose`
3. Replace `onOk` with `onRequestSubmit`

**Behavioral differences:**
1. Carbon Modal is always centered
2. Footer buttons are defined as props, not render slots

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Drawer
**Carbon:** `SideNav` from `@carbon/react`
**Import:** `import { SideNav } from '@carbon/react'`
**Complexity:** high — Carbon SideNav is a navigation shell element, not a general-purpose side panel. For a slide-over panel, consider a custom implementation using the Tile or a side panel pattern.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| open | — | no equivalent |
| visible | — | no equivalent |
| onClose | — | no equivalent |
| placement | — | no equivalent |
| width | — | no equivalent |
| title | — | no equivalent |
| closable | — | no equivalent |
| maskClosable | — | no equivalent |
| destroyOnClose | — | no equivalent |

**Structural changes:**
1. Carbon has no dedicated Drawer panel component
2. Use SideNav for persistent navigation drawers
3. For temporary overlay drawers, implement with a div + CSS transition overlay pattern

**Behavioral differences:**
1. Carbon has no first-class Drawer component in @carbon/react
2. Temporary drawers require custom overlay implementation

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Notification
**Carbon:** `ToastNotification` from `@carbon/react`
**Import:** `import { ToastNotification } from '@carbon/react'`
**Complexity:** medium — Carbon ToastNotification is a rendered component. Ant Design notification uses an imperative API. Requires a notification manager pattern in Carbon.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| message | title | |
| description | subtitle | |
| type | kind | |
| duration | timeout | |
| icon | — | no equivalent |
| placement | — | no equivalent |
| onClose | onCloseButtonClick | |

**Structural changes:**
1. Replace `notification.open()` with a state-driven ToastNotification component
2. Manage notification queue in state or via a context provider
3. Replace `type` with `kind` (success, error, warning, info)

**Behavioral differences:**
1. Carbon has no imperative notification API; must manage state
2. ToastNotification does not auto-position; wrap in a fixed-position container

**SCSS:**
```scss
@use '@carbon/react';
```
---

### message
**Carbon:** `ToastNotification` from `@carbon/react`
**Import:** `import { ToastNotification } from '@carbon/react'`
**Complexity:** medium — Ant message API is fully imperative. Carbon requires declarative state management.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| content | title | |
| duration | timeout | |
| onClose | onCloseButtonClick | |
| type | kind | |

**Structural changes:**
1. Replace `message.success()`, `message.error()` etc. with state-driven ToastNotification
2. Implement a useNotification hook or context provider
3. Replace `message.loading()` with a Loading overlay or InlineLoading

**Behavioral differences:**
1. No imperative API equivalent in Carbon
2. Loading messages require InlineLoading component separately

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Alert
**Carbon:** `InlineNotification` from `@carbon/react`
**Import:** `import { InlineNotification } from '@carbon/react'`
**Complexity:** low — Direct mapping. Carbon uses kind instead of type.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| type | kind | |
| message | title | |
| description | subtitle | |
| showIcon | — | no equivalent |
| closable | — | no equivalent |
| closeText | — | no equivalent |
| banner | — | no equivalent |
| onClose | onCloseButtonClick | |
| action | — | no equivalent; use ActionableNotification |

**Structural changes:**
1. Replace Alert with InlineNotification
2. Replace `type` with `kind` (success, error, warning, info)
3. Replace `message` with `title`

**Behavioral differences:**
1. Carbon InlineNotification does not support banner mode
2. Action buttons use ActionableNotification

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Tooltip
**Carbon:** `Tooltip` from `@carbon/react`
**Import:** `import { Tooltip } from '@carbon/react'`
**Complexity:** low — Direct mapping. Carbon Tooltip wraps a trigger element as children.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title | description | |
| placement | align | |
| trigger | — | no equivalent |
| visible | open | |
| defaultVisible | defaultOpen | |
| color | — | no equivalent |
| overlayStyle | — | no equivalent |
| mouseEnterDelay | — | no equivalent |
| mouseLeaveDelay | — | no equivalent |
| onVisibleChange | — | no equivalent |

**Structural changes:**
1. Replace `title` prop with `description` or children text
2. Carbon Tooltip wraps its trigger as children
3. Replace `placement` with `align` and `direction`

**Behavioral differences:**
1. Carbon Tooltip trigger is the child element, not a separate prop
2. Rich HTML content in tooltip requires description as JSX

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Popover
**Carbon:** `Popover` from `@carbon/react`
**Import:** `import { Popover, PopoverContent } from '@carbon/react'`
**Complexity:** medium — Carbon Popover is lower-level; it wraps a trigger and content. No built-in title/content slots.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| content | — | no equivalent; use PopoverContent |
| title | — | no equivalent |
| placement | align | |
| trigger | — | no equivalent |
| visible | open | |
| onVisibleChange | — | no equivalent |

**Structural changes:**
1. Replace Popover with Carbon Popover + PopoverContent
2. Manage open state externally
3. Title/content layout inside PopoverContent is custom markup

**Behavioral differences:**
1. Carbon Popover requires explicit open state management
2. No built-in title/content sections — lay out manually inside PopoverContent

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Tabs
**Carbon:** `Tabs` from `@carbon/react`
**Import:** `import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react'`
**Complexity:** medium — Carbon Tabs uses a composable API with TabList, Tab, TabPanels, TabPanel. Ant Design uses Tabs.TabPane.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| activeKey | selectedIndex | |
| defaultActiveKey | defaultSelectedIndex | |
| type | — | no equivalent |
| size | — | no equivalent |
| tabPosition | — | no equivalent |
| tabBarExtraContent | — | no equivalent |
| onChange | onChange | |
| onTabClick | — | no equivalent |
| destroyInactiveTabPane | — | no equivalent |

**Structural changes:**
1. Replace Tabs with Carbon Tabs
2. Replace Tabs.TabPane with TabPanel inside TabPanels
3. Add TabList wrapper around Tab items

**Behavioral differences:**
1. Carbon onChange receives tab index (number), not key string
2. Tab position is always top in Carbon

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Collapse
**Carbon:** `Accordion` from `@carbon/react`
**Import:** `import { Accordion, AccordionItem } from '@carbon/react'`
**Complexity:** low — Direct mapping. Carbon AccordionItem uses title prop for header text.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| activeKey | — | no equivalent; control per AccordionItem |
| defaultActiveKey | — | no equivalent |
| accordion | — | no equivalent |
| bordered | — | no equivalent |
| expandIconPosition | — | no equivalent |
| ghost | — | no equivalent |
| onChange | — | no equivalent |

**Structural changes:**
1. Replace Collapse with Accordion
2. Replace Collapse.Panel with AccordionItem
3. Replace `header` prop with `title` prop on AccordionItem

**Behavioral differences:**
1. Carbon Accordion manages open state per AccordionItem
2. No accordion-mode (only one open at a time) built in; implement with controlled open props

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Breadcrumb
**Carbon:** `Breadcrumb` from `@carbon/react`
**Import:** `import { Breadcrumb, BreadcrumbItem } from '@carbon/react'`
**Complexity:** low — Direct mapping. Use BreadcrumbItem for each step.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| items | — | no equivalent; use BreadcrumbItem children |
| separator | — | no equivalent |
| params | — | no equivalent |

**Structural changes:**
1. Replace Breadcrumb with Carbon Breadcrumb
2. Replace Breadcrumb.Item with BreadcrumbItem
3. Move `href` to BreadcrumbItem

**Behavioral differences:**
1. Carbon separator is always /; not configurable
2. No items array API; must use BreadcrumbItem children

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Pagination
**Carbon:** `Pagination` from `@carbon/react`
**Import:** `import { Pagination } from '@carbon/react'`
**Complexity:** low — Direct mapping. Carbon Pagination uses totalItems + pageSize pattern.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| current | page | |
| total | totalItems | |
| pageSize | pageSize | |
| defaultCurrent | page | |
| defaultPageSize | pageSize | |
| showSizeChanger | — | no equivalent |
| showQuickJumper | — | no equivalent |
| showTotal | — | no equivalent |
| disabled | disabled | |
| onChange | onChange | |

**Structural changes:**
1. Replace `total` with `totalItems`
2. Replace `current`/`page` with `page`
3. Replace `onChange(page, pageSize)` with `onChange({page, pageSize})`

**Behavioral differences:**
1. Carbon onChange receives {page, pageSize} object
2. Carbon Pagination always shows page size selector; use pageSizes prop to configure options

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Progress
**Carbon:** `ProgressBar` from `@carbon/react`
**Import:** `import { ProgressBar } from '@carbon/react'`
**Complexity:** low — Carbon ProgressBar maps to Ant Design line type. Steps type maps to ProgressIndicator.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| percent | value | |
| type | — | no equivalent |
| status | status | |
| showInfo | — | no equivalent |
| strokeColor | — | no equivalent |
| trailColor | — | no equivalent |
| strokeWidth | — | no equivalent |
| format | — | no equivalent |
| steps | — | no equivalent |

**Structural changes:**
1. Replace `Progress type='line'` with ProgressBar
2. Replace `Progress type='step'` with ProgressIndicator
3. Replace `percent` with `value` (0-100)

**Behavioral differences:**
1. Carbon ProgressBar does not support circular/dashboard types
2. No custom color; uses Carbon theme tokens

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Spin
**Carbon:** `Loading` from `@carbon/react`
**Import:** `import { Loading } from '@carbon/react'`
**Complexity:** low — Direct mapping. Carbon Loading has small and active variants.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| spinning | active | |
| size | small | |
| tip | description | |
| delay | — | no equivalent |
| indicator | — | no equivalent |

**Structural changes:**
1. Replace Spin with Loading
2. Replace `spinning` prop with `active`
3. Replace `size='small'` with `small={true}`

**Behavioral differences:**
1. Carbon Loading does not wrap content like Ant Design Spin
2. Use `withOverlay` for fullscreen loading

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Skeleton
**Carbon:** `SkeletonText` from `@carbon/react`
**Import:** `import { SkeletonText, SkeletonPlaceholder } from '@carbon/react'`
**Complexity:** low — Carbon provides SkeletonText for text lines and SkeletonPlaceholder for block areas.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| active | — | no equivalent; always animated |
| avatar | — | no equivalent |
| paragraph | paragraph | |
| title | — | no equivalent |
| round | — | no equivalent |
| loading | — | no equivalent |

**Structural changes:**
1. Replace Skeleton with SkeletonText for text content
2. Replace Skeleton with SkeletonPlaceholder for image/block placeholders
3. Replace `active` prop — Carbon skeletons always animate

**Behavioral differences:**
1. Carbon skeleton animation is always on
2. SkeletonText and SkeletonPlaceholder are separate components

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Menu
**Carbon:** `SideNav` from `@carbon/react`
**Import:** `import { SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem } from '@carbon/react'`
**Complexity:** high — Ant Design Menu is a general-purpose navigation component. Carbon SideNav is specific to shell navigation. Horizontal menus require Header navigation components.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| items | — | no equivalent |
| mode | — | no equivalent |
| selectedKeys | — | no equivalent |
| openKeys | — | no equivalent |
| defaultSelectedKeys | — | no equivalent |
| defaultOpenKeys | — | no equivalent |
| inlineCollapsed | isRail | |
| theme | — | no equivalent |
| onClick | — | no equivalent |
| onSelect | — | no equivalent |
| onOpenChange | — | no equivalent |

**Structural changes:**
1. Replace vertical Menu with SideNav + SideNavItems
2. Replace Menu.Item with SideNavLink
3. Replace Menu.SubMenu with SideNavMenu containing SideNavMenuItems

**Behavioral differences:**
1. Carbon SideNav is tightly coupled to the shell layout
2. No horizontal menu in SideNav; use HeaderNavigation for top nav

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Dropdown
**Carbon:** `OverflowMenu` from `@carbon/react`
**Import:** `import { OverflowMenu, OverflowMenuItem } from '@carbon/react'`
**Complexity:** medium — Ant Design Dropdown is a trigger + overlay menu. Carbon OverflowMenu is for icon-triggered action lists. For select behavior, use Carbon Dropdown.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| menu | — | no equivalent |
| overlay | — | no equivalent |
| trigger | — | no equivalent |
| placement | — | no equivalent |
| visible | open | |
| disabled | disabled | |
| onVisibleChange | — | no equivalent |

**Structural changes:**
1. Replace action Dropdowns (menu of actions) with OverflowMenu + OverflowMenuItem
2. Replace selection Dropdowns with Carbon Dropdown component
3. Remove `trigger` prop — OverflowMenu always triggers on click

**Behavioral differences:**
1. Carbon OverflowMenu does not support hover triggers
2. No custom trigger element; always a kebab icon unless children overridden

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Cascader
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** custom — No Carbon equivalent for cascading multi-level select. Implement with nested Dropdown or ComboBox components.
**Status:** custom_required

**Structural changes:**
1. Implement cascading selection using multiple Dropdown components
2. Manage selection state externally to populate subsequent dropdown options
3. Consider using ComboBox with dynamic option filtering

**Behavioral differences:**
1. No single Carbon component handles cascading hierarchical selection

**SCSS:**
```scss
@use '@carbon/react';
```
---

### TreeSelect
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** custom — No Carbon equivalent for tree-structured selection input.
**Status:** custom_required

**Structural changes:**
1. Implement with TreeView for display and a separate selection mechanism
2. Consider a Popover containing a TreeView as a custom pattern

**Behavioral differences:**
1. No Carbon component combines tree navigation with input selection

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Tree
**Carbon:** `TreeView` from `@carbon/react`
**Import:** `import { TreeView, TreeNode } from '@carbon/react'`
**Complexity:** medium — Carbon TreeView uses TreeNode children, not a data tree prop. Checkbox and drag-drop modes differ.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| treeData | — | no equivalent; convert to TreeNode JSX |
| checkable | — | no equivalent |
| checkedKeys | — | no equivalent |
| defaultCheckedKeys | — | no equivalent |
| expandedKeys | — | no equivalent |
| selectedKeys | selected | |
| defaultExpandedKeys | — | no equivalent |
| draggable | — | no equivalent |
| onSelect | onSelect | |
| onCheck | — | no equivalent |
| onExpand | — | no equivalent |
| showIcon | — | no equivalent |
| showLine | — | no equivalent |

**Structural changes:**
1. Replace Tree with TreeView
2. Replace `treeData` with TreeNode children (convert data to JSX)
3. Remove `draggable` — no drag-and-drop in Carbon TreeView

**Behavioral differences:**
1. Carbon TreeView has no drag-and-drop
2. Tree data must be converted to TreeNode JSX components

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Tag
**Carbon:** `Tag` from `@carbon/react`
**Import:** `import { Tag } from '@carbon/react'`
**Complexity:** low — Direct mapping. Carbon Tag uses type for semantic colors.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| color | type | |
| closable | filter | |
| onClose | onClose | |
| bordered | — | no equivalent |
| icon | renderIcon | |
| onClick | onClick | |

**Structural changes:**
1. Replace `color` prop with `type` prop using Carbon semantic types
2. Replace `closable` with `filter` prop for dismissible tags
3. Replace `onClose` with `onClose` on filter Tag

**Behavioral differences:**
1. Carbon Tag types are semantic (blue, green, red, etc.) not arbitrary colors
2. Dismissible tag requires `filter={true}`

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Badge
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** custom — Carbon has no badge/counter overlay component. Carbon Tag can display counts but does not position over other elements.
**Status:** custom_required

**Structural changes:**
1. Use CSS position:absolute with a styled span or Tag to replicate badge overlay
2. For notification counts, implement with a custom CSS counter bubble

**Behavioral differences:**
1. No Badge component in Carbon; requires custom CSS overlay implementation

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Avatar
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** custom — Carbon has no Avatar component. Use HTML img or a custom circular element.
**Status:** unsupported

**Structural changes:**
1. Replace Avatar with HTML img element and CSS border-radius:50%
2. For user initials display, use a styled div with Carbon typography

**Behavioral differences:**
1. No Carbon Avatar; implement with HTML/CSS

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Steps
**Carbon:** `ProgressIndicator` from `@carbon/react`
**Import:** `import { ProgressIndicator, ProgressStep } from '@carbon/react'`
**Complexity:** low — Direct mapping. Carbon ProgressIndicator uses currentIndex.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| current | currentIndex | |
| direction | vertical | |
| type | — | no equivalent |
| size | — | no equivalent |
| status | — | no equivalent; set per ProgressStep |
| onChange | onChange | |
| progressDot | — | no equivalent |

**Structural changes:**
1. Replace Steps with ProgressIndicator
2. Replace Steps.Step with ProgressStep
3. Replace `current` with `currentIndex`

**Behavioral differences:**
1. Carbon ProgressIndicator step status is per-step, not a global status
2. No progress percentage within steps

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Timeline
**Carbon:** `StructuredList` from `@carbon/react`
**Import:** `import { StructuredList, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell } from '@carbon/react'`
**Complexity:** custom — No Carbon equivalent. StructuredList can approximate timeline visually with custom CSS for the vertical connector line.
**Status:** custom_required

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| mode | — | no equivalent |
| pending | — | no equivalent |
| pendingDot | — | no equivalent |
| reverse | — | no equivalent |

**Structural changes:**
1. Replace Timeline with StructuredList
2. Implement vertical connector line with custom SCSS
3. Map each Timeline.Item to a StructuredListRow

**Behavioral differences:**
1. StructuredList is a data display pattern, not a timeline
2. Connector line and timeline dot must be implemented with custom CSS

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Card
**Carbon:** `Tile` from `@carbon/react`
**Import:** `import { Tile, ClickableTile } from '@carbon/react'`
**Complexity:** low — Tile replaces Card. Clickable cards map to ClickableTile. Carbon Tile is a simple container.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| title | — | no equivalent |
| extra | — | no equivalent |
| cover | — | no equivalent |
| actions | — | no equivalent |
| hoverable | — | no equivalent |
| bordered | — | no equivalent |
| size | size | |
| loading | — | no equivalent |
| onClick | — | no equivalent; use ClickableTile |

**Structural changes:**
1. Replace Card with Tile
2. Replace Card with onClick with ClickableTile
3. Card title/content/actions must be custom markup inside Tile

**Behavioral differences:**
1. Carbon Tile is a plain container; no header/footer/actions structure
2. ClickableTile for interactive cards

**SCSS:**
```scss
@use '@carbon/react';
```
---

### List
**Carbon:** `StructuredList` from `@carbon/react`
**Import:** `import { StructuredList, StructuredListBody, StructuredListRow, StructuredListCell } from '@carbon/react'`
**Complexity:** medium — StructuredList replaces List for data display. No virtual scroll. No load-more.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| dataSource | — | no equivalent |
| renderItem | — | no equivalent |
| loading | — | no equivalent |
| loadMore | — | no equivalent |
| pagination | — | no equivalent |
| header | — | no equivalent |
| footer | — | no equivalent |
| bordered | — | no equivalent |
| size | size | |
| split | — | no equivalent |
| virtual | — | no equivalent |

**Structural changes:**
1. Replace List with StructuredList
2. Replace List.Item with StructuredListRow
3. Replace List.Item.Meta with StructuredListCells

**Behavioral differences:**
1. StructuredList has no virtual scroll
2. No built-in load-more or pagination

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Divider
**Carbon:** `Divider` from `@carbon/react`
**Import:** `import { Divider } from '@carbon/react'`
**Complexity:** low — Direct mapping. Carbon Divider is a simple hr element.
**Status:** mapped

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| type | — | no equivalent |
| orientation | — | no equivalent |
| dashed | — | no equivalent |
| plain | — | no equivalent |
| children | — | no equivalent |

**Structural changes:**
1. Replace Divider with Carbon Divider
2. Remove children/text — Carbon Divider has no text content
3. Remove dashed/orientation props

**Behavioral differences:**
1. Carbon Divider is a plain horizontal rule; no text label support

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Typography.Title
**Carbon:** — (no equivalent)
**Import:** —
**Complexity:** low — Use HTML h1-h6 elements with Carbon typography CSS classes.
**Status:** unsupported

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| level | — | no equivalent |
| type | — | no equivalent |
| underline | — | no equivalent |
| delete | — | no equivalent |
| strong | — | no equivalent |

**Structural changes:**
1. Replace Typography.Title with h1-h6 HTML elements
2. Apply Carbon type scale classes via CSS: `$cds-productive-heading-01` etc.
3. Use @carbon/react SCSS type mixins for font styling

**Behavioral differences:**
1. No Carbon Typography component; use HTML elements + SCSS type tokens

**SCSS:**
```scss
@use '@carbon/react';
```
---

### Layout
**Carbon:** `Grid` from `@carbon/react`
**Import:** `import { Grid, Column } from '@carbon/react'`
**Complexity:** high — Ant Design Layout uses a shell wrapper pattern. Carbon uses the UIShell pattern with Header, SideNav, and a content Grid.
**Status:** partial

**Prop map:**
| Source Prop | Carbon Prop | Notes |
|-------------|-------------|-------|
| hasSider | — | no equivalent |

**Structural changes:**
1. Replace Layout with Carbon UIShell pattern
2. Replace Layout.Header with Carbon Header component
3. Replace Layout.Sider with SideNav

**Behavioral differences:**
1. Carbon UIShell is opinionated about shell structure
2. Content area uses 16-column grid system

**SCSS:**
```scss
@use '@carbon/react';
```
---
