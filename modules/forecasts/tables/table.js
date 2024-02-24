import { el, span, div, tr, td, hrsTd } from '../../components/elements.js';
import { formatDate, valueRating } from '../format.js';
import { paramSpan, paramVal } from '../../config/forecastValues.js';
import { isDayTime } from '../../utils/time.js';
import { vectorLayer } from '../../utils/map/vectorLayer.js';
import { addLayerToMap } from '../map/dmi.js';
import { getLastDataPoint } from '../../components/dashboard/tile.js';

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
  let cols = [hrsTd(f.utctime)]

  let stations = options?.stationNames || Object.keys(f).slice(1)
  stations.forEach(station => {
    options.station = station
    cols.push(paramsCols(f[station], options))
  })
     
  let scope = isDayTime(f.utctime, false) ? 'tr-scope' : 'tr-outofscope'
  return tr(`forecast-table-row ${scope}`, cols)
}

export const paramsCols = (station, options) => {
  let groupParams = options?.groupParams || false
  let s = (groupParams) ? 1 : 0
  let params = options?.paramNames || Object.keys(station).slice(s)
  let cols = []

  params.forEach(param => {
    if (station) {
      cols.push(paramSpan(station, param, options))
    } else {
      cols.push(span('td-param', ' - '))
    }
  })
  return groupParams ? td('td-param', cols) : cols.map(p => td('td-param', p))  
}

export const addObsToMap = (stations) => {
  let features = stations.map(s => { 
    let lastObs = getLastDataPoint(s, 'windspeed')
    return {
      lat: s.lat, 
      lon: s.lon, 
      name: s.name, 
      value: paramVal(lastObs, 'windspeed'),
      rotation: lastObs.winddir, 
      rating: valueRating(lastObs, 'windspeed', {wind: 'fetch'})
    }
  })
  let layer = vectorLayer(features)
  addLayerToMap(layer)
}