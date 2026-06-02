# Contributing / PR Checklist — SurfLog Webapp

Thanks for contributing! This project has a few conventions and invariants to preserve. Please follow this checklist when opening a PR.

Before you code
- Create a new branch from `ES6` with a short name like `feat/dmi-api` or `fix/param-format`.
- If your change touches platform integration (ArcGIS, proxy API, Google Charts), ask maintainers for relevant keys or sandbox test URLs.

Local dev setup
- Run a local HTTPS server (ArcGIS requires HTTPS):
  ```bash
  http-server -S -C /path/to/localhost.pem -K /path/to/localhost-key.pem
  # Open https://127.0.0.1:8080
  ```
- Or use VSCode Live Server configured in `.vscode/settings.json` (port and root already configured).

Implementation checklist
- Files you will likely change when adding a new provider or param:
  - `modules/config/datasources.js` — add provider and params (units, types, `panel: true` for UI panels).
  - `modules/config/forecastValues.js` — param display metadata (unit, caption, precision, `arrow`, `secondary`, `alias`).
  - `modules/forecasts/images/*` — image handling & UI (src formatting, nav functions).
  - `modules/forecasts/tables/*` — table rendering and `forecastToRow` functions.
  - `index.html` — add a new root container (ID) if you create a new UI panel or table.
  - `modules/main.js` / `modules/startup.js` — initialize modules or event listeners if required.
- Follow project patterns:
  - Use ES modules and named `export` / `import`.
  - Use DOM helper functions in `modules/components/elements.js` (`el`, `div`, `span`, `tr`, `td`, `hrsTd`) to generate UI elements.
  - Use `paramSpan()` and `paramVal()` to render parameter cells; pass `{stats}`, `{station}`, or `{alias}` as options when needed.
  - To render tables, use `updateForecastTable(forecast, forecastDate, forecastToRow, tableName, headers)` in `modules/forecasts/tables/table.js`.
  - For key existence checks, use `param in obj` — values like `0` must be considered present.

Important invariants and checks
- DO NOT rename the following root DOM container IDs (other modules expect them):
  - `root-forecast-table-dmi`, `root-forecast-table-dmi-historic`, `root-forecast-table-yr`, etc.
  - `dmi-waveheight-table`, `dmi-swellheight-table`, `dmi-wind-table` and `img-dmi-*` IDs used by image handlers.
- Avoid global side effects: prefer returning small, idempotent helpers rather than mutating unrelated modules.
- Add or reuse `params` definitions in `modules/config/forecastValues.js` and/or `modules/config/datasources.js`.

Testing & verification
- Manual QA: Open the app (https), check the Network tab for `fetch` calls to `urlAPI` and validate responses.
- Verify UI behavior: live/historic image toggles, nav buttons, and table rendering. Make sure `updateForecastTable()` updates correct containers.
- Verify `getStats()` usage and caching: `modules/utils/statistics.js` caches results in-memory and returns synthetic `buoy` data. Update tests or mocks accordingly.
- For map changes: verify ArcGIS controls with secure origin and check for missing credentials.

PR size and description
- Keep PRs focused: a single provider change or a small fix per PR is easier to review.
- Include the following in the PR description:
  1. What you changed and why.
  2. Files touched and key modules to review.
  3. Manual test steps (screenshots are helpful).
  4. Any new environment vars, API keys, or instructions to run locally.

Final reviewer checklist
- [ ] Branch and PR follow naming conventions.
- [ ] `index.html` DOM changes only when needed, and new IDs are unique.
- [ ] `modules/config` updated as required.
- [ ] `modules/forecasts/images` AND `modules/forecasts/tables` updated consistently.
- [ ] No unexpected changes to `css/` class names that break styling.
- [ ] Manual run-through (live/test toggles, tables, charts, maps) completed.
- [ ] README or `.github/copilot-instructions.md` updated if developer-facing instructions changed.

Thank you for contributing — your work helps improve the SurfLog web app!
