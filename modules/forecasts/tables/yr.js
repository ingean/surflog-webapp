import { el, arrow } from '../../html/elements.js';
import { get } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { formatValue } from '../format.js';
import { updateForecastTable } from './table.js';

function getHeaders(forecast) {
  let headers = ['Tid'];
  for (let key of Object.keys(forecast)) {
    headers.push(key);
  }
  return headers
}

function stationCell(f) {
  return (
    el('td', 'td', [ //Wave height and direction
      el('span', 'td-value', formatValue(f, 'waveheight')),
      el('span', 'td-arrow', arrow(f.wavedir))
    ])
  )
}

function yrForecastToRow(f) {
  let cells = [
    el('td', 'td-s', moment(f.localtime).format('HH'))
  ];

  for (let key of Object.keys(f.stations)) {
    cells.push(stationCell(f.stations[key]));
  }
  
  let emphasis = (isDayTime(f.localtime)) ? 'emphasis-row' : '';
  return (
    el('tr', `forecast-table-row ${emphasis}`, cells)
  )
}

function updateYrTable(forecast) {
  let headers = getHeaders(forecast[0].stations);
  updateForecastTable(forecast, getYrTime, yrForecastToRow, 'yr', headers);
}

function getYrTime(forecast) {
  return forecast.localtime;
}


export async function getYrForecast() {
  let forecast = await get('forecasts/yr');
  updateYrTable(forecast);
}