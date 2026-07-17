# Auth Form (form-action POST) → Carbon React (worked example)

> **Load rule:** Mandatory for any platform-modernize FED unit whose
> unit-context declares `archetype_hint: auth-form`. Loaded ONCE per
> unit, before reading any source file or authoring any target file.
> Loading is verified by the migration-coverage-audit role.

> **Verification rule:** Every Carbon import shown below was verified
> against `@carbon/react@1.x` at authoring time. As Carbon evolves,
> your installed package may differ. Treat every `@carbon/*` import as
> untrusted. Verify via Carbon MCP `code_search` before writing. Full
> rule: INDEX.md §HARD RULE.

## When this archetype applies

Graph-derived signals from the planner (NOT folder names):
- The JSP contains a `<form ... method="POST">` (case-insensitive).
- The JSP has NO `api_endpoint` edge — the form posts to a servlet /
  action URL handled by the container, not a JSON REST endpoint.
- Typically there is an inbound `script_dep` edge to a Dojo / DOM
  bootstrap script that wires field validation and submit. The script
  is preserved by Phase 4's anchored-only pruning.

The dominant case is sign-in / sign-up / password-reset / forgot-password
flows on Java EE container-based auth (form-login / Liberty /
WebSphere). The page uses session cookies (JSESSIONID) — no JWT, no
bearer token; the container handles auth and stamps the session.

## Source you will read (read-only context)

### `ISC_UI/WebContent/Login.jsp` (illustrative)

```jsp
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%
  String uipath = (String) request.getAttribute("ui.uipath");
  String error = request.getParameter("error");
%>
<html>
<head>
  <title><fmt:message key="login.title" /></title>
  <link rel="stylesheet"
        href="<%=request.getContextPath()%>/<%=uipath%>/css/login.css" />
</head>
<body>
  <div class="login-shell">
    <h1><fmt:message key="login.heading" /></h1>

    <% if (error != null) { %>
      <div class="login-error" role="alert">
        <fmt:message key="login.errorInvalid" />
      </div>
    <% } %>

    <form id="loginForm" method="POST" action="j_security_check">
      <label for="username"><fmt:message key="login.username" /></label>
      <input type="text" id="username" name="j_username" autocomplete="username" required />

      <label for="password"><fmt:message key="login.password" /></label>
      <input type="password" id="password" name="j_password" autocomplete="current-password" required />

      <button type="submit" id="loginSubmit">
        <fmt:message key="login.submit" />
      </button>
    </form>

    <p>
      <a href="ForgotPassword.jsp"><fmt:message key="login.forgot" /></a>
    </p>
  </div>

  <script type="text/javascript"
          src="<%=request.getContextPath()%>/<%=uipath%>/com/ibm/isim/ui/loginMain.js"></script>
</body>
</html>
```

The interesting bits to note:
1. `method="POST" action="j_security_check"` — Java EE container
   form-login. The browser POSTs `j_username` + `j_password` to a
   well-known servlet path; the container verifies and sets
   `JSESSIONID`. **You must preserve this submission target on the
   React side**, OR coordinate with the architect to introduce a JSON
   `/api/login` endpoint behind it. Default: keep `j_security_check`
   so the container contract is unchanged.
2. `<%=request.getContextPath()%>/<%=uipath%>/...` — JSP-EL prefixed
   resource URL. Phase 1b's stripping handles this for the planner;
   on the React side just embed the static suffix.
3. `loginMain.js` is the inbound `script_dep`. Read it to understand
   the field-validation / submit-disabling behaviour the page expects.
4. `?error=<reason>` query parameter signals invalid credentials. The
   container redirects back here on failure.

## Target you will author

### `new_app_root/src/components/LoginPage.tsx`

