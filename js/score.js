function calcScore(forecast,spot) {
  var pointsWaveheight = findScore(forecast,'waveheight');
  var pointsWaveperiod = findScore(forecast,'waveperiod');
  var pointsSwellheight = findScore(forecast,'swellheight');
  var pointsSwellperiod = findScore(forecast,'swellperiod');
  var pointsWind = findScore(forecast,'wind');

  var pointsTotal = pointsWaveheight + pointsWaveperiod + pointsSwellheight + pointsSwellperiod
  pointsTotal -= pointsWind;
  var score = findPoints(pointsTotal,SCORING['tresholds']);
  var label = SCORING['labels'][score];

  var labelhtml = '<span class="label label-' + label.badge + ' padded">' + label.name + '</span>';
  var labelsmallhtml = '<span class="label label-' + label.badge + '">' + label.name + '</span>';

  return {'points':pointsTotal,'score':score,'label':labelhtml, 'labelsmall': labelsmallhtml};
}

function findScore(forecast,parameter) {
  //var value1 = forecast[parameter]['forecasts']['dmi']['saltstein'];
  //var value2 = forecast[parameter]['forecasts']['dmi']['skagerak'];
  var value1 = forecast[parameter];
  var value2 = forecast['s'+parameter];
  
  var score1 = findPoints(value1,SCORING['settings'][parameter]);
  var score2 = findPoints(value2,SCORING['settings'][parameter]);
  if(score1>score2) {return score1} else {return score2};
}

function findPoints(value,json) {
  var points = 0;
  for(var i = 0; i < 6;i++) {
    if (value >= json[i]['min']) {
      points = json[i]['points'];
    }
  }
  return points;
}

function calcScore_old(forecast,spot) {
  var wavescore = 0;
  var params = [{"name":"waveheight","min":0.8,"scores":{"0":3,"1":4,"2":6,"4":8,"5":10}},{"name":"waveperiod","min":5,"scores":{"0":5,"1":6,"2":8,"4":10,"5":12}},
                {"name":"swellheight","min":0.2,"scores":{"0":3,"1":4,"2":6,"4":8,"5":10}},{"name":"swellperiod","min":5,"scores":{"0":5,"1":6,"2":9,"4":12,"5":16}},
                {"name":"wind","min":10,"scores":{"0":1,"1":2,"2":3,"4":4,"5":5}}];
  
  var scorelabels = [
    [0,0,'Flatt','danger'],
    [20,1,'Despo','warning'],
    [30,2,'Dårlig','info'],
    [35,4,'Bra','success'],
    [46,5,'Episk','success']
  ];

  for (var i = 0; i < params.length; i++) {
    var param = params[i];
    var score = 0;
    
    if (param.name !== 'wind') {
      var min = FORECASTSTATS[spot]['dmi']["4"]["min(" + param.name + ")"];
      var smin = FORECASTSTATS[spot]['dmi']["4"]["min(s" + param.name + ")"]; 
      if (forecast[param.name] >= min || forecast['s'+param.name] >= smin) { score = param.scores[0]; };
        for (var j = 1; j < 6; j++) {
            if (FORECASTSTATS[spot]['dmi'][j] !== null) {
              var avg = FORECASTSTATS[spot]['dmi'][j]["avg(" + param.name + ")"];
              var savg = FORECASTSTATS[spot]['dmi'][j]["avg(s" + param.name + ")"];
              if (forecast[param.name] >= avg || forecast['s' + param.name] >= savg) { score = param.scores[j]; }
            }            
        }
    } else {
      var max = FORECASTSTATS[spot]['dmi']["4"]["max(" + param.name + ")"];  
      if (forecast[param.name] <= max) { score = param.scores[0]; };
        for (var j = 1; j < 6; j++) {
          if (FORECASTSTATS[spot]['dmi'][j] !== null) {
            var avg = FORECASTSTATS[spot]['dmi'][j]["avg(" + param.name + ")"];
            if (forecast[param.name] <= avg) { score = param.scores[j]; };
          }
        }
    }
    wavescore += score;
  }

  var label = '';
  var labelsmall = '';
  var score = 0;

  for (var i = 0; i < scorelabels.length; i++) {
      if (wavescore >= scorelabels[i][0] && wavescore >= 0) {
        score = scorelabels[i][1];
        label = '<span class="label label-' + scorelabels[i][3] + ' padded">' + scorelabels[i][2] + '</span>';
        labelsmall = '<span class="label label-' + scorelabels[i][3] + '">' + scorelabels[i][2] + '</span>';
      } 
  }

  if (forecast.wind >=14) {
    label = '<span class="label label-danger padded">Utblåst</span>';
    labelsmall = '<span class="label label-danger">Utblåst</span>';
  }

  return {'points':wavescore,'score':score,'label':label, 'labelsmall': labelsmall};
}


