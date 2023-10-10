import { get } from '../../utils/api.js';
import { updateForecastTable, stationsCols } from './table.js';
import { getStats } from '../../utils/statistics.js';
import { vectorLayer } from '../../utils/map/vectorLayer.js';
import { addLayerToMap } from '../map/dmi.js';
import { valueRating } from '../format.js';
import { mergeTimeseries } from '../../utils/utilities.js';

var stats = {}
var omStations = []

function openMeteoForecastToRow(fc) {
  return stationsCols(fc, {
    paramNames: ['waveheight', 'waveperiod', 'wavedir', 'swellheight', 'swellperiod', 'swelldir'],
    groupParams: true,
    stats
  })
} 

function getOpenMeteoTime(fc) {
  return fc.utctime
}

export async function updateMetTable(spot = 'Saltstein') {
  if (!omStations) return
  stats = await getStats('yr')
  let headers = omStations.map(station => station.name)
  let timeserie = mergeTimeseries(omStations)

  //addOpenMeteoToMap(metStations, stats)
  updateForecastTable(timeserie, getOpenMeteoTime, openMeteoForecastToRow, 'openmeteo', ['Tid', ...headers])
}

export async function getOpenMeteoForecast() {
  omStations = await get(`forecasts/openmeteo`)
  updateMetTable()
}

const addOpenMeteoToMap = (metStations, stats) => {
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