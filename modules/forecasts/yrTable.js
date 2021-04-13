import { el, arrow } from '../html/elements.js';
import { updateForecastTable, display } from './forecastTable.js';
import { get } from '../utils/api.js';



function getHeaders(forecast) {
  let headers = ['Tid'];
  for (let key of Object.keys(forecast)) {
    headers.push(key);
  }
  return headers
}

function stationCell(f) {
  return (
    el('td', 'td-l', [ //Wave height and direction
      el('span', 'td-value', display(f, 'waveheight')),
      el('span', 'td-arrow', arrow(f.wavedir))
    ])
  )
}

function yrForecastToRow(f) {
  let cells = [
    el('td', 'td-l', moment(f.localtime).format('HH'))
  ];

  for (let key of Object.keys(f.stations)) {
    cells.push(stationCell(f.stations[key]));
  }
  
  return (
    el('tr', 'forecast-table-row', cells)
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