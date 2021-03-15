import { reportScore, conditionsDetails } from './showReportList.js';
import { showSession } from './showSession.js';
import { showObservation } from './showObservation.js';
import { el } from '../utils/html/elements.js';

export function showReport(report) {
  (report.type === 'Session') ? showSession(report) : showObservation(report);
}

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

function imagesButton(report) {
  if (report.hasimages === 1) {
    return el('span', {
      "id": "img-report-tool-images", 
      "class": "glyphicon glyphicon-picture",
      "data-toggle": "modal",
      "data-target": "#modal-images"
    })
  } else {
   return ''; 
  }
}

function deleteButton() {
  return el('span', {
    "id":"btn-deleteReport",
    "class": "glyphicon glyphicon-trash align-left",
    "data-toggle": "confirmation",
    "data-on-confirm": "deleteReport",
    "data-btn-ok-label": "Slett",
    "data-btn-ok-icon": "glyphicon glyphicon-trash",
    "data-btn-ok-class": "btn-danger",
    "data-btn-cancel-label": "Angre", 
    "data-btn-cancel-icon": "glyphicon glyphicon-ban-circle",
    "data-btn-cancel-class": "btn-success",
    "data-title": "Rapport", 
    "data-content": "Vil du slette rapporten?"
  });
}

export function reportFooter(report) {
  let content = [
    imagesButton(report),
    deleteButton()
  ]
  
  if (report.type === 'Observasjon') {
    content.unshift(report.source);
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