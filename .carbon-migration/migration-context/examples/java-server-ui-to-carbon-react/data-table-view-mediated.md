# Data Table — View-mediated chain → Carbon DataTable (worked example)

> **Load rule:** Mandatory for any platform-modernize FED unit whose
> unit-context declares `archetype_hint: data-table-view-mediated`.
> Loaded ONCE per unit, before reading any source file or authoring
> any target file. Loading is verified by the migration-coverage-audit
> role.

> **Verification rule:** Every Carbon import shown below was verified
> against `@carbon/react@1.x` at authoring time. As Carbon evolves,
> your installed package may differ. Treat every `@carbon/*` import
> as untrusted. Verify via Carbon MCP `code_search` before writing.
> Full rule: INDEX.md §HARD RULE.

## When this archetype applies

Graph-derived signals from the planner (NOT folder names):
- An `api_endpoint` edge from this unit's JSP whose `meta.via_collaborator`
  is set — i.e. the JSP imports a `*View`, the View imports a
  `*Service`/`*Manager`/`*Facade`/`*Repository`/`*Client`/`*Provider`/`*Delegate`,
  and that collaborator imports a REST controller annotated `@Path` /
  `@RequestMapping` / `@WebServlet` / etc. (Phase 2 one-bounded-hop
  expansion).
- Typically NO `$.ajax` / `fetch(...)` in the JSP itself — the data
  flows in through `request.getAttribute("xView")`.

This is the dominant ps-wcl / IBM Identity Manager shape. The JSP is
server-rendered through the View class; the View is the data
contract.

## Source you will read (read-only context)

You will read THREE source files: the JSP, the View class, and the
collaborator (Service / Manager / etc.). The architect's auto-included
REST resource is the wire contract.

### `WAR_STANDARD/WebContent/jsp/customers/customer-list.jsp` (illustrative)

```jsp
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="com.example.app.ui.view.customers.CustomerListView" %>
<%
  CustomerListView view =
    (CustomerListView) request.getAttribute("customerListView");
%>
<html>
<head><title><fmt:message key="customers.title" /></title></head>
<body>
  <h1><fmt:message key="customers.heading" /></h1>

  <table>
    <thead>
      <tr>
        <th><fmt:message key="customers.col.id" /></th>
        <th><fmt:message key="customers.col.name" /></th>
        <th><fmt:message key="customers.col.tier" /></th>
        <th><fmt:message key="customers.col.region" /></th>
        <th><fmt:message key="customers.col.status" /></th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="row" items="${customerListView.rows}">
        <tr>
          <td><c:out value="${row.id}" /></td>
          <td><c:out value="${row.name}" /></td>
          <td><c:out value="${row.tier}" /></td>
          <td><c:out value="${row.region}" /></td>
          <td><c:out value="${row.status}" /></td>
        </tr>
      </c:forEach>
    </tbody>
  </table>
</body>
</html>
```

Note the absence of `$.ajax` / `fetch`. The data comes through
`request.getAttribute("customerListView")` (the View instance) which
the container has already populated.

### `JAR_UI_LOGIC/.../CustomerListView.java`

```java
package com.example.app.ui.view.customers;

import java.util.List;
import com.example.app.services.CustomerService;

public class CustomerListView {
  private final CustomerService service;
  public CustomerListView(CustomerService service) { this.service = service; }

  public List<Row> getRows() { return service.findAll(); }

  public static class Row {
    private final String id, name, tier, region, status;
    // …getters omitted
  }
}
```

The View imports `CustomerService` — that's the collaborator the
planner walked one hop further to find the REST controller.

### `JAR_UI_LOGIC/.../CustomerService.java`

```java
package com.example.app.services;

import com.example.app.rest.CustomersResource;
import com.example.app.ui.view.customers.CustomerListView;

public class CustomerService {
  private final CustomersResource resource;
  public CustomerService(CustomersResource resource) { this.resource = resource; }
  public List<CustomerListView.Row> findAll() {
    // Real impl unmarshals from resource.listCustomers(...)
    return …;
  }
}
```

The Service imports `CustomersResource`. The `meta.via_collaborator`
in your unit's `architect_scope` points at this file. The architect
auto-included `CustomersResource.java` on the basis of this chain.

### `ADMIN_REST/.../CustomersResource.java` (auto-included)

```java
@Path("/api/customers")
public interface CustomersResource {
  @GET Response listCustomers(@QueryParam("status") String status);
  @POST Response createCustomer(CustomerDto customer);
  // …
}
```

This gives you the wire contract. The shape your React component
fetches via `/api/customers` is what `CustomersResource.listCustomers`
returns.

