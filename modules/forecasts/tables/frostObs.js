import { get, queryTimespan } from '../../utils/api.js';
import { stationsCols, paramsCols, updateForecastTable, addObsToMap } from './table.js';
import { isDayTime } from '../../utils/time.js'
import { mergeTimeseries } from '../../utils/utilities.js';
import { tr } from '../../components/elements.js'
import { stationTile } from '../../components/dashboard/tile.js'
import { getStats } from '../../utils/statistics.js';
import { paramCaption } from '../../config/forecastValues.js';
import { add } from '../../lib/ol/coordinate.js';

let frostStations = []
let kvStations = []

const frostObsToRow = (f) => {
  return stationsCols(f, {
    wind: 'local', 
    paramNames: ['windspeed', 'winddir'],
    groupParams: true
  })
}

const frostBuoyToRow = async (data) => {
  let cols = paramsCols(data, {
    wind: 'local', 
    stats: await getStats('buoy')
  })
  let scope = isDayTime(data.utctime, false) ? 'tr-scope' : 'tr-outofscope'
  return tr(`forecast-table-row ${scope}`, cols)
}

function updateFrostObsTable(windObsStations) {
  let headers = windObsStations.map(station => station.name)
  let timeserie = mergeTimeseries(windObsStations)
  updateForecastTable(timeserie, getFrostObsTime, frostObsToRow, 'windObs', ['Tid', ...headers])
}

function getFrostObsTime(forecast) {
  return forecast.utctime
}

export async function getFrostObs(start, end) {
  let query = queryTimespan(start, end)
  frostStations = await get(`observations/frost${query}`)
  kvStations = await get(`observations/kv${query}`)
  const windObsStations = [
    ...frostStations.slice(0, 3), // Elements before the index
    kvStations[0],                           // The new item
    ...frostStations.slice(3)     // Elements from the index onwards
  ]

  addObsToMap(windObsStations)
  updateFrostObsTable(windObsStations);
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