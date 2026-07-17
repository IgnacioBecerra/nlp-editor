# Carbon v11 Remediation (de-customization) Map

> Source: a codebase ALREADY on Carbon v11 (`@carbon/react` ^1.x, React 18) that misuses it — bespoke `.tsx` wrappers + a custom CSS/SCSS skin that renders janky
> Target: idiomatic Carbon v11 (`@carbon/react` Core + `@carbon/ibm-products`), same versions
> Last updated: 2026-06
> Spec: SPECS/CARBON_V11_REMEDIATION_SPEC_2026-06-15.md
> Docs: <https://react.carbondesignsystem.com>

**LOAD RULE:** Load this file only when `source_framework` is `carbon-v11-remediation` per INDEX.md. Load ONCE per session.

**CO-LOCATED PRECEDENT OVERRIDE:** Where the repo already has a clean, idiomatic Carbon area (no custom skin), the prior team's choices are authoritative. Follow those; log a deviation only when this map would yield a different result.

---

> **Carbon imports in this file are curated.** Anything not literally shown here (any icon, component, hook, prop, or token) MUST be verified against the installed package via Carbon MCP `code_search` / `docs_search` before you write the import (`MIGRATION_AGENT_PROTOCOL.md` §1.3). Invoke the **carbon-builder** skill before any Carbon change.

## §0 Premise — read first

The source is **already Carbon v11** (`@carbon/react ^1.x`, React 18). This is **NOT a version upgrade** and **NOT a third-party→Carbon library swap**. It is a **de-customization / conformance** pass: the repo wraps Carbon components in bespoke `.tsx` wrappers and re-skins them through a custom CSS/SCSS layer (e.g. `src/scss/*`), so the UI renders incorrectly / janky.

Your job: **strip the custom skin**, re-base components on **stock `@carbon/react`** (and `@carbon/ibm-products` for product patterns), and **regenerate design** with Carbon tokens where stripping CSS leaves a gap — while **preserving all logic and the public API**.

**HARD RULE: never remove `@carbon/react`, `@carbon/styles`, or `react`.** They are the foundation, not a source library to swap out.

## §1 Stack preservation — dependencies are OUT OF SCOPE

This is a **UI-only** remediation.

- Do **NOT** edit dependency versions in `package.json`. Do **NOT** upgrade or downgrade `react`, `react-dom`, `@carbon/react`, `@carbon/styles`, `@carbon/icons-react`, or `typescript`.
- Keep the source's stack **verbatim**. Downgrading the contemporary stack (e.g. React 18 → 16) is a **regression** and is forbidden. (A deterministic supervisor floor restores any accidental downgrade to the source value and records `[stack-downgrade-prevented]`; do not rely on it — just don't touch deps.)
- The only dependency you may add is `@carbon/ibm-products` (at the `config/carbon-version-pins.json` pin) **and only when** §3 routes a component there — never speculatively.

## §2 Strip the custom skin → reuse `maps/react.md`

The mechanics of removing custom CSS/SCSS and re-basing on Carbon are identical to the raw-React case. **Use `maps/react.md`** for:

- the strip-custom-CSS → Carbon-token rules (colors → `$text-*`/`$layer-*`, spacing → `$spacing-*`, type → type tokens, `<Theme>`/`<Layer>` usage);
- the design-deviation taxonomy — log `best-guess-carbon`, `preserved-source`, and `wrapper-added` exactly as `react.md` "Deviation triggers" defines them.

Do not duplicate those rules here; this map adds only what is remediation-specific (§4–§7).

## §3 Component upgrades → reuse `maps/carbon-v11-ibm-products.md`

When a bespoke wrapper re-implements a product pattern Carbon already ships (page header, side panel, tearsheet, empty state, etc.), replace the bespoke internals with the IBM Products component. **Use `maps/carbon-v11-ibm-products.md`** for the Core→IBM-Products lookup and the correct import names. Add `@carbon/ibm-products` (pinned) only when this actually fires.

## §4 Wrapper public-API preservation (remediation-specific)

The repo is a published library other apps consume. Each bespoke `.tsx` wrapper's **name and props are a contract**.

