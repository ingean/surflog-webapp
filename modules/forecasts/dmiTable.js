import { el, scoreLabel } from '../html/elements.js';
import { updateForecastTable, display } from './forecastTable.js';
import { get, queryTimespan } from '../utils/api.js';
import { round } from '../utils/utilities.js';
import { formatForecastValue, formatWindValue, getScoreCategory } from '../config/forecastFormat.js';

const headers = ['Tid', 'Bølgehøyde', 'Bølgeperiode', 'Dønning', 'Dønning, periode', 'Wind', 'Score', 'Surfbart'];

function format(f, param) {
  if (param === 'wind') return formatWindValue(f[param]);
  return formatForecastValue('dmi', param, f[param]);
}

function paramCell(forecast, param) {
  let f1 = forecast.stations['Saltstein']
  let f2 = forecast.stations['Skagerak']
  
  return (
    el('td', 'td-l', [
      el('span', `td-value ${format(f1, param)}`, display(f1, param)),
      el('span', 'td-secondary-value', display(f2, param, true))
    ])
  )
}

function paramScore(forecast, param) {
  let v1 = forecast[param][param];
  let v2 = forecast[param].p;

  let score = (param === 'score') ? scoreLabel(v1) : (v1 === 1) ? 'Ja' : 'Nei';
  
  return (
    el('td', 'td-l', [
      el('span', 'td-value', score),
      el('span', 'td-secondary-value', ` (${round(v2, 1)})`)
    ])
  )
}


function dmiForecastToRow(forecast) {
  let score = getScoreCategory('dmi', forecast);
  let cls = (score > 4) ? `bg-muted-${score}` : '';
  return (
    el('tr', `forecast-table-row ${cls}`, [
      el('td', 'td-l', moment(forecast.localtime).format('HH')),
      paramCell(forecast, 'waveheight'),
      paramCell(forecast, 'waveperiod'),
      paramCell(forecast, 'swellheight'),
      paramCell(forecast, 'swellperiod'),
      paramCell(forecast, 'wind'),
      paramScore(forecast, 'score'),
      paramScore(forecast, 'surfable')
    ])
  )
}

function updateDMITable(forecast) {
  updateForecastTable(forecast, getDMITime, dmiForecastToRow, 'dmi', headers);
}

function getDMITime(forecast) {
  return forecast.localtime;
}

export async function getDMIForecast(start, end) {
  let query = queryTimespan(start, end);
  let forecast = await get(`forecasts/dmi${query}`);
  updateDMITable(forecast);
}