function displayObservations(response,timesteps,elementId) {
  var observations = [];
  var labels = [{label:'Tid',id:'Tid',type:'datetime'}];
  var stations = [];
  var nrstations = response.currentItemCount/timesteps;


  var l = 0;
  while (l < response.currentItemCount) {
    labels.push({label:locations[response.data[l].sourceId].label,id:response.data[l].sourceId,type:'number'});
    labels.push({label:'Vindretning',type:'string',role:'tooltip',p: {'html': true}});
    labels.push({label:'Vindretning',type:'string',role:'annotation'});
    stations.push(locations[response.data[l].sourceId].label);
    l += timesteps;
  }

  observations.push(labels);
  createFilters(stations);

  var i = 0;
  var j = 0;

  for (i = 0; i < timesteps-1; i++) { //Loop through each timestep
    var row = [];
    var k = i;
    for (j = 0; j < nrstations; j++) { //Loop through each station
      if (j === 0) {
        row.push(utcToLocal(moment(response.data[k].referenceTime).toDate()));
      }

      if(response.data[k].observations[0].elementId === 'wind_from_direction') {
        row.push(response.data[k].observations[1].value);
        row.push(createToolTipHTML(response.data[k].observations[1].value,
                                  response.data[k].observations[0].value));
        row.push(response.data[k].observations[1].value + ' ' + winddirToText(response.data[k].observations[0].value)[1]);
      } else {
        row.push(response.data[k].observations[0].value);
        row.push(createToolTipHTML(response.data[k].observations[0].value,999));
        row.push(null); 
      }
      
      k += timesteps;
    }
    observations.push(row);
  }
  var chartwidth = screen.width;
    if (screen.width < 800) {
        chartwidth = 1000;
    };
  var obsTab = google.visualization.arrayToDataTable(observations,false);
  var obsOptions = {width:chartwidth,
                    height:540,
                    vAxis: { ticks: [
                      {v:0, f:'Stille'},
                      {v:2, f:'Laber bris'}, 
                      {v:4, f:'Bris'},
                      {v:8, f:'Frisk bris'},
                      {v:11, f:'Liten kuling'},
                      {v:14, f:'Stiv kuling'},
                      {v:17, f:'Sterk kuling'},
                      {v:21, f:'Liten storm'},
                    ] },
                    annotations: {
                      textStyle: {
                        fontSize: 10,
                        bold: true
                      }
                    },
                    chartArea: {
                      width: '90%',
                      height: '90%'
                    },
                    legend: {position: 'top'},
                    curveType: 'function', 
                    tooltip: { isHtml: true }};
  var obsChart = new google.visualization.LineChart(document.getElementById(elementId));

  obsChart.draw(obsTab, obsOptions);

  //Onclick event for filtering observations
  var filterall = document.getElementById('filter-all'); //Vis alle
  filterall.onclick = function() {
      view = new google.visualization.DataView(obsTab);
      view.hideColumns([]); 
      obsChart.draw(view, obsOptions);
  }
  var filterskagerak = document.getElementById('filter-skagerak'); //Vis Oksøy, Torungen og Lyngør
  filterskagerak.onclick = function() {
      view = new google.visualization.DataView(obsTab);
      view.hideColumns([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]); 
      obsChart.draw(view, obsOptions);
  }
  var filteroslo = document.getElementById('filter-oslofjorden');//Vis Jomfruland, Svenner og Færder
  filteroslo.onclick = function() {
      view = new google.visualization.DataView(obsTab);
      view.hideColumns([1,2,3,4,5,6,16,17,18,19,20,21,22,23,24]); 
      obsChart.draw(view, obsOptions);
  }
  var filtersverige = document.getElementById('filter-sverige'); //Vis Nordkoster og Väderöerna 
  filtersverige.onclick = function() {
      view = new google.visualization.DataView(obsTab);
      view.hideColumns([7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]); 
      obsChart.draw(view, obsOptions);
  }
}

function createFilters(stations){
  var html = '';

  for (var s in stations) {
    html += '<div class="checkbox">' +
              '<label><input type="checkbox" class="chk-stations" value="'+ stations[s] +'">'+ stations[s] +'</label>' +
            '</div>';
  }
  $('#filterobservations').attr('data-content',html);
}



function createToolTipHTML(windspeed,winddir) {
  return '<div style="padding:5px 5px 5px 5px;">' +
          '<img src="images/wind.png" style="-webkit-transform:rotate('+winddir+'deg);height:20px" /><p>' +
          '<b>' + windspeedToText(windspeed) + '</b> (' + windspeed + ' m/s)<br>' +
          ' fra <b>' + winddirToText(winddir)[0] + '.</b></p>' +
         '</div>'
}

function winddirToText(winddir) {
  if (winddir>=348.75 || winddir < 11.25) {return ['nord','n']};
  if (winddir>=11.25 && winddir < 33.75) {return ['nord-nordøst','nnø']};
  if (winddir>=33.75 && winddir < 56.25) {return ['nordøst','nø']};
  if (winddir>=56.25 && winddir < 78.75) {return ['øst-nordøst','ønø']};
  if (winddir>=78.75 && winddir < 101.25) {return ['øst','ø']};
  if (winddir>=101.25 && winddir < 123.75) {return ['øst-sørøst','øsø']};
  if (winddir>=123.75 && winddir < 146.25) {return ['sørøst','sø']};
  if (winddir>=146.25 && winddir < 168.75) {return ['sør-sørøst','ssø']};
  if (winddir>=168.75 && winddir < 191.25) {return ['sør','s']};
  if (winddir>=191.25 && winddir < 213.75) {return ['sør-sørvest','ssv']};
  if (winddir>=213.75 && winddir < 236.25) {return ['sørvest','sv']};
  if (winddir>=236.25 && winddir < 258.75) {return ['vest-sørvest','vsv']};
  if (winddir>=258.75 && winddir < 281.25) {return ['vest','v']};
  if (winddir>=281.25 && winddir < 303.75) {return ['vest-nordvest','vnv']};
  if (winddir>=303.75 && winddir < 326.25) {return ['nordvest','nv']};
  if (winddir>=326.25 && winddir < 348.75) {return ['nord-nordvest','nnv']}
  else {return 'Ukjent'};
}

function windspeedToText(windspeed) {
  if (windspeed>=0 && windspeed < 0.2) {return 'Stille'};
  if (windspeed>=0.2 && windspeed < 1.5) {return 'Flau vind'};
  if (windspeed>=1.5 && windspeed < 3.3) {return 'Svak vind'};
  if (windspeed>=3.3 && windspeed < 5.4) {return 'Lett bris'};
  if (windspeed>=5.4 && windspeed < 7.9) {return 'Laber bris'};
  if (windspeed>=7.9 && windspeed < 10.7) {return 'Frisk bris'};
  if (windspeed>=10.7 && windspeed < 13.8) {return 'Liten kuling'};
  if (windspeed>=13.8 && windspeed < 17.1) {return 'Stiv kuling'};
  if (windspeed>=17.1 && windspeed < 20.7) {return 'Sterk kuling'};
  if (windspeed>=20.7 && windspeed < 24.4) {return 'Liten storm'};
  if (windspeed>=24.4 && windspeed < 28.4) {return 'Full storm'};
  if (windspeed>=28.4 && windspeed < 32.6) {return 'Sterk storm'};
  if (windspeed>=32.6) {return 'Orkan'};
}
  
