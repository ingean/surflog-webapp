# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Server

There is no build step. Serve files directly over HTTPS (required for Facebook SDK and geolocation):

**Option A: VS Code Live Server** (port 5500, configured in `.vscode/settings.json` with SSL certs at `/etc/apache2/ssl/`)

**Option B: http-server with custom certs:**
```
http-server -S -C /Users/inge/Documents/dev/ssl/localhost.pem -K /Users/inge/Documents/dev/ssl/localhost-key.pem
```
Then open `https://127.0.0.1:8080`

## Architecture

Vanilla JavaScript SPA — no framework, no build toolchain. Uses native ES6 modules (`type="module"`).

**Entry point:** `main.js` — initializes theme, moment.js locale, Google Charts, and the Facebook SDK. Authentication is handled via Facebook login; on successful auth, `modules/startup.js:startSurfLog()` is called to bootstrap the app.

**Module structure under `modules/`:**

| Directory | Purpose |
|---|---|
| `config/` | Static configuration: spot IDs (`spots.js`), API URLs & forecast param definitions (`datasources.js`), score model (`scoreModel.js`), chart configs, form field definitions |
| `components/` | Reusable UI elements: `elements.js` (DOM builders), `modal.js`, `form.js`, `spotInput.js`, `dateInput.js`, `carousel.js`, `tabs.js`, `charts.js` |
| `forecasts/` | Forecast data fetching and display, organized by type: `tables/` (DMI, DMI API, Met/Yr, Open Meteo, SMHI, buoy/wind observations), `images/` (DMI animated maps, MSW), `charts/`, `cards/` (station stats), `map/` (ArcGIS layer setup), `dashboards/` |
| `reports/` | Surf session/observation CRUD: `create.js`, `read.js`, `delete.js`, `compare.js`; views in `views/` (list, report detail, session, observation, images, statistics) |
| `utils/` | `api.js` (fetch wrappers `get`/`post`/`del`, URL builder), `login.js` (FB auth flow), `logger.js` (Loader class, notifications), `time.js`, `statistics.js`, `parseString.js`, `imageToText.js` |
| `lib/ol/` | Bundled OpenLayers library (not actively used — ArcGIS replaced it) |

**Legacy scripts in `js/`:** `forecast.js` and `score.js` are older non-module scripts; `js/lib/` contains third-party libs loaded via `<script>` tags (moment.js, bootstrap-notify, bootstrap-confirmation, simplePagination).

## Key External Dependencies (CDN)

- **Bootstrap 3.3.7** + jQuery 3.2.0 (loaded as global scripts)
- **ArcGIS Maps SDK 4.34** (`<arcgis-map>` web component, `@arcgis/core` via importmap)
- **ArcGIS Calcite Design System 3.3.3**
- **Google Charts** (loaded via `google.charts.load`)
- **Facebook SDK** (authentication)
- **moment.js** with Norwegian locale (`nb_NO`)

## Backend API

All app data is stored on a Google App Engine proxy/backend:
- Base URL: `https://high-plating-184911.appspot.com/`
- Defined in `modules/config/datasources.js` as `urlAPI`
- The `modules/utils/api.js` `get(url)` function prepends `urlAPI` when the URL doesn't start with `http`

Images (observation photos) are stored in Google Cloud Storage: `https://storage.googleapis.com/observations/`

## Data Flow

1. User selects a **spot** (dropdown populated from backend) and a **date** (defaults to today)
2. Forecast tabs fetch from multiple external sources: DMI (images + API), Met.no oceanforecast, Yr coast, Open Meteo, SMHI buoy observations, Frost wind observations, DMI Danish weather stations
3. The **score model** (`modules/config/scoreModel.js`) converts wave/swell/wind parameters into a numeric surf quality score (0–5)
4. Reports list shows logged surf sessions; clicking a report loads the detail view with forecast comparison

## UI Language

The UI is in Norwegian (Bokmål). Comments and variable names are in English, but UI strings/labels are Norwegian.
