import { el, arrow, hrsTd } from '../../html/elements.js';
import { updateForecastTable, display } from './forecast.js';
import { get } from '../../utils/api.js';
import { formatForecastValue } from '../../config/forecasts.js';
import { isDayTime } from '../../utils/time.js';


const headers = ['Tid', 'Bølger', 'Periode', 'Bølgevarsel'];

function format(f, param) {
  let value = f[param];
  param = (param === 'waveheightforecast') ? 'waveheight' : param;
  return formatForecastValue('smhi', param, value);
}

function smhiForecastToRow(forecast) {
  let f = forecast.stations['Väderöerna']
  let emphasis = (isDayTime(forecast.localtime)) ? 'emphasis-row' : '';
  
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(forecast.localtime),
      el('td', '', [
        el('span', `td-value ${format(f, 'waveheight')}`, display(f, 'waveheight')),
        el('span', 'td-secondary-value', display(f, 'waveheightmax', true)),
        el('span', 'td-arrow', arrow(f.wavedir))
      ]),
      el('td', '', 
        el('span', `td-value ${format(f, 'waveperiod')}`, display(f, 'waveperiod'))),
      el('td', '', 
        el('span', `td-value ${format(f, 'waveheightforecast')}`, display(f, 'waveheightforecast'))
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