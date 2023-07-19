import { Loader } from '../../utils/logger.js'; 
import { getYrTides, getYrLocation, getSunTimes } from '../../utils/api.js';
import { spotIds } from '../../config/spots.js';
import { el, div } from '../../components/elements.js';
import { tideIcon } from '../../components/svg.js';

function tideHeaders(headers) {
  let th = [];
  headers.forEach(h => {
    th.push(el('th', 'td-s', h))
  })
  return el('thead', '', el('tr', '', th));
}


function tideRows(tide) {
  let rows = []
  tide = tide.sort((a, b) => moment(b.time).date() - moment(a.time).date())
  
  tide.forEach(t => {
    let type = (t.type === 'high') ? "Høyvann" : "Lavvann"
    let dir = (t.type === 'high') ? "synkende" : "stigende"
    let hrs = (t.type === 'high') ? 3 : 0 
    
    rows.push( 
      el('tr', '', [
        el('td', 'td-s', tideIcon(type, dir, hrs)),
        el('td', 'td-s', moment(t.time).format('HH:mm')),
        el('td', 'td-s', t.value)
      ])
    )
  })
  return el('tbody', '', rows);
}

function updateCard(spotName, location, tide, sun) {
  let card = 
    div('station-card flex-row', [
      div('station-card station-card-names flex-col', [
        div('station-card-spotName', spotName),
        div('station-card-stationName', location.name)
      ]),
      div('station-card flex-col', [
        div('station-card-sunIcon', el('img', {src: 'images/yr/01m.svg', style: 'transform: rotate(180deg);'})),
        div('station-card-sunTime', sun.firstLight),
        div('station-card-sunTime', sun.sunrise)
      ]),
      div('station-card flex-col', [
        div('station-card-sunIcon', el('img', {src: 'images/yr/01m.svg'})),
        div('station-card-sunTime', sun.sunset),
        div('station-card-sunTime', sun.lastLight)
      ]),
      div('station-card flex-col', 
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