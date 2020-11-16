function createURL(forecasttime,provider,type) {
  if (provider === 'surflog') {
    return createSurflogURL(forecasttime,type);
  } else {
    return createMSWURL(forecasttime,type);
  }
}

function createSurflogURL(forecasttime,type) {
    var f = ForecastTypes['SURFLOG'];
    var url = f.url + moment(forecasttime).format('YYYY/MM/DD') + '/' +  f[type] + '_';
  
    if (type === 'skagerak' || type === 'saltstein'){
        return url += moment(forecasttime).format('YYYYMMDD') + '_01' + f.suffix;
    } else {
        return url += moment(localToUTC(moment(forecasttime).toDate())).format('YYYYMMDD_HH') + f.suffix;
    }
}

function createMSWURL(forecasttime,type) {
  var url = ForecastTypes.MSW.url;
  if (type==='wind') {url = ForecastTypes.MSW.wurl};
  var epoch = moment(utcToLocal(moment(forecasttime).toDate())).unix();
  
  return url + epoch + ForecastTypes.MSW[type] + '.gif';
}

//Remove row with forecast images from SurfLog
function removeHistoricForecast() {
  for (var i in forecastOptions) {
    var o = forecastOptions[i];

    for (var j in o.types) {
      var t = o.types[j];
      var id = o.provider + '-' + o.source + '-' + t.type;
      $('#'+id).html('');
    }  
  }
  
  $('#mswlink').html('');
  $('#surflogforecast').html('');
  $('#interpretcontainer2').html('');
}

function displayHistoricForecasts(forecasttime) {  
  //Add historic data toolbar
  var html =  '<span class="h4-text-dark">SurfLog for </span>' +
  '<span id="time-dmi-surflog" class="h4-text-dark" data-forecasttime="">Forecasttime </span>' +
  '<button class="btn btn-square-dark pull-right" onClick="removeHistoricForecast()">Lukk</button>' +
  '<span id="score2" class="pull-right"></span>';

  $('#surflogforecast').html(html);


  //Add all historic image forecasts
  for (var i in forecastOptions) {
    var o = forecastOptions[i];
    displayForecast(forecasttime,o.provider,o.source,o.navigation,o.footer,o.categories);
  }

  //Adds Interpret-data
  getForecastsForDate(forecasttime,'2');

  //Adds button with link to historic MSW data for selected date
  displayMSWHistoricLink(forecasttime);
}

function displayForecast(forecasttime, provider, source, navigation, footer, categories) {
  for (var j in categories) {
    var o = categories[j];
    var id = provider + '-' + source + '-' + o.category;
    var url = createURL(forecasttime,source,o.category);
    var html = makeForecastHTML({'id':id,'provider':provider,'source':source,'url':url,'title':o.title,'navigation':navigation,'footer':footer});
    $('#'+id).html(html);
  }
  if (provider === 'msw') {
    setForecastTime(utcToLocal(moment(forecasttime).toDate()),'.time-' + provider + '-' + source); //Time for each container
  } else {
    setForecastTime(forecasttime,'#time-' + provider + '-' + source); //Time for each row
  }
}

function displayMSWHistoricLink(forecasttime){
    var st = moment(forecasttime).subtract(5,'Days');
    var et = moment(forecasttime).add(1,'Days');
    var url = 'https://magicseaweed.com/Saltstein-Surf-Report/556/Historic/?start_format=' +
                moment(st).format('DD') + '+' +
                monthsEn[moment(st).format('MMM')] + '+' +
                moment(st).format('YYYY') + '&end_format=' +
                moment(et).format('DD') + '+' +
                monthsEn[moment(et).format('MMM')] + '+' +
                moment(et).format('YYYY');

    var html = '<button id="btn-msw-historic-link" class="btn btn-square-dark" href="' + url + '" target="_blank">MSW</button>'
    
    $('#mswlink').html(html);
}

function makeForecastHTML(o) {
  var browse = 'browse' + o.provider.toUpperCase();
  if (o.provider === "dmi" && o.source==='surflog') {browse = 'browseSURFLOG';}
  
  var html = '<div class="panel-body-fluid">' +
                '<div id="container-' + o.id + '" class="container-'+ o.provider +'">' +
                  '<img id="img-' + o.id + '" class="img-' + o.provider + '" src="' + o.url + '" data-source="' + o.source + '"/>';
  
  if (o.navigation) {
      html +=     '<button id="buttonprev' + o.id + '" class="button buttonprev" onClick="' + browse + '(\'previous\',\'' + o.id + '\')">' +
                    '<span class="glyphicon glyphicon-chevron-left"></span>' +
                  '</button>' +
                  '<button id="buttonnext' + o.id + '" class="button buttonnext" onClick="' + browse + '(\'next\',\'' + o.id + '\')">' +
                    '<span class="glyphicon glyphicon-chevron-right"></span>' +
                  '</button>' +
                '</div>' +
              '</div>';
  }
              
  if (o.footer) {
    html += '<div class="panel-footer">' +
              '<span class="h4-text-dark">' + o.title + ' </span>' +
              '<span id="time-' + o.id + '" class="h4-text-dark time-msw-history" data-forecasttime=""></span>' +  
            '</div>'; 
  }
  
  return html        
}