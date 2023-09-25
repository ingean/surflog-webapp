import { el, div, tr, td, hrsTd } from '../../components/elements.js';
import { formatDate } from '../format.js';
import { paramSpan } from '../../config/forecastValues.js';
import { toLocal, isDayTime } from '../../utils/time.js';
import { vectorLayer } from '../../utils/map/vectorLayer.js';
import { addLayerToMap } from '../map/dmi.js';

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
    tr('', headers.map(header => el('th', (header === 'Strøm') ? 'hidden-xs' : '', header))))
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
      div('forecast-table-body', [
        div('forecast-table-heading', formatDate(forecastDate(fc[0]))),
        div('table-responsive',
          el('table', `table-hover forecast-table-${tableName}`, [
            forecastHeaders(headers),
            forecastRows(fc, forecastToRow)
          ])
        )
      ])
    )
  }

  let container = div('forecast-tables', tables)
  document.querySelector(`#root-forecast-table-${tableName}`)
  .replaceChildren(container);
}

export const stationsCols = (f, options) => {
  options.time = toLocal(f.utctime)
  let cols = [hrsTd(options.time)]

  let stationNames = options?.stationNames || Object.keys(f).slice(1)
  stationNames.forEach(stationName => {
    cols.push(stationCols(f[stationName], options))
  })
     
  let scope = isDayTime(options.time, false) ? 'tr-scope' : 'tr-outofscope'
  return tr(`forecast-table-row ${scope}`, cols)
}

export const stationCols = (station, options) => {
  let cols = []
  let paramNames = options?.paramNames || Object.keys(f).slice(1)
  paramNames.forEach(paramName => {
    cols.push(paramSpan(station, paramName, options))
  })
  return td('td-param', cols)
}

export const addObsToMap = (stations) => {
  let features = stations.map(s => { return {lat: s.lat, lon: s.lon, name: s.name, size: 4, rating: null}})
  let layer = vectorLayer(features)
  addLayerToMap(layer)
}