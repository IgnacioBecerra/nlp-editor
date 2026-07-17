# Data Table — Direct AJAX → Carbon DataTable (worked example)

> **Load rule:** Mandatory for any platform-modernize FED unit whose
> unit-context declares `archetype_hint: data-table-direct-ajax`.
> Loaded ONCE per unit, before reading any source file or authoring
> any target file. Loading is verified by the migration-coverage-audit
> role.

> **Verification rule:** Every Carbon import shown below was verified
> against `@carbon/react@1.x` at authoring time. As Carbon evolves,
> your installed package may differ. Treat every `@carbon/*` import as
> untrusted. Verify via Carbon MCP `code_search` before writing. Full
> rule: INDEX.md §HARD RULE.

## When this archetype applies

Graph-derived signals from the planner (NOT folder names):
- An `api_endpoint` edge from this unit's JSP whose `resolver_used` is
  `jspApiCalls` — i.e. the JSP has a literal `$.ajax(...)`,
  `fetch(...)`, or `<form action="/api/...">` call site that the
  jspApiCalls extractor matched against the architect's API contracts.
- Typically NO View-class indirection (otherwise the planner would
  pick `data-table-view-mediated`).
- The page is conventionally a **list** view: a table or grid of
  records the user paginates / filters / sorts.

This is the cleanest signal in the corpus and the lowest-risk smoke
test for Phase 3 — the JSP carries the REST contract literally in its
own bytes, so the FED has the data shape in front of it.

## Source you will read (read-only context)

### `WAR_STANDARD/WebContent/jsp/orders/orders-list.jsp` (illustrative)

```jsp
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
  <title><fmt:message key="orders.title" /></title>
  <link rel="stylesheet" type="text/css"
        href="<%=request.getContextPath()%>/css/orders.css" />
  <script type="text/javascript"
          src="<%=request.getContextPath()%>/js/jquery.min.js"></script>
</head>
<body>
  <h1><fmt:message key="orders.heading" /></h1>

  <div class="filter">
    <label for="status-filter"><fmt:message key="orders.status" /></label>
    <select id="status-filter">
      <option value=""><fmt:message key="orders.status.any" /></option>
      <option value="PENDING"><fmt:message key="orders.status.pending" /></option>
      <option value="SHIPPED"><fmt:message key="orders.status.shipped" /></option>
    </select>
  </div>

  <table id="orders-table">
    <thead>
      <tr>
        <th><fmt:message key="orders.col.id" /></th>
        <th><fmt:message key="orders.col.customer" /></th>
        <th><fmt:message key="orders.col.total" /></th>
        <th><fmt:message key="orders.col.status" /></th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

<script type="text/javascript">
$(function () {
  function render(rows) {
    var html = rows.map(function (r) {
      return '<tr>'
        + '<td>' + r.id + '</td>'
        + '<td>' + r.customer + '</td>'
        + '<td>' + r.total + '</td>'
        + '<td>' + r.status + '</td>'
        + '</tr>';
    }).join('');
    $('#orders-table tbody').html(html);
  }

  function load() {
    var status = $('#status-filter').val();
    $.ajax({
      url: '<%=request.getContextPath()%>/api/orders',
      data: { status: status },
      dataType: 'json',
      success: render,
      error: function () {
        $('#orders-table tbody').html(
          '<tr><td colspan="4">Failed to load orders.</td></tr>'
        );
      }
    });
  }

  $('#status-filter').on('change', load);
  load();
});
</script>
</body>
</html>
```

The structural anchors:
1. `<table id="orders-table">` with a header row + empty `<tbody>` —
   the table is rendered client-side.
2. `$.ajax({ url: '<%=...%>/api/orders', data: { status }, ... })` —
   the API call site. `jspApiCalls` matched this URL against
   `@Path("/api/orders")` from the architect's contracts; that's why
   the unit got the `data-table-direct-ajax` hint.
3. Filter `<select id="status-filter">` driving the AJAX `status`
   query parameter.

### `ADMIN_REST/.../OrdersResource.java` (architect_scope auto-include)

```java
@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
public interface OrdersResource {
  @GET
  Response listOrders(@QueryParam("status") String status);
  // …
}
```

The auto-included file gives you the wire shape: a list of order rows
with at minimum `{ id, customer, total, status }`. Extract the row
shape from the resource's response DTO if available.

## Target you will author

### `new_app_root/src/components/OrdersListPage.tsx`

