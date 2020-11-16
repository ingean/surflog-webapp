function displayTides(tides) {
  let parser = new DOMParser();
  let xmlTides = parser.parseFromString(tides,'text/xml');
  let predictions = xmlTides.getElementsByTagName('data')[0];
  let translate = {'high':'Høyvann','low':'Lavvann'};

  if (predictions.childElementCount <= 4) { // Just highs and lows
      let p = 0;
      let html = '<table class="table table-condensed">';
      while (p < predictions.childElementCount) {
          html += '<tr><td><img src="images/tide_' + predictions.children[p].attributes[2].nodeValue + '.png" /></td>' +
                  '<td>' + translate[predictions.children[p].attributes[2].nodeValue] + ' </td>' +
                  '<td> ' + moment(predictions.children[p].attributes[1].nodeValue).format('HH:mm') + '</td>' +
                  '<td> ' + predictions.children[p].attributes[0].nodeValue + 'cm </td></tr>';  
          p++
      }
      html += '</table>';
      $('#tidetable').html(html);

  } else { //Full tide report
      displayTideGraph(xmlTides);
  }
}

function displayTideGraph(xmlTides) {
  var tideTable = new google.visualization.DataTable();
  tideTable.addColumn('string', 'Tid');
  tideTable.addColumn('number', 'Prediksjon');
  tideTable.addColumn('number', 'Varsel');
  tideTable.addColumn('number', 'Observasjon');
  tideTable.addColumn('number', 'Værpåvirkning');

  let observations = xmlTides.getElementsByTagName('data')[0];
  let predictions = xmlTides.getElementsByTagName('data')[1];
  let weather = xmlTides.getElementsByTagName('data')[2];
  let forecast = xmlTides.getElementsByTagName('data')[3];
  
  let p = 0;
  let tideRows = [];

  while (p < predictions.childElementCount) {
      let tideRow = []
      let timestep = predictions.children[p].attributes[1].nodeValue;
      tideRow.push(moment(timestep).format('HH:mm'));
      tideRow.push(Number(predictions.children[p].attributes[0].nodeValue));

      //Add forecast if aligned in time
      if (forecast.childElementCount > p) {
          if (timestep == forecast.children[p].attributes[1].nodeValue) {
              tideRow.push(Number(forecast.children[p].attributes[0].nodeValue));
          } else {
              tideRow.push(0);
          }
      } else {
          tideRow.push(0);
      }
       
      //Add observations if aligned in time
      if (observations.childElementCount > p) {
          if (timestep == observations.children[p].attributes[1].nodeValue) {
              tideRow.push(Number(observations.children[p].attributes[0].nodeValue));
          } else {
              tideRow.push(0);
          }
      } else {
          tideRow.push(0);
      }

      //Add weather effect if aligned in time
      if (weather.childElementCount > p) {
          if (timestep == weather.children[p].attributes[1].nodeValue) {
              tideRow.push(Number(weather.children[p].attributes[0].nodeValue));
          } else {
              tideRow.push(0);
          }
      } else {
          tideRow.push(0);
      }  
      tideRows.push(tideRow);
      p++
  }

  tideTable.addRows(tideRows);
  createTidalChart(tideTable); 
}

function createTidalChart(tideTable) { 
  var options = {
    title: 'Prediksjon for Helgeroa',
    curveType: 'function',
    legend: { position: 'right' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('tidalgraph'));
  chart.draw(tideTable, options);
}

function showTidalGraph() {
  let date = getForecastTime('forecasttimedisplay');
  getTides(date,'all');
  $('#modal-tides').modal('show');
}
