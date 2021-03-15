import { log, notify, Loader } from '../utils/logger.js';
import { showReportList, showPagination } from './showReportList.js';
import { showReport} from './showReport.js';
import { urlAPI } from '../config/datasources.js';

export async function getTwin(date, spot = 'Saltstein', source = 'dmi') {
  let datestr = moment(date).format('YYYY-MM-DDTHH:00:00');
  let url = `${urlAPI}forecasts/${source}/${datestr}/twin?spot=${spot}`;
  let response = await fetch(url).catch(e => {
    log(e, 'No twin available for selected date');
  });
  return await response.json();
}

export async function getReport(date, id) {
  let load = new Loader('report-container');
  let url = '';
  if (id) {
    url = `${urlAPI}reports/${id}`;
  } else {
    url = `${urlAPI}reports?datetime=${moment(date).format('YYYY-MM-DD')}`;
  }

  let response = await fetch(url).catch(e => {
    notify('Klarte ikke å hente rapport');
    load.stop();
  });

  let report = await response.json();
  showReport(report[0]);
}

export async function getReports(page = 1, query = '') {
  let load = new Loader('report-list-container');
  
  try {
    let url = `${urlAPI}reports?page=${page}&${query}`;
    let response = await fetch(url);
    let reports = await response.json();
    let reportsCount = response.headers.get('X-Total-Count');
    
    if (reports) {
      showPagination(reportsCount, 10, query);
      showReportList(reports)
    } else {
      notify('Innstillingene gir ingen treff på rapporter', 'Info', 'filter');
    }
  } 
  catch(e) {
    log(e,'Klarte ikke hente rapporter');
    load.stop();
  }
}




