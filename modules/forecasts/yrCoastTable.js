import { el, arrow, weatherImg, tempTd } from '../html/elements.js';
import { updateForecastTable, display } from './forecastTable.js';
import { getYrCoast } from '../utils/api.js';


const headers = ['Tid', 'Vær', 'Temp', 'Bølger', 'Vind (byge)', 'Strøm', 'Vanntemp'];


function yrCoastForecastToRow(f) {
    return (
    el('tr', 'forecast-table-row', [
      el('td', 'td-l', moment(f.start).format('HH')),
      el('td', 'td-l', weatherImg(f.symbolCode.next1Hour)),
      tempTd(f.temperature.value),
      el('td', 'td-l', [ //Wave height and direction
        el('span', 'td-value', display(f.sea.wave, 'height')),
        el('span', 'td-arrow', arrow(f.sea.wave.direction))
      ]),
      el('td', 'td-l', [ //Wind speed and direction
        el('span', 'td-value', display(f.wind, 'speed')),
        el('span', 'td-secondary-value', display(f.wind, 'gust', true)),
        el('span', 'td-arrow', arrow(f.wind.direction))
      ]),
      el('td', 'td-l', [ //Current speed and direction
        el('span', 'td-value', display(f.sea.current, 'speed')),
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