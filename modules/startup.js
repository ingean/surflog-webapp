import { Loader } from './utils/logger.js'; 
import { initDateInput } from './components/dateInput.js';
import { initSpotList } from './components/spotInput.js';
import { createForms } from './components/form.js';
import { addDeleteReportsEventHandlers } from './reports/delete.js';
import { getReports } from './reports/read.js';
import { getFrostObs } from './forecasts/tables/frostObs.js';
import { getOpenMeteoForecast } from './forecasts/tables/openmeteo.js'
import { getMetForecast } from './forecasts/tables/met.js';
import { getDMIForecast } from './forecasts/tables/dmi.js';
import { initDMIImages } from './forecasts/images/dmi.js';   
import { getDMIObservations } from './forecasts/tables/dmiObs.js';
import { initTwin } from './reports/compare.js';
import { initReportlist } from './reports/views/list.js';
import { getBuoyObs } from './forecasts/tables/buoyObs.js';
import { initDMIMap } from './forecasts/map/dmi.js';

export async function startSurfLog(userId) {
  let load = new Loader(`#root-forecast-table-yrCoast`);
  //let mapLoader = new Loader(`#dmi-map-section`);
  
  // Maps
  initDMIMap()
  
  initDateInput() // Set current date
  initDMIImages() // Add click events for img nav btns and set time
  initTwin()
  initReportlist()
    
  //Forms
  await createForms(); // Need settings to create forms (list of countries etc.)
  initSpotList(); //Fills spotlist with available spots from db
  
  // Reports
  addDeleteReportsEventHandlers()
  getReports()

  // Forecasts
  getDMIForecast()
  getOpenMeteoForecast()
  getMetForecast()
  getBuoyObs()
  getDMIObservations()
  getFrostObs()
}