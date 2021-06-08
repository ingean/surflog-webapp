import { el, arrow, weatherImg, tempTd, hrsTd } from '../../html/elements.js';
import { getYrCoast } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { formatValue } from '../format.js';
import { updateForecastTable } from './table.js';

const headers = ['Tid', 'Vær', 'Temp', 'Bølger', 'Vind (byge)', 'Strøm', 'Vanntemp'];

function yrCoastForecastToRow(f) {
  let emphasis = (isDayTime(f.start)) ? 'emphasis-row' : '';
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(f.start),
      el('td', '', weatherImg(f.symbolCode.next1Hour)),
      tempTd(f.temperature.value),
      el('td', '', [ //Wave height and direction
        el('span', 'td-value', formatValue(f.sea.wave, 'height', false, 'waveheight')),
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

function updateYrCoastTable(forecast) {
  updateForecastTable(forecast.intervals, getYrCoastTime, yrCoastForecastToRow, 'yrCoast', headers);
}

function getYrCoastTime(forecast) {
  return forecast.start;
}

export async function getYrCoastForecast(yrId) {
  let forecast = await getYrCoast(yrId);
  updateYrCoastTable(forecast);
}