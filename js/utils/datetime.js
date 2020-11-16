function getDateInURL(url){ //Returns date in surflog forecast file name
  let datestring = url.substr(url.indexOf('_')+1,11);
  let timestring = url.substr(url.indexOf('_')+10,12) + ':00';
  return moment(datestring + ' ' + timestring,'YYYYMMDD HH').toDate();
}

function utcToLocal(date){
  return new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()));
}

function localToUTC(date) {
  return new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds());
}

function getForecastTime(timedisplayid) {
  return moment($(timedisplayid).attr('data-forecasttime')).toDate();
}

function setForecastTime(datestring,timedisplayid) {
  $(timedisplayid).text(moment(datestring).calendar(null,{
      sameElse: 'DD.MM.YYYY HH:mm'
  }));
  $(timedisplayid).attr('data-forecasttime',moment(datestring).format('YYYY-MM-DD HH:mm')); 
}

function getReferenceTime(hours,endtime) {
  if (typeof endtime === 'undefined') {endtime = new Date();}; //If no date set to today
  var timeend = moment.utc(endtime).format('YYYY-MM-DDTHH:') + '00'; //Find last hour
  var timestart = moment(timeend).subtract(hours,'hours'); //Find last hour
  return moment(timestart).format('YYYY-MM-DDTHH:mm') + '/' + moment(timeend).format('YYYY-MM-DDTHH:mm'); 
}

function findForecastUTCStartTime(){ //Estimates the start time for forecast coming live from DMI
  var utcdate = localToUTC(new Date());
  utcdate = new Date(utcdate.getTime()-7*3600*1000);

  if(utcdate.getHours()>=0 && utcdate.getHours()<6){utcdate.setHours(0)};
  if(utcdate.getHours()>=6 && utcdate.getHours()<12){utcdate.setHours(6)};
  if(utcdate.getHours()>=12 && utcdate.getHours()<18){utcdate.setHours(12)};
  if(utcdate.getHours()>=18 && utcdate.getHours()<24){utcdate.setHours(18)};
  
  utcdate.setMinutes(0);
  utcdate.setSeconds(0);
  return utcdate;
}
