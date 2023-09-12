import { forecasts } from '../../config/datasources.js';
import { el, hrsTd } from '../../components/elements.js';
import { arrow } from '../../components/icons.js';
import { getDMIObs } from '../../utils/api.js';
import { toUTC, isDayTime } from '../../utils/time.js';
import { formatValue, formatValue2, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';

function stationList(time, obs) {
  let stations = {}

  for (let i = 0; i < obs.length; i++) {
    let obsAtTime = obs[i].features.find(o => o.properties.observed === time)
    if (obsAtTime) {
      let props = obsAtTime.properties
      let stationId = props.stationId
  
      if (!(stationId in stations)) stations[stationId] = {}
      stations[stationId][props.parameterId] = props.value
      stations[stationId].name = forecasts.dmiObs.locations.find(l => l.id === stationId).name
    }
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
  return clsValue(o, 'wind_speed_past1h', {wind: 'fetch'})
}

function stationCell(o) {
  return (
    el('td', '', [
      el('span', `td-value ${cls(o)}`, formatValue(o, 'wind_speed_past1h', 'wind')),
      el('span', 'td-secondary-value', formatValue2(o, 'wind_gust_always_past1h', 'wind')),
      el('span', 'td-arrow', arrow(o['wind_dir_past1h']))
    ])
  )
}

function dmiObsToRow(o) {
  let cells = [hrsTd(o.localtime)];

  for (let key of Object.keys(o.stations)) {
    cells.push(stationCell(o.stations[key]));
  }
  
  let emphasis = (isDayTime(o.localtime, false)) ? 'tr-scope' : 'tr-outofscope';
  return (
    el('tr', `forecast-table-row ${emphasis}`, cells)
  )
}

function getDMIObsTime(obs) {
  return obs.localtime
}

function updateDMIObsTable() {
  let obs = convertData(dmiObservations)
  let headers = getHeaders(obs[0].stations)
  updateForecastTable(obs.reverse(), getDMIObsTime, dmiObsToRow, 'dmiObs', headers)
}

export var dmiObservations = [];

export async function getDMIObservations(start, end) {
  dmiObservations = await getDMIObs(start, end)
  updateDMIObsTable()
}