import { navHistoricDMIImages } from './historic.js';
import { navMSWImages } from './msw.js';

export function setImgTime(date, cls = '.time-dmi') {
  document.querySelectorAll(cls)
  .forEach(el => {
    el.textContent = moment(date).calendar(null, {sameElse: 'DD.MM.YYYY HH:mm'});
    el.dataset.forecastTime = moment(date).format('YYYY-MM-DDTHH:mm');
  })
}

export function getImgTime(cls = '.time-dmi') {
  let el = document.querySelector(cls)
  return moment(el.dataset.forecastTime).toDate();
}

export function navImages(source, param, scope, dir) {
  if (source === 'dmi' && scope === 'historic') navHistoricDMIImages(dir)
  if (source === 'msw') navMSWImages(dir, scope)
}