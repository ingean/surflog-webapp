import { el, scoreLabel, hrsTd } from '../html/elements.js';
import { updateForecastTable, display } from './forecastTable.js';
import { get, queryTimespan } from '../utils/api.js';
import { round } from '../utils/utilities.js';
import { formatForecastValue, formatWindValue, getScoreCategory } from '../config/forecastFormat.js';
import { isDayTime } from '../utils/time.js';

const headers = ['Tid', 'Bølgehøyde', 'Bølgeperiode', 'Dønning', 'Dønning, periode', 'Wind', 'Score'];

function format(f, param) {
  if (param === 'wind') return formatWindValue(f[param]);
  return formatForecastValue('dmi', param, f[param]);
}

function paramCell(forecast, param) {
  let f1 = forecast.stations['Saltstein']
  let f2 = forecast.stations['Skagerak']
  
  return (
    el('td', '', [
      el('span', `td-value ${format(f1, param)}`, display(f1, param)),
      el('span', 'td-secondary-value hidden-xs', display(f2, param, true))
    ])
  )
}

function paramScore(forecast, param) {
  let v1 = forecast[param][param];
  let v2 = forecast[param].p;

  let score = (param === 'score') ? scoreLabel(v1) : (v1 === 1) ? 'Ja' : 'Nei';
  
  return (
    el('td', '', [
      el('span', 'td-value', score),
      el('span', 'td-secondary-value hidden-xs', ` (${round(v2, 1)})`)
    ])
  )
}


function dmiForecastToRow(forecast) {
  let score = getScoreCategory('dmi', forecast);
  let cls = (score > 4) ? `bg-muted-${score}` : '';
  let emphasis = (isDayTime(forecast.localtime)) ? 'emphasis-row' : '';
  return (
    el('tr', `forecast-table-row ${cls} ${emphasis}`, [
      hrsTd(forecast.localtime),
      paramCell(forecast, 'waveheight'),
      paramCell(forecast, 'waveperiod'),
      paramCell(forecast, 'swellheight'),
      paramCell(forecast, 'swellperiod'),
      paramCell(forecast, 'wind'),
      paramScore(forecast, 'score')
    ])
  )
}

function updateDMITable(forecast) {
  updateForecastTable(forecast, getDMITime, dmiForecastToRow, 'dmi', headers);
}

function getDMITime(forecast) {
  return forecast.localtime;
}

export var dmiForecast = [];

export async function getDMIForecast(start, end) {
  let query = queryTimespan(start, end);
  dmiForecast = await get(`forecasts/dmi${query}`);
  updateDMITable(dmiForecast);
}