function validateScoringModel(forecasts) {
  forecasts = forecasts.sort(function(a, b) {
    if(moment(a.reporttime).isAfter(moment(b.reporttime))){
      return 1
    } else {
      return -1
    }
    });
  
  var result = {};
  //result['scores'] = newScores();
  result['swells'] = [];
  result['totaldiff'] = 0;
  result['totalabsdiff'] = 0;
  result['matrix'] = newMatrix();

  var swell = newSwell(forecasts[0]['reporttime'],forecasts[0]['score']);

  for(var i = 0; i<forecasts.length; i++) {
    var scoreInfo = calcScore(forecasts[i],'Saltstein');
    var score = scoreInfo['score'];

    result['matrix'][forecasts[i]['score']][score] += 1; 

    var diff = score - forecasts[i]['score'];
    result['totaldiff'] += diff;
    result['totalabsdiff'] += Math.abs(diff);
    //result['scores'][forecasts[i]['score']]['diff'] += diff;
    //result['scores'][forecasts[i]['score']]['absdiff'] += Math.abs(diff);
    //result['scores'][forecasts[i]['score']]['count'] += 1;

    if (moment(swell['time']).isSame(moment(forecasts[i]['reporttime']))) {
      swell['count'] += 1;
      swell['diff'] += diff;
      swell['absdiff'] += Math.abs(diff);
    } else {
      swell['avgdiff'] = swell['absdiff'] / swell['count'];
      swell['avgdiff'] = swell['avgdiff'].toFixed(2);
      if (swell['avgdiff'] > 2) {
        result['swells'].push(swell);  
      }
      swell = newSwell(forecasts[i]['reporttime'],forecasts[i]['score']);
      swell['count'] += 1;
      swell['diff'] += diff;
      swell['absdiff'] += Math.abs(diff);
    }
  }

/*   for (var i = 1; i < 6; i++) {
    result['scores'][i]['avgdiff'] = result['scores'][i]['absdiff'] / result['scores'][i]['count'];
    result['scores'][i]['avgdiff'] = result['scores'][i]['avgdiff'].toFixed(2);
  } */

  var html = '<table><tr>score<td></td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>';
  for (var i = 0; i <= 5; i++) {
    html += '<tr><td>'+ i + '</td>';
    for (var j = 0; j <= 5; j++) {
      result['matrix'][i][j] = (result['matrix'][i][j] / result['matrix'][i].reduce((a, b) => a + b, 0))*100;
      html += '<td>' + result['matrix'][i][j] + '</td>';
    }
    html +='</tr>';
  }


  result['count'] = forecasts.length;
  result['html'] = html + '</table>';
  result['score'] = result['totalabsdiff'] / result['count'];
  result['score'] = result['score'].toFixed(3);

  $('#scoreReport').val(JSON.stringify(result));
  $('#scoreReportValue').html(result['score']);
}

function newSwell(time,score) {
  var swell = {};
  swell['time'] = moment(time).format('YYYY-MM-DD HH:mm:ss');
  swell['score'] = score;
  swell['diff'] = 0;
  swell['absdiff'] = 0;
  swell['avgdiff'] = 0;
  swell['count'] = 0;
  return swell;
}

function newScores(){
 var s = {};
 s[1] = newScore();
 s[2] = newScore();
 s[3] = newScore();
 s[4] = newScore();
 s[5] = newScore();
 return s;
}

function newScore() {
  var s = {};
  s['diff'] = 0;
  s['absdiff'] = 0;
  s['avgdiff'] = 0;
  s['count'] = 0;
  return s;
}

function newMatrix() {
  var mx = [];
  for(var i = 0; i <= 5; i++) {
    mx.push([0,0,0,0,0,0]);
  }
  return mx;
}

function findTwin(forecast,spot) {
  var diff_total0 = 10000;
  var diff_total1 = 10000;
  var diff_total2 = 10000;

  var twins = {"dmi":[]};
  var twin0 = {"forecasttime":null,"score":null, "diff":null};
  var twin1 = {"forecasttime":null,"score":null, "diff":null};
  var twin2 = {"forecasttime":null,"score":null, "diff":null};
  
  for (var i = 0; i< FORECASTSHIST.length; i++) {
    var d1 = forecastDiff(forecast,FORECASTSHIST[i],'waveheight','saltstein');
    var d2 = forecastDiff(forecast,FORECASTSHIST[i],'waveheight','skagerak');
    var d3 = forecastDiff(forecast,FORECASTSHIST[i],'waveperiod','saltstein');
    var d4 = forecastDiff(forecast,FORECASTSHIST[i],'waveperiod','skagerak');
    var d5 = forecastDiff(forecast,FORECASTSHIST[i],'swellheight','saltstein');
    var d6 = forecastDiff(forecast,FORECASTSHIST[i],'swellheight','skagerak');
    var d7 = forecastDiff(forecast,FORECASTSHIST[i],'swellperiod','saltstein');
    var d8 = forecastDiff(forecast,FORECASTSHIST[i],'swellperiod','skagerak');
    var d9 = forecastDiff(forecast,FORECASTSHIST[i],'wind','saltstein');
    var d10 = forecastDiff(forecast,FORECASTSHIST[i],'wind','skagerak');
 
    var diff_total = d1 + d2 + d3 + d4 + d5 + d6 + d7 + d8 + d9 + d10;

    if (diff_total <= diff_total0) {
      twin0['forecasttime'] = FORECASTSHIST[i]['forecasttime'];
      twin0['score'] = FORECASTSHIST[i]['score'];
      twin0['diff'] = diff_total;
    } else if (diff_total <= diff_total1) {
      twin1['forecasttime'] = FORECASTSHIST[i]['forecasttime'];
      twin1['score'] = FORECASTSHIST[i]['score'];
      twin1['diff'] = diff_total;
    } else if (diff_total <= diff_total2) {
      twin2['forecasttime'] = FORECASTSHIST[i]['forecasttime'];
      twin2['score'] = FORECASTSHIST[i]['score'];
      twin2['diff'] = diff_total;
    }
  }
  twins['dmi'].push(twin0);
  twins['dmi'].push(twin1);
  twins['dmi'].push(twin2);
  return twins;
}

function forecastDiff(forecast,forecastOld,parameter,spot) {
  var parameterOld = parameter;
  if(spot === 'skagerak') {parameterOld = 's' + parameter};
  return  Math.abs((forecast[parameter]['forecasts']['dmi'][spot] - forecastOld[parameterOld])/forecast[parameter]['forecasts']['dmi'][spot]);
}