
import { get } from './utils/api.js';

export var settings = [];
export var statistics = {};
export var sunTimes = {};
export var user;

function formatSunTime(timeString) {
  return moment(timeString, 'hh:mm:ss a').utc(true).tz("Europe/Stockholm").format('HH:mm')
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





