import { urlMSWForecasts } from './config/datasources.js';
import { initDateTime } from './utils/time.js';
import { initSpotList } from './html/spotInput.js';
import { getSettings, getPlacesCreateForms, getStatistics } from './settings.js';
import { loadWebcam } from './webcam.js';
import { addDeleteReportsEventHandlers } from './reports/deleteReport.js';
import { getReports } from './reports/getReports.js';
import { getWindObs } from './forecasts/windObsTable.js';
import { getYrForecast } from './forecasts/yrTable.js';
import { getSMHIForecast } from './forecasts/smhiTable.js';
import { getDMIForecast } from './forecasts/dmiTable.js';
import { imgBrowser } from './html/imgBrowser.js';   


function setMSWImgs(){
  let unixTime = moment(moment().format('YYYY-MM-DDT00:00:00')).unix();
  let forecasts = ['wave', 'period', 'wind'];
  let date = moment().format('YYYYMMDD00');
  forecasts.forEach(fc => {
    let type = (fc === 'wind') ? 'gfs' : 'wave';
    let subtype = (fc === 'wind') ? '4' : (fc === 'wave') ? '24' : '25';
    let url = `${urlMSWForecasts}${type}/${date}/940/7-${unixTime}-${subtype}.gif`;
    document.querySelector(`#root-msw-${fc}`).replaceChildren(imgBrowser(`msw-${fc}`, url, ''));
  })
}

export async function startSurfLog(userId) {
  //Misc.
  initDateTime(); //Find forecast start times etc.
  loadWebcam();
  
  //Settings
  await getSettings(userId);
  await getStatistics();

  //Forms
  await getPlacesCreateForms(); // Need settings to create forms (list of countries etc.)
  initSpotList();
  
  // Reports
  addDeleteReportsEventHandlers();
  getReports();

  // Forecasts
  setMSWImgs();
  getWindObs();
  getYrForecast();
  getSMHIForecast();
  getDMIForecast();
}