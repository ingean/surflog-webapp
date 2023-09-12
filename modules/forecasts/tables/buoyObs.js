import { el, hrsTd, tempTd } from '../../components/elements.js';
import { arrow } from '../../components/icons.js';
import { get } from '../../utils/api.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';
import { updateBuoyDashboard } from '../dashboards/buoyObs.js';
import { smhiForecastToRow, getSMHITime } from './smhi.js';
import { isDayTime, toLocal } from '../../utils/time.js';
import { getStats } from '../../utils/statistics.js';

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
    const headers = ['Tid', 'Bølger', 'Periode', 'Bølgevarsel']
    updateForecastTable(obs, getSMHITime, smhiForecastToRow, 'buoyObs', headers);
  } else {
    const headers = ['Tid', 'Bølger', 'Periode', 'Vindstyrke og retning', 'Lufttrykk', 'Lufttemperatur']
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
  ukBuoys = await get(`observations/buoys`);
  smhiBuoys = await get('forecasts/smhi');
  updateBuoyDashboard(stats, ukBuoys, smhiBuoys)
  //updateBuoyObsTable(smhiBuoys);
  updateBuoyObsTable(ukBuoys[0].data, false);
}