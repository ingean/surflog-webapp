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
    paramNames: ['waveheight', 'wavedir'],
    groupParams: true
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

  //addMetToMap(metStations, stats)
  updateForecastTable(timeserie, getMetTime, metForecastToRow, 'yr', ['Tid', ...headers])
}

export async function getMetForecast() {
  metStations = await get(`forecasts/met`)
  updateMetTable()
}

const addYrToMap = (forecast, stats) => {
  let features = forecast.map((f, idx) => {
    let wh = f.properties.timeseries[0].data.instant.details
    let name = forecasts.met.locations[idx].name

    return {
      name,
      lat: f.geometry.coordinates[1], 
      lon: f.geometry.coordinates[0],
      rating: valueRating(wh, 'sea_surface_wave_height', {station: name, stats, alias: 'waveheight'})
    }
  })
  let layer = vectorLayer(features)
  addLayerToMap(layer)
}