import { el, weatherImg, tempTd, hrsTd } from '../../components/elements.js';
import { arrow } from '../../components/svg.js';
import { getYrCoast, getStatistics } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { formatValue, clsValue } from '../format.js';
import { updateForecastTable } from './table.js';

const headers = ['Tid', 'Vær', 'Temp', 'Bølger', 'Vind (byge)', 'Strøm', 'Vanntemp'];
let statistics = {}

function cls(f) {
  return clsValue(statistics, f.sea, 'wave', 'Saltstein')
}


function yrCoastForecastToRow(f) {
  let emphasis = (isDayTime(f.start)) ? 'tr-scope' : '';
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(f.start),
      el('td', '', weatherImg(f.symbolCode.next1Hour)),
      tempTd(f.temperature.value),
      el('td', '', [ //Wave height and direction
        el('span', `td-value ${cls(f)}`, formatValue(f.sea.wave, 'height', false, 'waveheight')),
        el('span', 'td-arrow', arrow(f.sea.wave.direction))
      ]),
      el('td', '', [ //Wind speed and direction
        el('span', 'td-value', formatValue(f.wind, 'speed', false, 'wind')),
        el('span', 'td-secondary-value', formatValue(f.wind, 'gust', true)),
        el('span', 'td-arrow', arrow(f.wind.direction))
      ]),
      el('td', 'hidden-xs', [ //Current speed and direction
        el('span', 'td-value', formatValue(f.sea.current, 'speed', false, 'currentSpeed')),
        el('span', 'td-arrow', arrow(f.sea.current.direction))
      ]),
      tempTd(f.sea.temperature.value),
    ])
  )
}

export async function updateYrCoastTable(spot = 'Saltstein') {
  statistics = await getStatistics('yr', spot)
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