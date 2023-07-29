import { spotIds } from '../config/spots.js';
import { formsOptions } from '../config/forms.js';
import { div } from './elements.js';
import { inputSelect } from './formGroup.js';
import { updateStationCard } from '../forecasts/cards/station.js';
import { updateDMICard } from '../forecasts/cards/dmiStats.js';
import { updateSMHICard } from '../forecasts/cards/smhiStats.js';
import { getYrCoastForecast, updateYrCoastTable } from '../forecasts/tables/yrCoast.js'; 
import { updateDMITable } from '../forecasts/tables/dmi.js'; 
import { updateSMHITable } from '../forecasts/tables/smhi.js'; 
import { updateYrTable } from '../forecasts/tables/yr.js'; 
import { filterReportListBySpot } from '../reports/views/list.js';


function clearInput(e) {
  let input = e.target.parentElement.parentElement.nextElementSibling;
  input.value = '';
}

function createSpotList() {
  let options = formsOptions.find(item => item.name === 'spot');
  options.formName = 'navbar'
  options.id = `${options.formName}-${options.name}`;
  let spots = div('input-group', inputSelect(options));
  document.querySelector('#navbar-spots-list')
  .replaceChildren(spots);

  document.querySelectorAll('.btn-clear-datalist')
  .forEach(e => e.addEventListener('click', clearInput))
}


async function onSpotChanged(e) {
  let spot = e.target.value;
  let yrId = spotIds[spot]?.yr?.id;

  if (!yrId) {
    e.target.value = 'Saltstein'
    spot = 'Saltstein'
    yrId = spotIds[spot]?.yr?.id
  }

  //filterReportListBySpot(spot)

  await updateStationCard(spot);
  updateDMICard(spot);
  updateSMHICard(spot);
  getYrCoastForecast(yrId);
  
  // Reformat tables to reflect selected spot statistics
  updateDMITable(spot)
  updateSMHITable(spot)
  updateYrTable(spot)
  updateYrCoastTable(spot)
}

export function initSpotList() {
  createSpotList();
  let spotList = document.querySelector('#navbar-spot');
  spotList.addEventListener('change', onSpotChanged)

  //Trigger change event
  let evt = document.createEvent("HTMLEvents");
  evt.initEvent('change', false, true);
  spotList.dispatchEvent(evt);
}

export function selectedSpot() {
  return document.querySelector('#navbar-spot').value;
}

export const setSpotListTo = (spot) => {
  document.querySelector('#navbar-spot').value = spot
}