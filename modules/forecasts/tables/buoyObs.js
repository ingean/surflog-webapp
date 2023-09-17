import { el, hrsTd, tempTd } from '../../components/elements.js';
import { arrow } from '../../components/icons.js';
import { get } from '../../utils/api.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';
import { updateBuoyDashboard } from '../dashboards/buoyObs.js';
import { smhiForecastToRow, getSMHITime, setNulls, getSMHIStats } from './smhi.js';
import { isDayTime, toLocal } from '../../utils/time.js';
import { getStats } from '../../utils/statistics.js';
import { vectorLayer } from '../../utils/map/vectorLayer.js';
import { addLayerToMap } from '../map/dmi.js';

var stats = {}

function cls(obj, param) {
  let options = {stats}
  return clsValue(obj, param, options)
}

function buoyObsToRow(f) {
  
  let emphasis = (isDayTime(toLocal(f.utctime), false)) ? 'tr-scope' : 'tr-outofscope';
  return el('tr', `forecast-table-row ${emphasis}`, [
    hrsTd(toLocal(f.utctime)),
    el('td', '', 
      el('span', `td-value ${cls(f, 'waveheight')}`, formatValue(f, 'waveheight'))),
    el('td', '', 
      el('span', `td-value ${cls(f, 'waveperiod')}`, formatValue(f, 'waveperiod'))),
    el('td', '', [
      el('span', `td-value ${cls(f, 'windspeed')}`, formatValue(f, 'windspeed', 'wind')),
      el('span', 'td-arrow', arrow(f.winddir, 'sm'))
    ]),
    el('td', '', 
      el('span', `td-value ${cls(f, 'airpressure')}`, formatValue(f, 'airpressure', 'pressure'))),
    tempTd(f.airtemp)
  ])
}

export async function updateBuoyObsTable(obs, smhi = true, spot = 'Saltstein') {
  
  if (smhi) {
    const headers = ['Tid', 'Høyde', 'Periode', 'Varsel']
    updateForecastTable(obs, getSMHITime, smhiForecastToRow, 'buoyObs', headers);
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
  await getSMHIStats()
  ukBuoys = await get(`observations/buoys`);
  smhiBuoys = setNulls(await get('forecasts/smhi'))
  addBuoysToMap(ukBuoys)
  updateBuoyDashboard(stats, ukBuoys, smhiBuoys)
  updateBuoyObsTable(ukBuoys[0].data, false);
}

const addBuoysToMap = (ukBuoys) => {
  let features = ukBuoys.map(b => { return {lat: b.lat, lon: b.lon, name: b.name}})
  let layer = vectorLayer(features)
  addLayerToMap(layer)
}