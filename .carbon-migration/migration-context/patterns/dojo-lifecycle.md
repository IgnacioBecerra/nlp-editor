# Dojo Widget Lifecycle → React Hooks Patterns

> Source: `dojo.declare`-based widgets (Dijit, Dojox, dgrid subclasses)
> Target: React functional components with hooks (`@carbon/react` v11 context)
> Last updated: 2026-04

**LOAD RULE:** Load this file only when `dojo.declare` lifecycle methods (`postCreate`, `startup`, `destroy`, `_setXAttr`, etc.) appear in the scoped files. Usually triggered alongside `maps/dojo.md`.

**CO-LOCATED PRECEDENT OVERRIDE:** If the target repo has a sibling module where human authors already migrated a similar widget, their lifecycle translation is authoritative. Follow it and log a deviation only when generic guidance below would yield a different choice.

---

> **Carbon imports in this file are curated and verified as of `Last updated` above — trust them as written.** Anything you reach for that is *not literally shown in this file* (any icon, component, hook, prop, or token name) MUST be verified against the installed package via Carbon MCP `code_search` (named exports, icons) or `docs_search` (subpaths) before you write the import. Carbon's API — including its icon taxonomy — is its own; names from other libraries (Material UI, Heroicons, Phosphor, Lucide, Font Awesome, etc.) do NOT translate. Full rule: `migration-context/INDEX.md` Package API Verification block + `MIGRATION_AGENT_PROTOCOL.md` §1.3.


## Authorship note

Dojo's widget lifecycle is rich: `postMixInProperties`, `buildRendering`, `postCreate`, `startup`, `_setXAttr` / `_getXAttr`, `destroy`, `destroyRecursive`, `destroyDescendants`, `_onShow`, `_onHide`, plus pub-sub via `dojo/topic` and event wiring via `dojo/on`. React has a much smaller lifecycle surface (mount / render / effect / unmount) and expresses the same ideas differently.

This file shows the canonical translations. Complex widgets may combine multiple patterns; the combined translation sometimes warrants a deviation entry because no one-to-one mapping exists.

---

## 1. `postCreate` — runs after the DOM nodes exist, before the widget is "live"

Typical Dojo:

```javascript
postCreate: function() {
  this.inherited(arguments);
  this._myInternalNode = domConstruct.create('span', {
    className: 'my-label',
    innerHTML: this.label,
  }, this.domNode);
  this._subs.push(topic.subscribe('app/user-changed', lang.hitch(this, '_onUserChange')));
}
```

Carbon React:

```jsx
function MyWidget({ label }) {
  // Child DOM lives in the JSX tree, not constructed imperatively
  useEffect(() => {
    // Subscriptions / side effects only
    const handler = (user) => { /* _onUserChange equivalent */ };
    const unsub = appEvents.on('user-changed', handler);
    return () => unsub();
  }, []);

  return <span className="my-label">{label}</span>;
}
```

**Translation rule**: imperative DOM construction in `postCreate` disappears entirely — express the structure in JSX. Subscriptions, event bindings, and other non-DOM side effects move into a `useEffect` with an empty-array dependency.

**Deviation trigger**: if `postCreate` mutates state of sibling widgets via `dijit.registry`, the translation is a genuine refactor — log a deviation (`Agent: architecture-modernizer`, category `widget-lifecycle`) capturing the cross-widget coupling and how it was replaced (Context, lifted state, prop, store subscription).

---

## 2. `startup` — runs after all children are rendered and layout-settled

Typical Dojo:

```javascript
startup: function() {
  if (this._started) return;
  this.inherited(arguments);
  this._sizeChildren();  // now safe because children exist
}
```

Carbon React:

```jsx
const ref = useRef(null);
useLayoutEffect(() => {
  // Runs after layout; safe to measure DOM
  const size = ref.current.getBoundingClientRect();
  sizeChildren(size);
}, []);
```

**Translation rule**: `startup` → `useLayoutEffect`. The distinction matters because `startup` runs **after** layout has settled, which is what `useLayoutEffect` guarantees in React. A regular `useEffect` runs post-paint and is visible to the user as a second frame.

