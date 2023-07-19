import { el, ratingLabel, hrsTd } from '../../components/elements.js';
import { get, getStatistics, queryTimespan } from '../../utils/api.js';
import { round } from '../../utils/utilities.js';
import { isDayTime } from '../../utils/time.js';
import { formatValue, clsValue } from '../format.js';
import { scoreForecast } from '../score.js';
import { updateForecastTable } from './table.js';

const headers = ['Tid', 'Bølgehøyde', 'Bølgeperiode', 'Dønning', 'Dønning, periode', 'Wind', 'Score'];
let statistics = {}

function paramCell(forecast, param) {
  let f1 = forecast.stations['Saltstein']
  let f2 = forecast.stations['Skagerak']
  
  return (
    el('td', '', [
      el('span', `td-value ${clsValue(statistics, f1, param)}`, formatValue(f1, param)),
      el('span', 'td-secondary-value hidden-xs', formatValue(f2, param, true))
    ])
  )
}

function paramScore(forecast, param) {
  let v1 = forecast[param][param];
  let v2 = forecast[param].p;

  let score = (param === 'score') ? ratingLabel(v1, 'sm') : (v1 === 1) ? 'Ja' : 'Nei';
  
  return (
    el('td', '', [
      el('span', 'td-value', score),
      el('span', 'td-secondary-value hidden-xs', ` (${round(v2, 1)})`)
    ])
  )
}

function dmiForecastToRow(forecast) {
  let score = scoreForecast(forecast, 'dmi');
  let cls = (score > 4) ? `bg-muted-${score}` : '';
  let emphasis = (isDayTime(forecast.localtime)) ? 'tr-scope' : '';
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

export async function updateDMITable(spot = 'Saltstein') {
  statistics = await getStatistics('dmi', spot)
  updateForecastTable(dmiForecast, getDMITime, dmiForecastToRow, 'dmi', headers);
}

function getDMITime(forecast) {
  return forecast.localtime;
}

export var dmiForecast = [];

export async function getDMIForecast(start, end) {
  let query = queryTimespan(start, end);
  dmiForecast = await get(`forecasts/dmi${query}`);
  updateDMITable();
}