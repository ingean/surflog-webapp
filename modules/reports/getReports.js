import { log, notify, Loader } from '../utils/logger.js';
import { updateReportList, updateReportsListPagination } from './reportsList.js';
import { updateReportView} from './reportView.js';
import { get } from '../utils/api.js';
import { updateImageCarousels } from './imagesCarousel.js';

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
  let url = (id) ? `reports/${id}` : `reports?datetime=${moment(date).format('YYYY-MM-DD')}`;
  let reports = await get(url)

  if (reports) updateReportView(reports[0]);
}

export async function getReports(page = 1, query = '') {
  let load = new Loader('report-list-container');
  let url = `reports?page=${page}&${query}`;
  let reports = await get(url, true);

  if (reports) {
    updateReportsListPagination(reports.count, 10, query);
    updateReportList(reports.data)
  }
}




