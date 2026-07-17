# General JSP → Carbon React — Worked Example (mandatory catch-all)

> **Load rule:** Mandatory for any platform-modernize FED unit whose
> unit-context declares `archetype_hint: general`. The catch-all that
> fires when no specific archetype matches. Loaded ONCE per unit,
> before reading any source file or authoring any target file. Loading
> is verified by the migration-coverage-audit role.

> **Verification rule:** Every Carbon import shown below was verified
> against `@carbon/react@1.x` at authoring time. As Carbon evolves,
> your installed package may differ. Treat every `@carbon/*` import as
> untrusted. Verify via Carbon MCP `code_search` before writing. Full
> rule: INDEX.md §HARD RULE.

## When this archetype applies

You are loading this file because the planner did NOT detect any of
the more specific archetype shapes:
- no `api_endpoint` edge with `meta.via_collaborator` → not view-mediated
- no `api_endpoint` edge from `jspApiCalls` → not direct-AJAX
- no `component_invocation` to `*KpiCard` / `*MetricCard` → not dashboard-with-kpis
- no `<form method="POST">` with no api_endpoint → not auth-form
- not all-`.jspf` and not empty → not static-content

This catch-all covers any JSP shape that the planner could not classify
more specifically: a redirect-only page, a JSP that mixes scriptlets
with custom taglibs, a fragment include with light dynamic content, a
page that relies on session attributes set by a servlet upstream, etc.

The archetype works for ANY Java EE source — ps-wcl, Struts, JSF,
plain JSP — as long as the page's behaviour reduces to "render some
markup, optionally call into the server, optionally redirect."

## Source you will read (read-only context)

You are NOT permitted to modify any of these files. Read them to
understand what the page does, then author the React equivalent in
`new_app_root/src/`.

### `WAR_STANDARD/WebContent/jsp/profile/profile.jsp` (illustrative, generic)

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="com.example.app.ui.view.profile.ProfileView" %>
<%
  ProfileView view = (ProfileView) request.getAttribute("profileView");
%>
<html>
<head>
  <title><fmt:message key="profile.title" /></title>
</head>
<body>
  <%@ include file="/jsp/common/header.jspf" %>

  <h1><fmt:message key="profile.heading" /></h1>

  <c:if test="${not empty profileView.message}">
    <p class="notice"><c:out value="${profileView.message}" /></p>
  </c:if>

  <dl>
    <dt><fmt:message key="profile.name" /></dt>
    <dd><c:out value="${profileView.user.fullName}" /></dd>
    <dt><fmt:message key="profile.email" /></dt>
    <dd><c:out value="${profileView.user.email}" /></dd>
    <dt><fmt:message key="profile.lastLogin" /></dt>
    <dd>
      <fmt:formatDate value="${profileView.user.lastLogin}" pattern="yyyy-MM-dd HH:mm" />
    </dd>
  </dl>

  <%@ include file="/jsp/common/footer.jspf" %>
</body>
</html>
```

The interesting bits to note:
1. `<%@ page import="...ProfileView" %>` declares the View class — the
   page-controller pattern. Read `ProfileView.java` for the data
   contract.
2. `request.getAttribute("profileView")` is how the JSP receives the
   View instance. The shape of `view.user` (and any nested objects) is
   what your TypeScript types need to mirror.
3. `<fmt:message key="..." />` is i18n. Every key becomes a JSON entry
   in your React i18n bridge — see
   `migration-context/patterns/java-server-ui-i18n-bridge.md`.
4. `<c:out value="${...}" />` is the JSTL escaping pattern. In React,
   the JSX renderer escapes by default; do not call your own
   `escapeHtml`.
5. `<%@ include file="..." %>` pulls in the shared header/footer. In
   React these become layout components; the include relationship is
   already in `architect_scope` for you.

### `JAR_UI_LOGIC/src/com/example/app/ui/view/profile/ProfileView.java`

```java
package com.example.app.ui.view.profile;

import com.example.app.dto.User;

public class ProfileView {
  private final User user;
  private final String message;

  public ProfileView(User user, String message) {
    this.user = user;
    this.message = message;
  }

