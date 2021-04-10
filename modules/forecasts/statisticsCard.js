import { el } from '../html/elements.js';
import { selectedSpot } from '../html/spotInput.js';
import { statistics } from '../settings.js';
import { round } from '../utils/utilities.js';

function paramType(param) {
  return param.substring(0,3);
}

function paramName(param) {
  return param.substring(
    param.lastIndexOf('(') + 1, 
    param.lastIndexOf(')'))
}

function statsTab(stats) {
  let table = [];
  let keys = Object.keys(stats);
  let params = [];

  keys.forEach(key => {
    if (params.length === 0) {
      table.push(el('div', 'flex-row', paramName(key)))
    }
    params.push(
      el('div', 'station-card-cell-stats', [
        el('span', 'txt-stats-type', `${paramType(key)}: `), 
        el('span', '', `${round(stats[key],1)}`)
      ])
    )

    if(params.length === 4) {
      let row = el('div', 'flex-row', params);
      table.push(row);
      params = [];
    }
  })
  return table;
}

function updateCard(spot, statistics, forecast) {
  let stats = statistics[spot][forecast][0];
  let card = 
    el('div', 'station-card flex-row', [
      el('div', 'station-card station-card-names flex-col', [
        el('div', 'station-card-spotName', spot),
        el('div', 'station-card-stationName', `Statistikk for ${forecast.toUpperCase()}`)
      ]),   
      el('div', 'station-card station-card-stats-table flex-col y-scrollable', statsTab(stats))
    ]);
      
  document.querySelector(`#root-station-card-${forecast}`)
  .replaceChildren(card);
}

export function updateStatsCard(forecast, spot) {
  spot = spot || selectedSpot();
  updateCard(spot, statistics, forecast);
}