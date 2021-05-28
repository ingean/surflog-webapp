import { el, arrow, hrsTd } from '../../html/elements.js';
import { get } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';


const headers = ['Tid', 'Bølger', 'Periode', 'Bølgevarsel'];


function smhiForecastToRow(forecast) {
  let f = forecast.stations['Väderöerna']
  let emphasis = (isDayTime(forecast.localtime)) ? 'emphasis-row' : '';
  
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(forecast.localtime),
      el('td', '', [
        el('span', `td-value ${clsValue(f, 'waveheight', 'smhi')}`, formatValue(f, 'waveheight')),
        el('span', 'td-secondary-value', formatValue(f, 'waveheightmax', true)),
        el('span', 'td-arrow', arrow(f.wavedir))
      ]),
      el('td', '', 
        el('span', `td-value ${clsValue(f, 'waveperiod', 'smhi')}`, formatValue(f, 'waveperiod'))),
      el('td', '', 
        el('span', `td-value ${clsValue(f, 'waveheightforecast', 'smhi')}`, formatValue(f, 'waveheightforecast'))
    )])
  )
}

function updateSMHITable(forecast) {
  updateForecastTable(forecast, getSMHITime, smhiForecastToRow, 'smhi', headers);
}

function getSMHITime(forecast) {
  return forecast.localtime;
}

export async function getSMHIForecast(start, end) {
  let forecast = await get('forecasts/smhi');
  updateSMHITable(forecast);
}