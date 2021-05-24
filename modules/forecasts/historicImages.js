import { forecastSources } from '../config/datasources.js';
import { el, scoreLabel } from '../html/elements.js';
import { imgBrowser } from '../html/imgBrowser.js';
import { toUTC} from '../utils/time.js';
import { setDMITime } from '../forecasts/dmiImages.js';

function surlogUrl(date, param) {
  var f = forecastSources.surflog;
  var url = f.url + moment(date).format('YYYY/MM/DD') + '/' +  f[param] + '_';

  if (param === 'skagerak' || param === 'saltstein'){
      return url += moment(date).format('YYYYMMDD') + '_01' + f.suffix;
  } else {
      return url += moment(toUTC(moment(date).toDate())).format('YYYYMMDD_HH') + f.suffix;
  }
}

function imgFooter(param, source, report) {
  let footer = el('div', 'panel-footer dark', [
    el('span', 'panel-h dark', param),
    el('span', `time-${source}-historic panel-h4 dark`),
    el('span', 'pull-right', scoreLabel(report.score))
  ])
                
  return footer;
}

export function updateHistoricImages(report, date) {
  let params = ['waveheight', 'swellheight', 'wind', 'skagerak', 'saltstein'];
  params.forEach(param => {
    let src = surlogUrl(date, param);
    let source = (param === 'skagerak' || param === 'saltstein') ? 'yr' : 'dmi';
    let img = imgBrowser(`img-${source}-${param}-historic`, src, `img-${source}`);
    let footer = imgFooter(param, source, report);
    document.querySelector(`#${source}-${param}-historic`).replaceChildren(...img);
    document.querySelector(`#${source}-${param}-panel`).append(footer);
    setDMITime(moment(date).format('YYYY-MM-DD HH:00:00'), '.time-dmi-historic');
    document.querySelectorAll('.time-yr-historic')
    .forEach(el => {
      el.textContent = moment(date).calendar(null, {sameElse: 'DD.MM.YYYY'});
    })
  })
}

