import { initDateTime } from './utils/time.js';
import { getSettings, getPlacesCreateForms } from './settings.js';
import { getForecasts, getYrCoastal } from './forecasts/getForecasts.js';
import { loadWebcam } from './webcam.js';
import { addDeleteReportsEventHandlers } from './reports/deleteReport.js';
import { getReports } from './reports/getReports.js';

export async function startSurfLog(userId) {
  //Misc.
  initDateTime(); //Find forecast start times etc.
  loadWebcam();
  
  //Settings
  await getSettings(userId);

  //Forms
  await getPlacesCreateForms(); // Need settings to create forms (list of countries etc.)
  
  // Reports
  addDeleteReportsEventHandlers();
  getReports();

  // Forecasts
  getYrCoastal();
  //getForecasts();
}