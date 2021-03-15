import { getRange } from './utilities.js';
import { dateInputInitialize } from './html/dateInput.js';

export function initDateTime() {
  dateInputInitialize();
  let dmiForecastStart = toLocal(dmiStartTime()); 
  setForecastTime(dmiForecastStart, '#time-dmi-live');
  
  var mswForecastStart = moment(moment().format('YYYY-MM-DD 00:00:00')).toDate();
  setForecastTime(mswForecastStart, '.time-msw-live');
}

export function toLocal(utcDate) {
  return new Date(Date.UTC(utcDate.getFullYear(),utcDate.getMonth(),utcDate.getDate(),utcDate.getHours(),utcDate.getMinutes(),utcDate.getSeconds()));
}

export function toUTC(tzDate) {
  return new Date(tzDate.getUTCFullYear(),tzDate.getUTCMonth(),tzDate.getUTCDate(),tzDate.getUTCHours(),tzDate.getUTCMinutes(),tzDate.getUTCSeconds());
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
  let date = new Date();
  date = new Date(date.getTime()-7*3600*1000);

  let ranges = [
    {min: 0, max: 6, hour: 0},
    {min: 6, max: 12, hour: 6},
    {min: 12, max: 18, hour: 12},
    {min: 18, max: 24, hour: 18},
  ];

  date.setHours = getRange(ranges, date.getHours, 'hour');  
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}