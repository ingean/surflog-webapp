import { el, hrsTd } from '../../components/elements.js';
import { arrow } from '../../components/icons.js';
import { get, queryTimespan } from '../../utils/api.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';
import { isDayTime } from '../../utils/time.js';

function getHeaders(forecast) {
  let headers = ['Tid'];
  for (let key of Object.keys(forecast)) {
    headers.push(forecast[key].name);
  }
  return headers
}

function cls(f) {
  return clsValue(f, 'wind', {wind: 'fetch'})
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
  
  let emphasis = (isDayTime(f.localtime, false)) ? 'tr-scope' : 'tr-outofscope';
  return (
    el('tr', `forecast-table-row ${emphasis}`, cells)
  )
}

function updateWindObsTable() {
  let headers = getHeaders(metObservations[0].stations);
  updateForecastTable(metObservations.reverse(), getWindObsTime, windObsToRow, 'windObs', headers);
}

function getWindObsTime(forecast) {
  return forecast.localtime;
}

export var metObservations = []

export async function getWindObs(start, end) {
  let query = queryTimespan(start, end);
  metObservations = await get(`forecasts/frost${query}`);
  updateWindObsTable();
}