- **Keep every wrapper's exported name and prop shape.** Convert the wrapper into a **thin adapter** over stock Carbon: same props in, mapped to Carbon's props, same behavior out. Log `wrapper-added` (per `react.md`).
- **Strip the custom SCSS skin from inside the wrapper** — remove `className`-based overrides that re-style Carbon internals. Log `[style-approximation]` when you drop a bespoke visual treatment that Carbon does not reproduce 1:1.
- **Never narrow the public export surface.** A name a consumer imports must still resolve. If a wrapper can no longer back a name, route it through the compatibility layer (Bucket A core alias / Bucket B `@carbon/ibm-products` wrapper / Bucket C render-safe stub) per the public-export-surface rule — see the `FINAL_REFINEMENT` C2.5/C2.6 checklist and the public-API-preservation spec. A silently dropped public export is a defect, not a sanctioned drop.

## §5 UX-prediction protocol (predict the rendered result WITHOUT running it)

The pipeline is headless — you cannot render the app. The defect being remediated **is** the rendered/interaction behavior, so reason about it statically. For each component you touch:

1. **State Carbon's default.** What does the stock Carbon component render (DOM structure, states, focus, portals) with no custom CSS?
2. **Diff the custom layer against it.** What does the bespoke wrapper + custom SCSS change?
3. **Predict the delta the custom layer causes** to the rendered result and interactions (clipping, misalignment, overlay/z-index, focus, theme, responsive).
4. **Classify each delta:** *jank to remove* (fights Carbon) vs *intentional theme to keep* (legitimate brand token).
5. **State the predicted post-remediation UX**, validated against the project **GESTALT** (the intended design language — load it in Phase 0).

If `.carbon-migration/ux-jank-worklist.md` exists, it is a deterministic, pre-computed list of jank candidates in your scope — address each (fix the cause or record a residual per §7). It is a floor, not a ceiling: still run the protocol above.

## §6 Jank taxonomy (static signal → idiomatic fix)

Each row: what the user sees → the greppable signal in code (no render needed) → the idiomatic Carbon fix → the residual deviation tag.

| Symptom | Static signal | Idiomatic fix | tag |
|---|---|---|---|
| Menus / tooltips / modals clipped | `overflow:hidden`/`auto` on a Carbon layout ancestor; broken portal escape | remove the clipping override; rely on Carbon portaling | `[ux-jank-residual]` |
| Content cut off / cramped | fixed `px` height/width/`line-height` on a Carbon component | drop the fixed dimension; size from content/tokens | `[ux-jank-residual]` |
| Misaligned rows, off-rhythm | spacing not on the token grid; overridden `--cds-spacing-*` | spacing tokens / Carbon layout components | `[ux-jank-residual]` |
| Overlay behind content | hand-set `z-index` fighting Carbon layering | remove; rely on Carbon stacking | `[ux-jank-residual]` |
| Invisible focus / a11y break | `outline:none`; removed `:focus`/`:focus-visible` | restore Carbon focus tokens | `[ux-jank-residual]` |
| Broken dark / contrast theme | non-token colors; overridden `--cds-*` color custom properties | token references; `<Theme>` | `[ux-jank-residual]` |
| Layout breaks at widths | custom media queries vs the Carbon grid | Carbon `Grid`/`Column` breakpoints | `[ux-jank-residual]` |
| Won't reflow / elements overlap | `float:left/right`; `position:absolute/fixed` used for layout | remove; use Carbon `Grid`/flex/flow (keep `absolute` only for a true overlay) | `[ux-jank-residual]` |
| Smushed / clipped at narrow widths | fixed `px` `width`/`max-width` (≈≥80px); `white-space:nowrap` | drop the fixed width; allow wrapping; size from grid/content | `[ux-jank-residual]` |
| Wrong type weight / size | `font-weight` off the Carbon scale (≠300/400/600/700); `font-size:Npx` | Carbon type tokens / a scale weight | `[ux-jank-residual]` |
| Style approximation kept | a custom rule deliberately retained (legitimate theme) | keep, but record the approximation | `[style-approximation]` |

Remove the **cause** of the jank, not the symptom. Never re-introduce custom CSS to "fix" a gap — use Carbon tokens/layout.

## §7 Deviation discipline

- Record residual jank you could not safely de-skin as `[ux-jank-residual]` (one entry per spot: file:line + symptom + why it must stay).
- Record kept bespoke visual treatments as `[style-approximation]`.
- Record dropped/aliased public exports per §4 (compat layer) — never a silent drop.
- A clean remediation of an already-idiomatic area yields **0 deviations**. Do not invent deviations for code that already uses Carbon correctly.
