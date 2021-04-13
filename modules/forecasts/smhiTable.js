import { el, arrow } from '../html/elements.js';
import { updateForecastTable, display } from './forecastTable.js';
import { get } from '../utils/api.js';
import { formatForecastValue } from '../config/forecastFormat.js';


const headers = ['Tid', 'Bølger', 'Periode', 'Bølgevarsel'];

function format(f, param) {
  let value = f[param];
  param = (param === 'waveheightforecast') ? 'waveheight' : param;
  return formatForecastValue('smhi', param, value);
}

function smhiForecastToRow(forecast) {
  let f = forecast.stations['Väderöerna']
  
  return (
    el('tr', 'forecast-table-row', [
      el('td', 'td-l', moment(forecast.localtime).format('HH')),
      el('td', 'td-l', [
        el('span', `td-value ${format(f, 'waveheight')}`, display(f, 'waveheight')),
        el('span', 'td-secondary-value', display(f, 'waveheightmax', true)),
        el('span', 'td-arrow', arrow(f.wavedir))
      ]),
      el('td', 'td-l', 
        el('span', `td-value ${format(f, 'waveperiod')}`, display(f, 'waveperiod'))),
      el('td', 'td-l', 
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