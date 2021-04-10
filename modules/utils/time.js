import { getRange } from './utilities.js';
import { dateInputInitialize } from '../html/dateInput.js';

export function initDateTime() {
  dateInputInitialize();
  let dmiForecastStart = toLocal(dmiStartTime()); 
  setForecastTime(dmiForecastStart, '.time-dmi');
  
  var mswForecastStart = moment(moment().format('YYYY-MM-DD 00:00:00')).toDate();
  setForecastTime(mswForecastStart, '.time-msw');
}

export function toLocal(utcDate) {
  return moment(utcDate).utc(true).tz('Europe/Stockholm').toDate();
}

export function toUTC(localDate, timeZone = 'Europe/Stockholm') {
  return moment.tz(localDate, timeZone).utc();
}

export function getForecastTime(elementId) {
  let el = document.getElementById(elementId);
  return moment(el.getAttribute('data-forecasttime')).toDate();
}

export function setForecastTime(date, query) {
  let el = document.querySelector(query);

  el.textContent = moment(date).calendar(null, {sameElse: 'DD.MM.YYYY HH:mm'});
  el.setAttribute('data-forecasttime', moment(date).format('YYYY-MM-DD HH:mm')); 
}

export function dmiStartTime(){ //Estimates the start time for forecast coming live from DMI
  let date = moment().subtract(7, 'hours');
  let hr = moment(date).hour();
  hr = (hr < 6) ? '00' : (hr < 12 ) ? '06' : (hr < 18) ? '12' : '18';
  return moment(date).format(`YYYY-MM-DDT${hr}:00:00`);
}