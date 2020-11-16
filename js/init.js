async function startSurfLog(fbUserId) { // Starts the dashboard for logged in user
  moment.locale('nb_NO');
  google.charts.load('current', {'packages':['corechart'],'language':'nb_NO'}); 
  
  getUserSettings(fbUserId)
  dateSelected(new Date());
  
  initDMI();
  initMSW();

  $('#s-modal-tides').html(htmlModal('tides', 'Tidevann','<span id="tidalgraph"></span>')); 
  $('#img-webcam').attr('src', urlWebCam); //Lazy load webcam image

  getForecasts();
  initReports();
}

function initDMI() {
  let dmiForecasttime = utcToLocal(findForecastUTCStartTime()); 
  setForecastTime(dmiForecasttime, '#time-dmi-today');
}

function initMSW() {
 var mswForecasttime = moment(moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00').toDate();
 displayForecast(mswForecasttime,'msw','today',true,false,forecastOptions[1].categories);
}







