import { calcScope, calcEmphasis, createTooltip, createAnnotation, updateForecastChart } from './chart.js';

const header = [
  {label:'Tid', type:'datetime'},
  {label: 'Saltstein', type: 'number'},
  {id:'scope1', role:'scope'},
  {id:'emphasis1', role:'emphasis'},
  {type:'string', role:'annotation'},
  {type:'string', role:'tooltip', p: {'html': true}},
  {id:'avgSubStd', type:'number', role:'interval'},
  {id:'avgAddStd', type:'number', role:'interval'},
  {label: 'Skagerak', type: 'number'},
  {id:'scope1', role:'scope'},
  {type:'string', role:'tooltip', p: {'html': true}}
];

function forecastToRow(row, param, stats) {
  let time = row['localtime'];
  let value1 = row['stations']['Saltstein'][param];
  let value2 = row['stations']['Skagerak'][param];
  return [
    moment(time).toDate(),
    value1,
    calcScope(time),
    calcEmphasis(time),
    createAnnotation(time, value1, gUnits[param], false),
    createTooltip(value1, param, stats, gUnits[param]),
    stats[`avg(${param})`] - stats[`std(${param})`],
    stats[`avg(${param})`] + stats[`std(${param})`],
    value2,
    calcScope(time),
    createTooltip(value2,`s${param}`, stats, gUnits[param])
  ];
}

export function updateChart(forecast, param) {
  updateForecastChart(forecast,  )
}