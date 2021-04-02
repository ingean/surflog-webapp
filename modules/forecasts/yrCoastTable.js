import { el, arrow } from '../html/elements.js';
import { yrImgs } from '../config/lookups.js';


const headers = ['Tid', 'Vær', 'Temp', 'Bølger', 'Vind (byge)', 'Strøm', 'Vanntemp'];


function weatherImg(symbolCode) {
  let dividerPos = symbolCode.indexOf('_')
  let firstPart = (dividerPos > -1) ? symbolCode.substring(0, dividerPos) : symbolCode;
  let prefix = yrImgs[firstPart];
  let suffix = (dividerPos > -1 ) ? symbolCode.substr(dividerPos + 1, 1) : '';
  let src = `${prefix}${suffix}.svg`;

  return el('img', {src: `images/yr/${src}`, class: 'img-weather'})
}

function forecastHeaders() {
  return el('thead', 'forecast-table-header', 
    el('tr', '', headers.map(h => el('th', 'th-flex', h))))
}

function forecastRows(forecast) {
  let rows = forecast.intervals.map(f => { 
    return (
    el('tr', '', [
      el('td', 'td-flex', moment(f.start).format('HH')),
      el('td', 'td-flex', weatherImg(f.symbolCode.next1Hour)),
      el('td', 'td-flex', [ //Air temp
        el('span', 'td-value', Math.round(f.temperature.value)),
        el('span', 'td-unit-temp', '°')
      ]),
      el('td', 'td-flex', [ //Wave height and direction
        el('span', 'td-value', f.sea.wave.height),
        el('span', 'td-arrow', arrow(f.sea.wave.direction))
      ]),
      el('td', 'td-flex', [ //Wind speed and direction
        el('span', 'td-value', f.wind.speed),
        el('span', 'td-secondary-value', ` (${f.wind.gust})`),
        el('span', 'td-arrow', arrow(f.wind.direction))
      ]),
      el('td', 'td-flex', [ //Current speed and direction
        el('span', 'td-value', f.sea.current.speed),
        el('span', 'td-arrow', arrow(f.sea.current.direction))
      ]),
      el('td', 'td-flex', [ //Water temp
        el('span', 'td-value', Math.round(f.sea.temperature.value)),
        el('span', 'td-unit-temp', '°')
      ])
    ])
  )})

  return el('tbody', '', rows);
}

export function updateYrCoastTable(forecast) {
  let table = el('table', 'forecast-table', [
    forecastHeaders(),
    forecastRows(forecast)
  ])
  document.querySelector('#forecast-yr-now')
  .replaceChildren(table);
}