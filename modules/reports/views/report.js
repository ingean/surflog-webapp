import { el } from '../../html/elements.js';
import { spotIds } from '../../config/spots.js';
import { urlMSW } from '../../config/datasources.js';
import { forecastParamAll } from '../../config/datasources.js';
import { reportScore, conditionsDetails } from './list.js';
import { updateSessionView } from './session.js';
import { updateObservationView } from './observation.js';
import { comparisonReport } from '../compare.js';

function tide(report) {
  if(report.type === 'Session') {
    let t = report.tide;
    let beforeAfter = (t.includes('-')) ? "før" : "etter";
    let hours = t.match(/\d+/); //Find number in str
    let highLow = t.substr(0,t.indexOf(' ')).toLowerCase(); //Find tide
    if(hours) {
      return `(${hours}t ${beforeAfter} ${highLow})`;
    } else {
      return `(${highLow[0].toUpperCase()}${highLow.slice(1)})`;
    }
  }
  return '';
}

function headerDetails(report) {
  if (report.type === "Session") {
    return `${report.duration}t fra kl ${moment(report.reporttime).format('HH:mm')} ${tide(report)}`;
  }
  return `kl ${moment(report.reporttime).format('HH:mm')}`;
}

function footerToolbar(report) {
  return el('div', 'report-tools', [
    imagesButton(report),
    mswLink(report),
    deleteButton()
  ])
}

function imagesButton(report) {
  if (report.hasimages === 1) {
    return el('div', {
      "id": "img-report-tool-images", 
      "class": "glyphicon glyphicon-picture report-tool",
      "data-toggle": "modal",
      "data-target": "#modal-report-images"
    })
  } else {
   return ''; 
  }
}

function mswLink(report) {
  if (!spotIds[report.spot]) return '';
  let mswId = spotIds[report.spot].msw;
  let spot = mswId.name ?? report.spot.replace(' ', '-');
  let start = moment(report.reporttime).subtract(3, 'days').format('YYYY-MM-DD');
  let end = moment(report.reporttime).add(3, 'days').format('YYYY-MM-DD');
  let url = `${urlMSW}${spot}-Surf-Report/${mswId.id}/Historic/?start=${start}&end=${end}`;
  return  el('div', 'report-footer-tool', 
    el('a', { href: url, target: '_blank', class: 'report-tool'}, 
      el ('div', 'glyphicon glyphicon-calendar')))
}

function deleteButton() {
  return el('div', {
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
  });
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
  let profilePicture = document.getElementById('navbar-profile-img').getAttribute('src');
  
  return (
    el('div', 'report-header', [
      el('img', { 
        src: profilePicture,
        class: "report-header-img img-circle"}
      ), 
      el('div', 'report-header-text', [
        el('div', 'report-header-title', [report.spot, ' ', moment(report.reporttime).calendar()]),
        el('div', 'report-header-details', headerDetails(report))
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
        `For denne ${reportType} var det varslet ${compare.wavesize} bølger og ${compare.windspeed} vind enn ${moment(compare.forecasttime).calendar()}.`),
      el('div', "report-subtitle", "Detaljer"),
    ];

    for (let param of params) {
      let txt = format(compare, param);
      if (txt) elements.push(el('div', 'report-twin-txt', txt)) 
    }
    return elements;
  } else {
    el('div', {id: 'report-twin-info'},
      el('div', 'report-text', 'Klarte ikke å sammenlikne varsel for denne rapporten med valgt tidspunkt (tidspunkt satt for DMI-bilder)'));
  }
}

export function reportFooter(report) {
  let content = [
    footerToolbar(report)
  ]
  
  if (report.type === 'Observasjon') {
    content.unshift(el('div', 'report-footer-detail', report.source));
  } else {
    content.unshift(conditionsDetails(report));
  }
  return el('div', 'report-footer', content);
}

export function reportText(title, text) {
  return reportPage(title, 
    el('p', {class: "report-page-text"}, text));
}

export function reportPage(title, content) {
  
  return el('div', {class: "report-page"}, [
          el('div', 'report-page-title', title),
          el('div', 'report-page-body', content)
        ])
}

export function updateReportView(report) {
  (report.type === 'Session') ? updateSessionView(report) : updateObservationView(report);
}