## Target you will author

### `new_app_root/src/components/CustomerListPage.tsx`

```tsx
import {
  DataTable,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Loading,
  InlineNotification,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useCustomers } from '../api/customers';

const HEADERS = [
  { key: 'id',     header: 'customers.col.id' },
  { key: 'name',   header: 'customers.col.name' },
  { key: 'tier',   header: 'customers.col.tier' },
  { key: 'region', header: 'customers.col.region' },
  { key: 'status', header: 'customers.col.status' },
] as const;

export default function CustomerListPage() {
  const { t } = useTranslation();
  const { data: rows, isLoading, error } = useCustomers();

  if (isLoading) return <Loading description={t('common.loading')} withOverlay />;
  if (error)     return <InlineNotification kind="error" title={t('customers.loadFailed')} />;

  return (
    <DataTable
      rows={rows ?? []}
      headers={HEADERS.map((h) => ({ key: h.key, header: t(h.header) }))}
      isSortable
    >
      {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
        <TableContainer
          title={t('customers.heading')}
          {...getTableContainerProps()}
        >
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((h) => (
                  <TableHeader key={h.key} {...getHeaderProps({ header: h })}>
                    {h.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
}
```

### `new_app_root/src/api/customers.ts`

```ts
import { useQuery } from '@tanstack/react-query';

export type CustomerStatus = 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

export interface CustomerRow {
  id: string;
  name: string;
  tier: string;
  region: string;
  status: CustomerStatus;
}

async function fetchCustomers(): Promise<CustomerRow[]> {
  // Path comes from architect_scope.api_contracts. Verify against the
  // CustomersResource @Path before hard-coding. The View-mediated
  // chain in the JSP did NOT carry the path literally — it came
  // through the auto-included REST resource.
  const res = await fetch('/api/customers', { credentials: 'include' });
  if (!res.ok) throw new Error(`customers fetch failed: ${res.status}`);
  return res.json();
}

export function useCustomers() {
  return useQuery({ queryKey: ['customers'], queryFn: fetchCustomers });
}
```

### `new_app_root/src/i18n/en.json` (excerpt — additive)

```json
{
  "customers.title": "Customers",
  "customers.heading": "Customers",
  "customers.col.id": "Customer #",
  "customers.col.name": "Name",
  "customers.col.tier": "Tier",
  "customers.col.region": "Region",
  "customers.col.status": "Status",
  "customers.loadFailed": "Failed to load customers. Try refreshing the page."
}
```

## Translation rules used (cross-references)

- `migration-context/maps/java-server-ui-pswcl.md` — server-side
  `<c:forEach>` over `${customerListView.rows}` translates to the
  Carbon `<DataTable>` rows prop.
- `migration-context/patterns/java-server-ui-i18n-bridge.md` — every
  `<fmt:message>` key from the JSP becomes a JSON entry; keep the
  `customers.*` namespace stable so the column keys are auditable.
- The chain `JSP → View → Service → REST` collapses to a single
  React fetch. Read all three Java files to derive the response
  shape before writing the TypeScript types.

## Generalization rules — DO NOT COPY VERBATIM

- Replace `CustomerListPage` with the entity name from the JSP /
  View.
- Replace `CustomerRow` with the actual row shape — read the View's
  inner DTO + the REST resource's response shape.
- Replace `/api/customers` with the actual path from
  `architect_scope.api_contracts` (the auto-included resource's
  `@Path`).
- Note the difference vs. `data-table-direct-ajax`: the JSP did NOT
  carry the API path literally. You MUST get it from the
  architect_scope, not infer from the JSP.

## Anti-patterns (do NOT do these)

- Do NOT modify the source `.jsp` / `.java` / `.properties` files.
- Do NOT skip reading the collaborator file. The chain
  `View → Service → REST` is what gives you the row shape; missing
  the Service file will lead to a TypeScript type that doesn't match
  the wire shape.
- Do NOT hard-code an API path that is not in
  `architect_scope.api_contracts`. The View-mediated chain
  intentionally hides the path from the JSP — your sole source of
  truth is the resource's `@Path`.
- Do NOT keep the server-side `<c:forEach>` semantics by computing
  `tier` / `region` etc. from the row inline. Whatever the View
  emitted goes through to the React row as-is.

## Carbon imports verified at authoring time

- `DataTable`, `Table`, `TableHead`, `TableHeader`, `TableBody`,
  `TableRow`, `TableCell`, `TableContainer`, `Loading`,
  `InlineNotification` — all exported from `@carbon/react@1.x`.

Verify via Carbon MCP `code_search` for your installed version before
writing.
