import { forecasts, imgPanels } from '../../config/datasources.js';
import { imgBrowser } from '../../components/imgBrowser.js';
import { toLocal, toUTC } from '../../utils/time.js';
import { replaceOrAppendFooter, imgFooter } from './historic.js';
import { setImgTime } from './forecast.js';

const MSW = forecasts.msw;
const Panels = imgPanels('msw');

function setMSWTime(date, scope) {
  document.querySelectorAll(`.time-msw-${scope}`)
  .forEach(el => {
    el.textContent = moment(date).calendar(null, {sameElse: 'DD.MM.YYYY HH:mm'});
    el.dataset.forecastTime = moment(date).format('YYYY-MM-DDTHH:mm');
  })
}

function getMSWTime(scope) {
  let el = document.querySelector(`.time-msw-${scope}`)
  return moment(el.dataset.forecastTime).toDate();
}

export function updateMSWImages(report, date) {
  let scope = date ? 'historic' : 'live'
  let midnight = date ? moment(date) : moment()
  midnight = toLocal(midnight.format('YYYY-MM-DDT00:00:00'));
  let unixTime = moment(midnight).unix();
  setMSWTime(midnight, scope);

  Panels.forEach(param => {
    let src = `${MSW.baseUrl}${param.type}/${MSW.size}/${MSW.prefix}${unixTime}-${param.subtype}.${MSW.imgFormat}`; 
    let img = imgBrowser(`img-msw-${param.id}-${scope}`, src, `img-msw`);

    document.querySelector(`#msw-${param.id}-${scope}`).replaceChildren(...img);
    if(date) {
      let footer = imgFooter('msw', report);
      replaceOrAppendFooter('msw', param.id, footer);
      setImgTime(midnight, '.time-msw-historic')
    }
  })
}

export function navMSWImages(dir, scope) {
  let currentTime = toUTC(getMSWTime(scope))
  let newTime = (dir === 'next')
    ? moment(currentTime).add(3, 'hours')
    : moment(currentTime).subtract(3, 'hours')

  Panels.forEach(param => {
    let el = document.getElementById(`img-msw-${param.id}-${scope}`);
    el.src = el.src.replace(moment(currentTime).unix(), moment(newTime).unix());
  })
  setMSWTime(toLocal(newTime), scope)  
}

export function initMSWImages() {
  updateMSWImages()
  document.querySelectorAll('.forecast-nav-msw')
  .forEach(el => el.addEventListener('click', navMSWImages));
}