import { selectedSpot } from './html/spotInput.js';
import { get } from './utils/api.js';

export var settings = [];
export var statistics = {};
export var sunTimes = {};
export var user;

function formatSunTime(timeString) {
  return moment(timeString, 'hh:mm:ss a').utc(true).tz("Europe/Stockholm").format('HH:mm')
}

function switchTheme() {
  let currentTheme = document.documentElement.getAttribute('data-theme');
  let targetTheme =  (currentTheme === 'light') ? 'dark' : 'light'
  
  document.documentElement.setAttribute('data-theme', targetTheme)
  localStorage.setItem('theme', targetTheme);
}

export async function getSettings(userId) {
  settings = await get(`settings/${userId}`);
  statistics = await get(`statistics/forecasts`);
}

export function setUser(loggedInUser) {
  user = loggedInUser;
}

export function setSunTimes(sun) {
  sunTimes.firstLight = formatSunTime(sun.civil_twilight_begin);
  sunTimes.lastLight = formatSunTime(sun.civil_twilight_end);
  sunTimes.sunrise = formatSunTime(sun.sunrise);
  sunTimes.sunset = formatSunTime(sun.sunset);
  return sunTimes;
}

export function getStats(forecast, param, location = 0) {
  param = (forecast === 'dmi')  ? `s${param}` : param; // Use DMI-stats for Skagerak

  let spot = selectedSpot();
  let avg = statistics[spot][forecast][location][`avg(${param})`];
  let std = statistics[spot][forecast][location][`std(${param})`];
  let min = statistics[spot][forecast][location][`std(${param})`];
  return {min, avg, std};
}

export function initTheme() {
  let toggle = document.getElementById("theme-toggle");
  let storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  if (storedTheme)
    document.documentElement.setAttribute('data-theme', storedTheme)

  toggle.addEventListener('click', switchTheme)  
}



