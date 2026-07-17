# Dashboard with KPIs → Carbon Tile + MetricStat (worked example)

> **Load rule:** Mandatory for any platform-modernize FED unit whose
> unit-context declares `archetype_hint: dashboard-with-kpis`. Loaded
> ONCE per unit, before reading any source file or authoring any
> target file. Loading is verified by the migration-coverage-audit
> role.

> **Verification rule:** Every Carbon import shown below was verified
> against `@carbon/react@1.x` at authoring time. As Carbon evolves,
> your installed package may differ. Treat every `@carbon/*` import
> as untrusted. Verify via Carbon MCP `code_search` before writing.
> Full rule: INDEX.md §HARD RULE.

## When this archetype applies

Graph-derived signals from the planner (NOT folder names):
- ≥1 `component_invocation` edge from this unit's JSP to a tag handler
  whose simple class name matches `*KpiCard*` or `*MetricCard*` (case-
  insensitive). The tag-library descriptor (`itim.tld` / similar)
  resolves the JSP's `<myns:KpiCard ...>` element to the Java tag
  handler.
- The dashboard JSP typically combines several KPI widgets with a
  primary chart or table; this archetype focuses on the KPI + Tile
  layout shell. Charts attached to a KPI card are out of scope for
  the example (the architect emits chart data contracts separately).

## Source you will read (read-only context)

### `WAR_STANDARD/WebContent/jsp/dashboard/dashboard.jsp` (illustrative)

```jsp
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="ui" uri="/WEB-INF/itim.tld" %>
<%@ page import="com.example.app.ui.view.dashboard.DashboardView" %>
<%
  DashboardView view = (DashboardView) request.getAttribute("dashboardView");
%>
<html>
<head><title><fmt:message key="dashboard.title" /></title></head>
<body>
  <h1><fmt:message key="dashboard.heading" /></h1>

  <ui:Foundation>
    <div class="kpi-row">
      <ui:KpiCard
        label="${dashboardView.activeUsers.label}"
        value="${dashboardView.activeUsers.value}"
        delta="${dashboardView.activeUsers.delta}" />

      <ui:KpiCard
        label="${dashboardView.openTickets.label}"
        value="${dashboardView.openTickets.value}"
        delta="${dashboardView.openTickets.delta}" />

      <ui:KpiCard
        label="${dashboardView.errorRate.label}"
        value="${dashboardView.errorRate.value}"
        delta="${dashboardView.errorRate.delta}" />
    </div>

    <ui:DataTable items="${dashboardView.recentEvents}">
      <%-- DataTable contents driven by tag handler --%>
    </ui:DataTable>
  </ui:Foundation>
</body>
</html>
```

The interesting bits:
1. `<ui:KpiCard label="..." value="..." delta="..." />` — the
   `component_invocation` edge in your `architect_scope.component_mappings`.
   Read the Java tag handler (`KpiCardTag.java`) to understand how
   `delta` is rendered (color-coded, signed, etc.).
2. `<ui:Foundation>` is the page shell — translates to a layout
   wrapper (`<Theme>` + `<Grid>` / `<Column>` in Carbon).
3. The `dashboardView.activeUsers` shape is a small DTO with
   `{label, value, delta}` — the JSP exposes it via the View; the
   shape generalizes to any KPI tile.

### `JAR_UI_LOGIC/.../tags/defaults/KpiCardTag.java`

```java
public class KpiCardTag extends SimpleTagSupport {
  private String label;
  private String value;
  private String delta;
  // setters omitted

  @Override
  public void doTag() throws JspException, IOException {
    JspWriter out = getJspContext().getOut();
    out.println("<div class=\"kpi-card\">");
    out.println("  <div class=\"label\">" + escape(label) + "</div>");
    out.println("  <div class=\"value\">" + escape(value) + "</div>");
    out.println("  <div class=\"delta " + deltaClass(delta) + "\">"
                + escape(delta) + "</div>");
    out.println("</div>");
  }
  // …
}
```

The tag handler shows the rendering contract: a label / value / delta
trio with the delta colored by sign. Replicate this in React without
the server emit.

### `JAR_UI_LOGIC/.../view/dashboard/DashboardView.java`

```java
public class DashboardView {
  public Kpi getActiveUsers() { … }
  public Kpi getOpenTickets() { … }
  public Kpi getErrorRate()   { … }
  public List<EventRow> getRecentEvents() { … }

  public static class Kpi {
    private final String label, value, delta;
    // getters omitted
  }
}
```

## Target you will author

### `new_app_root/src/components/DashboardPage.tsx`

