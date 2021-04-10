import { Loader } from '../utils/logger.js'; 
import { getYrTides, getYrLocation, getSunTimes } from '../utils/api.js';
import { spotIds } from '../config/lookups.js';
import { el, tideIcon } from '../html/elements.js';


function formatTime(timeString) {
  return moment(timeString, 'hh:mm:ss a').utc(true).tz("Europe/Stockholm").format('HH:mm')
}

function tideHeaders(headers) {
  let divs = []
  headers.forEach(h => {
    divs.push(el('div', 'station-card-cell station-card-tideHeading', h))
  })
  return el('div', 'flex-row', divs);
}


function tideFlexTab(tide) {
  let table = [
    el('div', 'flex-row station-card-tideTitle', 'Tidevann'),
    tideHeaders(['Type', 'Tid', 'Høyde'])
  ];
  tide.forEach(t => {
    table.push( 
      el('div', 'flex-row', [
        el('div', 'station-card-cell station-card-tideIcon', tideIcon(t.type)),
        el('div', 'station-card-cell station-card-tideText', moment(t.time).format('HH:mm')),
        el('div', 'station-card-cell station-card-tideText', t.value)
      ])
    )
  })
  return table;
}

function updateCard(spotName, location, tide, sun) {
  let card = 
    el('div', 'station-card flex-row', [
      el('div', 'station-card station-card-names flex-col', [
        el('div', 'station-card-spotName', spotName),
        el('div', 'station-card-stationName', location.name)
      ]),
      el('div', 'station-card flex-col',[
        el('div', 'station-card-sunIcon', el('img', {src: 'images/yr/01m.svg', style: 'transform: rotate(180deg);'})),
        el('div', 'station-card-sunTime', formatTime(sun.civil_twilight_begin)),
        el('div', 'station-card-sunTime', formatTime(sun.sunrise))
      ]),
      el('div', 'station-card flex-col',[
        el('div', 'station-card-sunIcon', el('img', {src: 'images/yr/01m.svg'})),
        el('div', 'station-card-sunTime', formatTime(sun.sunset)),
        el('div', 'station-card-sunTime', formatTime(sun.civil_twilight_end))
      ]),
      el('div', 'station-card station-card-tide-table flex-col', tideFlexTab(tide))
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

  updateCard(spot, location, tide['_embedded'].tides, sun.results);
}