import { hrsTd, tr, td } from '../../components/elements.js';
import { get } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { updateForecastTable } from './table.js';
import { getStats } from '../../utils/statistics.js';
import { paramSpan } from '../../config/forecastValues.js';

const headers = ['Tid', 'Høyde', 'Periode', 'Varsel'];
var smhiStats = null

export async function getSMHIStats() {
  if (!smhiStats) smhiStats = await getStats('smhi')
  return smhiStats
}
export function smhiForecastToRow(obs) {
  let emphasis = (isDayTime(obs.utctime)) ? 'tr-scope' : 'tr-outofscope';
  let options = {stats: smhiStats}
  
  return tr(`forecast-table-row ${emphasis}`, [
          hrsTd(obs.utctime),
          td( '', [
            paramSpan(obs, 'waveheight', options),
            paramSpan(obs, 'waveheightmax', options),
            paramSpan(obs, 'wavedir', options),
          ]),
          td('', paramSpan(obs, 'waveperiod', options)),
          td('', paramSpan(obs, 'waveheightforecast', options))
        ])
}

export async function updateSMHITable() {
  stats = await getStats('smhi')
  updateForecastTable(smhiForecast, getSMHITime, smhiForecastToRow, 'smhi', headers);
}

export function getSMHITime(forecast) {
  return forecast.utctime
}

export var smhiForecast = [];

export async function getSMHIForecast(start, end) {
  smhiForecast = await get('forecasts/smhi');
  updateSMHITable();
}