```tsx
import { Grid, Column, Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useDashboard } from '../api/dashboard';
import KpiTile from './KpiTile';
import RecentEventsTable from './RecentEventsTable';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useDashboard();
  if (isLoading || !data) return null;
  if (error) return <p role="alert">{t('common.error')}</p>;

  return (
    <Grid>
      <Column lg={16}>
        <h1>{t('dashboard.heading')}</h1>
      </Column>

      <Column lg={5} md={4} sm={4}>
        <KpiTile {...data.activeUsers} />
      </Column>
      <Column lg={5} md={4} sm={4}>
        <KpiTile {...data.openTickets} />
      </Column>
      <Column lg={6} md={8} sm={4}>
        <KpiTile {...data.errorRate} />
      </Column>

      <Column lg={16}>
        <RecentEventsTable rows={data.recentEvents} />
      </Column>
    </Grid>
  );
}
```

### `new_app_root/src/components/KpiTile.tsx`

```tsx
import { Tile } from '@carbon/react';

export interface KpiTileProps {
  label: string;
  value: string;
  delta: string; // e.g. "+12.4%" / "-3.1%"
}

function deltaTone(delta: string): 'positive' | 'negative' | 'neutral' {
  if (delta.startsWith('+')) return 'positive';
  if (delta.startsWith('-')) return 'negative';
  return 'neutral';
}

export default function KpiTile({ label, value, delta }: KpiTileProps) {
  const tone = deltaTone(delta);
  return (
    <Tile>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className={`kpi-delta kpi-delta--${tone}`}>{delta}</p>
    </Tile>
  );
}
```

### `new_app_root/src/api/dashboard.ts`

```ts
import { useQuery } from '@tanstack/react-query';

export interface Kpi {
  label: string;
  value: string;
  delta: string;
}
export interface EventRow {
  id: string;
  timestamp: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}
export interface DashboardResponse {
  activeUsers: Kpi;
  openTickets: Kpi;
  errorRate: Kpi;
  recentEvents: EventRow[];
}

async function fetchDashboard(): Promise<DashboardResponse> {
  // Path comes from architect_scope.api_contracts.
  const res = await fetch('/api/dashboard', { credentials: 'include' });
  if (!res.ok) throw new Error(`dashboard fetch failed: ${res.status}`);
  return res.json();
}

export function useDashboard() {
  return useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard });
}
```

### `new_app_root/src/i18n/en.json` (excerpt — additive)

```json
{
  "dashboard.title": "Dashboard",
  "dashboard.heading": "Operations dashboard",
  "common.error": "Something went wrong. Try refreshing the page."
}
```

## Translation rules used (cross-references)

- `migration-context/maps/java-server-ui-pswcl.md` — `<itim:Foundation>`
  → `<Theme>` + `<Grid>`; `<itim:KpiCard>` → custom React `KpiTile`
  built on Carbon `<Tile>`; `<itim:DataTable>` → Carbon `<DataTable>`.
- `migration-context/patterns/java-server-ui-i18n-bridge.md` — labels
  on KPI cards come from the View, not the bundle, so they are NOT
  translated by `<fmt:message>`. Pass them through as data.

## Generalization rules — DO NOT COPY VERBATIM

- Replace `DashboardPage` with the actual page name.
- Replace `KpiTile` props with whatever shape the tag handler exposes.
  Some KPI widgets carry `trend` (sparkline data), `target` (KPI
  threshold), or `unit` ("MB", "ms"); the shape generalizes — read
  the tag handler's setters to enumerate the props.
- Replace `/api/dashboard` with the actual path from
  `architect_scope.api_contracts`.
- Replace the Grid column counts (`lg={5}` etc.) with whatever the
  designer intended; Carbon's grid is 16 columns, so balance the row.

## Anti-patterns (do NOT do these)

- Do NOT modify the source `.jsp`, the `KpiCardTag.java`, the View,
  or the `.properties` files.
- Do NOT replicate the JSP's manual `<div class="kpi-card">` emission
  — Carbon's `<Tile>` does the wrapper. Inheriting the `kpi-card`
  CSS class is fine (the design system likely overrides Tile padding
  to match), but author the JSX from the React component model, not
  the JspWriter shape.
- Do NOT call the chart library directly inside `KpiTile`. If a
  trend sparkline is required, accept it as a prop and render via a
  separate component composed in `<DashboardPage>`.
- Do NOT skip the delta color heuristic. The JSP's tag handler color-
  codes positive vs. negative; the React component MUST reproduce
  that affordance for parity.

## Carbon imports verified at authoring time

- `Grid`, `Column`, `Tile` — all exported from `@carbon/react@1.x`.

Verify via Carbon MCP `code_search` for your installed version before
writing. If the IBM Products `MetricStat` component is available
(`@carbon/ibm-products`), it's a reasonable replacement for the
custom `KpiTile`; check before adopting.
