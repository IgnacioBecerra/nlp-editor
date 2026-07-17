# Static Content / JSP Fragment → Carbon React layout component

> **Load rule:** Mandatory for any platform-modernize FED unit whose
> unit-context declares `archetype_hint: static-content`. Loaded ONCE
> per unit, before reading any source file or authoring any target
> file. Loading is verified by the migration-coverage-audit role.

> **Verification rule:** Every Carbon import shown below was verified
> against `@carbon/react@1.x` at authoring time. As Carbon evolves,
> your installed package may differ. Treat every `@carbon/*` import
> as untrusted. Verify via Carbon MCP `code_search` before writing.
> Full rule: INDEX.md §HARD RULE.

## When this archetype applies

Graph-derived signals from the planner (NOT folder names):
- All target files are `.jspf` (JSP fragments) — typically header,
  footer, and navigation includes that other JSPs pull in via
  `<%@ include file="..." %>`. **OR**
- The unit has zero outbound coupling edges of types
  `api_endpoint` / `component_invocation` / `script_dep` — pure
  display markup with no behavioral / data binding.

These units carry the chrome of the application: brand bar, primary
nav, footer link blocks, license / copyright banners, layout
scaffolds. There is no business logic to reproduce; the React side is
a layout component composed into the application shell.

## Source you will read (read-only context)

### `WAR_STANDARD/WebContent/jsp/common/header.jspf` (illustrative)

```jsp
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<header class="app-header">
  <a href="<%=request.getContextPath()%>/" class="brand">
    <fmt:message key="app.name" />
  </a>
  <nav class="primary">
    <ul>
      <li>
        <a href="<%=request.getContextPath()%>/jsp/orders/orders-list.jsp">
          <fmt:message key="nav.orders" />
        </a>
      </li>
      <li>
        <a href="<%=request.getContextPath()%>/jsp/customers/customer-list.jsp">
          <fmt:message key="nav.customers" />
        </a>
      </li>
    </ul>
  </nav>
</header>
```

### `WAR_STANDARD/WebContent/jsp/common/footer.jspf` (illustrative)

```jsp
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<footer class="app-footer">
  <p>
    &copy; <fmt:formatDate value="<%= new java.util.Date() %>" pattern="yyyy" />
    <fmt:message key="app.copyright" />
  </p>
  <ul>
    <li>
      <a href="<%=request.getContextPath()%>/jsp/legal/terms.jsp">
        <fmt:message key="footer.terms" />
      </a>
    </li>
    <li>
      <a href="<%=request.getContextPath()%>/jsp/legal/privacy.jsp">
        <fmt:message key="footer.privacy" />
      </a>
    </li>
  </ul>
</footer>
```

The interesting bits:
1. Pure markup with `<fmt:message>` for the i18n strings. No data
   binding, no behavior.
2. Anchor `href`s point at server-rendered JSP routes; on the React
   side, these become client-router routes.
3. The fragments are referenced by other JSPs via
   `<%@ include file="..." %>`. The includes are already in
   `architect_scope` for you.

## Target you will author

### `new_app_root/src/components/AppHeader.tsx`

```tsx
import { Header, HeaderName, HeaderNavigation, HeaderMenuItem } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function AppHeader() {
  const { t } = useTranslation();
  return (
    <Header aria-label={t('app.name')}>
      <HeaderName as={Link} to="/" prefix="">
        {t('app.name')}
      </HeaderName>
      <HeaderNavigation aria-label={t('nav.primary')}>
        <HeaderMenuItem as={Link} to="/orders">
          {t('nav.orders')}
        </HeaderMenuItem>
        <HeaderMenuItem as={Link} to="/customers">
          {t('nav.customers')}
        </HeaderMenuItem>
      </HeaderNavigation>
    </Header>
  );
}
```

### `new_app_root/src/components/AppFooter.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function AppFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <p>&copy; {year} {t('app.copyright')}</p>
      <ul>
        <li><Link to="/legal/terms">{t('footer.terms')}</Link></li>
        <li><Link to="/legal/privacy">{t('footer.privacy')}</Link></li>
      </ul>
    </footer>
  );
}
```

### `new_app_root/src/components/AppShell.tsx` (composes header + footer)

```tsx
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

export default function AppShell() {
  return (
    <>
      <AppHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <AppFooter />
    </>
  );
}
```

### `new_app_root/src/i18n/en.json` (excerpt — additive)

```json
{
  "app.name": "Acme Console",
  "app.copyright": "Acme Inc. All rights reserved.",
  "nav.primary": "Primary navigation",
  "nav.orders": "Orders",
  "nav.customers": "Customers",
  "footer.terms": "Terms of service",
  "footer.privacy": "Privacy policy"
}
```

## Translation rules used (cross-references)

- `migration-context/maps/java-server-ui-pswcl.md` — `<header>` / `<footer>`
  shapes lift directly to React; primary navigation goes through
  Carbon `<Header>` + `<HeaderNavigation>` for built-in keyboard a11y.
- `migration-context/patterns/java-server-ui-dispatch.md` — server-side
  anchor `href`s become React Router `<Link to>` references.
- `migration-context/patterns/java-server-ui-i18n-bridge.md` — every
  `<fmt:message>` key becomes an i18n bundle entry.

## Generalization rules — DO NOT COPY VERBATIM

- Replace `app.*` / `nav.*` / `footer.*` keys with whatever the JSP
  bundle uses.
- Replace the routes (`/orders`, `/customers`, etc.) with whatever
  client-router path corresponds to the destination JSP. The
  architect's `route_map` (in `architect_scope`, when emitted) lists
  the JSP-route → React-route correspondence.
- If the header includes user identity or session state (logged-in
  username, sign-out link), add a `useUserSession()` hook and wire
  the conditional render. The static-content archetype focuses on
  shell chrome; user-state controls overlap with `auth-form` and
  belong in the authenticated-shell component, not in the static
  fragment.

## Anti-patterns (do NOT do these)

- Do NOT modify the source `.jspf` / `.properties` files.
- Do NOT re-implement the `<%@ include file="..." %>` chain in React
  via dynamic imports — the include relationship is a JSP-side
  composition concern; React composes via JSX nesting (`<AppShell>` →
  `<Outlet>`).
- Do NOT skip the i18n bridge for navigation labels. They MUST be
  translated; the JSP authors expect that contract on the React side
  too.
- Do NOT use a regular HTML `<a href="/orders">` for in-app links —
  React Router's `<Link>` keeps the SPA navigation snappy and avoids
  full page reloads.
- Do NOT add behavior here. If a "logout" link or a search box
  appears in the JSP header, the unit should have been classified
  differently (auth-form or general-jsp-to-react). Check the planner
  output.

## Carbon imports verified at authoring time

- `Header`, `HeaderName`, `HeaderNavigation`, `HeaderMenuItem` — all
  exported from `@carbon/react@1.x`.

Verify via Carbon MCP `code_search` for your installed version before
writing. If the `as={Link}` polymorphic prop is unavailable in your
Carbon version, fall back to `<a>` and pass the anchor through
`useNavigate()` for client-side routing.
