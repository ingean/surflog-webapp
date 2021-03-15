import { el }  from '../utils/html/elements.js';
import { reportHeader, reportText, reportFooter } from './showReport.js';

export function showObservation(report) {
  document.getElementById('report-container').replaceChildren(
    el('div', {class: "report", "data-reportid": report.id}, [
      reportHeader(report), 
      el('div', {class: "report-body"},
        reportText('Beskrivelse', report.descr)),
      reportFooter(report)
    ])
  );  
}