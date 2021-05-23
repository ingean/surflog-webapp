import { selectedSpot } from '../html/spotInput.js';
import { statistics } from '../settings.js';
import { scoring } from './scoreModel.js';

const direction = [
  {low: 348.75, mid:0, high: 360, short: "N", caption: "nord"}, 
  {low: 0, mid: 0, high: 11.25, short: "N", caption: "nord"},
  {low: 11.25, mid: 22.5, high: 33.75, short: "NNE", caption: "nord-nordøst"},
  {low: 33.75, mid: 45, high: 56.25, short: "NE", caption: "nordøst"},
  {low: 56.25, mid: 67.5, high: 78.75, short: "ENE", caption: "øst-nordøst"},
  {low: 78.75, mid: 90, high: 101.25, short: "E", caption: "øst"},
  {low: 101.25, mid: 112.5, high: 123.75, short: "ESE", caption: "øst-sørøst"},
  {low: 123.75, mid: 135, high: 146.25, short: "SE", caption: "sørøst"},
  {low: 146.25, mid: 157.5, high: 168.75, short: "SSE", caption: "sør-sørøst"},
  {low: 168.75, mid: 180, high: 191.25, short: "S", caption: "sør"},
  {low: 191.25, mid: 202.5, high: 213.75, short: "SSW", caption: "sør-sørvest"},
  {low: 213.75, mid: 225, high: 236.25, short: "SW", caption: "sørvest"},
  {low: 236.25, mid: 247.5, high: 258.75, short: "WSW", caption: "vest-sørvest"},
  {low: 258.75, mid: 270, high: 281.25, short: "W", caption: "vest"},
  {low: 281.25, mid: 292.5, high: 303.75, short: "WNW", caption: "vest-nordvest"},
  {low: 303.75, mid: 315, high: 326.25, short: "NW", caption: "nordvest"},
  {low: 326.25, mid: 337.5, high: 348.75, short: "NNW", caption: "nord-nordvest"}
];

const windspeed = [
  {low: 0, high: 0.2, local: 5, fetch: 1, caption: "Stille"},
  {low: 0.2, high: 1.5, local: 5, fetch: 1, caption: "Flau vind"},
  {low: 1.5, high: 3.3, local: 4, fetch: 1, caption: "Svak vind"},
  {low: 3.3, high: 5.4, local: 4, fetch: 2, caption: "Lett bris"},
  {low: 5.4, high: 7.9, local: 3, fetch: 3, caption: "Laber bris"},
  {low: 7.9, high: 10.7, local: 2, fetch: 4, caption: "Frisk bris"},
  {low: 10.7, high: 13.8, local: 2, fetch: 4, caption: "Liten kuling"},
  {low: 13.8, high: 17.1, local: 1, fetch: 5, caption: "Stiv kuling"},
  {low: 17.1, high: 20.7, local: 1, fetch: 5, caption: "Sterk kuling"},
  {low: 20.7, high: 24.4, local: 1, fetch: 5, caption: "Liten storm"},
  {low: 24.4, high: 28.4, local: 1, fetch: 5, caption: "Full storm"},
  {low: 28.4, high: 32.6, local: 1, fetch: 5, caption: "Sterk storm"},
  {low: 32.6, high: 100, local: 1, fetch: 5, caption: "Orkan"}
];

const current = [
  {low: 0, high: 30, category: 2, caption: 'Svak'},
  {low: 30, high: 40, category: 1, caption: 'Sterk'},
  {low: 40, high: 9999, category: 0, caption: 'Svært sterk'}
];

export const ratingClasses = {
0: {class: "cat-0", labelClass: 'default', caption: 'Ukjent', score: 'Flatt'},
1: {class: "cat-1", labelClass: 'danger', caption: 'Veldig lav', score: 'Despo'},
2: {class: "cat-2", labelClass: 'warning', caption: 'Lav', score: 'Dårlig'},
3: {class: "cat-3", labelClass: 'info', caption: 'Middels', score: 'Ok'},
4: {class: "cat-4", labelClass: 'primary', caption: 'Høy', score: 'Bra'},
5: {class: "cat-5", labelClass: 'success', caption: 'Veldig høy', score: 'Episk'}
};

export function getCurrentInfo(speed) {
  return current.find(s => speed > s.low && speed <= s.high); 
}

export function getCurrentCategory(speed) {
  let info = getCurrentInfo(speed);
  return classes[info.category];
}

export function getDirInfo(dir) {
  return direction.find(d => dir > d.low && dir <= d.high); 
}

export function getDirFromTxt(dirTxt) {
  return direction.find(d => d.short === dirTxt);
}

export function getWindspeedInfo(speed) {
  return windspeed.find(s => speed > s.low && speed <= s.high); 
}

export function getWindspeedCategory(speed, local = true) {
  let info = getWindspeedInfo(speed);
  let cat = (local) ? info.local : info.fetch; 
  return classes[cat];
}

function getParamClass(forecast, param, value) {
  let s = getStats(forecast, param);
  return (value >= (s.avg + s.std)) ? 5: (value >= s.avg) ? 4 : (value >= (s.avg - s.std) ? 3 : (value >= s.min) ? 2 : 0);
}

function getParamPoints(forecast, param, value) {
  let cls = getParamClass(forecast, param, value);
  return scoring[param][cls].points; 
}

function getStats(forecast, param) {
  param = (forecast === 'dmi')  ? `s${param}` : param; // Use DMI-stats for Skagerak

  let spot = selectedSpot();
  let avg = statistics[spot][forecast][0][`avg(${param})`];
  let std = statistics[spot][forecast][0][`std(${param})`];
  let min = statistics[spot][forecast][0][`std(${param})`];
  return {min, avg, std};
}

function getWindPoints(wind) {
  let cls = (wind > 14) ? 5 : (wind > 12) ? 4 : (wind > 10) ? 3 : (wind > 8) ? 2 : (wind > 6) ? 1 : 0;
  return scoring['wind'][cls].points; 
}

export function formatForecastValue(forecast, param, value) {
  let score = getParamClass(forecast, param, value);
  return (score > 2) ? `txt-${score}` : '';
}

function windFetch(value) {
  return (value > 14) ? 5 : (value > 12) ? 4 : (value > 10) ? 3 : 0; 
}

function windLocal(value) {
  return (value > 12) ? 1 : (value > 8) ? 2 : 0; 
}

export function formatWindValue(value, fetch = false) {  
  let cls = (fetch) ? windFetch(value) : windLocal(value);  
  return (cls) ? `txt-${cls}` : '';
}


export function getTotalPoints(forecast, fc) {
  let points = 0
  let stations = Object.keys(fc.stations);
  let params = Object.keys(fc.stations[stations[0]]);
  let station = (forecast === 'dmi') ? 1 : 0; // Use DMI-values for Skagerak
  params.forEach(param => { 
    if (param !== 'wind') {
      points += getParamPoints(forecast, param, fc.stations[stations[station]][param])
    } else {
      points -= getWindPoints(fc.stations[stations[0]][param])
    }   
  });
  return points;
}

export function getScoreCategory(forecast, fc) {
  let s = getTotalPoints(forecast, fc);
  
  return (s > 46) ? 5 : (s > 35) ? 4 : (s > 30) ? 3 : (s > 26) ? 2 : (s > 17) ? 1 : 0;
}