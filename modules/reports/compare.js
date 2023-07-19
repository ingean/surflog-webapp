import { getTwin, getComparison } from '../utils/api.js';
import { setDateInput } from '../components/dateInput.js';

var twin = undefined;
var comparison = undefined;

export function initTwin() {
  document.querySelector('#report-twin-btn')
  .addEventListener('click', updateTwinInfo);
}

export async function updateTwinInfo() {
  twin = await getTwin();
  setDateInput(twin.reporttime);
}

export async function comparisonReport(date) {
  return (twin) ? twin : await getComparison(date);
}

