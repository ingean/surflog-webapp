import { forecasts, imgPanels } from '../../config/datasources.js';
import { div, span, ratingLabel } from '../../components/elements.js';
import { imgBrowser } from '../../components/imgBrowser.js';
import { toUTC} from '../../utils/time.js';
import { capitalize } from '../../utils/utilities.js';
import { getImgTime, setImgTime } from './forecast.js';

const SL = forecasts.surflog

function surflogUrl(date, param, source) {
  let url = SL.baseUrl + moment(date).format('YYYY/MM/DD') + '/' +  capitalize(param.id) + '_';

  if (source === 'yr') {
      return url += `${moment(date).format('YYYYMMDD')}_01.${SL.imgFormat}`;
  } else {
      return url += `${fileName(date)}.${SL.imgFormat}`;
  }
}

function updateHistoricDMIImgs(date) {
  const dmiPanels = imgPanels('dmi')
  dmiPanels.forEach(param => {
    let src = surflogUrl(date, param);
    document.getElementById(`img-dmi-${param.id}-historic`).src = src;
  })
}

function fileName(date) {
  return moment(toUTC(moment(date).toDate())).format('YYYYMMDD_HH')
}

function displayYrImgContainers(date) {
  if (moment(date).isAfter('2022-02-01')) {
    document.getElementById('yr-historic-row').style.display = 'none'
  } else {
    document.getElementById('yr-historic-row').style.display = ''
  }
}

export function imgFooter(source, report) {
  let footer = div('panel-footer', span(`time-${source}-historic panel-h4`))

  if (report) {
    footer.append(ratingLabel(report.score, 'md', 'align-right'))
    footer.classList.add(`bg-${report.score}`)
  } 
           
  return footer;
}

export function replaceOrAppendFooter(type, param, newFooter) {
  let panel =  document.querySelector(`#${type}-${param}-panel`);
  let oldFooter = panel.querySelector('.panel-footer');
  (oldFooter) ? panel.replaceChild(newFooter, oldFooter) : panel.append(newFooter)
}

export function updateHistoricImages(report, date) {
  const Panels = imgPanels('dmi').concat(imgPanels('yr')) 
  Panels.forEach(param => {
    let source = (param.id === 'skagerak' || param.id === 'saltstein') ? 'yr' : 'dmi'
    let src = surflogUrl(date, param, source);
    let img = imgBrowser(`img-${source}-${param.id}-historic`, src, `img-${source}`);
    let footer = imgFooter(source, report);

    document.querySelector(`#${source}-${param.id}-historic`).replaceChildren(...img);
    replaceOrAppendFooter(source, param.id, footer);
    
    setImgTime(moment(date).format('YYYY-MM-DD HH:00:00'), '.time-dmi-historic');
    setImgTime(moment(date).format('YYYY-MM-DD'), '.time-yr-historic')
  })
  displayYrImgContainers(date)
}

export function navHistoricDMIImages(dir) {
  let m = moment(getImgTime('.time-dmi-historic'));
  let t = (dir === 'prev') ? m.subtract(1, 'hours') : m.add(1, 'hours');
  updateHistoricDMIImgs(t);
  setImgTime(t, '.time-dmi-historic');
}


