import { div } from '../../components/elements.js';
import { arrow } from '../../components/icons.js';
import { get, queryTimespan } from '../../utils/api.js';
import { stationsCols, updateForecastTable, addObsToMap } from './table.js';
import { toLocal } from '../../utils/time.js'
import { mergeTimeseries, round, maxObj, minObj } from '../../utils/utilities.js';
import { stationTile, tile } from '../../components/dashboard/tile.js'
import { indicator } from '../../components/dashboard.js'
import { paramVal } from '../../config/forecastValues.js';
import { direction } from '../../config/forecasts.js';
import { drawLineChart } from '../../components/charts.js';
import { chartOption } from "../../config/charts.js"

const windObsToRow = (f) => {
  return stationsCols(f, {
    wind: 'fetch', 
    paramNames: ['windspeed', 'winddir']
  })
}

function updateWindObsTable(frostStations) {
  let headers = frostStations.map(station => station.name)
  let timeserie = mergeTimeseries(frostStations)
  updateForecastTable(timeserie, getWindObsTime, windObsToRow, 'windObs', ['Tid', ...headers])
}

function getWindObsTime(forecast) {
  return toLocal(forecast.utctime)
}

export async function getWindObs(start, end) {
  let query = queryTimespan(start, end)
  let frostStations = await get(`observations/frost${query}`)
  addObsToMap(frostStations)
  updateWindObsTable(frostStations);
  addObsToDash(frostStations[0])
}

const addObsToDash = (obs) => {
  let container = document.getElementById('buoy-tile-group')
  let frostTile = stationTile(obs, {
    id: obs.name,
    onSelect: tileSelected,
    chartParam: 'waveheight'
  })
  
  container.insertBefore(frostTile, container.childNodes[6])
}

const tileSelected = () => {
  console.log('TODO: Frost Ekofisk tile selected')
}