
import { initDateInput } from './html/dateInput.js';
import { initSpotList } from './html/spotInput.js';
import { getSettings} from './settings.js';
import { createForms } from './html/form.js';
import { initWebcam } from './html/webcam.js';
import { addDeleteReportsEventHandlers } from './reports/deleteReport.js';
import { getReports } from './reports/getReports.js';
import { getWindObs } from './forecasts/windObsTable.js';
import { getYrForecast } from './forecasts/yrTable.js';
import { getSMHIForecast } from './forecasts/smhiTable.js';
import { getDMIForecast } from './forecasts/dmiTable.js';
import { initDMIImages } from './forecasts/dmiImages.js';   
import { initMSWImages } from './forecasts/mswImages.js';
import { getUKForecast } from './forecasts/ukTable.js';
import { initTwin } from './reports/compareReports.js';



export async function startSurfLog(userId) {
  initDateInput(); // Set current date
  initWebcam(); //Lazy load and add eventhandlers to webcam tools
  initDMIImages(); //Add click events for img nav btns and set time
  initMSWImages();
  initTwin();
  
  //Settings
  await getSettings(userId); //Get settings, statistics and sun up/down

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
}