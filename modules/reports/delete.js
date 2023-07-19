import { log, notify, Loader } from '../utils/logger.js';
import  { del } from '../utils/api.js';
import { getReports } from './read.js';
import { el } from '../components/elements.js';

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
    notify(res.message, 'success', 'trash');
    emptyReportView();
  }
}

export function addDeleteReportsEventHandlers() {
  //Enable confirmation
  $(document).on('click','#btn-deleteReport', () => {
    $('#btn-deleteReport').confirmation('show');
  });
  window.deleteReport = deleteReport; //Make confirmation click event globally available
}

/*
export function addDeleteReportEventHandler() {
  let confirmBtn = document.querySelector('.btn-deletReport-confirm');
  confirmBtn.addEventListener('click', deleteReport);
}*/