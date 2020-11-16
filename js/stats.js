function getUserStats() {
  getReportsStatsUser(user.id); //Get and display stats for a user
}

function displayUserStats(statistics) {
  let sessions = 0;
  let scores = statistics[0].scorecount;
  let months = statistics[0].monthcount;
  let reports = statistics[0].reports[0];
  let srows = [];
  let mrows = [];
  let thtml = createTabHTML('stats','BRUKER','keynumbers','active');
  let sthtml = createTabHTML('scores','ØKTER PR SCORE','scorechart2');
  let mthtml = createTabHTML('months','ØKTER PR MÅNED','monthchart');
  let sdata = new google.visualization.DataTable();
  let mdata = new google.visualization.DataTable();
  let html = '<ul class="nav nav-tabs">' +
              '<li class="active"><a data-toggle="tab" href="#stats">Bruker</a></li>' +
              '<li><a data-toggle="tab" href="#scores">Score</a></li>' +
              '<li><a data-toggle="tab" href="#months">Måned</a></li>' +
             '</ul>' +
             '<div class="tab-content">' + thtml + sthtml + mthtml + '</div>';

  htmlModal('modal-user','s-modal-user','Statistikk',html);  //Create html to host the graphics

  sdata.addColumn('string', 'Score');
  sdata.addColumn('number', 'Antall økter');
  mdata.addColumn('string', 'Måned');
  mdata.addColumn('number', '2017');
  var startyear = '2017';
  var currentyear = '2017';
  var years = 1;

  for (var s in scores) {
      srows.push([scoreLabels[scores[s].score],scores[s]["count(*)"]]);
      sessions += scores[s]["count(*)"];
  }

  var prmonth = {};
  var years = 1;

  for (var m in months) {
      if (String(months[m]["YEAR(reporttime)"]) != currentyear) {
          mdata.addColumn('number', String(months[m]["YEAR(reporttime)"])); //Add column pr year
          currentyear = String(months[m]["YEAR(reporttime)"]);
          years++; //Count number of years
      } 

      if (prmonth[months[m]["MONTH(reporttime)"]-1]) { //Month already present
          prmonth[months[m]["MONTH(reporttime)"]-1].push(months[m]["count(*)"]); 
      } else { // add new month
          if (String(months[m]["YEAR(reporttime)"]) != startyear) {
              prmonth[months[m]["MONTH(reporttime)"]-1] = [moment(months[m]["MONTH(reporttime)"],'M').format('MMM'),0,months[m]["count(*)"]]; 
          } else {
              prmonth[months[m]["MONTH(reporttime)"]-1] = [moment(months[m]["MONTH(reporttime)"],'M').format('MMM'),months[m]["count(*)"]]; 
          }
      }
  }

  
  for (var pm in prmonth) {
  
      if (prmonth[pm].length < years + 1) {
          prmonth[pm].push(0);
      }
      mrows.push(prmonth[pm])
  }
  
  sdata.addRows(srows);
  mdata.addRows(mrows);
  
  var soptions = {'height':250,
                 colors: ['#ff9933', '#ff0000', '#33cc33', '#009900']};
  var moptions = {'height':250};

  var schart = new google.visualization.PieChart(document.getElementById('scorechart2'));
      schart.draw(sdata, soptions);

  var mchart = new google.visualization.ColumnChart(document.getElementById('monthchart'));
      mchart.draw(mdata, moptions);

  var keyhtml = '<div class="row"><div class="col-sm-4">'+
                '<img src="http://graph.facebook.com/'+user.id+'/picture?type=normal" class="img-circle">' +
                '<b>'+user.name+'</b></div>' +
                '<div class="col-sm-8">' +
                'Antall økter i vannet: <b>'+sessions+'</b><br>' + 
                'Gjennomsnittslengde på øktene: <b>'+reports["avg(duration)"]+'</b><br>' +
                'Totalt antall timer i vannet: <b>'+reports["sum(duration)"]+'</b></div></div>';
  $('#keynumbers').html(keyhtml);
  $('#modal-user').modal('show');
}

function createTabHTML(divid,title,contentid,active = '') {
  let html = '<div id="'+divid+'" class="tab-pane fade in '+active+'">' +
              '<h4>'+title+'</h4>' +
              '<div id="'+contentid+'"></div>' +
             '</div>';
  return html
}

