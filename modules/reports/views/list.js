import { el, paramLabel, div, span, ratingLabel } from '../../components/elements.js';
import { arrow, icon, iconReport, iconTide } from '../../components/icons.js'
import { dateChanged } from '../../components/dateInput.js';
import { formatValue } from '../../forecasts/format.js'
import { imgSrc } from '../../utils/utilities.js';
import { getReports } from '../read.js';
import { tideText } from './report.js';
import { slWaveheight, slRating, slSwell, slSubswell, slWind, slEnergy } from './slForecast.js';
import { setSpotListTo } from '../../components/spotInput.js';

let forecast = 'MSW'
let selected_page = 1
let active_query = ''

function reportInfo(report) {
  return div('report-info', [
    div('report-list-img', iconReport(report)),
    div('flex-col', [
      div('flex-row', [
        div('report-list-title', report.spot),
        el('img', {class: 'report-list-img-small', src: imgSrc(report.country, 'flags')})
      ]),
      div('report-list-date', `${moment(report.reporttime).format('DD.MM.YY')} ${tideText(report)}`)  
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



export function conditionsDetails(report) {
  let params = [
    {id: 'waveheight', alias: 'waveheightObs'}, {id: 'waveperiod', alias: 'waveperiodObs'},
    {id: 'wavedir', alias: 'wavedirObs'}, {id: 'windspeed', alias: 'windspeedObs'}, 
    {id: 'winddir', alias: 'winddirObs'}
  ]
  
  let hidden = (report['report_id']) ? 'hidden-large' : 'hidden-small'
  if (report.type !== 'Session') return span(`report-conditions ${hidden}`)

  return div(`report-conditions ${hidden}`, params.map(param => {
    return paramLabel(param.id, report[param.alias])
  }))
}

function mswForecastDetails(report) {
  if (report['report_id'] === null) return
  return div('report-forecast-msw hidden-small', [
    slWaveheight(report),
    slRating(report),
    slSwell(report),
    slSubswell(report),
    slWind(report),
    slEnergy(report)
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
          div('report-forecast-msw-value-narrow', arrow(report['wavedir'], 'sm'))
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
      return span(`label bg-1 score-label score-label-lg align-right`, report.source);     
    } else {
      let d = (report.issurfable === 1) ? 'up' : 'down';
      return icon(`thumbs-${d}`, 'align-right');
    } 
  } else {
    return ratingLabel(report.score, 'lg', 'align-right')
  }
}

export function updateReportList(reports) {
  let reportsList = div('list-group') 

  for (let report of reports) {
    let reportEl = 
      el('a', 'list-group-item report-list-item', [
        reportInfo(report), 
        reportDetails(report),
        div('report-tide', iconTide(report)),
        conditionsDetails(report, 'Obs'),
        (forecast === 'MSW') ? mswForecastDetails(report) : (forecast === 'DMI') ? dmiForecastDetails(report) : smhiObservationsDetails(report),
        reportScore(report) 
      ]
    )
    reportEl.addEventListener('click', () => {
      dateChanged(report.reporttime, report.id)
      setSpotListTo(report.spot)
    });
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

  let query = formToQuery(data)
  let reports = await getReports(1, query)
  if (reports?.data) updateList(reports) 
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

export const filterReportListBySpot = async (spot) => {
  let reports = await getReports(1, `&spot=${spot}`)
  if (reports?.data) updateList
}

const updateList = (reports, query) => {
  updateReportsListPagination(reports.count, 10, query)
  updateReportList(reports.data)
}

