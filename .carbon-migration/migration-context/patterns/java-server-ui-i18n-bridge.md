# Java `.properties` → React i18n JSON Bridge

> **Load rule:** this file is loaded on trigger when the FED agent or
> scaffold phase encounters `.properties` resource bundles in the source
> tree during a `platform-modernize` job. Loaded ONCE per session.

---

## What changes across the bridge

Java server UIs carry translated strings in `.properties` files. Keys
are often dot-delimited, messages often use positional arguments (`{0}`,
`{1}`). React apps carry strings in JSON (or YAML) bundles per locale,
and modern i18n libraries (`react-intl`, `i18next`, `tolgee`) prefer
named arguments (`{name}`, `{count}`) for readability + safety.

This bridge defines the **one-time conversion** that runs during the
Architect's scaffold phase, and the **convention FED follows** when
authoring new keys.

## Source shape

```properties
# strings.properties
user.greeting = Hello, {0}
user.account.count = {0} has {1} accounts
form.required = This field is required.
```

- One file per locale (`strings.properties`, `strings_de.properties`, …)
- Positional args `{0}`, `{1}` reference method parameter order at the
  Java call site.
- Keys are dot-delimited. Case varies by team convention.

## Target shape

```json
{
  "user.greeting": "Hello, {name}",
  "user.account.count": "{name} has {count} accounts",
  "form.required": "This field is required."
}
```

- One JSON file per locale under `<new_app_root>/src/i18n/<locale>.json`.
- Positional args rewritten to named args using the Java method's
  parameter names when available, or `arg0` / `arg1` / ... as fallback.
- Keys preserved verbatim — no case change, no normalisation.

## Conversion algorithm (scaffold phase)

1. Walk the source tree for `*.properties` files.
2. For each file:
   - Parse line-by-line: `key = value` (comments + blank lines ignored).
   - For each `{N}` positional arg in the value, consult the Java call
     site that uses this key (identified via `NLSUtils.getString(...)`
     or equivalent) and read parameter names. When unambiguous, rewrite
     `{0}` → `{<paramName>}`. When ambiguous (multiple call sites with
     different parameter names), fall back to `arg0` / `arg1` / ... and
     emit an `i18n-key-untranslated` deviation so the reviewer can
     harmonise the arg name by hand.
3. Write `<new_app_root>/src/i18n/<locale>.json` with UTF-8 BOM-less
   JSON.
4. Emit a human-readable report at
   `<new_app_root>/src/i18n/.conversion-report.md` listing every file,
   how many keys converted, how many needed fallback names.

## FED consumption convention

React components must use a single `t(key, args?)` helper (scaffold-
provided) — never read the JSON directly. Examples:

```tsx
import { t } from '@/i18n';

<h1>{t('user.greeting', { name: user.displayName })}</h1>
<p>{t('user.account.count', { name: user.displayName, count: accounts.length })}</p>
```

The helper:

- Loads the current locale's JSON bundle at app startup.
- Falls back to English when a key is missing in the current locale.
- Returns the key itself (not throwing) when a key is missing from
  every bundle — this makes missing keys visible at runtime rather
  than invisible via empty strings.

## What stays server-side

Keys that are SERVED from the backend (e.g., inside a JSON response
body) remain in the `.properties` file. Do NOT duplicate them into the
React JSON bundle — the backend is the source of truth for those
strings, and duplication guarantees drift. Examples:

- Error messages embedded in REST response bodies.
- Audit log messages.
- Email template strings.

Identify these by: the source Java code reads the key inside a
`com.ibm.itim.apps.*` or `com.ibm.itim.remoteservices.*` call path, not
inside a View class.

## Coverage audit (from migration-coverage-audit role)

The coverage-audit role asserts every source `.properties` key either:

- Exists in the React JSON bundle (direct match, OR named-arg-normalised
  match), OR
- Has an `i18n-key-untranslated` deviation explaining why not.

No key goes unmentioned.

## Load signals

- File extension `.properties` inside the source tree
- Java calls to `NLSUtils.getString(...)`, `ResourceBundle.getBundle(...)`,
  or equivalent
- References to `UI*Resources` / `*Resources.properties` filenames

## Related

- `scaffolds/java-server-ui-to-carbon-react.md` — scaffold phase that runs this conversion once.
- `maps/java-server-ui-pswcl.md` — companion widget map.
