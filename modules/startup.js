import { initDateTime } from './utils/time.js';
import { getSettings, getPlacesCreateForms } from './settings.js';
import { getForecasts } from './forecasts/getForecasts.js';
import { initReports } from './reports/reports.js';
import { loadWebcam } from './webcam.js';

export async function startSurfLog(userId) {
  initDateTime(); //Find forecast start times etc.
  //getForecasts();
  loadWebcam();
  let settings = await getSettings(userId);
  initReports();
  getPlacesCreateForms();
}