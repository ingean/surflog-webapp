import { forecastParamAll } from '../config/datasources.js';
import { el } from '../components/elements.js';
import { round } from '../utils/utilities.js';
import { scoreWindValue, scoreValue } from './score.js';

const noCalendarDates = {
  lastDay : '[I går]',
  sameDay : '[I dag]',
  nextDay : '[I morgen]',
  lastWeek : '[Forrige] dddd',
  nextWeek : 'dddd',
  sameElse : 'L'
}

export function formatDate(date) {
  return moment(date).calendar(null, noCalendarDates)
}

export function formatValue(f, param, secondary = false, lookupAlias) {
  let lu = lookupAlias || param;
  let u = forecastParamAll(lu);
  let v = round(f[param], u.unit.precision);
  let p1 = '', p2 = '', p3 = '';
  if (secondary) {
    p1 = ' ';
    p2 = '(';
    p3 = ')';
  }
  return (f[param] !== null) ? `${p1}${p2}${v} ${u.unit.unit}${p3}` : null;
}

export function clsValue(statistics, f, param,  location, type = 'txt', wind = 'local') {
  param = (param === 'waveheightforecast') ? 'waveheight' : param;
  if (param.includes('wind')) {
    let score = scoreWindValue(f[param], wind)
    return (score) ? `${type}-${score}` : ''; //Text or background color eg txt-1 or bg-1
  } else {
    let score = scoreValue(statistics, f[param], param, location);
    return (score > 2) ? `${type}-${score}` : ''; //Text or background color eg txt-1 or bg-1
  }
}

export function labelValue(f, param, forecast, fetch = false) {
  return el('span', clsValue(f, param, forecast, 'bg', fetch), formatValue(f, param))
}
