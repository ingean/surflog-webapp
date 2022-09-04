import { Loader } from '../../utils/logger.js'; 
import { getYrTides, getYrLocation, getSunTimes } from '../../utils/api.js';
import { spotIds } from '../../config/spots.js';
import { el, tideIcon } from '../../html/elements.js';

function tideHeaders(headers) {
  let th = [];
  headers.forEach(h => {
    th.push(el('th', 'td-s', h))
  })
  return el('thead', '', el('tr', '', th));
}


function tideRows(tide) {
  tide = tide.sort((a, b) => moment(b.time).date() - moment(a.time).date())
  
  let dir = tide.type === 'low' ? 'down' : 'up'


  let rows = [];
  tide.forEach(t => {
    rows.push( 
      el('tr', '', [
        el('td', 'td-s', tideIcon(t.type, dir)),
        el('td', 'td-s', moment(t.time).format('HH:mm')),
        el('td', 'td-s', t.value)
      ])
    )
  })
  return el('tbody', '', rows);
}

function updateCard(spotName, location, tide, sun) {
  let card = 
    el('div', 'station-card flex-row', [
      el('div', 'station-card station-card-names flex-col', [
        el('div', 'station-card-spotName', spotName),
        el('div', 'station-card-stationName', location.name)
      ]),
      el('div', 'station-card flex-col', [
        el('div', 'station-card-sunIcon', el('img', {src: 'images/yr/01m.svg', style: 'transform: rotate(180deg);'})),
        el('div', 'station-card-sunTime', sun.firstLight),
        el('div', 'station-card-sunTime', sun.sunrise)
      ]),
      el('div', 'station-card flex-col', [
        el('div', 'station-card-sunIcon', el('img', {src: 'images/yr/01m.svg'})),
        el('div', 'station-card-sunTime', sun.sunset),
        el('div', 'station-card-sunTime', sun.lastLight)
      ]),
      el('div', 'station-card flex-col', 
        el('table', 'station-card station-card-table', [
          tideHeaders(['Type', 'Tid', 'Høyde']),
          tideRows(tide)
        ])
      )
    ]);
      
  document.querySelector('#root-station-card-yrCoast')
  .replaceChildren(card);
}

export async function updateStationCard(spot) {
  let load = new Loader(`root-station-card-yrCoast`);
  let yrId = spotIds[spot].yr.id;
  let location = await getYrLocation(yrId)
  let tide = await getYrTides(yrId);
  let sun = await getSunTimes(location.position.lat, location.position.lon);

  updateCard(spot, location, tide['_embedded'].tides, sun);
}