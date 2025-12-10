import { hrsTd, tempTd, tr, td, span } from '../../components/elements.js';
import { get } from '../../utils/api.js';
import { valueRating } from '../format.js';
import { updateForecastTable } from './table.js';
import { updateBuoyDashboard, getLastSMHIObs } from '../dashboards/buoyObs.js';
import { smhiForecastToRow, getSMHITime, getSMHIStats } from './smhi.js';
import { isDayTime, toLocal } from '../../utils/time.js';
import { getStats } from '../../utils/statistics.js';
import { vectorLayer } from '../../utils/map/vectorLayer.js';
//import { addLayerToMap } from '../map/dmi.js';
import { addDataToMap } from '../map/arcgis.js';
import { paramSpan, paramVal } from '../../config/forecastValues.js';

var stats = {}

function buoyObsToRow(f) {
  let emphasis = (isDayTime(f.utctime, false)) ? 'tr-scope' : 'tr-outofscope';
  let options = {stats}
  return tr(`forecast-table-row ${emphasis}`, [
          hrsTd(f.utctime),
          td('', buoyWaveGroup(f, options)),
          td('', buoyWindGroup(f, options)),
          td('', paramSpan(f, 'airpressure', options)),
          tempTd(f.airtemp)
          ]
        )
}

export function buoyWaveGroup(forecast, options) {
  return span('params-group params-group-waves', [
    paramSpan(forecast, 'waveheight', options),
    paramSpan(forecast, 'waveperiod', options)
  ]);
}

export function buoyWindGroup(forecast, options) {
  return span('params-group', [
    paramSpan(forecast, 'windspeed', options),
    paramSpan(forecast, 'winddir', options)
  ]);
}

export async function updateBuoyObsTable(obs, smhi = true, spot = 'Saltstein') {
  
  if (smhi) {
    const headers = ['Tid', 'Observasjoner', 'Max observasjon', 'Varsel']
    updateForecastTable(obs.data, getSMHITime, smhiForecastToRow, 'buoyObs', headers);
  } else {
    const headers = ['Tid', 'Bølger', 'Vind', 'Trykk', 'Lufttemp.']
    updateForecastTable(obs, getBuoyObsTime, buoyObsToRow, 'buoyObs', headers);
  }
}

function getBuoyObsTime(forecast) {
  return toLocal(forecast.utctime)
}

export var ukBuoys = []
export var smhiBuoys = []

export async function getBuoyObs() {
  stats = await getStats('buoy')
  let smhiStats = await getSMHIStats()
  ukBuoys = await get(`observations/buoys`)
  smhiBuoys = await get('forecasts/smhi')
  addBuoysToMap(ukBuoys, stats)
  addSMHIToMap(smhiBuoys, smhiStats)
  updateBuoyDashboard(stats, smhiStats, ukBuoys, smhiBuoys)
  updateBuoyObsTable(ukBuoys[0].data, false);
}

const addBuoysToMap = (ukBuoys, stats) => {
  let data = ukBuoys.map(b => { 
    let lastObs = b.data.at(-1)
    return {
      lat: b.lat, 
      lon: b.lon, 
      name: b.name,
      value: lastObs.waveheight,
      caption: paramVal(lastObs, 'waveheight'),
      rotation: lastObs.winddir, 
      rating: valueRating(lastObs, 'waveheight', {stats})}
  })
  addDataToMap(data, 'wave', 'UK Buoys')
}

const addSMHIToMap = (smhiBuoys, stats) => {
  let lastObs = getLastSMHIObs(smhiBuoys)
  
  let data = [{ 
    lat: smhiBuoys.lat, 
    lon: smhiBuoys.lon, 
    name: smhiBuoys.name,
    value: lastObs.waveheight,
    caption: paramVal(lastObs, 'waveheight'),
    rotation: lastObs.wavedir, 
    rating: valueRating(lastObs, 'waveheight', {stats})
  }]

  addDataToMap(data, 'wave', 'SMHI Buoys')
}