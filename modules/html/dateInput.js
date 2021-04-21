import { notify } from '../utils/logger.js';
import { getReport, getImages } from '../reports/getReports.js';

const elementId = 'application-date';

function onDateChanged(event) {
  let date = event.currentTarget.value;
  dateChanged(date);
}

export function initDateInput() {
  document.getElementById(elementId)
  .addEventListener('change', onDateChanged);
  setDateInput(new Date());
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
  
  let evt = document.createEvent("HTMLEvents");
  evt.initEvent("change", false, true);
  dateInput.dispatchEvent(evt);
}