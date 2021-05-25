import { forecasts } from '../../config/datasources.js';
import { el, scoreLabel } from '../../html/elements.js';
import { imgBrowser } from '../../html/imgBrowser.js';
import { toUTC} from '../../utils/time.js';
import { capitalize } from '../../utils/utilities.js';
import { params } from '../../config/forecasts.js';
import { getImgTime, setImgTime } from './forecast.js';
import { updateDMIImgs } from './dmi.js'; 

function surlogUrl(date, param) {
  var f = forecasts.surflog;
  var url = f.imgUrl + moment(date).format('YYYY/MM/DD') + '/' +  capitalize(param) + '_';

  if (param === 'skagerak' || param === 'saltstein'){
      return url += moment(date).format('YYYYMMDD') + '_01' + f.imgSuffix;
  } else {
      return url += fileName(date) + f.imgSuffix;
  }
}

function updateHistoricDMIImgs(date) {
  let params = ['waveheight', 'swellheight', 'wind'];
  params.forEach(param => {
    let src = surlogUrl(date, param);
    document.getElementById(`img-dmi-${param}-historic`).src = src;
  })
}

function fileName(date) {
  return moment(toUTC(moment(date).toDate())).format('YYYYMMDD_HH')
}

function imgFooter(param, source, report) {
  let footer = el('div', 'panel-footer dark', [
    //el('span', 'panel-h dark', params[param].caption  + ' '),
    el('span', `time-${source}-historic panel-h4 dark`),
    el('span', 'pull-right', scoreLabel(report.score))
  ])
                
  return footer;
}

function replaceOrAppendFooter(source, param, newFooter) {
  let panel =  document.querySelector(`#${source}-${param}-panel`);
  let oldFooter = panel.querySelector('.panel-footer');
  if (oldFooter) {
    panel.replaceChild(newFooter, oldFooter)
  } else {
    panel.append(newFooter)
  }
}

export function updateHistoricImages(report, date) {
  let params = ['waveheight', 'swellheight', 'wind', 'skagerak', 'saltstein'];
  params.forEach(param => {
    let src = surlogUrl(date, param);
    let source = (param === 'skagerak' || param === 'saltstein') ? 'yr' : 'dmi';
    let img = imgBrowser(`img-${source}-${param}-historic`, src, `img-${source}`);
    let footer = imgFooter(param, source, report);

    document.querySelector(`#${source}-${param}-historic`).replaceChildren(...img);
    replaceOrAppendFooter(source, param, footer);
    
    setImgTime(moment(date).format('YYYY-MM-DD HH:00:00'), '.time-dmi-historic');
    setImgTime(moment(date).format('YYYY-MM-DD'), '.time-yr-historic')
  })
}

export function navHistoricDMIImages(dir) {
  let m = moment(getImgTime('.time-dmi-historic'));
  let t = (dir === 'prev') ? m.subtract(1, 'hours') : m.add(1, 'hours');
  updateHistoricDMIImgs(t);
  setImgTime(t, '.time-dmi-historic');
}


