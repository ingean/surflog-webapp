import { el, arrow, hrsTd } from '../../html/elements.js';
import { get, queryTimespan } from '../../utils/api.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';

function getHeaders(forecast) {
  let headers = ['Tid'];
  for (let key of Object.keys(forecast)) {
    headers.push(forecast[key].name);
  }
  return headers
}

function cls(f) {
  return clsValue(f, 'wind', 'dmi', 0, 'txt', 'fetch')
}

function stationCell(f) {
  return (
    el('td', '', [
      el('span', `td-value ${cls(f)}`, formatValue(f, 'wind')),
      el('span', 'td-arrow', arrow(f.winddir))
    ])
  )
}

function windObsToRow(f) {
  let cells = [hrsTd(f.localtime)];

  for (let key of Object.keys(f.stations)) {
    cells.push(stationCell(f.stations[key]));
  }
  
  return (
    el('tr', 'forecast-table-row', cells)
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