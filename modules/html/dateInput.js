import { notify } from '../utils/logger.js';
import { getReport, getImages } from '../reports/getReports.js';
import { getForecasts } from '../forecasts/getForecasts.js';

const elementId = 'application-date';

export function dateInputInitialize() {
  setDateInput(new Date());
  document.getElementById(elementId)
  .addEventListener('change', dateChanged);
}

export function dateChanged(datestring, id){
  let date = moment(datestring).toDate();
  if (moment(date).isSameOrBefore(new Date(), 'day')){
    getReport(date, id);
    getImages(date);
      if (!moment(date).isSame(new Date(), 'day')){
        //getForecasts(date);
      }
  } else { // Selected date is in the future
      notify('Det finnes ikke varsler for denne datoen');
  }

  //getSunriseSet(date);
  //getTides(date,'tab');   
}

export function setDateInput(date) {
  let dateInput = document.getElementById(elementId);
  dateInput.value = moment(date).format('YYYY-MM-DD');
}