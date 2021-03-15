import { log, Loader } from '../utils/logger.js';
import { urlAPI } from '../config/datasources.js';

const fcSources = ['dmi', 'smhi', 'yr', 'frost', 'kv'];

export var forecasts = {
  statistics: [],
  live: {},
  historic: {}
}



function createQuery(startTime, endTime) {
  if (startTime && endTime) {
    let start = moment(startTime).format('YYYY-MM-DDT00:00:00');
    let end = moment(endTime).format('YYYY-MM-DDT23:00:00');
    return `?starttime=${start}&endtime=${end}`;  
  } else {
    return '';
  }
}

function getForecast(source, query) {
  return fetch(`${urlAPI}forecasts/${source}${query}`)
  .catch(e => {log(e, `Klarte ikke hente varseldata fra ${source}`)});
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

export async function getForecasts(startTime, endTime, type = 'live') {
  let load = new Loader(`forecasts-graphs-${type}`);
  load.start();

  try {
    let spot = document.getElementById('navbar-spots-list').value;  
    let query = createQuery(startTime, endTime);

    for (let fc of fcSources) {
      forecasts[type][fc] = getForecast(fc, query);  
    }

    createChartsDMI(await forecasts[type].dmi, spot, elementId);
    createChart(await forecasts[type].smhi, 'smhi', 'waveheight', spot, elementId);
    createChart(await forecasts[type].yr, 'yr', 'waveheight', spot, elementId);
    createTable(await forecasts[type].frost, await forecasts[type].kv, '', elementId);
  } catch(e) {
    log(e, 
      'Klarte ikke hente alle varsler og observasjoner')
  } finally {
    load.stop();
  }
}