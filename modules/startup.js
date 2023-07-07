import { Loader } from './utils/logger.js'; 
import { initDateInput } from './html/dateInput.js';
import { initSpotList } from './html/spotInput.js';
import { createForms } from './html/form.js';
import { addDeleteReportsEventHandlers } from './reports/delete.js';
import { getReports } from './reports/read.js';
import { getWindObs } from './forecasts/tables/windObs.js';
import { getYrForecast } from './forecasts/tables/yr.js';
import { getSMHIForecast } from './forecasts/tables/smhi.js';
import { getDMIForecast } from './forecasts/tables/dmi.js';
import { initDMIImages } from './forecasts/images/dmi.js';   
import { getUKForecast } from './forecasts/tables/uk.js';
import { getDMIObservations } from './forecasts/tables/dmiObs.js';
import { initTwin } from './reports/compare.js';
import { initReportlist } from './reports/views/list.js';

//import { getSettings } from './settings.js';
//import { initWebcam } from './html/webcam.js';
//import { initMSWImages } from './forecasts/images/msw.js';

export async function startSurfLog(userId) {
  let load = new Loader(`root-forecast-table-yrCoast`);
  initDateInput(); // Set current date
  //initWebcam(); // No linger available
  initDMIImages(); // Add click events for img nav btns and set time
  //initMSWImages(); // No longer available
  initTwin();
  initReportlist()
  
  //Settings
  //await getSettings(userId); //Get settings and statistics

  //Forms
  await createForms(); // Need settings to create forms (list of countries etc.)
  initSpotList(); //Fills spotlist with available spots from db
  
  // Reports
  addDeleteReportsEventHandlers();
  getReports();

  // Forecasts
  getWindObs();
  getYrForecast();
  getSMHIForecast();
  getDMIForecast();
  getUKForecast();
  getDMIObservations();
}