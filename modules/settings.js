import { selectedSpot } from './components/spotInput.js';
import { getSunTimes } from './utils/api.js';

export var settings = [];
//export var statistics = {};
export var sunTimes = {};
export var user;

function switchTheme() {
  let currentTheme = document.documentElement.getAttribute('data-theme');
  let targetTheme =  (currentTheme === 'light') ? 'dark' : 'light'
  
  document.documentElement.setAttribute('data-theme', targetTheme)
  localStorage.setItem('theme', targetTheme);
}

export async function getSettings(userId) {
  //settings = await get(`settings/${userId}`);
  //statistics = await get(`statistics/forecasts`);
}

export function setUser(loggedInUser) {
  user = loggedInUser;
}

export function getStats_old(forecast, param, location = 0) {
  param = (forecast === 'dmi')  ? `s${param}` : param; // Use DMI-stats for Skagerak

  let spot = selectedSpot();
  let avg = statistics[spot][forecast][location][`avg(${param})`];
  let std = statistics[spot][forecast][location][`std(${param})`];
  let min = statistics[spot][forecast][location][`min(${param})`];
  return {min, avg, std};
}

export async function initTheme() {
  let toggle = document.getElementById("theme-toggle");
  let storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  if (storedTheme)
    document.documentElement.setAttribute('data-theme', storedTheme)

  toggle.addEventListener('click', switchTheme)
  await getSunTimesForPosition()  
}

export async function getSunTimesForPosition() {  
  
/*   async function getSun(p) {
    const lat = p.coords.latitude
    const lon = p.coords.longitude
    sunTimes = await getSunTimes(lat, lon)
  }
  
  navigator.geolocation.getCurrentPosition(getSun) */

  sunTimes = await getSunTimes(59.89, 10.61)
}