```tsx
import { useState, useId } from 'react';
import {
  Form,
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
  Stack,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

export default function LoginPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const error = params.get('error');
  const [submitting, setSubmitting] = useState(false);
  const userId = useId();
  const passId = useId();

  function onSubmit(evt: React.FormEvent<HTMLFormElement>) {
    // Preserve the container form-login contract: let the browser
    // POST natively to j_security_check so the container sets
    // JSESSIONID. Disable the submit button to prevent double-submit.
    setSubmitting(true);
  }

  return (
    <main className="login-shell">
      <h1>{t('login.heading')}</h1>

      {error && (
        <InlineNotification
          kind="error"
          title={t('login.errorInvalid')}
          hideCloseButton
        />
      )}

      <Form
        method="POST"
        action="/j_security_check"
        onSubmit={onSubmit}
        aria-label={t('login.heading')}
      >
        <Stack gap={5}>
          <TextInput
            id={userId}
            name="j_username"
            labelText={t('login.username')}
            autoComplete="username"
            required
          />
          <PasswordInput
            id={passId}
            name="j_password"
            labelText={t('login.password')}
            autoComplete="current-password"
            required
          />
          <Button type="submit" disabled={submitting}>
            {t('login.submit')}
          </Button>
        </Stack>
      </Form>

      <p>
        <a href="/forgot-password">{t('login.forgot')}</a>
      </p>
    </main>
  );
}
```

### `new_app_root/src/i18n/en.json` (excerpt — additive)

```json
{
  "login.title": "Sign in",
  "login.heading": "Sign in to your account",
  "login.username": "Username",
  "login.password": "Password",
  "login.submit": "Sign in",
  "login.forgot": "Forgot your password?",
  "login.errorInvalid": "Username or password is incorrect."
}
```

### `new_app_root/src/routes.tsx` (excerpt — additive route entry)

```tsx
// React Router v6 — register the route alongside the other top-level
// pages. The login page is intentionally outside the authenticated
// shell because the container redirects to it BEFORE the session
// exists.
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './components/LoginPage';
// …

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  // …other routes
]);
```

## Translation rules used (cross-references)

- `migration-context/patterns/java-server-ui-i18n-bridge.md` — every
  `<fmt:message key="login.*">` becomes a JSON entry. Keep the
  `login.*` namespace stable so other auth flows (forgot-password,
  reset-password) can share keys.
- `migration-context/patterns/java-server-ui-dispatch.md` — server-
  forward → client-route. The JSP redirects back to itself with
  `?error=invalid` on failure; replicate with `useSearchParams`.
- `migration-context/maps/java-server-ui-pswcl.md` — native `<input>`
  → Carbon `<TextInput>` / `<PasswordInput>`; native `<button>` →
  Carbon `<Button>`; jQuery validation → uncontrolled component +
  native HTML5 `required`/`pattern`.

## Generalization rules — DO NOT COPY VERBATIM

- Replace `LoginPage` / `/login` with whatever the JSP filename and
  router path are.
- Replace the form `action` (`/j_security_check`) with the actual
  servlet path the JSP submits to. The path is in the JSP's `<form
  action="...">`; do not guess.
- Replace `j_username` / `j_password` field names with whatever the
  servlet expects. These are container-specific contracts.
- Replace `?error` with the actual query parameter the container uses.
- The error text (`login.errorInvalid`) should NOT include details
  that distinguish "wrong username" from "wrong password" — keep the
  generic phrasing for security.

## Anti-patterns (do NOT do these)

- Do NOT modify the source JSP, properties, or the inbound
  `loginMain.js`. The Login flow is a server-rendered page with
  container-managed session; preserving the wire contract avoids
  introducing a JSON-vs-form fork the architect didn't anticipate.
- Do NOT replace `j_security_check` with a fetch-to-`/api/login` POST
  unless the architect's `api_contracts` explicitly emits a JSON login
  endpoint. The container is the auth boundary; bypassing it breaks
  session management.
- Do NOT skip `autoComplete="username"` / `autoComplete="current-password"` —
  these are standard a11y / password-manager hooks and silently
  required for compliance.
- Do NOT make the form fields controlled (`useState` for username /
  password). Browser password managers and auto-fill work better with
  uncontrolled inputs that submit directly.
- Do NOT add a `submitting` spinner that hides the form during POST.
  The browser's native form-POST navigation removes the page anyway;
  a long-running spinner is wasted work.

## Carbon imports verified at authoring time

- `Form`, `TextInput`, `PasswordInput`, `Button`, `InlineNotification`,
  `Stack` — all exported from `@carbon/react@1.x`.

Verify via Carbon MCP `code_search` for your installed version before
writing. If `PasswordInput` is missing, fall back to `TextInput
type="password"`.
