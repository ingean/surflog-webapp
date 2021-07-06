import { el }  from '../../html/elements.js';
import { tabs } from '../../html/tabs.js';
import { reportHeader, reportCompare, reportFooter } from './report.js';

export async function updateObservationView(report) {
  document.getElementById('report-container').replaceChildren(
    el('div', {class: "report", "data-reportid": report.id}, [
      reportHeader(report), 
      el('div', {class: "report-body"},
      tabs(
        'observation', 
        ['Beskrivelse', 'Sammenlikning'], 
        [report.descr, await reportCompare(report, 'observasjonen')]
      )),
      reportFooter(report)
    ])
  );
}