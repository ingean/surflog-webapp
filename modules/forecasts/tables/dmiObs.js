import { forecasts } from '../../config/datasources.js';
import { el, arrow, hrsTd } from '../../html/elements.js';
import { getDMIObs } from '../../utils/api.js';
import { toUTC } from '../../utils/time.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';


function stationList(time, obs) {
  let stations = {}

  for (let i = 0; i < obs.length; i++) {
    let obsAtTime = obs[i].features.find(o => o.properties.observed === time)
    let props = obsAtTime.properties
    let stationId = props.stationId

    if (!(stationId in stations)) stations[stationId] = {}
    stations[stationId][props.parameterId] = props.value
    stations[stationId].name = forecasts.dmiObs.locations.find(l => l.id === stationId).name
  }

  return stations
}

function convertData(obs) {
  let data = []
 
  obs[0].features.forEach(o => {
    let time = o.properties.observed
    data.push({
      utctime: moment(toUTC(time)).format('YYYY-MM-DDTHH:mm:ss'),
      localtime: moment(time).format('YYYY-MM-DDTHH:mm:ss'),
      stations: stationList(time, obs)
    })
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
  let headers = getHeaders(obs[0].stations)
  updateForecastTable(obs, getDMIObsTime, dmiObsToRow, 'dmiObs', headers)
}

export function getDMIObservations(start, end) {
  getDMIObs(start, end)
  .then(o => updateDMIObsTable(o))
  //.catch(e => console.error(`Klarte ikke hente observasjoner fra DMI: ${e}`))
}