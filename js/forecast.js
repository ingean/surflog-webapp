function createTable(fc, fc2,  stations = '', suffix = '') {
  let table = [];
  let headers = [];
  let colspan = 24 - Number(moment(fc[0].localtime).format('HH')); //Timesteps in first day 
 // let names = ['Ekofisk', 'Torungen', 'Fugløya', 'Svenner', 'Færder', 'Gullholmen', 'Väderöerna', 'Nordkoster'];
  //stations = ['SN76920:0', 'SN36200:0', 'Fugløya', 'SN29950:0', 'SN27500:0', 'SN17280:0', 'SN250100:0', 'SN250000:0'];
  let names = ['Ekofisk', 'Torungen', 'Fugløya', 'Svenner', 'Færder', 'Gullholmen'];
  stations = ['SN76920:0', 'SN36200:0', 'Fugløya', 'SN29950:0', 'SN27500:0', 'SN17280:0'];

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

function formatForecast(data, stats, type, scope) {
  var min = stats['min(' + type + ')'];
  var avg = stats['avg(' + type + ')'];
  var std = stats['std(' + type + ')'];
  var tdclass = "td-flat";

  if (data === null) {
    tdclass = "td-null";
    data = '';
  } else if(data >= avg + std) {
    tdclass = "td-max";
  } else if(data >= avg) {
    tdclass = "td-avg";
  } else if(data >= avg - std) {
    tdclass = "td-std";
  } else if(data >= min) {
    tdclass = "td-min";
  } else {
    tdclass = "td-flat";
  }
  return '<td class="' + tdclass + scope + '">' + data +'</td>';
}

function formatWindDir(winddir, speed, location, scope) {  
  if (typeof winddir !== 'undefined' && winddir != null) {
    var dirtext = directionToText(winddir);
    var tdclass = windTDClass(speed,winddir,location);

    return '<td class="' + tdclass + '">' +
           '<img src="images/arrows/' + dirtext + '.png"></td>';
  } else {
    return '<td class="td-val td-null' + scope + '"></td>';
  }
}

function formatWaveDir(wavedir, location, scope) {  
  if (typeof wavedir !== 'undefined' && wavedir != null) {
    var dirtext = directionToText(wavedir);
    var dirScore = winddirScore(wavedir,"saltstein", "fetch");
    var tdclass = 'td-null';

    if(dirScore != 'ukjent') {
      tdclass =  waveDirScores[dirScore].tdclass;
    } 

    return '<td class="' + tdclass + '">' +
           '<img src="images/arrows/' + dirtext + '.png"></td>';
  } else {
    return '<td class="td-null' + scope + '"></td>';
  }
}

function formatWindObs(speed, winddir, location, scope) {
  if (typeof speed !== 'undefined' && winddir != null) {
    var tdclass = windTDClass(speed, winddir, location);
    return '<td class="' + tdclass + '">' + speed +'</td>';
  } else if (typeof spped !== 'undefined') {
    return '<td class="td-val td-ukjent">' + speed +'</td>';
  } else {
    return '<td class="td-val td-null' + scope + '"></td>';
  }
}

function windTDClass(speed, dir, location) {
  //var dirScore = winddirScore(dir,location);
  //var dirScore = winddirScore(dir,"saltstein", "fetch");
  var dirScore = winddirScore(dir,"saltstein", locations[location].class);
  var speedScore = windspeedScore(speed,location);

  if(dirScore != 'ukjent' && speedScore != 'ukjent') {
    return 'td-val ' + windScores[dirScore + speedScore].tdclass;
  } else {
    return 'td-val td-ukjent';
  }
}

function formatScore(data, scope) {
  var tdclasses = ['td-flat','td-min','td-std','td-avg','td-avg','td-max'];
  var tdclass = tdclasses[data];
  return '<td class="' + tdclass + scope + '"></td>';
}

function formatSurfable(data, scope) {
  var tdclass = '';
  if(data == 0) {tdclass = "td-flat";} else {tdclass = "td-avg";}
    return '<td class="' + tdclass + scope + '"></td>';
}

function formatHours(data) {
  var hours = moment(data).format('HH')
  return '<td class="td-time">' + hours + '</td>';
}

function formatWeekDay(data, timestep, colspan) {
  var weekday = moment(data).format('dddd');
  
  if(timestep == 0) {
    return '<td class="td-time" colspan="' + colspan + '">' + weekday + '</td>';
  } else if (timestep == colspan + 96) {
    return '<td class="td-time" colspan="12">' + weekday + '</td>';
  } else if (timestep == colspan || timestep == colspan + 24 || timestep == colspan + 48 || timestep == colspan + 72) {
    return '<td class="td-time" colspan="24">' + weekday + '</td>';
  } else {
    return '';
  } 
}

function getScope(timestep) {
  var hr = Number(moment(timestep).format('HH'));
  var last = Number(moment(sunTimes.last,'HH:mm').format('HH'));
  var first = Number(moment(sunTimes.first,'HH:mm').format('HH'));
  if(moment(timestep).isBefore(moment()) || (hr >= last && hr <= 23) || (hr >= 00 && hr <= first) ) {
    return ' td-disabled';
  } else {
    return '';
  }
}

function createChartsDMI(fc, spot = 'Saltstein', chartIdsuffix = '') {
  const params = ['waveheight', 'waveperiod', 'swellheight', 'swellperiod', 'score'];
  
  for (var i = 0; i < params.length; i++) {
    createChart(fc, 'dmi', params[i], spot, chartIdsuffix);
  }
}

function createChart(fc, source, param = 'waveheight', spot = 'Saltstein', chartIdsuffix = '') { 
  let table = [];
  table.push(createHeader(source, param))
  
  for (var i = 0; i < fc.length; i++) {

    if (source === 'dmi' && param === 'waveheight') {
      fc[i]['points'] = calcScore(reformatDMI(fc[i]), spot);
    }
    table.push(createRow(fc[i], source, param, getStats(spot, source)))
  }

  let date_formatter = new google.visualization.DateFormat({ 
    pattern: "EEEE HH:mm"
  });

  if (screen.width > 800) {gFCOptions.defaults.width = screen.width };
  
  let dtable = google.visualization.arrayToDataTable(table,false);
  date_formatter.format(dtable, 0);
  
  let options = JSON.parse(JSON.stringify(gFCOptions.defaults));
  options = overrideDefaultOptions(options, gFCOptions[param][source]);
  
  let chart;
  let e = document.getElementById(insertHTMLElem(param, source, chartIdsuffix));
  if (param === 'score') {
    chart = new google.visualization.ComboChart(e);  
  } else {
    chart = new google.visualization.LineChart(e);
  }
  chart.draw(dtable, options);
}

function overrideDefaultOptions(options, overrides) {
  try {
    let keys = Object.keys(overrides)

    for (var i = 0; i < keys.length; i++) {
      options[keys[i]] = overrides[keys[i]];
    }
    return options;
  }
  catch (e) {
    return options;
  }
}

function insertHTMLElem(param, prefix, suffix, operation = 'add') {
  let html = '';
  if (operation === 'add' ) {
    html = $('#interpretcontainer' + suffix).html();
  }
  
  let elementId = `${prefix}_${param}${suffix}`;
  html += `<span id="${elementId}"></span>`;
  $('#interpretcontainer' + suffix).html(html);
  return elementId;
}

function getStats(spot, source) {
  try {
    return gFCStats[spot][source][0];
  }
  catch (e) {
    return gFCStats['Saltstein']['dmi'][0];
  }
}

function createHeader(source, param) {
  switch (source) {
    case 'dmi':
      if (param === 'score') {
        return scoreHeader();
      } else {
        return defaultHeader();
      }
    case 'smhi': 
      return smhiHeader();
    case 'frost': 
      return frostHeader();
    case 'yr':
      return yrHeader();
    default:
      return defaultHeader();
  }
}

function createRow(row, source, param, stats) {
  switch(source) {
    case 'dmi':
      if (param === 'score') {
        return scoreRow(row)
      } else {
        return defaultRow(row, param, stats);  
      }
    case 'smhi':
      return smhiRow(row, stats);
    case 'frost': 
      return frostRow(row, stats);
    case 'yr': 
      return yrRow(row, stats);
    default:
      return defaultRow(row, param, stats);
  }
}

function defaultHeader() {
  return [
    {label:'Tid', type:'datetime'},
    {label: 'Oslofjorden', type: 'number'},
    {id:'scope1', role:'scope'},
    {id:'emphasis1', role:'emphasis'},
    {type:'string', role:'annotation'},
    {type:'string', role:'tooltip', p: {'html': true}},
    {id:'DMI_snitt', type:'number', role:'interval'},
    {id:'DMI_snitt', type:'number', role:'interval'},
    {label: 'Skagerak', type: 'number'},
    {id:'scope1', role:'scope'},
    {type:'string', role:'tooltip', p: {'html': true}}
  ];
}

function defaultRow(row, param, stats) {
  let time = row['localtime'];
  let value1 = row['stations']['Saltstein'][param];
  let value2 = row['stations']['Skagerak'][param];
  return [
    moment(time).toDate(),
    value1,
    calcScope(time),
    calcEmphasis(time),
    create_annotation(time, value1, gUnits[param], false),
    createTooltip(value1, param, stats, gUnits[param]),
    stats[`avg(${param})`] - stats[`std(${param})`],
    stats[`avg(${param})`] + stats[`std(${param})`],
    value2,
    calcScope(time),
    createTooltip(value2,`s${param}`, stats, gUnits[param])
  ];
}

function scoreHeader() {
  return [
    {label:'Tid',id:'Tid',type:'datetime'},
    {label: 'Flatt', type: 'number'},
    {label: 'Despo', type: 'number'},
    {label: 'Dårlig', type: 'number'},
    {label: 'Ok', type: 'number'},
    {label: 'Bra', type: 'number'},
    {label: 'Episk', type: 'number'},
    {label: 'Poeng', type: 'number'},
    {type:'string', role:'annotation'}
  ];
}

function scoreRow(row){
  var time = [moment(row['localtime']).toDate(),"1"];
  var score = row['score']['score'];
  var result = [];
  if(score === 0) {result = time.concat(["0","0","0","0","0"])};
  if(score === 1) {result = time.concat(["1","0","0","0","0"])};
  if(score === 2) {result = time.concat(["1","1","0","0","0"])};
  if(score === 3) {result = time.concat(["1","1","1","0","0"])};
  if(score === 4) {result = time.concat(["1","1","1","1","0"])};
  if(score === 5) {result = time.concat(["1","1","1","1","1"])};  
  var points = row['points']['points'] / 10;
  points = points.toFixed(1);
  //points -= 1; //Calibrate to approx. score scale
  
  result = result.concat([points,
    create_annotation(
      row['localtime'],
      row['points']['points'],
      '',
      row['points']
    )
  ])

  return result;
}

function smhiHeader(){
  return [
    {label:'Tid',id:'Tid',type:'datetime'},
    {label: 'Varsel', type: 'number'},
    {id:'scope1',role:'scope'},
    {id:'emphasis1',role:'emphasis'},
    {type:'string', role:'tooltip', p: {'html': true}},
    {id:'SMHI_snitt', type:'number', role:'interval'}, 
    {id:'SMHI_snitt', type:'number', role:'interval'},
    {label: 'Observasjon', type: 'number'},
    {label:'Retning og periode',type:'string',role:'annotation'},
    {label:'Retning og periode',type:'string',role:'tooltip',p: {'html': true}},
    {label: 'Makshøyde', type: 'number'},
    {type:'string', role:'tooltip', p: {'html': true}}
  ];
}

function smhiRow(row, stats){
  let time = row['localtime'];
  let fc = row['stations']['Väderöerna']['waveheightforecast'];
  let obs = row['stations']['Väderöerna']['waveheight'];
  let p = row['stations']['Väderöerna']['waveperiod'];
  let dir = row['stations']['Väderöerna']['wavedir'];
  let max = row['stations']['Väderöerna']['waveheightmax'];
  return [
    moment(time).toDate(),
    fc,
    calcScope(time),
    calcEmphasis(time),
    createTooltip(fc, 'waveheight', stats, gUnits['waveheight']),
    stats['avg(waveheight)'] - stats['std(waveheight)'],
    stats['avg(waveheight)'] + stats['std(waveheight)'],
    obs,
    create_annotation(time, p + ' ' + directionToText(dir), '', false),
    createTooltip(obs, 'waveheight', stats, gUnits['waveheight']),
    0, // Dummy value as placeholder for max waveheight tooltip
    createTooltip(max, 'waveheightmax', stats, gUnits['waveheightmax'])
  ];
}

function yrHeader() {
  let stations = ['Skagerak', 'Saltstein', 'Oslofjorden'];
  let c = [{label:'Tid', type:'datetime'}];
  
  for (var i = 0; i < stations.length; i++) {
    c.push({label: stations[i], type: 'number'});
    c.push({type: 'string', role: 'style'});
    c.push({label:'Høyde og retning',type:'string',role:'annotation'});
    c.push({label:'Høyde og retning',type:'string',role:'tooltip',p: {'html': true}});
  }
  return c;
}

function yrRow(row, stats) {
  let time = row['localtime'];
  let c = [moment(time).toDate()];
  let stations = ['Skagerak', 'Saltstein', 'Oslofjorden'];

  for (var i = 0; i < stations.length; i++) {
    let w = row['stations'][stations[i]]['waveheight'];
    let d =  row['stations'][stations[i]]['wavedir']
    
    c.push(w);
    c.push(`point {shape-type: triangle; shape-rotation: ${d}; }`);
    c.push(create_annotation(time, w + ' ' + directionToText(d), '', false));
    c.push(createTooltip(w, 'waveheight', stats, gUnits['waveheight']));
  }
  return c;
}

function frostHeader() {
  let stations = ['Ekofisk', 'Torungen', 'Jomfruland', 'Svenner', 'Færder'];
  let c = [{label:'Tid', type:'datetime'}];
  
  for (var i = 0; i < stations.length; i++) {
    c.push({label: stations[i], type: 'number'});
    c.push({type: 'string', role: 'style'});
    c.push({label:'Styrke og retning',type:'string',role:'annotation'});
    c.push({label:'Styrke og retning',type:'string',role:'tooltip',p: {'html': true}});
  }
  return c;
}

function frostRow(row, stats) {
  let time = row['localtime'];
  let c = [moment(time).toDate()];
  //let stations = Object.keys(row['stations']);
  let stations = ['SN76920:0', 'SN36200:0', 'SN34130:0', 'SN29950:0', 'SN27500:0'];

  for (var i = 0; i < stations.length; i++) {
    let w = row['stations'][stations[i]]['wind'];
    let d =  row['stations'][stations[i]]['winddir']
    
    c.push(w);
    c.push(`point {shape-type: triangle; shape-rotation: ${d}; }`);
    c.push(create_annotation(time, w + ' ' + directionToText(d), '', false));
    c.push(createTooltip(w, 'wind', stats, gUnits['wind']));
  }
  return c;
}

function createHeaderPoints(){
  return [
    {label:'Tid',id:'Tid',type:'datetime'},
    'Flatt', 'Despo', 'Dårlig', 'Bra', 'Episk', 'Score',
    {type:'string', role:'annotation'}
  ];
}

function createRowPoints(row){
  return [
    moment(row['localtime']).toDate(),
    17,9,9,11,7,row['points']['points'],
    create_annotation(row['localtime'],
                      row['points']['points'],
                      '',
                      row['points'])
  ];
}

function create_annotation(timestamp,value,unit,points) {
  var hr = moment(timestamp).format('HH');
  if (hr == '00' || hr == '06' || hr == '12' || hr == '18') {
    if (points) {
        return points.label.substring(
          points.label.indexOf(">") + 1, 
          points.label.indexOf("<",points.label.indexOf(">") + 1));
    } else {
      return String(value) + unit;
    }
  } else {
      return undefined;
  }
}

function waveToolTip(waveheight,waveperiod, wavedir) {
  return '<div style="padding:5px 5px 5px 5px;">' +
          '<b>Bølger</b><p>' +
          '<img src="images/wind.png" style="-webkit-transform:rotate('+wavedir+'deg);height:20px" /><p>' +
          '<b>' + waveheight + ' m</b> (' + waveperiod + ' s)<br>' +
          ' fra <b>' + directionToLongText(wavedir) + '.</b></p>' +
         '</div>'
}

function createTooltip(value, parameter, stats, unit = 'm',) {
  return '<div style="padding:5px 5px 5px 5px;width:150px;height:25px;font-size:18px">' +
          createValueDisplay(value, parameter, stats, unit) + '<br>' + 
         '</div>'
}

function createScoreTooltip(score,points) {
  return '<div style="padding:5px 5px 5px 5px;width:150px;height:25px;font-size:18px">' +
    '<span class="label label-'+SCORING['labels'][score]['badge']+'">'+SCORING['labels'][score]['name']+'</span>' +
    points.labelsmall;
}

function createValueDisplay(value, parameter, stats, unit) {
  var min = stats['min(' + parameter + ')'];
  var avg = stats['avg(' + parameter + ')'];
  var std = stats['std(' + parameter + ')'];
  var label = 'danger';

  if (value === null) {
    label = 'default'
    value = '----';
    unit = '';
  } else if(value >= avg) {
    label = 'success';
  } else if(value >= avg - std) {
    label = 'info';
  } else if(value >= min) {
    label = 'warning';
  } else {
    label = 'danger';
  }

  min = min.toFixed(1);
  avgstd = avg - std;
  avgstd = avgstd.toFixed(1);
  avg = avg.toFixed(1);

  return '<span class="label label-' + label + '">' + value + unit + '</span>' +
    ' <span style="font-size:12px;font-weight:bold;color:#f0ad4e">' + min + '</span> ' +
    '<span style="font-size:12px;font-weight:bold;color:#5bc0de">' + avgstd + '</span> ' +
    '<span style="font-size:12px;font-weight:bold;color:#5cb85c">' + avg + '</span>';
}

function reformatDMI(row) {
  var old = {};
  old['waveheight'] = row['stations']['Saltstein']['waveheight'];
  old['swaveheight'] = row['stations']['Skagerak']['waveheight'];
  old['waveperiod'] = row['stations']['Saltstein']['waveperiod'];
  old['swaveperiod'] = row['stations']['Skagerak']['waveperiod'];
  old['swellheight'] = row['stations']['Saltstein']['swellheight'];
  old['sswellheight'] = row['stations']['Skagerak']['swellheight'];
  old['swellperiod'] = row['stations']['Saltstein']['swellperiod'];
  old['sswellperiod'] = row['stations']['Skagerak']['swellperiod'];
  old['wind'] = row['stations']['Saltstein']['wind'];
  old['swind'] = row['stations']['Skagerak']['wind'];
  return old;
}

function directionToText(winddir) {
  return findCategory(winddir, directionSectors, "type");
}

function directionToLongText(winddir) {
  return findCategory(winddir, directionSectors, "label");
}

function winddirScore(winddir,spot, key) {
  return findCategory(winddir,locationSectors[spot], key);
}

function windspeedScore(speed,spot) {
  var cls = locations[spot].class;
  return findCategory(speed,windspeedCategories, cls);
}

function findCategory(value,arr,label) {
  for(var i = 0; i < arr.length; i++) {
    if(value >= arr[i].low && value <= arr[i].high) {
      return arr[i][label]
    }
  }
  return 'ukjent';
}

function windspeedToText(speed) {
  return findCategory(speed,windspeedCategories, "label");
}

function calcScope(timestamp) {
 return moment(timestamp).isAfter(moment()); 
}

function calcEmphasis(timestamp) {
  return moment(timestamp).isSameOrAfter(moment()) && moment(timestamp).isBefore(moment().add(12,'h')); 
}