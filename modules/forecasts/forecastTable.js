import { el } from '../html/elements.js';
 
const dateFormat = {
  lastDay : '[I går]',
  sameDay : '[I dag]',
  nextDay : '[I morgen]',
  lastWeek : '[Forrige] dddd',
  nextWeek : 'dddd',
  sameElse : 'L'
}


function splitForecastPrDay(forecast, getForecastTime) {
  let day = 0;
  let days = [];

  for (let i = 0; i < forecast.length; i++) {
    if (moment(getForecastTime(forecast[i])).format('HH') === '00' && i !== 0) day++;
    if (typeof days[day] === 'undefined') days[day] = [];
    days[day].push(forecast[i]) 
  }
  return days;
}


function forecastHeaders(headers) {
  return el('thead', 'forecast-table-header', 
    el('tr', '', headers.map(header => el('th', 'th-flex', header))))
}

function forecastRows(forecast, forecastToRow) {
  let rows = forecast.map(f => forecastToRow(f))
  return el('tbody', '', rows);
}

export function updateForecastTable(forecast, getForecastTime, forecastToRow, tableName, headers) {
  let forecastByDays = splitForecastPrDay(forecast, getForecastTime);
  let tables = [];

  for (let fc of forecastByDays) {
    tables.push(
      el('div', 'forecast-table-body', [
        el('div', 'forecast-table-heading', moment(getForecastTime(fc[0])).calendar(null, dateFormat)),
        el('table', `forecast-table-${tableName}`, [
          forecastHeaders(headers),
          forecastRows(fc, forecastToRow)
        ])
      ])
    )
  }

  let container = el('div', 'forecast-tables', tables);
  document.querySelector(`#root-forecast-table-${tableName}`)
  .replaceChildren(container);
}