**Common mistake**: migrating `startup` to `useEffect` without layout concerns. If the original code only used `startup` for "ready" semantics (not DOM measurement), plain `useEffect` is fine and preferable.

---

## 3. `_setXAttr` / `_getXAttr` — custom setters/getters for widget props

Typical Dojo:

```javascript
_setValueAttr: function(value) {
  this._set('value', value);
  this.inputNode.value = value;
  this.emit('value-changed', value);
}
```

Carbon React:

```jsx
// "Prop" is just a controlled input. The setter lives in the parent.
<TextInput
  value={value}
  onChange={(e) => {
    onChange(e.target.value);
    onValueChanged?.(e.target.value);
  }}
/>
```

**Translation rule**: custom setters become **controlled components** in React. The widget's internal state transition is pushed up to the parent; the widget itself renders a function of props.

**Edge case**: if `_setXAttr` did heavy computation (transforming the value, validating asynchronously, reformatting), that computation moves to the parent's change handler — or for synchronous transforms, a `useMemo`. Async work goes in a `useEffect` that watches the prop.

**Deviation trigger**: when `_setXAttr` triggered pub-sub that other widgets listened to, **log a deviation** describing the event topic, its payload, and how you rewired it (Context, store, lifted state, direct prop callback). Event-system coupling is where silent behavioural drift hides.

---

## 4. `destroy` / `destroyRecursive` — cleanup

Typical Dojo:

```javascript
destroy: function() {
  array.forEach(this._subs, function(sub) { sub.remove(); });
  this._myInternalNode && domConstruct.destroy(this._myInternalNode);
  this.inherited(arguments);
}
```

Carbon React:

```jsx
useEffect(() => {
  const unsub = topic.subscribe(…);
  return () => unsub();  // equivalent to destroy for this subscription
}, []);
```

**Translation rule**: each effect registers its own cleanup. Carbon components tear down their own DOM when unmounted; remove imperative DOM teardown entirely.

**Edge case**: `destroyRecursive` on a container widget tore down all children. React handles this automatically via the component tree. Do not attempt to manually tear down children.

**Deviation trigger**: if `destroy` had cleanup for something outside the widget's DOM (global timers, polling intervals, external library instances) — ensure a corresponding cleanup exists in an effect. Missed cleanups are a memory-leak source; worth a deviation if the behaviour was non-obvious.

---

## 5. `dojo/topic` pub-sub — widget-to-widget communication

Typical Dojo:

```javascript
// Publisher
topic.publish('identity/user-changed', { userId: newId });

// Subscriber (in another widget)
this._subs.push(topic.subscribe('identity/user-changed', lang.hitch(this, '_onUserChange')));
```

Carbon React — three patterns, choose based on scope:

### Pattern A — React Context (narrow scope, component tree)

```jsx
const UserContext = React.createContext(null);

// Provider
<UserContext.Provider value={{ user, setUser }}>
  <App />
</UserContext.Provider>

// Subscriber
const { user } = useContext(UserContext);
```

Use when: pub-sub is scoped to a portion of the app, publishers and subscribers share a common ancestor.

### Pattern B — Store library (app-wide state)

Zustand / Redux Toolkit / Jotai — whichever the repo already uses. If no store exists, Architect's plan should pick one (with deviation logged).

```jsx
const useUserStore = create((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
}));

// Publisher
const setUser = useUserStore((s) => s.setUser);
setUser(newUser);

// Subscriber
const user = useUserStore((s) => s.user);
```

Use when: publishers and subscribers are far apart in the tree, or the app already has a store.

### Pattern C — Event library / EventTarget

```jsx
// Shared event bus (one file, exported)
export const appEvents = new EventTarget();

// Publisher
appEvents.dispatchEvent(new CustomEvent('identity/user-changed', { detail: { userId } }));

// Subscriber
useEffect(() => {
  const handler = (e) => onUserChange(e.detail.userId);
  appEvents.addEventListener('identity/user-changed', handler);
  return () => appEvents.removeEventListener('identity/user-changed', handler);
}, []);
```

