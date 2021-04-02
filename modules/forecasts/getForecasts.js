import { log, Loader } from '../utils/logger.js';
import { get } from '../utils/api.js';
import { spotIds } from '../config/lookups.js';
import { updateYrCoastTable } from './yrCoastTable.js';

const fcSources = ['dmi', 'smhi', 'yr', 'frost', 'kv'];

export var forecasts = {
  statistics: [],
  live: {},
  historic: {}
}


function createQuery(startTime, endTime) {
  if (!startTime || !endTime) return '';
  let start = moment(startTime).format('YYYY-MM-DDT00:00:00');
  let end = moment(endTime).format('YYYY-MM-DDT23:00:00');
  return `?starttime=${start}&endtime=${end}`;  
}

export function getForecastsForDate(datestring, suffix = '') { 
  var starttime = moment(datestring).format('YYYY-MM-DDT00:00:00');
  var endtime = moment(datestring).format('YYYY-MM-DDT23:00:00');  
  
  getForecasts(starttime, endtime, suffix);
}

export async function getStatistics() {
  let response = await fetch(urlAPI + 'statistics/forecasts')
  .catch(e => {log(e, 'Klarte ikke hente varsel-statistikk for spotter i Oslofjorden')})
  forecasts.statistics = await response.json();
}

export async function getForecasts(startTime, endTime) {
  let load = new Loader(`forecasts-graphs-${type}`);
  let type = (startTime) ? 'historic' : 'live';
  let spot = document.getElementById('navbar-spots-list').value;  
  let query = createQuery(startTime, endTime);

  try {
    let data = await Promise.all(fcSources.map(source => get(`forecasts/${source}${query}`)))
  } catch(e) {
    log(e, 'Klarte ikke hente varsler og observasjoner')
  } finally {
    load.stop();
  }

  for (let i = 0; i < fcSources.length; i++) {
    forecasts[type][fcSources[i]] = data[i];  
  }
    
  createChartsDMI(await forecasts[type].dmi, spot, elementId);
  createChart(await forecasts[type].smhi, 'smhi', 'waveheight', spot, elementId);
  createChart(await forecasts[type].yr, 'yr', 'waveheight', spot, elementId);
  createTable(await forecasts[type].frost, await forecasts[type].kv, '', elementId);
  
}

export async function getYrCoastal() {
  let spot = document.querySelector('#navbar-spot').value;
  let yrId = spotIds[spot].yr.id;
  
  let forecast = await get(`https://www.yr.no/api/v0/locations/${yrId}/forecast/coast`);
  updateYrCoastTable(forecast);
}