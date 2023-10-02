import { forecasts } from '../../config/datasources.js';
import { get } from '../../utils/api.js';
import { updateForecastTable, stationsCols } from './table.js';
import { getStats } from '../../utils/statistics.js';
import { vectorLayer } from '../../utils/map/vectorLayer.js';
import { addLayerToMap } from '../map/dmi.js';
import { valueRating } from '../format.js';
import { mergeTimeseries } from '../../utils/utilities.js';

var stats = {}
var metStations = []

function metForecastToRow(fc) {
  return stationsCols(fc, {
    paramNames: ['waveheight', 'wavedir', 'windspeed', 'winddir'],
    groupParams: true,
    stats
  })
} 

function getMetTime(fc) {
  return fc.utctime
}

export async function updateMetTable(spot = 'Saltstein') {
  if (!metStations) return
  stats = await getStats('yr')
  let headers = metStations.map(station => station.name)
  let timeserie = mergeTimeseries(metStations)

  addMetToMap(metStations, stats)
  updateForecastTable(timeserie, getMetTime, metForecastToRow, 'yr', ['Tid', ...headers])
}

export async function getMetForecast() {
  metStations = await get(`forecasts/met`)
  updateMetTable()
}

const addMetToMap = (metStations, stats) => {
  let features = metStations.map(f => {
    
    return {
      name: f.name,
      lat: f.lat, 
      lon: f.lon,
      rating: valueRating(f.data[0], 'waveheight', {station: f.name, stats})
    }
  })
  let layer = vectorLayer(features)
  addLayerToMap(layer)
}