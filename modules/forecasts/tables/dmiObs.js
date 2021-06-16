import { el, arrow, hrsTd } from '../../html/elements.js';
import { getDMIObs } from '../../utils/api.js';
import { toLocal } from '../../utils/time.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';



function process(o, data) {
  let time = o.properties.observed
  let process = (moment(time).format('mm') === '00') ? true : false
  let alreadyProcessed = data.find(d => d.utctime === moment(time).format('YYYY-MM-DDTHH:mm:ss'))
  return (alreadyProcessed) ? false : process
}

function station(time, obs, stations) {
  let params = obs.features.filter(o => o.properties.observed === time)
  if (!params.length) return

  let stationId = params[0].properties.stationId
  
  stations[stationId] = {}
  
  params.forEach(param => {
    let p = param.properties
    stations[stationId][p.parameterId] = p.value
  })
  return stations
}

function stationList(time, obs) {
  let stations = {}
  let ids = [0,1,2]
  ids.forEach(i => {
    if (obs[i].features.length) station(time, obs[i], stations)
  })
  return stations
}

function convertData(obs) {
  let data = []
 
  obs[0].features.forEach(o => {
    if (process(o, data)) {
      let time = o.properties.observed
      data.push({
        localtime: toLocal(time),
        utctime: moment(time).format('YYYY-MM-DDTHH:mm:ss'),
        stations: stationList(time, obs)
      })
    } 
  })
  return data.reverse()
}

function getHeaders(obs) {
  let headers = ['Tid'];
  for (let key of Object.keys(obs)) {
    headers.push(obs[key].name);
  }
  return headers
}

function cls(o) {
  return clsValue(o, 'wind_speed_past1h', 'dmi', 'txt', 'fetch')
}

function stationCell(o) {
  return (
    el('td', '', [
      el('span', `td-value ${cls(o)}`, formatValue(o, 'wind_speed_past1h', false, 'wind')),
      el('span', 'td-secondary-value', formatValue(o, 'wind_gust_always_past1h', true, 'wind')),
      el('span', 'td-arrow', arrow(o['wind_dir_past1h']))
    ])
  )
}

function dmiObsToRow(o) {
  let cells = [hrsTd(o.localtime)];

  for (let key of Object.keys(o.stations)) {
    cells.push(stationCell(o.stations[key]));
  }
  
  return (
    el('tr', 'forecast-table-row', cells)
  )
}

function getDMIObsTime(obs) {
  return obs.localtime
}

function updateDMIObsTable(obs) {
  obs = convertData(obs)
  let headers = getHeaders(obs)
  updateForecastTable(obs, getDMIObsTime, dmiObsToRow, 'dmiObs', headers)
}

export function getDMIObservations(start, end) {
  getDMIObs(start, end)
  .then(o => updateDMIObsTable(o))
  //.catch(e => console.error(`Klarte ikke hente observasjoner fra DMI: ${e}`))
}