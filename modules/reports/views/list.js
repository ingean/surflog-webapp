import { el, tideIcon, scoreLabel, icon, arrow, stars } from '../../html/elements.js';
import { dateChanged } from '../../html/dateInput.js';
import { getRating } from '../../config/forms.js';
import { formatValue } from '../../forecasts/format.js'
import { imgSrc } from '../../utils/utilities.js';
import { reportSVG } from '../../html/svg.js';
import { get } from '../../utils/api.js';
import { getReports } from '../read.js';

let forecast = 'MSW'
let selected_page = 1
let active_query = ''

function reportIcon(report) {
  let str = (report.type === 'Session') ? report.type : report.source;
  return reportSVG(str);
}

function reportInfo(report) {
  return el('div', 'report-info', [
    el('div', 'report-list-img', reportIcon(report)),
    el('div', 'report-list-title', report.spot),
    el('img', {class: 'report-list-img-small', src: imgSrc(report.country, 'flags')}),
    el('div', 'report-list-date', moment(report.reporttime).calendar()),
  ])
}

function reportDetails(report) {
  let rd = el('div', 'report-details');
  if (report.hasimages === 1) rd.appendChild(icon('picture','report-detail'));
  if (report.crowds === "Mye") rd.appendChild(icon('user','report-detail'));
  if (report.isreference === 1) rd.appendChild(icon('star','report-detail'));
  if (report.board) {
    if (report.board.toLowerCase().includes('longboard')) {
      rd.appendChild(icon('exclamation-sign', 'report-detail'));
    }
  }
  return rd
}

function reportTide(tide) {
  
  let rt = el('div', 'report-tide');

  if (!tide) return rt

  let sign = tide.includes('-') ? 'min' : 'pos'
  let hrs = tide.match(/\d+/)
  hrs = hrs ? hrs[0] : 0
  let type = tide.substring(0, tide.indexOf(' '))
  type = type === 'Lavvann' ? 'low' : 'high'
  type = Math.abs(hrs) > 2 ? 'medium' : type
  let dir = 'up'
  if (type === 'low') {
    dir = (sign === 'pos') ? 'up' : 'down'
  } else {
    dir = (sign === 'pos') ? 'down' : 'up'
  }

  return rt.appendChild(tideIcon(type, dir)) 
}

export function conditionsDetails(report, suffix = '') {
  if (report.type !== 'Session') return el('span', 'report-conditions hidden-xs hidden-sm', '');
  let params = ['waveheight', 'waveperiod', 'wavedir', 'windspeed', 'winddir'];

  return el('div', 'report-conditions hidden-xs hidden-sm', params.map(param => {
    let value = report[`${param}${suffix}`];
    let rating = getRating(param, value);
    return el('span', `label bg-${rating} report-condition`, value);
  }))
}

function mswForecastDetails(report) {
  return el('div', 'report-forecast-msw .hidden-xs .hidden-s .hidden-md', [
      el('div', 'report-forecast-msw-waveheight', [
        el('div', 'report-forecast-msw-value', formatValue(report, 'waveheight_from', false, 'waveheight')),
        el('div', 'report-forecast-msw-value-xsmall', '-' ),
        el('div', 'report-forecast-msw-value', formatValue(report, 'waveheight_to', false, 'waveheight'))
      ]),
      el('div', 'report-forecast-msw-starrating', stars(report['stars_open'], report['stars_filled'])),
      el('div', 'report-forecast-msw-swell', [
        el('div', 'report-forecast-msw-value', formatValue(report, 'swellheight')),
        el('div', 'report-forecast-msw-value', formatValue(report, 'swellperiod')),
        el('div', 'report-forecast-msw-value-narrow', arrow(report['swelldir']))
      ]),
      el('div', 'report-forecast-msw-subswell .hidden-xs .hidden-s .hidden-md .hidden-lg', [
        el('div', 'report-forecast-msw-value-small', formatValue(report, 'subswellheight', false, 'swellheight')),
        el('div', 'report-forecast-msw-value-small', formatValue(report, 'subswellperiod', false, 'swellperiod')),
        el('div', 'report-forecast-msw-value-narrow', arrow(report['subswelldir'], '20', '20'))
      ]),
      el('div', 'report-forecast-msw-wind', [
        el('div', 'report-forecast-msw-value-narrow', `${report['windspeed']}`),
        el('div', 'report-forecast-msw-windgust', [
          el('div', 'report-forecast-msw-value-short', `(${report['windgust']})`),
          el('div', 'report-forecast-msw-value-short', 'km/t'),
        ]),
      ]),
      el('div', `report-forecast-msw-value-narrow bg-muted-${report['windscore']}`, arrow(report['winddir'])),
    ])
}

