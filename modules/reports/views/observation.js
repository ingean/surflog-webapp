import { div }  from '../../components/elements.js';
import { tabs } from '../../components/tabs.js';
import { reportHeader, reportCompare, reportFooter } from './report.js';

export async function updateObservationView(report) {
  document.getElementById('report-container').replaceChildren(
    div({class: "report", "data-reportid": report.id}, [
      reportHeader(report), 
      div('report-body',
      tabs(
        'observation', 
        ['Beskrivelse', 'Sammenlikning'], 
        [report.descr, await reportCompare(report, 'observasjonen')]
      )),
      reportFooter(report)
    ])
  );
}