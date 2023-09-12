import { el, weatherImg, tempTd, hrsTd } from '../../components/elements.js';
import { arrow } from '../../components/icons.js'
import { getYrCoast } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { formatValue, formatValue2, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';
import { getStats } from '../../utils/statistics.js';

const headers = ['Tid', 'Vær', 'Temp', 'Høyde', 'Vind (byge)', 'Strøm', 'Vanntemp.'];
var stats = {}

function cls(f) {
  return clsValue(f.sea.wave, 'height', {stats, station: 'Saltstein', alias: 'waveheight'})
}


function yrCoastForecastToRow(f) {
  let emphasis = (isDayTime(f.start)) ? 'tr-scope' : 'tr-outofscope';
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(f.start),
      el('td', '', weatherImg(f.symbolCode.next1Hour)),
      tempTd(f.temperature.value),
      el('td', '', [ //Wave height and direction
        el('span', `td-value ${cls(f)}`, formatValue(f.sea.wave, 'height', 'waveheight')),
        el('span', 'td-arrow', arrow(f.sea.wave.direction, 'sm'))
      ]),
      el('td', '', [ //Wind speed and direction
        el('span', 'td-value', formatValue(f.wind, 'speed', 'wind')),
        el('span', 'td-secondary-value', formatValue2(f.wind, 'gust')),
        el('span', 'td-arrow', arrow(f.wind.direction))
      ]),
      el('td', 'hidden-xs', [ //Current speed and direction
        el('span', 'td-value', formatValue(f.sea.current, 'speed', 'currentSpeed')),
        el('span', 'td-arrow', arrow(f.sea.current.direction, 'sm'))
      ]),
      tempTd(f.sea.temperature.value),
    ])
  )
}

export async function updateYrCoastTable(spot = 'Saltstein') {
  stats = await getStats('yr')
  updateForecastTable(yrCoastForecast.shortIntervals, getYrCoastTime, yrCoastForecastToRow, 'yrCoast', headers);
}

function getYrCoastTime(forecast) {
  return forecast.start;
}

export var yrCoastForecast = []

export async function getYrCoastForecast(yrId) {
  yrCoastForecast = await getYrCoast(yrId);
  updateYrCoastTable();
}