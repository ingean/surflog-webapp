import { sunTimes } from '../settings.js';

export function toLocal(utcDate) {
  return moment(utcDate).utc(true).tz('Europe/Stockholm').toDate();
}

export function toUTC(localDate, timeZone = 'Europe/Stockholm') {
  return moment.tz(localDate, timeZone).utc();
}

export function isDayTime(date) {
  if (moment(date).isBefore(moment())) return false;
  
  let dateHr = moment(date).format('HH:mm:ss')
  if (moment(dateHr, 'HH:mm:ss').isBetween(
      moment(sunTimes.firstLight, 'HH:mm'),
      moment(sunTimes.lastLight, 'HH:mm'))) return true;
  return false;
}