import { sunTimes } from '../settings.js';

export function toLocal(utcDate) {
  return moment(utcDate).utc(true).tz('Europe/Stockholm').toDate();
}

export function toUTC(localDate, timeZone = 'Europe/Stockholm') {
  return moment.tz(localDate, timeZone).utc();
}

export function isDayTime(date, checkPast = true) {
  if (checkPast) {
    if (moment(date).isBefore(moment())) return false;
  }
  
  let dateHr = moment(date).format('HH:mm:ss')
  return (moment(dateHr, 'HH:mm:ss').isBetween(
      moment(sunTimes.firstLight, 'HH:mm'),
      moment(sunTimes.lastLight, 'HH:mm'))) ? true : false
}

export const monthAsText = (month) => {
  return moment(String(month), 'M').format('MMMM')
}

export const thisMonth = () => {
  let date = new Date()
  return date.getMonth() + 1
}

export const thisYear = () => {
  let date = new Date()
  return date.getFullYear()
}