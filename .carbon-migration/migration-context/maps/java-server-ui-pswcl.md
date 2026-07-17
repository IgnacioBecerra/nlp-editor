# Java Server UI (ps-wcl) → Carbon React Map

> **Load rule:** this file is loaded automatically when the job's
> `source_framework` is `java-server-ui` AND the `source_subtype` is
> `ps-wcl`. Loaded ONCE per session. Other subtypes (reserved: `struts`,
> `jsf`) load a different map file.
>
> **Scope:** this map covers the IBM Presentation Services Web Component
> Library (PSW WCL) used by IBM Tivoli/Security Identity Manager and
> similar enterprise Java apps. The source code is read-only under
> platform-modernize — the map tells the FED agent what Carbon React
> component to author in `<new_app_root>` for each PSW Java widget it
> encounters while reading source views.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## PSW package families

PSW ships four sibling packages. Each is a separate mapping target:

| Package | Role | Typical count in a real app |
|---|---|---|
| `com.ibm.psw.wcl` | Widgets (WTable, WTree, WForm, WButton, …) | High — the core UI primitives |
| `com.ibm.psw.wcc` | Console chrome (canvas, portfolio, taskbar, mediator, skins) | Low — replace wholesale with Carbon UIShell |
| `com.ibm.psw.cct` | Common Component Toolkit (config, console, context, nls) | Low — platform glue, dropped |
| `com.ibm.psw.ua` | User administration helpers | Very low — subtype-specific |

Only `wcl` has a direct Carbon-component mapping table. The other three
collapse into the Carbon UIShell + theme system wholesale.

---

## Widget → Carbon mapping (wcl)

| PSW class | Carbon React | Notes |
|---|---|---|
| `WTable` / `DefaultExtendedTableModel` | `DataTable` + `TableContainer` | Model-as-object → `rows` / `headers` arrays from REST |
| `WTree` / `DefaultExtendedTreeModel` | `TreeView` | Eager-loaded tree → lazy-load via REST on node expand |
| `WForm` | `Form` + Carbon form fields | Server round-trip per field → controlled state + onSubmit |
| `WComponent` / `WContainer` | composition via JSX | No direct mapping — these are PSW layout primitives |
| `WTextEntry` | `TextInput` | `maxlength` → `maxLength`; `required` → `required` |
| `WTextArea` | `TextArea` | — |
| `WComboBox` | `ComboBox` / `Dropdown` | Options from server model → fetched options |
| `WCheckBox` | `Checkbox` | — |
| `WRadioButtonGroup` | `RadioButtonGroup` | — |
| `WButton` | `Button` | Kind (primary/secondary/ghost) per PSW style constant |
| `WDateChooser` | `DatePicker` | Locale-aware; preserve the user's session locale |
| `WTimeChooser` | `TimePicker` | — |
| `WMessageBox` (`psw.wcl.components.message`) | `InlineNotification` or `Modal` | Non-modal info → InlineNotification; modal → Modal |
| `WNotebook` | `Tabs` + `Tab` | Tab IDs preserved for deep-link parity |
| `WWizard` | `@carbon/ibm-products` `CreateFullPage` or `CreateTearsheet` | Progressive disclosure w/ `ProgressIndicator` |
| `WBubbleHelp` | `Tooltip` or `HelperText` | Inline help copy moves to `helperText` prop |
| `WDualList` | `StructuredList` pair, or custom w/ `DataTable` | Check precedent in-repo React first — common there |
| `WPopupMenu` / `MenuInfo` / `MenuItemInfo` | `OverflowMenu` + `OverflowMenuItem` | — |
| `FDAInfo` / `IMessageConsumer` / `IMessageProducer` | React context or status mgmt (TanStack Query) | FDA = Field Data Assistance — validation message channel |

## Does NOT map (drop entirely)

These are server-rendering machinery that disappear in a client-side
React world. Do not try to port them:

- `com.ibm.psw.cct.*` console chrome classes → Carbon UIShell + SideNav
- `com.ibm.psw.wcc.*` console common components → Carbon UIShell
- `com.ibm.psw.wcl.skins` / `com.ibm.psw.wcc.skins` → Carbon theming tokens
- `com.ibm.psw.wcl.renderers` → server-side HTML renderers, dropped
- `com.ibm.psw.wcl.tags` → PSW JSP tag library wrappers (if present), dropped

## Load signals (additional context)

- Import starts with `com.ibm.psw.wcl.` / `com.ibm.psw.wcc.` / `com.ibm.psw.cct.` / `com.ibm.psw.ua.`
- References to W-prefixed class names: `WTable`, `WTree`, `WForm`, `WComponent`, `WContainer`, `WButton`, `WTextEntry`, `WComboBox`, `WCheckBox`, `WDateChooser`, `WNotebook`, `WMessageBox`, `WDualList`, `WBubbleHelp`, `WPopupMenu`
- `MenuInfo`, `MenuItemInfo`, `FDAInfo`, `IMessageConsumer`, `IMessageProducer` type references
- Local wrapper `com.ibm.itim.ui.customizer.widgets.WTable` (ITIM-specific subclass shim; same mapping applies)

## Related companion files

- `patterns/java-server-ui-dispatch.md` — the single-dispatcher Strangler-Fig pattern for classes-as-pages source like ITIMControlServlet.
- `patterns/java-server-ui-i18n-bridge.md` — `.properties` → JSON conversion with positional-to-named arg rewrite.
- `scaffolds/java-server-ui-to-carbon-react.md` — the 5-stage bootstrap recipe the Architect uses to stand up `<new_app_root>` from scratch.
