import { log, notify, Loader } from '../utils/logger.js';
import { el, label, icon } from '../html/elements.js';
import { dateChanged } from '../html/dateInput.js';
import { getRating } from '../config/formsOptions.js';
import { imgSrc } from '../utils/utilities.js';
import { getReports } from './getReports.js';

function reportIcon(report) {
  let str = (report.type === 'Session') ? report.type : report.source;
  return imgSrc(str, 'report');
 
}

function reportDetails(report) {
  let rd = el('div', {class: 'report-details'});
  if (report.hasimages === 1) { rd.appendChild(icon('picture','report-detail')) };
  if (report.crowds === "Mye") { rd.appendChild(icon('user','report-detail')) };
  if (report.isreference === 1) { rd.appendChild(icon('star','report-detail')) };
  return rd;
}

export function reportScore(report) {
  if (report.type === 'Observasjon' || report.type === 'Observation'){
    if (report.source ==="Bomtur") {
      return label('danger', report.source, 'report-score');      
    } else {
      let d = (report.issurfable === 1) ? 'up' : 'down';
      return icon(`thumbs-${d}`, 'report-score');
    } 
  } else {
    return label(
      getRating('score', report.score, 'value'), 
      getRating('score', report.score, 'value', false), 
      'report-score');  
  }
}

export function conditionsDetails(report) {
  if (report.type === 'Session') {
    return el('div', {class: 'report-conditions'}, [
      label(getRating('waveheight', report.waveheight), report.waveheight, 'report-condition'),
      label(getRating('waveperiod', report.waveperiod), report.waveperiod, 'report-condition'),
      label('default', report.wavedir, 'report-condition'),
      label(getRating('windspeed', report.windspeed), report.windspeed, 'report-condition'),
      label(getRating('winddir', report.winddir), report.winddir, 'report-condition'),
    ]);
  } else {
    return '';
  }
}

export function updateReportList(reports) {
  let reportsList = el('div', 'list-group'); 

  for (let report of reports) {
    let reportEl = 
      el('a', 'list-group-item report-list-item', [
        el('img', {class: 'report-list-img', src: reportIcon(report)}),
        el('div', 'report-list-title', report.spot),
        el('img', {class: 'report-list-img-small', src: imgSrc(report.country, 'flags')}),
        el('div', 'report-list-date', moment(report.reporttime).calendar()),
        reportDetails(report),
        conditionsDetails(report),
        reportScore(report) 
      ]
    );
    reportEl.addEventListener('click', () => {dateChanged(report.reporttime, report.id)});
    reportsList.appendChild(reportEl);
  }

  let container = document.getElementById('report-list-container')
  container.innerHTML = '';
  container.appendChild(reportsList);
}

export function updateReportsListPagination(totItems, limit, query = '') {
  $('#report-list-pagination').pagination({
    items: totItems,
    itemsOnPage: limit,
    displayedPages: 3,
    cssStyle: '',
    prevText: '<span aria-hidden="true">&laquo;</span>',
    nextText: '<span aria-hidden="true">&raquo;</span>',
    onPageClick: (page, evg) => {
        getReports(page, query);
    }
  })
}