function displayLocation(statistics, spot){
  let bestTide = '';
  let bestTideCount = 0;
  let sessions = 0;
  let scores = statistics[0].scorecount;
  let tides = statistics[0].tidecount;
  let reports = statistics[0].reports[0];
  let srows = [];
  let sdata = new google.visualization.DataTable();
  let thtml = createTabHTML('spot','SPOT','spotnumbers','active');
  let sthtml = createTabHTML('spotscores','ØKTER PR SCORE','spotscorechart');
  let html = '<ul class="nav nav-tabs">' +
              '<li class="active"><a data-toggle="tab" href="#spot">Spot</a></li>' +
              '<li><a data-toggle="tab" href="#spotscores">Score</a></li>'; 


  if (spot == 'Saltstein' || spot =='Esso') {
      let dmihtml = createTabHTML('dmi','DMI-VARSEL PR SCORE','dmitab');
      let bwhtml = createTabHTML('bw','BW-VARSEL PR SCORE','bwtab');
      let smhihtml = createTabHTML('smhi','SMHI-OBSERVASJONER PR SCORE','smhitab');
      html += '<li><a data-toggle="tab" href="#dmi">DMI</a></li>' +
              '<li><a data-toggle="tab" href="#bw">BW</a></li>' + 
              '<li><a data-toggle="tab" href="#smhi">SMHI</a></li>' + 
              '</ul><div class="tab-content">' + thtml + sthtml + dmihtml + bwhtml + smhihtml +'</div>';
  } else {
      html += '</ul><div class="tab-content">' + thtml + sthtml + '</div>';
  } 

  //Create html to host the graphics
  htmlModal('modal-spot','s-modal-spot','Statistikk',html);

  sdata.addColumn('string', 'Score');
  sdata.addColumn('number', 'Antall økter');

  for (var s in scores) {
      srows.push([scoreLabels[scores[s].score],scores[s]["count(*)"]]);
      sessions += scores[s]["count(*)"];
  }
  sdata.addRows(srows);

  var soptions = {'width':350,
                  'height':250,
                  colors: ['#ff9933', '#ff0000', '#33cc33', '#009900']};

  var schart = new google.visualization.PieChart(document.getElementById('spotscorechart'));
      schart.draw(sdata, soptions);

  //Find best tide
  for (var j in tides) {
      if(tides[j]["count(*)"] > bestTideCount) {
          bestTideCount = tides[j]["count(*)"];
          bestTide = tides[j].tide;
      }
  }
  
  var keyhtml = '<div class="row"><div class="col-sm-4">'+
                '<img height="100px" src="images/location-pin.png"><br>' +
                '<a href="http://geodata.maps.arcgis.com/apps/webappviewer/index.html?id=d4786d371cd840d0927cdba5c41dd6f0&find='+spot+'" target="_blank"><b>'+spot+'</b></a></div>' +
                '<div class="col-sm-8">' +
                'Antall økter: <b>'+sessions+'</b><br>' + 
                'Beste tidevann: <img height="15px" src="images/'+tideImages[bestTide]+'.png"><br>' +
                'Gjennomsnittslengde på øktene: <b>'+reports["avg(`duration`)"]+'</b><br>' +
                'Totalt antall timer i vannet: <b>'+reports["sum(`duration`)"]+'</b></div></div>';
  $('#spotnumbers').html(keyhtml);
 
  //Create table from dmi forecast statistics
  let tabhtml = '<table class="table"><tr><td></td><td colspan="2">Bølger</td><td colspan="2">Dønning</td><td></td></tr>' +
                '<tr><td>Score</td><td>Høyde</td><td>Periode</td><td>Høyde</td><td>Periode</td><td>Vind</td></tr><tr>';
 
  var forecasts = DMIstats[spot]; 

  for (var f in forecasts ) {
      tabhtml += "<td><span class='label label-default'>" + scoreLabels[forecasts[f].score] + "</span></td>" +
                 "<td><b>" + Math.round(forecasts[f]["avg(waveheight)"]*10)/10 + "m</b> (" + 
                 Math.round(forecasts[f]["avg(swaveheight)"]*10)/10 + "m) </b></td>" +
                 "<td><b>" + Math.round(forecasts[f]["avg(waveperiod)"]*10)/10 +"s </b> (" +
                 Math.round(forecasts[f]["avg(swaveperiod)"]*10)/10 +"s) </td>" +
                 "<td><b>" + Math.round(forecasts[f]["avg(swellheight)"]*10)/10 +"m </b> (" +
                 Math.round(forecasts[f]["avg(sswellheight)"]*10)/10 +"m) </td>" +
                 "<td><b>" + Math.round(forecasts[f]["avg(swellperiod)"]*10)/10 +"s </b> (" +
                 Math.round(forecasts[f]["avg(sswellperiod)"]*10)/10 +"s) </b></td>" +
                 "<td><b>" + Math.round(forecasts[f]["avg(wind)"]*10)/10 +"m/s </b> (" +
                 Math.round(forecasts[f]["avg(swind)"]*10)/10 +"m/s) </td></tr>"
  }
  
  tabhtml += '</table>';
  $('#dmitab').html(tabhtml);

  //Create table from bw forecast statistics
  let bwtabhtml = '<table class="table"><tr>Score<td></td><td>Bølgehøyde</td><td>Maks bølgehøyde</td><td>Bølgeperiode</td><td>Bølgeretning</td></tr>';

  forecasts = BWstats[spot]; 

  for (var f in forecasts ) {
      bwtabhtml += "<tr><td><span class='label label-default'>" + scoreLabels[forecasts[f].score] + "</span></td>" +
      "<td><b>" + Math.round(forecasts[f]["avg(waveheight)"]*10)/10 + "m</b> (" + 
      Math.round(forecasts[f]["min(waveheight)"]*10)/10 + "m - " +
      Math.round(forecasts[f]["max(waveheight)"]*10)/10 + "m) </b></td>" +
      "<td><b>" + Math.round(forecasts[f]["avg(waveheightmax)"]*10)/10 +"m </b> (" +
      Math.round(forecasts[f]["min(waveheightmax)"]*10)/10 +"m - " +
      Math.round(forecasts[f]["max(waveheightmax)"]*10)/10 + "m) </td>" +
      "<td><b>" + Math.round(forecasts[f]["avg(waveperiod)"]*10)/10 +"s </b> (" +
      Math.round(forecasts[f]["min(waveperiod)"]*10)/10 +"s - " +
      Math.round(forecasts[f]["max(waveperiod)"]*10)/10 +"s) </td>" +
      "<td><b>" + Math.round(forecasts[f]["avg(winddir)"]*10)/10 +" </b> (" +
      Math.round(forecasts[f]["min(winddir)"]*10)/10 + " - " +
      Math.round(forecasts[f]["max(winddir)"]*10)/10 +") </b></td></tr>" 
  }

  bwtabhtml += '</table>';
  $('#bwtab').html(bwtabhtml);

  //Create table from bw forecast statistics
  let smhitabhtml = '<table class="table"><tr>Score<td></td><td>Bølgehøyde</td><td>Maks bølgehøyde</td><td>Varslet bølgehøyde</td><td>Bølgeperiode</td><td>Bølgeretning</td></tr>';

  forecasts = SMHIstats[spot]; 

  for (var f in forecasts ) {
      smhitabhtml += "<tr><td><span class='label label-default'>" + scoreLabels[forecasts[f].score] + "</span></td>" +
      "<td><b>" + Math.round(forecasts[f]["avg(waveheight)"]*10)/10 + "m</b> (" + 
      Math.round(forecasts[f]["min(waveheight)"]*10)/10 + "m - " +
      Math.round(forecasts[f]["max(waveheight)"]*10)/10 + "m) </b></td>" +
      "<td><b>" + Math.round(forecasts[f]["avg(waveheightmax)"]*10)/10 +"m </b> (" +
      Math.round(forecasts[f]["min(waveheightmax)"]*10)/10 +"m - " +
      Math.round(forecasts[f]["max(waveheightmax)"]*10)/10 + "m) </td>" +
      "<td><b>" + Math.round(forecasts[f]["avg(waveheightforecast)"]*10)/10 +"m </b> (" +
      Math.round(forecasts[f]["min(waveheightforecast)"]*10)/10 +"m - " +
      Math.round(forecasts[f]["max(waveheightforecast)"]*10)/10 + "m) </td>" +
      "<td><b>" + Math.round(forecasts[f]["avg(waveperiod)"]*10)/10 +"s </b> (" +
      Math.round(forecasts[f]["min(waveperiod)"]*10)/10 +"s - " +
      Math.round(forecasts[f]["max(waveperiod)"]*10)/10 +"s) </td>" +
      "<td><b>" + Math.round(forecasts[f]["avg(wavedir)"]*10)/10 +" </b> (" +
      Math.round(forecasts[f]["min(wavedir)"]*10)/10 + " - " +
      Math.round(forecasts[f]["max(wavedir)"]*10)/10 +") </b></td></tr>" 
  }

  smhitabhtml += '</table>';
  $('#smhitab').html(smhitabhtml);

  $('#modal-spot').modal('show');
}

function drawScoreChart(scores, chartid) {
  var sessions = 0;
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Score');
  data.addColumn('number', 'Antall');
  
  var rows = [];

  for (var s in scores) {
      rows.push([scoreLabels[scores[s].score],scores[s]["count(*)"]]);
      sessions += scores[s]["count(*)"];
  }
  data.addRows(rows);

  var options = {'width':350,
                 'height':250,
                 colors: ['#ff9933', '#ff0000', '#33cc33', '#009900']};

  var chart = new google.visualization.PieChart(document.getElementById(chartid));
      chart.draw(data, options);

  return sessions;
}
