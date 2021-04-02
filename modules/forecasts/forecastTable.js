import { el } from '../html/elements.js';


function timestepsInFirstDay(forecast) {
  let firstTimeStep = forecast?.[0].localtime;
  let firstHour = moment(firstTimeStep).format('HH');
  return 24 - Number(firstHour);
}

export function forecastTable(fc, fc2,  stations = '', suffix = '') {
  let table = [];
  let colspan = timestepsInFirstDay(fc);

  for (i = 0; i < (stations.length * 2) + 2; i++) { table.push([]); }
 
  for (var i = 0; i < 24; i++) {
    let wsr = 0;
    let wdr = 1;
  
    for(var j = 0; j < stations.length; j++) {      
      
      let ws = null;
      let wd = null;

      if (j === 2) {
        ws = fc2[i]['stations'][stations[j]].wind;
        wd = fc2[i]['stations'][stations[j]].winddir;
      } else { 
        ws = fc[i]['stations'][stations[j]].wind;
        wd = fc[i]['stations'][stations[j]].winddir;
      }
      
      if (i === 0) {
        table[wsr].push(
          '<td class="td-header" rowspan="2">' +
          //fc[i]['stations'][stations[j]].name.substring(0,3) +
          names[j].substring(0,3) + 
          '</td>'
        );
      }

      table[wsr].push(formatWindObs(ws,wd,stations[j],true));
      table[wdr].push(formatWindDir(wd,ws,stations[j],true));
      wsr += 2;
      wdr += 2;
    }

    if (i === 0) {
      table[10].push('<td class="td-header" rowspan="2">Tid</td>');
    }


    table[10].push(formatHours(fc[i].localtime));                        
    table[11].push(formatWeekDay(fc[i].localtime, i, colspan));
  }

  var html = '<div class="table-forecast"><table class="table-frost">';

  for (var i = 0; i < table.length; i++) {
    html += '<tr>';
    for (var j = 0; j < table[0].length; j++) {
      html += table[i][j];
    }
    html += '</tr>';
  }
  
  html += '</table></div>';
 
  $('#' + insertHTMLElem('windtab', 'frost', suffix)).html(html);
}