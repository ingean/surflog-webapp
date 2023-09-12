import { el, hrsTd } from '../../components/elements.js';
import { arrow } from '../../components/icons.js';
import { get } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { formatValue, formatValue2, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';
import { getStats } from '../../utils/statistics.js';

const headers = ['Tid', 'Bølger', 'Periode', 'Bølgevarsel'];
var stats = {}

function cls(obj, param) {
  return clsValue(obj, param, {stats})
}

export function smhiForecastToRow(forecast) {
  let f = forecast.stations['Väderöerna']
  let emphasis = (isDayTime(forecast.localtime)) ? 'tr-scope' : 'tr-outofscope';
  
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(forecast.localtime),
      el('td', '', [
        el('span', `td-value ${cls(f, 'waveheight')}`, formatValue(f, 'waveheight')),
        el('span', 'td-secondary-value', formatValue2(f, 'waveheightmax')),
        el('span', 'td-arrow', arrow(f.wavedir, 'sm'))
      ]),
      el('td', '', 
        el('span', `td-value ${cls(f, 'waveperiod')}`, formatValue(f, 'waveperiod'))),
      el('td', '', 
        el('span', `td-value ${cls(f, 'waveheightforecast')}`, formatValue(f, 'waveheightforecast'))
    )])
  )
}

export async function updateSMHITable() {
  stats = await getStats('smhi')
  updateForecastTable(smhiForecast, getSMHITime, smhiForecastToRow, 'smhi', headers);
}

export function getSMHITime(forecast) {
  return forecast.localtime;
}

export var smhiForecast = [];

export async function getSMHIForecast(start, end) {
  smhiForecast = await get('forecasts/smhi');
  updateSMHITable();
}