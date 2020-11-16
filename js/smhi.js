function displayObservationsSMHI(response){
  var observations = [[
    {label:'Tid',id:'Tid',type:'datetime'},
    'Høyde',
    {label:'Bølgeretning',type:'string',role:'tooltip',p: {'html': true}}, //Tooltip
    {label:'Vindretning',type:'string',role:'annotation'}, //Annotation
    'Makshøyde','Varsel',
    {id:'wh', type:'number', role:'interval'}, 
    {id:'wh', type:'number', role:'interval'},   
    'Periode',
    {id:'wp', type:'number', role:'interval'},
    {id:'wp', type:'number', role:'interval'}
  ]];

for (var i in response) {
  observations.push([
  moment(response[i]['obstime']).toDate(),
  response[i]['waveheight'],
  waveToolTip(response[i]['waveheight'],response[i]['waveperiod'],response[i]['wavedir']),
  response[i]['waveheight'] + ' ' + winddirToText(response[i]['wavedir'])[1], 
  response[i]['waveheightmax'],
  response[i]['waveheightforecast'],
  SMHIstats['Saltstein'][2]['avg(waveheight)'] - SMHIstats['Saltstein'][2]['std(waveheight)'],
  SMHIstats['Saltstein'][2]['avg(waveheight)'] + SMHIstats['Saltstein'][2]['std(waveheight)'],
  response[i]['waveperiod'],
  SMHIstats['Saltstein'][2]['avg(waveperiod)'] - SMHIstats['Saltstein'][2]['std(waveperiod)'],
  SMHIstats['Saltstein'][2]['avg(waveperiod)'] + SMHIstats['Saltstein'][2]['std(waveperiod)']
  ]);
}


  var chartwidth = screen.width;
    if (screen.width < 800) {
        chartwidth = 1000;
    };
  var obsTab = google.visualization.arrayToDataTable(observations,false);
  var obsOptions = {
                    width:chartwidth,
                    height:540,
                    series: {
                      0: { color: 'blue' }, //Waveheight
                      1: { color: 'red' }, //Waveheight max
                    
                      2: { color: 'blue', //Waveheight forecast
                           lineDashStyle: [5, 5] }, 
                      3: { color:'green' }//Wave period
                    },
                    annotations: {
                      textStyle: {
                        fontSize: 10,
                        bold: true
                      }
                    },
                    chartArea: {
                      width: '90%',
                      height: '80%'
                    },
                    legend: {position: 'top'},
                    curveType: 'function', 
                    tooltip: { isHtml: true },
                    intervals: {style: 'area'}
                  };

  var obsChart = new google.visualization.LineChart(document.getElementById('smhi-today'));
  obsChart.draw(obsTab, obsOptions);
}

function waveToolTip(waveheight,waveperiod, wavedir) {
  return '<div style="padding:5px 5px 5px 5px;">' +
          '<b>Bølger</b><p>' +
          '<img src="images/wind.png" style="-webkit-transform:rotate('+wavedir+'deg);height:20px" /><p>' +
          '<b>' + waveheight + ' m</b> (' + waveperiod + ' s)<br>' +
          ' fra <b>' + winddirToText(wavedir)[0] + '.</b></p>' +
         '</div>'
}