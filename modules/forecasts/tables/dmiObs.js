import { get, queryTimespan } from '../../utils/api.js';
import { toLocal } from '../../utils/time.js';
import { stationsCols, updateForecastTable, addObsToMap } from './table.js';
import { mergeTimeseries } from '../../utils/utilities.js';

function dmiObsToRow(obs) {
  return stationsCols(obs, {
    wind: 'fetch', 
    paramNames: ['windspeed', 'winddir']
  })
}

function getDMIObsTime(obs) {
  return toLocal(obs.utctime)
}

function updateDMIObsTable(dmiStations) {
  let headers = dmiStations.map(station => station.name)
  let timeserie = mergeTimeseries(dmiStations)
  updateForecastTable(timeserie, getDMIObsTime, dmiObsToRow, 'dmiObs', ['Tid', ...headers])
}

export var dmiObservations = [];

export async function getDMIObservations(start, end) {
  let query = queryTimespan(start, end)
  let dmiStations = await get(`observations/dmi${query}`)
  addObsToMap(dmiStations)
  updateDMIObsTable(dmiStations)
}