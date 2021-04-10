import { el, arrow } from '../html/elements.js';
import { updateForecastTable } from './forecastTable.js';
import { get, queryTimespan } from '../utils/api.js';
import { formatWindValue } from '../config/forecastFormat.js';

function getHeaders(forecast) {
  let headers = ['Tid'];
  for (let key of Object.keys(forecast)) {
    headers.push(forecast[key].name);
  }
  return headers
}

function format(f) {
  return formatWindValue(f.wind, true)
}

function stationCell(f) {
  return (
    el('td', 'td-flex', [
      el('span', `td-value ${format(f)}`, f.wind),
      el('span', 'td-arrow', arrow(f.winddir))
    ])
  )
}

function windObsToRow(f) {
  let cells = [
    el('td', 'td-flex', moment(f.localtime).format('HH'))
  ];

  for (let key of Object.keys(f.stations)) {
    cells.push(stationCell(f.stations[key]));
  }
  
  return (
    el('tr', '', cells)
  )
}

function updateWindObsTable(forecast) {
  let headers = getHeaders(forecast[0].stations);
  updateForecastTable(forecast, getWindObsTime, windObsToRow, 'windObs', headers);
}

function getWindObsTime(forecast) {
  return forecast.localtime;
}


export async function getWindObs(start, end) {
  let query = queryTimespan(start, end);
  let forecast = await get(`forecasts/frost${query}`);
  updateWindObsTable(forecast);
}