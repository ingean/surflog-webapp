import { el, image, div} from '../../components/elements.js';
import { spotIds } from '../../config/spots.js';
import { urlMSW } from '../../config/datasources.js';
import { forecastParamAll } from '../../config/datasources.js';
import { reportScore, conditionsDetails } from './list.js';
import { updateSessionView } from './session.js';
import { updateObservationView } from './observation.js';
import { comparisonReport } from '../compare.js';
import { tideParts } from '../../utils/utilities.js';

export function tideText(report) {
  if(report.type !== 'Session') return ''
  
  let p = tideParts(report.tide)
 
  if(p.hours) {
    return `(${p.hours}t ${p.beforeAfter} ${p.type})`
  } else {
    return `(${p.type})`;
  }
}

function headerDetails(report) {
  if (report.type === "Session") {
    return `${report.duration}t fra kl ${moment(report.reporttime).format('HH:mm')} ${tideText(report)}`;
  }
  return `kl ${moment(report.reporttime).format('HH:mm')}`;
}

function footerToolbar(report) {
  return div('report-tools', [
    imagesButton(report),
    deleteButton()
  ])
}

function imagesButton(report) {
  if (report.hasimages === 1) {
    return div({
      "id": "img-report-tool-images", 
      "class": "glyphicon glyphicon-picture report-tool",
      "data-toggle": "modal",
      "data-target": "#modal-report-images"
    })
  } else {
   return ''; 
  }
}

function deleteButton() {
  return div({
    "id":"btn-deleteReport",
    "class": "glyphicon glyphicon-trash report-tool",
    "data-toggle": "confirmation",
    "data-on-confirm": "deleteReport",
    "data-btn-ok-label": "Ja",
    "data-btn-ok-icon": "glyphicon glyphicon-trash",
    "data-btn-ok-class": "btn-danger",
    "data-btn-cancel-label": "Nei", 
    "data-btn-cancel-icon": "glyphicon glyphicon-ban-circle",
    "data-btn-cancel-class": "btn-success",
    "data-title": "Slett rapport", 
    "data-content": "Er du sikker?"
  })
}

function format(comparisonReport, param) {
  let value = comparisonReport[param].diff;
  if (value === 0) return;

  param = (param === 'swind') ? 'wind' : param
  let p = forecastParamAll(param)
  
  let s = (value > 0) ? 'up' : 'down';
  return `${p.caption} var ${Math.abs(value)}${p.unit.unit} ${p.unit[s]}.`
}

export function reportHeader(report) {
  let avatarURL = document.getElementById('navbar-profile-img').getAttribute('src');
  let bgCls = (report.score) ? `bg-${report.score}` : ''

  return (
    div(`report-header ${bgCls}`, [
      image(avatarURL, { 
        class: "report-header-img img-circle",
        height: '40px'
      }
      ), 
      div('report-header-text', [
        div('report-header-title', [report.spot, ' ', moment(report.reporttime).calendar()]),
        div('report-header-details', headerDetails(report))
      ]),
      reportScore(report)
    ]) 
  )
}

export async function reportCompare(report, reportType = 'økta') {
  let compare = await comparisonReport(report.reporttime);
  if (compare) {
    let params = ['waveheight', 'waveperiod', 'swellheight', 'swellperiod', 'wind', 'swind'];
    let elements = [
      el('p', "txt-report",
        `For denne ${reportType} var det varslet ${compare.wavesize} bølger og ${compare.windspeed} vind enn ${moment(compare.forecasttime).calendar()}.`)
    ];

    for (let param of params) {
      let txt = format(compare, param);
      if (txt) elements.push(div('report-twin-txt', txt)) 
    }
    return elements;
  } else {
    div({id: 'report-twin-info'},
    div('report-text', 'Klarte ikke å sammenlikne varsel for denne rapporten med valgt tidspunkt (tidspunkt satt for DMI-bilder)'));
  }
}

export function reportFooter(report) {
  let bgCls = (report.score) ? `bg-${report.score}` : ''
  
  let content = [
    footerToolbar(report)
  ]
  
  if (report.type === 'Observasjon') {
    content.unshift(el('div', 'report-footer-detail', report.source));
  } else {
    content.unshift(div('report-conditions-bg',conditionsDetails(report)));
  }
  return el('div', `report-footer ${bgCls}`, content)
}

export function reportText(title, text) {
  return reportPage(title, 
    el('p', {class: "report-page-text"}, text));
}

export function reportPage(title, content) {
  
  return div({class: "report-page"}, [
          div('report-page-title', title),
          div('report-page-body', content)
        ])
}

export function updateReportView(report) {
  (report.type === 'Session') ? updateSessionView(report) : updateObservationView(report);
}