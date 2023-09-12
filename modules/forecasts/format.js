import { forecastParamAll } from '../config/datasources.js';
import { span } from '../components/elements.js';
import { round } from '../utils/utilities.js';
import { scoreWindValue, scoreValue, scorePressureValue } from './score.js';
import { paramStats } from '../utils/statistics.js';

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

export function formatValue(obj, param, paramAlias) {
  if (!obj?.[param]) return null
  let value = obj[param]
  param = (paramAlias) ? paramAlias : param
  let u = forecastParamAll(param)
  value = round(value, u.unit.precision)
  
  return `${value} ${u.unit.unit}`
}

export function formatValue2(value, param, paramAlias) {
  return ` (${formatValue(value, param, paramAlias)})`
}

export function clsValue_old(statistics, f, param,  location, type = 'txt', wind = 'local') {
  param = (param === 'waveheightforecast') ? 'waveheight' : param;
  if (param.includes('wind')) {
    let score = scoreWindValue(f[param], wind)
    return (score) ? `${type}-${score}` : ''; //Text or background color eg txt-1 or bg-1
  } else {
    let score = scoreValue(statistics, f[param], param, location);
    return (score > 2) ? `${type}-${score}` : ''; //Text or background color eg txt-1 or bg-1
  }
}

export function clsValue(obj, param, options) {
  let type = options?.type || 'txt'
  let rating = valueRating(obj, param, options)
  return (rating) ? `${type}-rating-${rating}` : ''
}

export function valueRating(obj, param, options) {
  if (param.includes('wind')) {
    return scoreWindValue(obj[param], options.wind)
  } else if (param.includes('pressure')) {
    return scorePressureValue(obj[param])
  } else {
    let rating = calcRating(obj, param, options)
    return (rating > 2) ? rating : null
  }
}

export function labelValue(f, param, forecast, fetch = false) {
  let options = {source: forecast, fetch: fetch, type: 'bg'}
  return span(clsValue(f, param, options), formatValue(f, param))
}

function calcRating(obj, param, options) {
  let v = obj[param]
  let s = paramStats(param, options)
  return (v >= (s.avg + s.std)) ? 7: (v >= s.avg) ? 5 : (v >= (s.avg - s.std) ? 4 : (v >= s.min) ? 3 : 0);
}