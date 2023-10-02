import { get, queryTimespan } from '../../utils/api.js';
import { stationsCols, paramsCols, updateForecastTable, addObsToMap } from './table.js';
import { toLocal, isDayTime } from '../../utils/time.js'
import { mergeTimeseries } from '../../utils/utilities.js';
import { tr } from '../../components/elements.js'
import { stationTile } from '../../components/dashboard/tile.js'
import { getStats } from '../../utils/statistics.js';
import { paramCaption } from '../../config/forecastValues.js';

let frostStations = []

const frostObsToRow = (f) => {
  return stationsCols(f, {
    wind: 'fetch', 
    paramNames: ['windspeed', 'winddir'],
    groupParams: true
  })
}

const frostBuoyToRow = (data) => {
  let cols = paramsCols(data, {
    wind: 'fetch', 
    stats: getStats('buoy')
  })
  let scope = isDayTime(data.utctime, false) ? 'tr-scope' : 'tr-outofscope'
  return tr(`forecast-table-row ${scope}`, cols)
}

function updateFrostObsTable(frostStations) {
  let headers = frostStations.map(station => station.name)
  let timeserie = mergeTimeseries(frostStations)
  updateForecastTable(timeserie, getFrostObsTime, frostObsToRow, 'windObs', ['Tid', ...headers])
}

function getFrostObsTime(forecast) {
  return forecast.utctime
}

export async function getFrostObs(start, end) {
  let query = queryTimespan(start, end)
  frostStations = await get(`observations/frost${query}`)
  addObsToMap(frostStations)
  updateFrostObsTable(frostStations);
  addFrostObsTile(frostStations[0])
}

const addFrostObsTile = (obs) => {
  let tileGroup = document.getElementById('buoy-tile-group')
  
  let frostTile = stationTile(obs, {
    id: obs.name,
    onSelect: tileSelected,
    stats: getStats('buoy')
  })
  
  if (tileGroup.childNodes.length >=6) {
    tileGroup.insertBefore(frostTile, tileGroup.childNodes[6])
  } else {
    tileGroup.appendChild(frostTile)
  }
}

const tileSelected = () => {
  let obs = frostStations[0]
  let data = obs.data.filter(o => o.waveheight)

  const headers = getHeaders(data[0])
  updateForecastTable(data, getFrostObsTime, frostBuoyToRow, 'buoyObs', headers)
}

const getHeaders = (obj) => {
  let params = Object.keys(obj)
  return params.map(param => paramCaption(param))
}