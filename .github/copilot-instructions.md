# Copilot / AI Agent Instructions — SurfLog Webapp

This file documents concise, actionable guidance for an AI agent (Copilot, etc.) to be immediately productive in this repo.

Summary
- This is a static client-side web app (ES Modules) that reads forecast & observation data, renders UI elements (maps, image panels, tables), and interacts with a backend API proxy at `urlAPI` (see `modules/config/datasources.js`).
- Entry points: `index.html` (UI structure & root elements) and `main.js` (initialization — theme, locale, FB SDK, charts).

How to run locally
- Use a static file server. Example (from README):
  ```bash
  http-server -S -C /path/to/localhost.pem -K /path/to/localhost-key.pem
  # open https://127.0.0.1:8080 in Chrome
  ```
- Alternatively use VSCode Live Server. `.vscode/settings.json` has a port & root set.
- Note: ArcGIS SDK and some external APIs require HTTPS; use the local cert command above.

Key directories & architecture
- `index.html` — root structure and container IDs (e.g. `#root-forecast-table-dmi`, `#dmi-waveheight-table`) used by modules to insert content.
- `main.js` — minimal initializer; sets theme, loads 3rd party SDKs.
- `css/` — UI styles (theme, utilities, tables, etc.) and `modules/components/elements.js` — small DOM helpers used across the app.
- `modules/config/` — static configuration objects for `forecasts`, `datasources`, `forecastValues` (units, param definitions, caption). To add a new forecast source, modify this file and related `modules/forecasts/*` modules.
- `modules/components` — shared DOM helpers, UI elements, e.g. `elements.js` (`el`, `div`, `span`, `tr`, `td`), useful for building consistent markup across code.
- `modules/forecasts/` — visualization and table logic divided by providers and types:
  - `tables/` — re-usable table rendering (`table.js`) and provider-specific table functions
  - `images/` — image-based forecast handling & navigation
  - `map/` — map layers & ArcGIS/OL integration
- `modules/utils/` — utilities: `api.js` (fetch wrappers and endpoints), `statistics.js` (caching & aggregation), `logger.js` (log, notify), `utilities.js` (rounding, mergeTimeseries).
- `modules/lib/` — vendor/local third-party libraries (OpenLayers, rbush, quickselect). These are self-contained; prefer reusing them rather than adding new large libraries unless necessary.

Data flow & integration points
- Local & 3rd-party data is fetched via `modules/utils/api.js` (`get`, `post`, `del`, `queryTimespan`) — `urlAPI` is the main backend proxy.
- Forecasters are identified in `modules/config/datasources.js` and used throughout `modules/forecasts/*`.
- Images may be proxied via the `proxy` server (see `urlAPI` usage in `index.html` and image src paths in `modules/forecasts/images/*`).
- Statistics are fetched via `statistics/forecasts2` endpoint and cached in `modules/utils/statistics.js`.

Coding patterns and conventions (use these patterns when editing)
- ES modules and named exports are used throughout — prefer `export`/`import` over mixing script tags.
- Use helper element functions from `modules/components/elements.js` (`el`, `div`, `span`, `tr`, `td`, `hrsTd`) to keep UI markup consistent.
- Parameter metadata is configured in `modules/config/forecastValues.js` and `modules/config/datasources.js`. Use `paramVal()` and `paramSpan()` to consistently format values and include units.
- Check for existence of keys using `param in obj` (the value may be 0 or falsy, but still present).
- Use `updateForecastTable(forecast, forecastDate, forecastToRow, tableName, headers)` (in `modules/forecasts/tables/table.js`) to populate and refresh tables. This function takes care of day-splitting and table dom replacement.
  - Example: `updateForecastTable(timeseries, getDMITime, dmiForecastToRow, 'dmi', headers)` — `forecastDate` is a getter function that returns the forecast's utctime.
- `get*Forecast` functions in `modules/forecasts/*` usually fetch data and then call `updateForecastTable()`.
- Common options object pattern is used: pass `{stats}` or `{station, alias, secondary}` to `paramSpan`/`paramVal` and other helpers.
- Styling classes used in JS are authoritative (e.g., `param-value`, `param-arrow`, `tr-scope`, `tr-outofscope`); CSS selectors in `css/` will control appearance.

Common tasks and quick recipes
- Add a new forecast provider:
  1. Add config in `modules/config/datasources.js` with `params` array.
  2. Add data fetch in `modules/utils/api.js` or a new module in `modules/forecasts/`.
  3. Add UI code — images component in `modules/forecasts/images/` and table row in `modules/forecasts/tables/`.
  4. Use `paramSpan()` and `paramVal()` for param rendering.
  5. Add root element in `index.html` to host the rendered table or image and wire `updateForecastTable`.

- Update or add a new param display (e.g. airtemp):
  1. Add param to `params` array in `modules/config/forecastValues.js` or to the relevant `datasources` `params` array.
  2. Use `paramSpan(station, 'airtemp', options)` in table columns or `paramVal()` for raw string formatting.

- Debugging fetch or API flows: open Browser DevTools > Network, check `fetch` requests against `urlAPI`, and check console for messages printed by `logger.js` or `console.log`.
  - Use `log()` and `notify()` from `modules/utils/logger.js` — they print to the console and show UI notifications (via `bootstrap-notify`).

- ArcGIS & external SDKs: require internet and secure host (HTTPS). `index.html` contains importmap and ArcGIS components — avoid moving or changing them unless necessary.

Important files for common tasks
- `index.html` — root containers and import scripts
- `main.js` — initialization and global SDK setups
- `modules/components/elements.js` — DOM element helpers
- `modules/config/datasources.js`, `modules/config/forecastValues.js` — key params & datasource configs
- `modules/utils/api.js` — fetch wrapper and endpoints
- `modules/forecasts/tables/table.js` — table renderer & utils
- `modules/forecasts/images/*` and `modules/forecasts/tables/*` — provider-specific UI
- `modules/utils/statistics.js` — stats retrieval, caching & score logic
  - Note: `getStats()` caches results in-memory and returns synthetic data for certain sources (e.g., `buoy`); be aware when adding tests or changes.

Style & safety: small notes
- Follow existing code style where helpful; avoid changing global code style drastically in a small PR.
- Preserve existing dev invariants such as DOM container IDs and CSS class names for styling.
  - DO NOT rename root containers (e.g., `root-forecast-table-dmi`, `dmi-waveheight-table`) — many modules select these IDs directly.

If unsure or the change touches platform-integration (ArcGIS, FB SDK, Google Charts, or proxy API), ask the maintainers for credentials / sandbox URLs.

---
Suggestions & continuing improvements
- Consider adding a `dev` script or `package.json` to standardize local dev commands (not currently in repo).
- Adding a CONTRIBUTING.md with a small PR checklist (keeping CSS classes & container IDs stable, adding new root container IDs to `index.html`) will help future agents.

If anything above is unclear or incomplete, please highlight the sections to iterate on.

## PR Checklist (short)
When opening a PR, please include the following checks in the PR description:
 - What changed and why
 - Manual QA steps to verify the change locally (expected UI, API calls)
 - Files touched and any IDs or CSS classes added/removed
 - If a new root container is added, add it to `index.html` and avoid renaming existing ones (e.g., `root-forecast-table-dmi`)
 - Ensure `modules/config/` updated for new providers or params
 - Remember to run the app via the Local HTTPS `http-server` (or Live Server) and verify console / network logs