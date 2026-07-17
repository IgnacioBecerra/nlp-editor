# Deviations — front-end-developer session agt_b6180217eab1

## Deviation entries

- Description: @carbon/react 1.109.0 transitively depends on @floating-ui/react@^0.27.4 which peers React >=17, but project is on React 16.14.0. Webpack 5 (react-scripts 5) cannot resolve react/jsx-runtime from the ESM @floating-ui/react nested under @carbon/react/node_modules/. Build fails with "Can't resolve 'react/jsx-runtime'".
  File: `package.json`
  Lines: N/A
  Agent: front-end-developer
  What the system did: partial-migration

- Description: @elyra/canvas 12.12.3 peers @carbon/icons-react@^10.44.0, incompatible with v11. Auto-bumped to @elyra/canvas@^13.48.0 (latest, supports v11 icons).
  File: `package.json`
  Lines: N/A
  Agent: front-end-developer
  What the system did: best-guess-carbon

- Description: Icon import style locked to Option A (keep @carbon/icons-react as direct dep, import from '@carbon/icons-react').
  File: `.carbon-migration/icon-import-style.txt`
  Lines: N/A
  Agent: front-end-developer
  What the system did: preserved-source
