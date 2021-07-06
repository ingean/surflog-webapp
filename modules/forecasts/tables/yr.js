import { el, arrow } from '../../html/elements.js';
import { forecasts } from '../../config/datasources.js';
import { getMetForecast } from '../../utils/api.js';
import { isDayTime, toUTC } from '../../utils/time.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';

function getHeaders(forecast) {
  let headers = ['Tid'];
  for (let key of Object.keys(forecast)) {
    headers.push(key);
  }
  return headers
}

function stationCell(f, location) {
  return (
    el('td', 'td', [ //Wave height and direction
      el('span', `td-value ${clsValue(f, 'waveheight', 'yr', location)}`, formatValue(f, 'waveheight')),
      el('span', 'td-arrow', arrow(f.wavedir))
    ])
  )
}

function yrForecastToRow(f) {
  let location = 0
  let cells = [
    el('td', 'td-s', moment(f.localtime).format('HH'))
  ];

  for (let key of Object.keys(f.stations)) {
    cells.push(stationCell(f.stations[key], location));
    location++
  }
  
  let emphasis = (isDayTime(f.localtime)) ? 'tr-scope' : '';
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

function stationList(time, fc) {
  let stations = {}

  for (let i = 0; i < fc.length; i++) {
    let fcAtTime = fc[i].properties.timeseries.find(f => f.time === time)
    let props = fcAtTime.data.instant.details
    let stationId = forecasts.met.locations[i].name

    if (!(stationId in stations)) stations[stationId] = {}

    forecasts.met.params.forEach(p => {
      stations[stationId][p.id] = props[p.sourceId]
    })
  }

  return stations
}

function convertToForecast(results) {
  let data = []
 
  results[0].properties.timeseries.forEach(f => {
    data.push({
      utctime: moment(toUTC(f.time)).format('YYYY-MM-DDTHH:mm:ss'),
      localtime: moment(f.time).format('YYYY-MM-DDTHH:mm:ss'),
      stations: stationList(f.time, results)
    })
  })
  return updateYrTable(data)
}


export async function getYrForecast() {
  getMetForecast()
  .then(results => convertToForecast(results))
}