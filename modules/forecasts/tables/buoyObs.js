import { hrsTd, tempTd, tr, td } from '../../components/elements.js';
import { get } from '../../utils/api.js';
import { valueRating } from '../format.js';
import { updateForecastTable } from './table.js';
import { updateBuoyDashboard, getLastSMHIObs } from '../dashboards/buoyObs.js';
import { smhiForecastToRow, getSMHITime, getSMHIStats } from './smhi.js';
import { isDayTime, toLocal } from '../../utils/time.js';
import { getStats } from '../../utils/statistics.js';
import { vectorLayer } from '../../utils/map/vectorLayer.js';
import { addLayerToMap } from '../map/dmi.js';
import { paramSpan } from '../../config/forecastValues.js';

var stats = {}

function buoyObsToRow(f) {
  let emphasis = (isDayTime(f.utctime, false)) ? 'tr-scope' : 'tr-outofscope';
  let options = {stats}
  return tr(`forecast-table-row ${emphasis}`, [
          hrsTd(f.utctime),
          td('', paramSpan(f, 'waveheight', options)),
          td('', paramSpan(f, 'waveperiod', options)),
          td('', [
            paramSpan(f, 'windspeed', options),
            paramSpan(f, 'winddir', options)
          ]),
          td('', paramSpan(f, 'airpressure', options)),
          tempTd(f.airtemp)
          ]
        )
}

export async function updateBuoyObsTable(obs, smhi = true, spot = 'Saltstein') {
  
  if (smhi) {
    const headers = ['Tid', 'Høyde', 'Periode', 'Varsel']
    updateForecastTable(obs.data, getSMHITime, smhiForecastToRow, 'buoyObs', headers);
  } else {
    const headers = ['Tid', 'Høyde', 'Periode', 'Vind', 'Trykk', 'Lufttemp.']
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
  let features = ukBuoys.map(b => { return {lat: b.lat, lon: b.lon, name: b.name, rating: valueRating(b.data[0], 'waveheight', {stats})}})
  let layer = vectorLayer(features)
  addLayerToMap(layer)
}

const addSMHIToMap = (smhiBuoys, stats) => {
  let features = [{ 
    lat: smhiBuoys.lat, 
    lon: smhiBuoys.lon, 
    name: smhiBuoys.name, 
    rating: valueRating(getLastSMHIObs(smhiBuoys), 'waveheight', {stats})
  }]
  let layer = vectorLayer(features)
  addLayerToMap(layer)
}