# Deviations for Human Review — Job 2m6oxm88

## Purpose

This file records every case during this migration where the automated system
was uncertain, made an assumption, or produced output that warrants human
verification before the migration PR is merged. The migration did NOT stop
for any of these — it continued with its best attempt and logged the entry
here. A human reviewer should work through every entry below during
draft-PR review, confirm the automated choice is acceptable, and mark each
entry resolved.

- Total deviations: 3
- Design section: 0
- Architecture section: 3
- Generated: 2026-07-17T22:49:08.480Z
- Contributing agents: (none)

---

## Design

_No deviations logged._

## Architecture

### Deviation 1

- Description: @carbon/react 1.109.0 transitively depends on @floating-ui/react@^0.27.4 which peers React >=17, but project is on React 16.14.0. Webpack 5 (react-scripts 5) cannot resolve react/jsx-runtime from the ESM @floating-ui/react nested under @carbon/react…
- File: `package.json`
- Lines: N/A
- Agent: front-end-developer
- What the system did: partial-migration

### Deviation 2

- Description: @elyra/canvas 12.12.3 peers @carbon/icons-react@^10.44.0, incompatible with v11. Auto-bumped to @elyra/canvas@^13.48.0 (latest, supports v11 icons).
- File: `package.json`
- Lines: N/A
- Agent: front-end-developer
- What the system did: best-guess-carbon

### Deviation 3

- Description: Icon import style locked to Option A (keep @carbon/icons-react as direct dep, import from '@carbon/icons-react').
- File: `.carbon-migration/icon-import-style.txt`
- Lines: N/A
- Agent: front-end-developer
- What the system did: preserved-source
