import { urlMSWForecasts } from '../config/datasources.js';

function setMSWTime(date) {
  document.querySelectorAll('.time-msw')
  .forEach(el => {
    el.textContent = moment(date).calendar(null, {sameElse: 'DD.MM.YYYY HH:mm'});
    el.dataset.forecastTime = moment(date).format('YYYY-MM-DDTHH:mm');
  })
}

function getMSWTime() {
  let el = document.querySelector('.time-msw')
  return moment(el.dataset.forecastTime).toDate();
}


function setMSWImgs(){
  let unixTime = moment(moment().format('YYYY-MM-DDT00:00:00')).unix();
  let forecasts = ['wave', 'period', 'wind'];
  let date = moment().format('YYYYMMDD00');
  forecasts.forEach(fc => {
    let type = (fc === 'wind') ? 'gfs' : 'wave';
    let subtype = (fc === 'wind') ? '4' : (fc === 'wave') ? '24' : '25';
    let url = `${urlMSWForecasts}${type}/${date}/940/7-${unixTime}-${subtype}.gif`;
    document.querySelector(`#msw-${fc}`).replaceChildren(...imgBrowser(`img-msw-${fc}`, url, ''));
  })
}

export function initMSWImages() {
  setMSWTime(moment().format('YYYY-MM-DDT00:00:00'));
  document.querySelectorAll('.forecast-nav-msw')
  .forEach(el => el.addEventListener('click', navMSWImages));
}