function dmiForecastDetails(report) {
  return el('div', 'report-forecast-msw hidden-xs hidden-sm hidden-md', [ 
      el('div', 'report-forecast-msw-value', formatValue(report, 'waveheight')),
      el('div', 'report-forecast-msw-value-subdued', formatValue(report, 'swaveheight', true, 'waveheight')),
      el('div', 'report-forecast-msw-value', formatValue(report, 'waveperiod')),
      el('div', 'report-forecast-msw-value-subdued', formatValue(report, 'swaveperiod', true, 'waveperiod')),
      el('div', 'report-forecast-msw-value', formatValue(report, 'swellheight')),
      el('div', 'report-forecast-msw-value-subdued', formatValue(report, 'sswellheight', true, 'swellheight')),
      el('div', 'report-forecast-msw-value', formatValue(report, 'swellperiod')),
      el('div', 'report-forecast-msw-value-subdued', formatValue(report, 'sswellperiod', true, 'swellperiod')),
      el('div', 'report-forecast-msw-value', formatValue(report, 'wind')),
      el('div', 'report-forecast-msw-value-subdued', formatValue(report, 'swind', true, 'wind')),
    ])
}

function smhiObservationsDetails(report) {
  return el('div', 'report-forecast-msw hidden-xs hidden-sm hidden-md', [ 
      el('div', 'report-forecast-msw-value', formatValue(report, 'waveheight')),
      el('div', 'report-forecast-msw-value-subdued', formatValue(report, 'waveheightmax', true, 'waveheight')),
      el('div', 'report-forecast-msw-value', formatValue(report, 'waveperiod')),
      el('div', 'report-forecast-msw-value-narrow', arrow(report['wavedir']))
    ])
}

export function switchForecast(e) {
  let target = e.target
  forecast = target.innerHTML
  getReports(selected_page, active_query, forecast)

  document.querySelectorAll('.reports-forecast-switch')
  .forEach(e => e.classList.remove('active'))
  target.classList.add('active')
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

export function updateReportList(reports) {
  let reportsList = el('div', 'list-group'); 

  for (let report of reports) {
    let reportEl = 
      el('a', 'list-group-item report-list-item', [
        reportInfo(report), 
        reportDetails(report),
        reportTide(report.tide),
        conditionsDetails(report, 'Obs'),
        (forecast === 'MSW') ? mswForecastDetails(report) : (forecast === 'DMI') ? dmiForecastDetails(report) : smhiObservationsDetails(report),
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
  active_query = query
  $('#report-list-pagination').pagination({
    items: totItems,
    itemsOnPage: limit,
    displayedPages: 3,
    cssStyle: '',
    prevText: '<span aria-hidden="true">&laquo;</span>',
    nextText: '<span aria-hidden="true">&raquo;</span>',
    onPageClick: (page, evg) => {
      selected_page = page  
      getReports(page, query, forecast)
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
  let reports = await get(`reports?page=1&table=v_reports_msw&${query}`, true)
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

export function initReportlist() {
  document.querySelectorAll('.reports-forecast-switch')
  .forEach(e => {
    e.addEventListener('click', switchForecast)
  })
}

