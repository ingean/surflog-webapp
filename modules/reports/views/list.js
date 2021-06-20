import { el, scoreLabel, icon } from '../../html/elements.js';
import { dateChanged } from '../../html/dateInput.js';
import { getRating } from '../../config/forms.js';
import { imgSrc } from '../../utils/utilities.js';
import { get } from '../../utils/api.js';
import { getReports } from '../read.js';

function reportIcon(report) {
  let str = (report.type === 'Session') ? report.type : report.source;
  return imgSrc(str, 'report');
 
}

function reportDetails(report) {
  let rd = el('div', {class: 'report-details'});
  if (report.hasimages === 1) rd.appendChild(icon('picture','report-detail'));
  if (report.crowds === "Mye") rd.appendChild(icon('user','report-detail'));
  if (report.isreference === 1) rd.appendChild(icon('star','report-detail'));
  if (report.board) {
    if (report.board.toLowerCase().includes('longboard')) {
      rd.appendChild(icon('exclamation-sign', 'report-detail'));
    }
  }
  return rd;
}

export function reportScore(report) {
  if (report.type === 'Observasjon' || report.type === 'Observation'){
    if (report.source ==="Bomtur") {
      return el('span', `label bg-1 report-score`, report.source);     
    } else {
      let d = (report.issurfable === 1) ? 'up' : 'down';
      return icon(`thumbs-${d}`, 'report-score');
    } 
  } else {
    return scoreLabel(report.score, 'report-score');
  }
}

export function conditionsDetails(report) {
  if (report.type !== 'Session') return '';
  let params = ['waveheight', 'waveperiod', 'wavedir', 'windspeed', 'winddir'];
  return el('div', 'report-conditions hidden-xs hidden-sm hidden-md', params.map(param => {
    let value = report[param];
    let rating = getRating(param, value);
    return el('span', `label bg-${rating} report-condition`, value);
  }))
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

function deleteFormData(data, keys) {
  for (let key of keys) {
    if (data.has(key)) data.delete(key);
  }
}


export async function filterReportsList(form) {
  let data = new FormData(form);
  if (data.get('loctype') === 'Alle') {
    deleteFormData(data, ['country', 'location', 'spot']);
  }
  data.delete('loctype');

  let query = formToQuery(data);
  let reports = await get(`reports?page=1&${query}`, true)
  if (reports.data) {
    updateReportsListPagination(reports.count, 10, query);
    updateReportList(reports.data);
  } 
}

function formToQuery(data) {
  let query = '';
  for (let entry of data.entries()) {
    if (entry[1] !== 'Alle') {
      query += `&${entry[0]}=${entry[1]}`;
    }
  }

  return query.substring(1); //Remove first & from query
}