Use when: the migration is incremental and Dojo code still lives alongside Carbon code, or the pub-sub crosses iframe / micro-frontend boundaries. Closest to Dojo's model semantically.

**Deviation trigger (always)**: pub-sub migration is where silent drift hides. Log a deviation for every unique topic, listing: topic name, publishers, subscribers, chosen pattern, and anything you couldn't verify (subscriber count, ordering guarantees, synchronous vs async dispatch).

---

## 6. `dojo/on` — DOM event binding

Typical Dojo:

```javascript
this.own(on(this.buttonNode, 'click', lang.hitch(this, '_onClick')));
```

Carbon React:

```jsx
<Button onClick={onClick}>Label</Button>
```

**Translation rule**: direct. React's `on*` props replace `dojo/on`. Keyed variants (`on(node, 'keyup:' + keys.ENTER, …)`) become explicit `onKeyUp` + `e.key === 'Enter'` checks.

**Edge case**: delegated events (`on(parent, '.child:click', …)`) → prefer attaching the handler to each child in React; delegation is less idiomatic and harder to reason about.

---

## 7. `dojo/_base/lang.hitch` — binding `this`

Typical Dojo:

```javascript
topic.subscribe('foo', lang.hitch(this, '_handler'));
```

Carbon React: not needed. Arrow functions or `useCallback` solve the same problem:

```jsx
const handler = useCallback((payload) => {
  // 'this' is no longer a thing in a functional component
}, [dependencies]);
```

No deviation needed unless the hitched method was relying on `this` being the original widget instance while the function reference was passed to some external consumer — in that case, the external consumer is the thing to migrate (often a jQuery plugin or third-party library).

---

## 8. `dojo/_base/declare` class inheritance + mixins

Typical Dojo:

```javascript
declare('my.UserRow', [TemplatedWidget, _WidgetsInTemplateMixin, MyFormMixin], {
  templateString: template,
  postCreate: function() { … },
  _onClick: function() { … },
});
```

Carbon React:

```jsx
function UserRow({ user, onAction }) {
  // State + logic from mixins all flattens here or into custom hooks.
  const formState = useFormState(user);
  const handleClick = () => onAction(user.id);

  return (
    <div className="user-row">
      <span>{user.name}</span>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
}
```

**Translation rule**: the class hierarchy flattens. Multiple-inheritance mixins become **custom hooks** (`useFormState`, `useKeyboardNav`, …) composed into one function.

**Key traps**:
- Mixins often have shared state ("this._state"); React custom hooks have local state per invocation. If the Dojo code relied on mixin state surviving across methods, the translation may need a `useRef` or a store.
- Mixins sometimes call each other's `this.inherited(arguments)` chain. React has no inheritance chain. Collapse it.
- "Abstract base widget" patterns (inherit, override one method) → React "render prop" / children-as-function / custom hook.

**Deviation trigger**: always log a deviation for any widget migrated from a class hierarchy deeper than 2 levels. Include the class chain in the description and which mixins were merged / which were dropped. Deep inheritance almost always encodes behaviour that a plain React component doesn't express.

---

## 9. Dijit widgets in HTML templates (`_WidgetsInTemplateMixin`)

Typical Dojo:

```html
<!-- my/widget/templates/UserForm.html -->
<div class="my-form">
  <input data-dojo-type="dijit/form/TextBox" data-dojo-attach-point="nameInput" />
  <button data-dojo-type="dijit/form/Button" data-dojo-attach-event="onClick: _onSave">Save</button>
</div>
```

Carbon React:

```jsx
function UserForm({ onSave }) {
  const [name, setName] = useState('');
  return (
    <div className="my-form">
      <TextInput
        id="user-form-name"
        labelText="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={() => onSave(name)}>Save</Button>
    </div>
  );
}
```

