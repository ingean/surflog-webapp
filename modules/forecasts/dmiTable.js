import { el, scoreLabel } from '../html/elements.js';
import { updateForecastTable } from './forecastTable.js';
import { get, queryTimespan } from '../utils/api.js';
import { round } from '../utils/utilities.js';
import { formatForecastValue, formatWindValue, getScoreCategory } from '../config/forecastFormat.js';

const headers = ['Tid', 'Bølgehøyde', 'Bølgeperiode', 'Dønning', 'Dønning, periode', 'Wind', 'Score', 'Surfbart'];

function format(value, param) {
  if (param === 'wind') return formatWindValue(value);
  return formatForecastValue('dmi', param, value);
}

function paramCell(forecast, param, unit = 'm', precision = 1) {
  let v1 = forecast.stations['Saltstein'][param]
  let v2 = forecast.stations['Skagerak'][param]
  
  return (
    el('td', 'td-flex', [
      el('span', `td-value ${format(v1, param)}`, `${round(v1, precision)} ${unit}`),
      el('span', 'td-secondary-value', ` (${round(v2, precision)} ${unit})`)
    ])
  )
}

function paramScore(forecast, param) {
  let v1 = forecast[param][param];
  let v2 = forecast[param].p;

  let score = (param === 'score') ? scoreLabel(v1) : (v1 === 1) ? 'Ja' : 'Nei';
  
  return (
    el('td', 'td-flex', [
      el('span', 'td-value', score),
      el('span', 'td-secondary-value', ` (${round(v2, 1)})`)
    ])
  )
}


function dmiForecastToRow(forecast) {
  let score = getScoreCategory('dmi', forecast);
  let cls = (score > 4) ? `bg-muted-${score}` : '';
  return (
    el('tr', cls, [
      el('td', 'td-flex', moment(forecast.localtime).format('HH')),
      paramCell(forecast, 'waveheight'),
      paramCell(forecast, 'waveperiod', 's', 0),
      paramCell(forecast, 'swellheight'),
      paramCell(forecast, 'swellperiod', 's', 0),
      paramCell(forecast, 'wind', 'm/s', 0),
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