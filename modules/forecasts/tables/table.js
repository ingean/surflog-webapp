import { el } from '../../components/elements.js';
import { formatDate } from '../format.js';

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
    el('tr', '', headers.map(header => el('th', (header === 'Strøm') ? 'hidden-xs' : '', header))))
}

function forecastRows(forecast, forecastToRow) {
  let rows = forecast.map(f => forecastToRow(f))
  return el('tbody', '', rows);
}

export function updateForecastTable(forecast, forecastDate, forecastToRow, tableName, headers) {
  let forecastByDays = splitForecastPrDay(forecast, forecastDate);
  let tables = [];

  for (let fc of forecastByDays) {
    tables.push(
      el('div', 'forecast-table-body', [
        el('div', 'forecast-table-heading', formatDate(forecastDate(fc[0]))),
        el('div', 'table-responsive',
          el('table', `table-hover forecast-table-${tableName}`, [
            forecastHeaders(headers),
            forecastRows(fc, forecastToRow)
          ])
        )
      ])
    )
  }

  let container = el('div', 'forecast-tables', tables);
  document.querySelector(`#root-forecast-table-${tableName}`)
  .replaceChildren(container);
}