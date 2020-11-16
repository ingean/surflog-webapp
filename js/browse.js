function getForecastImageInfo(containerid,imageid) {
    var url = $(imageid).attr('src');
    var type = $(containerid).attr('data-forecasttype'); 
    var provider = $(containerid).attr('data-forecastprovider');

    if(url.includes('surflog')) {provider = 'SURFLOG'};
    return {'url':url,'type':type,'provider':provider};
}

function updateDMIURLs(str1,str2) {
    $('#img-dmi-today-wave').attr('src',$('#img-dmi-today-wave').attr('src').replace(str1,str2));
    $('#img-dmi-today-swell').attr('src',$('#img-dmi-today-swell').attr('src').replace(str1,str2));
    $('#img-dmi-today-wind').attr('src',$('#img-dmi-today-wind').attr('src').replace(str1,str2));
}

function updateHistoryURLs(forecasttime,providerId,firstId) {
  var o = forecastOptions[providerId];
  var source = $('#img-' + firstId).attr('data-source');
  for (var i in o.categories) {
    var id = '#img-' + o.provider + '-' + source + '-' + o.categories[i].category;
    //var url = createURL(forecasttime,o.provider,o.categories[i].category);
    var url = createURL(forecasttime,source,o.categories[i].category);
    $(id).attr('src',url);
  }
}

function changeForecast(category,type) {
  var id = 'dmi-today-' + category;
  changeForecastURL(id,type);

  //Also swich for historic forecast if exists
  var id2 = 'dmi-surflog-' + category;
  if($('#container-' + id2).length > 0) {
    changeForecastURL(id2,type);
  }
}

function changeForecastURL(id,type) {
  var i = getForecastImageInfo('#container-' + id, '#img-' + id);
  var t = ForecastTypes[i.provider];
  $('#img-' + id).attr('src',i.url.replace(t[i.type], t[type]));
  $('#container-' + id).attr('data-forecasttype',type);
}


//Toggles between forecast interpretation visualization
function changeInterpret(type,targetId) {
    //getDMIForecasts(moment(getForecastTime('forecasttimedisplay')).format('YYYY-MM-DD'),type,targetId);
    displayForecasts(FORECASTS, targetId, type);
}

function browseDMIForecast(direction) {
    var f = getForecastImageInfo('#container-dmi-today-wave','#img-dmi-today-wave');
    var forecasttime = getForecastTime('#time-dmi-today');
    var newtime = moment();
    var id = Number(f.url.match(/\d+/)[0]); //Timestep indicator in url
    var nid = 0;

    if (direction === "previous"){
      newtime = moment(forecasttime).subtract(1,'hours');  
      if (id >= 2) { //Not crossing date
            nid = id - 1;
            updateDMIURLs(id,nid);
            setForecastTime(newtime,'#time-dmi-today');
        } else { //switch source to Surflog forecast
            //ForecastToSurflog(moment(forecasttime).subtract(1,'hours'),f.type);
            //Add another row with historic forecasts
            displaySurfLogForecast(newtime);
        }
    } else if (id<120 && direction=="next") {
      newtime = moment(forecasttime).add(1,'hours');  
      if (newtime.isAfter(moment(forecasttime),'day')) { //Crossing into a new day
            $( "#datepicker" ).datepicker( "setDate", moment(newtime).format('YYYY-MM-DDTHH:mm:ss'));
        }
        nid = id + 1;
        updateDMIURLs(id,nid);
        setForecastTime(newtime,'#time-dmi-today');
    };
    setScore(newtime, gFCNow.dmi);
}

function browseSURFLOG(direction,id) {
    var newtime = new Date();
    var f = getForecastImageInfo('#container-dmi-surflog-wave','#img-dmi-surflog-wave');
    var forecasttime = getForecastTime('#time-dmi-surflog');

    if (direction=="previous") { newtime = moment(forecasttime).subtract(1,'hours'); };
    if (direction=="next"){ newtime = moment(forecasttime).add(1,'hours'); };
    updateHistoryURLs(newtime,0,id);

    if (! moment(newtime).isSame(forecasttime,'day')) { //Check if browsing into a new day
        $( "#datepicker" ).datepicker( "setDate", newtime);
        getReportsAndImagesForDate(moment(newtime).format('YYYY-MM-DD')); 
    }

    setForecastTime(newtime,'#time-dmi-surflog');
    setScore(newtime, FORECASTSHIST, '2');
}

function browseMSW(direction,id) {
    var newtime = new Date();
    var forecasttime = getForecastTime('#time-' + id);

    if (direction=="previous") { newtime = moment(forecasttime).subtract(3,'hours'); };
    if (direction=="next"){ newtime = moment(forecasttime).add(3,'hours'); };
    updateHistoryURLs(localToUTC(moment(newtime).toDate()),1,id);
    setForecastTime(newtime,'.time-msw-' + $('#img-'+id).attr('data-source'));
}

function setScore(timestring,forecasts, id = '') {
  var forecast = getForecastsForTimestep(timestring,forecasts);
  displayDMIforecast(forecast,id);
}

function getForecastsForTimestep(timestring,forecasts) {
  var timestep = moment(timestring).format('YYYY-MM-DD HH:mm:ss');
  for(var i = 0; i< forecasts.length;i++) {
    if(forecasts[i]['localtime'] === timestep) {
      return forecasts[i];
    }
  }
  return null;
}


