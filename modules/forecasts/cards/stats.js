import { el } from '../../html/elements.js';
import { getStatistics } from '../../utils/api.js';
import { getStatsForParam } from '../../utils/statistics.js';
import { round } from '../../utils/utilities.js';
import { forecastParamAll } from '../../config/datasources.js';

const cCls = 'td-m';
const headers = ['min', 'avg - std', 'avg', 'avg + std', 'max', 'std'];
const statParam = ['min', 'avg', 'max', 'std'];

function tableRow(stats, param) {
  return el('tr', '', tableCells(stats, param));
}

function tableHead() {
  let th = headers.map(s => el('th', 'th', el('span', 'td-text-h td-text-m', s)))
  th.unshift(el('th', 'th td-left', 'Parameter'))
  return el('thead', '', el('tr', '', th));
}

function cell(v, param) {
  let u = forecastParamAll(param.id);
  v = (v) ? `${round(v, u.unit.precision)} ${u.unit.unit}` : null;

  return el('div', cCls, 
    el('span', '', v)
  );
}

function tableCells(stats, param, station) {
  let s = getStatsForParam(stats, param.id, 4, station);
  return [
    el('td', 'td-m td-left', param.caption),
    el('td', cCls, cell(s.min, param)), // max
    el('td', cCls, cell(s.avg - s.std, param)), // avg - std
    el('td', cCls, cell(s.avg, param)), // avg
    el('td', cCls, cell(s.avg + s.std, param)), // avg + std
    el('td', cCls, cell(s.max, param)), // max
    el('td', cCls, cell(s.std, param)) // std
  ]
}

function tableBody(stats, params) {
  let rows = [];
  params.forEach(param => rows.push(tableRow(stats, param)))
  return el('tbody', '', rows)
}

export async function updateCard(spot, forecast, params) {
  let statistics = await getStatistics(forecast, spot)
  let station = (forecast === 'yr') ? 'Saltstein' : null
  if (!statistics) return
    let card = 
    el('div', 'station-card flex-row', [
      el('div', 'station-card station-card-names flex-col', [
        el('div', 'station-card-spotName', spot),
        el('div', 'station-card-stationName', `Statistikk for ${forecast.toUpperCase()}`)
      ]),   
      el('table', 'station-card-table', [
        tableHead(),
        tableBody(statistics, params, station)
      ])
    ]);
      
  document.querySelector(`#root-station-card-${forecast}`)
  .replaceChildren(card);
}