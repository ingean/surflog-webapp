import { el, arrow, hrsTd } from '../../html/elements.js';
import { get, getStatistics } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';


const headers = ['Tid', 'Bølger', 'Periode', 'Bølgevarsel'];
let statistics = {}

function smhiForecastToRow(forecast) {
  let f = forecast.stations['Väderöerna']
  let emphasis = (isDayTime(forecast.localtime)) ? 'tr-scope' : '';
  
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(forecast.localtime),
      el('td', '', [
        el('span', `td-value ${clsValue(statistics, f, 'waveheight')}`, formatValue(f, 'waveheight')),
        el('span', 'td-secondary-value', formatValue(f, 'waveheightmax', true)),
        el('span', 'td-arrow', arrow(f.wavedir))
      ]),
      el('td', '', 
        el('span', `td-value ${clsValue(statistics, f, 'waveperiod')}`, formatValue(f, 'waveperiod'))),
      el('td', '', 
        el('span', `td-value ${clsValue(statistics, f, 'waveheightforecast')}`, formatValue(f, 'waveheightforecast'))
    )])
  )
}

export async function updateSMHITable(spot = 'Saltstein') {
  statistics = await getStatistics('smhi', spot)
  updateForecastTable(smhiForecast, getSMHITime, smhiForecastToRow, 'smhi', headers);
}

function getSMHITime(forecast) {
  return forecast.localtime;
}

export var smhiForecast = [];

export async function getSMHIForecast(start, end) {
  smhiForecast = await get('forecasts/smhi');
  updateSMHITable();
}