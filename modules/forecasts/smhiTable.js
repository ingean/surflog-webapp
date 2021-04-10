import { el, arrow } from '../html/elements.js';
import { updateForecastTable } from './forecastTable.js';
import { get } from '../utils/api.js';
import { round } from '../utils/utilities.js';
import { formatForecastValue } from '../config/forecastFormat.js';

const headers = ['Tid', 'Bølger', 'Periode', 'Bølgevarsel'];

function format(forecast, param) {
  let value = forecast[param];
  param = (param === 'waveheightforecast') ? 'waveheight' : param;
  return formatForecastValue('smhi', param, value);
}


function smhiForecastToRow(forecast) {
  let f = forecast.stations['Väderöerna']
  let max = round(f.waveheightmax, 1);
  max = (max) ? ` (${max} m)` : null; 
  return (
    el('tr', '', [
      el('td', 'td-flex', moment(forecast.localtime).format('HH')),
      el('td', 'td-flex', [
        el('span', `td-value ${format(f, 'waveheight')}`, `${round(f.waveheight, 1)} m`),
        el('span', 'td-secondary-value', max),
        el('span', 'td-arrow', arrow(f.wavedir))
      ]),
      el('td', 'td-flex', 
        el('span', `td-value ${format(f, 'waveperiod')}`, `${round(f.waveperiod)} s`)),
      el('td', 'td-flex', 
        el('span', `td-value ${format(f, 'waveheightforecast')}`, `${round(f.waveheightforecast, 1)} m`)
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