```tsx
import { useState } from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  Select,
  SelectItem,
  Loading,
  InlineNotification,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useOrders, OrderStatus } from '../api/orders';

const HEADERS = [
  { key: 'id', header: 'orders.col.id' },
  { key: 'customer', header: 'orders.col.customer' },
  { key: 'total', header: 'orders.col.total' },
  { key: 'status', header: 'orders.col.status' },
] as const;

export default function OrdersListPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const { data: rows, isLoading, error } = useOrders(status);

  if (isLoading) return <Loading description={t('common.loading')} withOverlay />;
  if (error)     return <InlineNotification kind="error" title={t('orders.loadFailed')} />;

  return (
    <DataTable
      rows={rows ?? []}
      headers={HEADERS.map((h) => ({ key: h.key, header: t(h.header) }))}
      isSortable
    >
      {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
        <TableContainer
          title={t('orders.heading')}
          {...getTableContainerProps()}
        >
          <TableToolbar>
            <TableToolbarContent>
              <Select
                id="status-filter"
                labelText={t('orders.status')}
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus | '')}
              >
                <SelectItem value=""        text={t('orders.status.any')} />
                <SelectItem value="PENDING" text={t('orders.status.pending')} />
                <SelectItem value="SHIPPED" text={t('orders.status.shipped')} />
              </Select>
            </TableToolbarContent>
          </TableToolbar>
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

### `new_app_root/src/api/orders.ts`

```ts
import { useQuery } from '@tanstack/react-query';

export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderRow {
  id: string;
  customer: string;
  total: string;
  status: OrderStatus;
}

async function fetchOrders(status: OrderStatus | ''): Promise<OrderRow[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  // Path comes from architect_scope.api_contracts. Replace with the
  // exact path for the unit you are migrating.
  const res = await fetch(`/api/orders?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`orders fetch failed: ${res.status}`);
  return res.json();
}

export function useOrders(status: OrderStatus | '') {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: () => fetchOrders(status),
  });
}
```

### `new_app_root/src/i18n/en.json` (excerpt — additive)

```json
{
  "orders.title": "Orders",
  "orders.heading": "Orders",
  "orders.status": "Status",
  "orders.status.any": "All",
  "orders.status.pending": "Pending",
  "orders.status.shipped": "Shipped",
  "orders.col.id": "Order #",
  "orders.col.customer": "Customer",
  "orders.col.total": "Total",
  "orders.col.status": "Status",
  "orders.loadFailed": "Failed to load orders. Try refreshing the page."
}
```

## Translation rules used (cross-references)

- `migration-context/maps/java-server-ui-pswcl.md` — table → `<DataTable>`
  with sortable / filterable patterns; native `<select>` → Carbon
  `<Select>` + `<SelectItem>`.
- `migration-context/patterns/java-server-ui-i18n-bridge.md` — every
  `<fmt:message key="..." />` becomes a key in the i18n bundle. Group
  keys under a logical namespace (`orders.*`) so they're easy to
  audit.
- `migration-context/scaffolds/java-server-ui-to-carbon-react.md` — the
  list-page scaffold (filter toolbar + DataTable) is in the standard
  scaffold; reuse the layout and lift the data-load hook into a
  per-feature `api/<entity>.ts` file.

## Generalization rules — DO NOT COPY VERBATIM

- Replace `OrdersListPage` with the entity name from the JSP's filename
  / View class.
- Replace `OrderRow` with the actual row shape — read the REST
  resource's DTO or, when not available, infer from the JSP's `render`
  function.
- Replace `/api/orders` with the actual path from
  `architect_scope.api_contracts`.
- Replace the `OrderStatus` enum with the actual status values used in
  the page (the JSP `<option>`s are the source of truth — extract them
  literally and TypeScript-ify).
- The HEADERS const is the right place to keep the column shape
  declarative; do NOT inline `header: t(...)` calls inside the JSX
  body — keep them in the const so the column order is auditable.

## Anti-patterns (do NOT do these)

- Do NOT modify the source `.jsp` / `.java` / `.css` files.
- Do NOT invent Carbon component names not literally present in the
  installed `@carbon/react` package. If `<DataTable>` does not exist,
  fall back to a plain `<Table>` from `@carbon/react` (which DOES
  exist) styled to match.
- Do NOT keep jQuery. The Carbon component handles sort, filter, and
  selection without it.
- Do NOT put i18n keys inline in JSX; route them through `useTranslation()`
  and the bundle JSON.
- Do NOT skip the `error` and `isLoading` branches — the JSP's
  `error: function() { ... 'Failed to load' }` and the empty initial
  `<tbody>` are the user-visible loading + error states; reproduce
  them with `<InlineNotification>` + `<Loading>`.
- Do NOT hard-code an API path that is not in `architect_scope.api_contracts`.
  If the contract is missing, the unit was misclassified — surface a
  `missing-api-contract` deviation instead of guessing.

## Carbon imports verified at authoring time

- `DataTable`, `Table`, `TableHead`, `TableHeader`, `TableBody`,
  `TableRow`, `TableCell`, `TableContainer`, `TableToolbar`,
  `TableToolbarContent` — all exported from `@carbon/react@1.x`.
- `Select`, `SelectItem` — exported from `@carbon/react@1.x`.
- `Loading`, `InlineNotification` — exported from `@carbon/react@1.x`.

Verify via Carbon MCP `code_search` for your installed version before
writing. If any of these is missing, drop to `<Table>` (which has
been stable since `@carbon/react@0.x`) and a plain `<select>` — the
table-driven UX is what matters; the toolbar shape is forgiving.
