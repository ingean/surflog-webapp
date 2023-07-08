import { log, notify, Loader } from '../utils/logger.js';
import { updateReportList, updateReportsListPagination } from './views/list.js';
import { updateReportView} from './views/report.js';
import { get } from '../utils/api.js';
import { updateImageCarousels } from './views/imagesCarousel.js';

export async function getImages(date) {
  let datestring = moment(date).format('YYYY-MM-DD');
  let imageUrls = await get(`images/${datestring}`)
  if (imageUrls) {
    updateImageCarousels(imageUrls);
  }
}

export async function getTwin(date, spot = 'Saltstein', source = 'dmi') {
  let datestr = moment(date).format('YYYY-MM-DDTHH:00:00');
  let url = `forecasts/${source}/${datestr}/twin?spot=${spot}`;
  let twin = await get(url)
  return twin;
}

export async function getReport(date, id) {
  let load = new Loader('report-container');
  let url = (id) ? `reports/${id}?table=v_reports_msw` : `reports?datestring=${moment(date).format('YYYY-MM-DD')}&table=v_reports_msw`;
  let reports = await get(url)

  if (reports) {
    updateReportView(reports[0])
    return reports[0];
  } else {
    load.stop();
  }   
}

export async function getReports(page = 1, query = '', table = 'MSW') {
  let tables = {
    MSW: 'v_reports_msw',
    DMI: 'v_reports_dmi',
    SMHI: 'v_reports_smhi',
  }
  
  let load = new Loader('report-list-container');
  let url = `reports?page=${page}&table=${tables[table]}&${query}`;
  let reports = await get(url, true);

  if (reports) {
    if (page === 1) updateReportsListPagination(reports.count, 10, query);
    updateReportList(reports.data)
  }
}