  public User getUser() { return user; }
  public String getMessage() { return message; }
}
```

The View is a pure data holder. Your React component renders the same
shape; the wire contract is "whatever fields the JSP reads via
`view.getXxx()`."

## Target you will author

Author these inside `new_app_root/src/`. The `architect_scope` block
in your unit-context tells you the exact `new_app_root` path.

### `new_app_root/src/components/ProfilePage.tsx`

```tsx
import { Layer, Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '../api/profile';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useUserProfile();

  if (isLoading) return <p>{t('common.loading')}</p>;
  if (error)     return <p role="alert">{t('common.error')}</p>;
  if (!data)     return null;

  return (
    <Layer>
      <h1>{t('profile.heading')}</h1>

      {data.message && <p className="notice">{data.message}</p>}

      <Tile>
        <dl>
          <dt>{t('profile.name')}</dt>
          <dd>{data.user.fullName}</dd>
          <dt>{t('profile.email')}</dt>
          <dd>{data.user.email}</dd>
          <dt>{t('profile.lastLogin')}</dt>
          <dd>
            {new Intl.DateTimeFormat(i18n.language, {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit',
            }).format(new Date(data.user.lastLogin))}
          </dd>
        </dl>
      </Tile>
    </Layer>
  );
}
```

### `new_app_root/src/api/profile.ts`

```ts
import { useQuery } from '@tanstack/react-query';

export interface User {
  fullName: string;
  email: string;
  lastLogin: string;
}

export interface ProfileResponse {
  user: User;
  message?: string;
}

async function fetchProfile(): Promise<ProfileResponse> {
  // Path comes from architect_scope.api_contracts. Replace with the
  // exact path the architect emits — do NOT hard-code an `/api/...`
  // path that is not in the scope.
  const res = await fetch('/api/profile', { credentials: 'include' });
  if (!res.ok) throw new Error(`profile fetch failed: ${res.status}`);
  return res.json();
}

export function useUserProfile() {
  return useQuery({ queryKey: ['profile'], queryFn: fetchProfile });
}
```

### `new_app_root/src/i18n/en.json` (excerpt — additive)

```json
{
  "profile.title": "Your profile",
  "profile.heading": "Profile",
  "profile.name": "Full name",
  "profile.email": "Email address",
  "profile.lastLogin": "Last sign-in",
  "common.loading": "Loading…",
  "common.error": "Something went wrong. Try refreshing the page."
}
```

## Translation rules used (cross-references)

- `migration-context/maps/java-server-ui-pswcl.md` — `<fmt:message>` and
  `<c:out>` translation table; `<itim:Foundation>` overlay shape.
- `migration-context/patterns/java-server-ui-i18n-bridge.md` — every
  JSP key becomes a JSON entry; the bridge pattern explains how to wire
  the `<fmt:setBundle>` source into a runtime i18n provider.
- `migration-context/patterns/java-server-ui-dispatch.md` — server-side
  forwards (`<jsp:forward>`, `request.getRequestDispatcher`) become
  client-side React Router redirects.

## Generalization rules — DO NOT COPY VERBATIM

Replace the placeholder identifiers in this file with whatever the
unit you are migrating actually uses:
- `ProfileView` → the JSP's actual `*View` class name (could be
  `*Controller`, `*PageBean`, `*Action`, `*Backing`, etc.).
- `profileView` → the camel-lower-first name passed to
  `request.getAttribute(...)`.
- `User` → the actual entity type. The SHAPE generalizes, not the
  name.
- `/api/profile` → the actual endpoint path emitted by the
  architect's `api_contracts` block. If no `api_contracts` entry
  exists for this unit, the page is purely server-rendered with no
  REST path; use a static fixture or page-load data hook instead.
- `profile.*` i18n keys → the actual key names from the bundle the
  JSP references via `<fmt:setBundle>`.

## Anti-patterns (do NOT do these)

- Do NOT modify the source `.jsp` / `.java` / `.properties` files.
  Migration is greenfield: read the source, author new files in
  `new_app_root/src/`.
- Do NOT invent Carbon component names not literally present in the
  installed `@carbon/react` package. If the example here references a
  component that does not exist in your installed Carbon version,
  drop it back to a styled HTML element.
- Do NOT skip the i18n bridge. Every key the JSP references via
  `<fmt:message>` must round-trip to a JSON entry in the React app.
- Do NOT hard-code a REST path that is not in `architect_scope.api_contracts`.
  If the unit truly has no API contract, the page is server-rendered
  and your React component should accept the data as props or load it
  via a page-level loader (React Router `loader`) — not invent a path.
- Do NOT bypass the View-class indirection on a `data-table-view-mediated`
  archetype unit. If the planner emitted `meta.via_collaborator`, the
  data shape comes from the chain `View → Service → Resource` — read
  all three Java files before designing the React types.

## Notes on graceful degradation

If a more specific archetype example file referenced by the
unit-context (e.g. `data-table-view-mediated.md`) does not exist on
disk for any reason, fall back to:
1. This file (`general-jsp-to-react.md`)
2. `migration-context/maps/java-server-ui-pswcl.md`
3. `migration-context/scaffolds/java-server-ui-to-carbon-react.md`

…and emit a `missing-archetype-example` deviation in your run notes.
The migration-coverage-audit role will surface that deviation at PR
time so the operator can choose whether to block.
