import { defaults } from '../../config/charts.js';
import { deepmerge } from '../../utils/deepMerge.js';
import { formatValue, labelValue } from '../format.js';
import { el } from '../../html/elements.js';


function createChart(id, forecast, headers, createRow, fcOptions, combo = false) { 
  let table = [headers];
  
  forecast.forEach(f => {
    table.push(createRow(f))
  })

  let date_formatter = new google.visualization.DateFormat({ 
    pattern: "EEEE HH:mm"
  });

  const options = deepmerge(defaults, fcOptions);
  
  let dataTable = google.visualization.arrayToDataTable(table, false);
  date_formatter.format(dataTable, 0);
    
  let el = document.getElementById(id);
  let chart = (combo) ? new google.visualization.ComboChart(el) : new google.visualization.LineChart(el);
  
  chart.draw(dataTable, options);
}


export function calcScope(date) {
  return moment(date).isAfter(moment()); 
}

export function calcEmphasis(date) {
  return moment(date).isSameOrAfter(moment()) && moment(date).isBefore(moment().add(12,'h')); 
}

export function createTooltip(f, param, forecast) {
  return el('div', {
    style: 'padding:5px 5px 5px 5px;width:150px;height:25px;font-size:18px'
    }, 
    labelValue(f, param, forecast))
}

export function createAnnotation(f, param, date, score) {
  var hr = moment(date).format('HH');
  if (hr == '00' || hr == '06' || hr == '12' || hr == '18') {
    if (score) {
        return points.label.substring(
          points.label.indexOf(">") + 1, 
          points.label.indexOf("<",points.label.indexOf(">") + 1));
    } else {
      return formatValue(f, param)
    }
  } else {
      return undefined;
  }
}

export function updateForecastChart(id, forecast, headers, forecastToRow, options, combo = false) {
  createChart(id, forecast, headers, forecastToRow, options, combo = false)
}