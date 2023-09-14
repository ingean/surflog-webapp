import { Loader } from '../../utils/logger.js'; 
import { getYrTides, getYrLocation, getSunTimes } from '../../utils/api.js';
import { spotIds } from '../../config/spots.js';
import { el, div } from '../../components/elements.js';
import { sprite } from '../../components/icons.js';

function tideHeaders(headers) {
  let th = [];
  headers.forEach(h => {
    th.push(el('th', 'td-s', h))
  })
  return el('thead', '', el('tr', '', th));
}

function sortTides(tide) {
  return tide.sort((a, b) => moment(b.time).date() - moment(a.time).date())
}


function tideRows(tide) {
  let rows = []
  tide = sortTides(tide)
  
  tide.forEach(t => {
    let id = (t.type === 'high') ? "hoyvann_synkende1" : "lavvann_stigende1"
    
    rows.push( 
      el('tr', '', [
        el('td', 'td-s', sprite('tides', 'tides', id, 24, 24)),
        el('td', 'td-s', formatTideTime(t.time)),
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

function formatTideTitle(title) {
  return (title === 'high') ? 'Høyvann' : 'Lavvann'
}

function formatTideTime(time) {
  return moment(time).format('HH:mm')
}

function formatTideLevel(level) {
  return `${level} cm`
}

function updateFooter(spot, location, sun, tide) {
  tide = sortTides(tide)
  let tideTitles = []
  let tideTimes = []
  let tideLevels = []

  tide.forEach(t => {
    tideTitles.push(div('footer-info-tideTime', formatTideTitle(t.type)))
    tideTimes.push(div('footer-info-tideTime', formatTideTime(t.time)))
    tideLevels.push(div('footer-info-tideTime', formatTideLevel(t.value)))
  })

  let info = 
  div('footer-info flex-col center-v', [
    div('footer-info-spotName', spot),
    div('footer-info-stationName', location.name),
    div('footer-info flex-row center-h', [
      div('footer-info flex-col', [
        div('footer-info-sunTime', `Første lys:` ),
        div('footer-info-sunTime', `Soloppgang:` ),
        div('footer-info-sunTime', `Solnedgang:` ),
        div('footer-info-sunTime', `Siste lys:` )
      ]),
      div('footer-info flex-col', [
        div('footer-info-sunTime', sun.firstLight),
        div('footer-info-sunTime', sun.sunrise),
        div('footer-info-sunTime', sun.sunset),
        div('footer-info-sunTime', sun.lastLight)
      ])
    ]),
    div('footer-info flex-row center-h', [
      div('footer-info flex-col', tideTitles),
      div('footer-info flex-col', tideTimes),
      div('footer-info flex-col', tideLevels)
    ])
  ]) 

  document.getElementById('footer-container-spot')
  .replaceChildren(info);
}



export async function updateStationCard(spot) {
  let load = new Loader(`root-station-card-yrCoast`);
  let yrId = spotIds[spot].yr.id;
  let location = await getYrLocation(yrId)
  let tide = await getYrTides(yrId);
  let sun = await getSunTimes(location.position.lat, location.position.lon);

  updateCard(spot, location, tide['_embedded'].tides, sun);
  updateFooter(spot, location, sun, tide['_embedded'].tides)
}