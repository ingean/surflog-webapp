import { log, notify, Loader } from '../utils/logger.js';
import  { del } from '../utils/api.js';
import { getReports } from './getReports.js';
import { el } from '../html/elements.js';

function emptyReportView() {
  let reportContainer = document.querySelector('#report-container');
  reportContainer.innerHTML = ' ';
  reportContainer.appendChild(el('span', 'report-title', 'Velg en rapport fra listen'))
  getReports();
}

async function deleteReport() { //Delete report from database
  let report = document.querySelector('.report');
  let id = report.dataset.reportid;
  let res = await del(`reports/${id}`);
  
  if (res) {
    notify('Rapporten er slettet', 'success', 'trash');
    emptyReportView();
  }
}

export function addDeleteReportEventHandler() {
  let confirmBtn = document.querySelector('.btn-deletReport-confirm');
  confirmBtn.addEventListener('click', deleteReport);
}

export function makeDeleteReportGlobal() {
  window.deleteReport = deleteReport;
}