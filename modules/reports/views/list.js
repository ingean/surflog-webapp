import { el, tideIcon, scoreLabel, icon, arrow, stars, div, span } from '../../html/elements.js';
import { dateChanged } from '../../html/dateInput.js';
import { getRating } from '../../config/forms.js';
import { formatValue } from '../../forecasts/format.js'
import { imgSrc } from '../../utils/utilities.js';
import { reportSVG } from '../../html/svg.js';
import { get } from '../../utils/api.js';
import { getReports } from '../read.js';
import { tide } from './report.js';

let forecast = 'MSW'
let selected_page = 1
let active_query = ''

function reportIcon(report) {
  let str = (report.type === 'Session') ? report.type : report.source;
  return reportSVG(str);
}

function reportInfo(report) {
  return div('report-info', [
    div('report-list-img', reportIcon(report)),
    div('flex-col', [
      div('flex-row', [
        div('report-list-title', report.spot),
        el('img', {class: 'report-list-img-small', src: imgSrc(report.country, 'flags')})
      ]),
      div('report-list-date', `${moment(report.reporttime).format('DD.MM.YY')} ${tide(report)}`)  
    ])
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

  let t = tideTextParts(tide)
  let dir = 'stigende'
  if (t.type === 'Lavvann') {
    dir = (t.sign === '+') ? 'stigende' : 'synkende'
  } else {
    dir = (t.sign === '+') ? 'synkende' : 'stigende'
  }
  
  return rt.appendChild(tideIcon(t.type, dir, t.hrs)) 
}

export function tideTextParts(tide) {
  let type = tide.substring(0, tide.indexOf(' ')) 
  let sign = tide.includes('-') ? '-' : '+'
  let hrs = tide.match(/\d+/)
  hrs = hrs ? Number(hrs[0]) : 0
   
  return {type, sign, hrs}
}

export function conditionsDetails(report, suffix = '') {
  let params = ['waveheight', 'waveperiod', 'wavedir', 'windspeed', 'winddir']
  let hidden = (report['report_id']) ? 'hidden-large' : 'hidden-small'

  if (report.type !== 'Session') return span(`report-conditions ${hidden}`)

  return div(`report-conditions ${hidden}`, params.map(param => {
    let value = report[`${param}${suffix}`]
    let rating = getRating(param, value)
    return span(`label bg-${rating} report-condition`, value)
  }))
}

function mswForecastDetails(report) {
  if (report['report_id'] === null) return
  return div('report-forecast-msw hidden-small', [
          div('report-forecast-msw-waveheight', [
          div('report-forecast-msw-value', formatValue(report, 'waveheight_from', false, 'waveheight')),
          div('report-forecast-msw-value-xsmall', '-' ),
          div('report-forecast-msw-value', formatValue(report, 'waveheight_to', false, 'waveheight'))
      ]),
      div('report-forecast-msw-starrating', stars(report['stars_open'], report['stars_filled'])),
        div('report-forecast-msw-swell', [
        div('report-forecast-msw-value', formatValue(report, 'swellheight')),
        div('report-forecast-msw-value', formatValue(report, 'swellperiod')),
        div('report-forecast-msw-value-narrow', arrow(report['swelldir']))
      ]),
      div('report-forecast-msw-subswell', [
        div('report-forecast-msw-value-small', formatValue(report, 'subswellheight', false, 'swellheight')),
        div('report-forecast-msw-value-small', formatValue(report, 'subswellperiod', false, 'swellperiod')),
        div('report-forecast-msw-value-narrow', arrow(report['subswelldir'], '20', '20'))
      ]),
      div('report-forecast-msw-wind', [
        div('report-forecast-msw-value-narrow', `${report['windspeed']}`),
        div('report-forecast-msw-windgust', [
          div('report-forecast-msw-value-short', `(${report['windgust']})`),
          div('report-forecast-msw-value-short', 'km/t'),
        ]),
      ]),
      div(`report-forecast-msw-value-narrow bg-muted-${report['windscore']}`, arrow(report['winddir'])),
    ])
}

function dmiForecastDetails(report) {
  return div('report-forecast-msw hidden-xs hidden-sm hidden-md', [ 
          div('report-forecast-msw-value', formatValue(report, 'waveheight')),
          div('report-forecast-msw-value-subdued', formatValue(report, 'swaveheight', true, 'waveheight')),
          div('report-forecast-msw-value', formatValue(report, 'waveperiod')),
          div('report-forecast-msw-value-subdued', formatValue(report, 'swaveperiod', true, 'waveperiod')),
          div('report-forecast-msw-value', formatValue(report, 'swellheight')),
          div('report-forecast-msw-value-subdued', formatValue(report, 'sswellheight', true, 'swellheight')),
          div('report-forecast-msw-value', formatValue(report, 'swellperiod')),
          div('report-forecast-msw-value-subdued', formatValue(report, 'sswellperiod', true, 'swellperiod')),
          div('report-forecast-msw-value', formatValue(report, 'wind')),
          div('report-forecast-msw-value-subdued', formatValue(report, 'swind', true, 'wind')),
        ])
}

function smhiObservationsDetails(report) {
  return div('report-forecast-msw hidden-xs hidden-sm hidden-md', [ 
          div('report-forecast-msw-value', formatValue(report, 'waveheight')),
          div('report-forecast-msw-value-subdued', formatValue(report, 'waveheightmax', true, 'waveheight')),
          div('report-forecast-msw-value', formatValue(report, 'waveperiod')),
          div('report-forecast-msw-value-narrow', arrow(report['wavedir']))
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
      return span(`label bg-1 report-score`, report.source);     
    } else {
      let d = (report.issurfable === 1) ? 'up' : 'down';
      return icon(`thumbs-${d}`, 'report-score');
    } 
  } else {
    return scoreLabel(report.score, 'report-score');
  }
}

export function updateReportList(reports) {
  let reportsList = div('list-group') 

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