**Translation rule**: convert the template to JSX. `data-dojo-attach-point` becomes a state variable or ref. `data-dojo-attach-event` becomes a handler prop.

**Edge cases**:
- If the HTML template was shared between multiple widgets, extract the JSX into a component.
- If the template contained inline strings that were parameterised via Dojo `${variable}` substitution, make those real JSX expressions.
- If the HTML had non-Dojo widgets (plain HTML for server-side rendering), preserve them exactly — these often have server dependencies (JSP references, Thymeleaf, etc.).

**Deviation trigger**: any template that contained `data-dojo-attach-point` on a node whose reference was used by **other widgets** (cross-widget DOM traversal) — this is a coupling that doesn't survive the migration cleanly. Log the traversal path and the replacement approach.

---

## 10. `dijit.registry.byId` — global widget lookup

Typical Dojo:

```javascript
var dlg = registry.byId('userEditDialog');
dlg.set('title', 'Editing ' + userName);
dlg.show();
```

Carbon React: there is no global component registry.

**Replacement patterns** (choose by context):

1. **Lifted state / context** — if caller and widget share a React ancestor, lift the open/close and prop state.
2. **Ref forwarding** — if they share a direct parent, pass a `useRef` + `useImperativeHandle` pattern.
3. **Global store** — if the caller is far away (different route, different tree), use a store.

**Deviation trigger (always, if the id is referenced from non-migrated code)**: if `byId('someDialog')` is called from JSP, server-rendered markup, or any non-React code that remains after migration, the `id` must be preserved on the DOM root, but React still owns the state. Log deviation describing the cross-boundary coupling and the chosen approach (typically: render to a specific DOM id, expose an imperative API via a global, or — better — migrate the caller too).

---

## 11. `dijit.byNode` / `dijit.byId` from Dojo inside Carbon-migrated tree

This pattern breaks: the "Carbon-migrated tree" no longer has dijit widgets to look up. If ANY legacy Dojo code is searching for a widget that has been migrated to Carbon, the search will fail silently.

**Required action**: grep the codebase for `dijit.byId`, `dijit.byNode`, `registry.byId`, `registry.byNode` **after migration** and ensure every reference has been updated. This is a `deviation-completeness-audit` responsibility.

---

## 12. i18n — `dojo/i18n!./nls/strings`

Dojo:

```javascript
define(['dojo/i18n!./nls/strings'], function(strings) {
  // strings.save, strings.cancel, etc.
});
```

Carbon React: depends on what the repo already uses.

- **react-intl / react-i18next** — replace `strings.save` with `t('save')`; preserve the bundle file layout (`nls/strings.js` → `locales/en/translation.json` or similar).
- **No i18n library in repo** — log a deviation. If this is a genuinely fresh migration, the Architect plan should pick one.

Preserve the locale files' information even if reshaping their format — every translation that exists before migration must still exist after.

**Deviation trigger (always if i18n library choice isn't obvious)**: log a deviation listing the bundle files and the proposed translation layer, so reviewers can verify nothing got lost.

---

## Summary checklist — what to emit as deviations

| Pattern migrated | Deviation required? |
|---|---|
| `postCreate` with only DOM construction | No (direct translation) |
| `postCreate` touching sibling widgets via registry | **Yes** (`widget-lifecycle`) |
| `_setXAttr` with pub-sub on change | **Yes** (`event-system` — describe topic rewiring) |
| `destroy` with external resource cleanup | Maybe (if non-obvious) |
| `dojo/topic` rewire | **Yes, one per unique topic** (`event-topic-unverified`) |
| `dojo/on` for DOM events | No |
| Class hierarchy deeper than 2 levels | **Yes** (`ambiguous-lifecycle` — list the chain) |
| `_WidgetsInTemplateMixin` templates | **Yes if template was cross-widget-coupled** |
| `dijit.registry.byId` from non-React code | **Yes, one per unique id** (`widget-lifecycle`) |
| `dijit.byId` inside the migrated tree | Completeness audit flags if any remain |
| i18n bundle rewire | **Yes** if target i18n isn't pre-existing |
