import { ratingLabel, hrsTd, span, td, tr } from '../../components/elements.js';
import { get, queryTimespan } from '../../utils/api.js';
import { round } from '../../utils/utilities.js';
import { isDayTime } from '../../utils/time.js';
import { scoreForecast } from '../score.js';
import { updateForecastTable } from './table.js';
import { getStats } from '../../utils/statistics.js';
import { paramSpan } from '../../config/forecastValues.js';

const headers = ['Tid', 'Høyde', 'Periode', 'Dønning', 'Periode', 'Vind', 'Score'];
var stats = {}

function paramCell(forecast, param) {
  let f1 = forecast.stations['Saltstein']
  let f2 = forecast.stations['Skagerak']
  
  return (
    td('', [
      paramSpan(f1, param, {stats, wind: 'local'}),
      paramSpan(f2, param, {stats, secondary: true, wind: 'fetch'})
    ])
  )
}

function paramScore(forecast, param) {
  let v1 = forecast[param][param];
  let v2 = forecast[param].p;

  let score = (param === 'score') ? ratingLabel(v1, 'sm') : (v1 === 1) ? 'Ja' : 'Nei';
  
  return (
    td('', [
      span('param-value', score),
      span('param-value-sm hidden-xs', ` ${round(v2, 1)*100}%`)
    ])
  )
}

function dmiForecastToRow(forecast) {
  let score = scoreForecast(forecast, 'dmi');
  let cls = (score > 4) ? `bg-muted-${score}` : '';
  let emphasis = (isDayTime(forecast.localtime)) ? 'tr-scope' : 'tr-outofscope';
  return (
    tr(`forecast-table-row ${cls} ${emphasis}`, [
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

export async function updateDMITable() {
  stats = await getStats('dmi')
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