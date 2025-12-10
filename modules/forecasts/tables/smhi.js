import { hrsTd, tr, td, span } from '../../components/elements.js';
import { get } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { updateForecastTable } from './table.js';
import { getStats } from '../../utils/statistics.js';
import { paramSpan } from '../../config/forecastValues.js';

//const headers = ['Tid', 'Observasjoner', 'Varsel'];
var smhiStats = null

export async function getSMHIStats() {
  if (!smhiStats) smhiStats = await getStats('smhi')
  return smhiStats
}
export function smhiForecastToRow(obs) {
  let emphasis = (isDayTime(obs.utctime)) ? 'tr-scope' : 'tr-outofscope';
  return tr(`forecast-table-row ${emphasis}`, [
          hrsTd(obs.utctime),
          td('', smhiWaveObsGroup(obs)),
          td('', smhiWaveMaxGroup(obs)),
          td('', smhiWaveGroup(obs)),
        ])
}

export function smhiWaveObsGroup(obs) {
  let options = {stats: smhiStats}
  return span('params-group params-group-waves', [
    paramSpan(obs, 'waveheight', options),
    paramSpan(obs, 'waveperiod', options),
    paramSpan(obs, 'wavedir', options),
  ]);
}
export function smhiWaveMaxGroup(obs) {
  return span('params-group', [
    paramSpan(obs, 'waveheightmax', {stats: smhiStats}),
  ]);
}

export function smhiWaveGroup(forecast) {
  return span('params-group', [
    paramSpan(forecast, 'waveheightforecast', {stats: smhiStats}),
  ]);
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