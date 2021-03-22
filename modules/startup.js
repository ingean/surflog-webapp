import { initDateTime } from './utils/time.js';
import { getSettings, getPlacesCreateForms } from './settings.js';
import { getForecasts } from './forecasts/getForecasts.js';
import { initReports } from './reports/reports.js';
import { loadWebcam } from './webcam.js';
import { makeDeleteReportGlobal } from './reports/deleteReport.js';

export async function startSurfLog(userId) {
  initDateTime(); //Find forecast start times etc.
  //getForecasts();
  loadWebcam();
  let settings = await getSettings(userId);
  initReports();
  makeDeleteReportGlobal(); // Expose click event function to window for bootstrap confirm dialog
  getPlacesCreateForms();
}