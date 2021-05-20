import { el } from '../html/elements.js';
import { statistics } from '../settings.js';
import { round } from '../utils/utilities.js';
import { units } from '../config/lookups.js';

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

function getValues(stats, param) {
  return statParam.map(s => { return [
    stats[`${s}(${param.id})`],
    stats[`${s}(s${param.id})`]
    ]
  })
}


function cell(v1, v2, param) {
  let u = units[param.id];
  v1 = (v1) ? `${round(v1, u.precision)} ${u.unit}` : null;
  v2 = (v2) ? ` (${round(v2, u.precision)} ${u.unit})` : null;
  return el('div', cCls, [
   el('span', '', v1),
   el('span', 'txt-table-2', v2)
  ]);
}

function tableCells(stats, param) {
  let v = getValues(stats, param);
  return [
    el('td', 'td-m td-left', param.caption),
    el('td', cCls, (cell(v[0][0], v[0][1], param))), // max
    el('td', cCls, (cell(v[1][0] - v[3][0], v[1][1] - v[3][1], param))), // avg - std
    el('td', cCls, (cell(v[1][0], v[1][1], param))), // avg
    el('td', cCls, (cell(v[1][0] + v[3][0], v[1][1]  + v[3][1], param))), // avg + std
    el('td', cCls, (cell(v[2][0], v[2][1], param))), // max
    el('td', cCls, (cell(v[3][0], v[3][1], param))) // std
  ]
}


function tableBody(stats, params) {
  let rows = [];
  params.forEach(param => rows.push(tableRow(stats, param)))
  return el('tbody', '', rows)
}

export function updateCard(spot, forecast, params) {
  let stats = statistics[spot][forecast][0];
  let card = 
    el('div', 'station-card flex-row', [
      el('div', 'station-card station-card-names flex-col', [
        el('div', 'station-card-spotName', spot),
        el('div', 'station-card-stationName', `Statistikk for ${forecast.toUpperCase()}`)
      ]),   
      el('table', 'station-card-table', [
        tableHead(),
        tableBody(stats, params)
      ])
    ]);
      
  document.querySelector(`#root-station-card-${forecast}`)
  .replaceChildren(card);
}