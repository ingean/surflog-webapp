import { spotIds } from '../config/lookups.js';
import { formsOptions } from '../config/formsOptions.js';
import { el } from '../html/elements.js';
import { formSelectInput } from '../html/formGroup.js';
import { updateStationCard } from '../forecasts/stationCard.js';
import { updateStatsCard } from '../forecasts/dmiStatsCard.js';
import { getYrCoastForecast } from '../forecasts/yrCoastTable.js'; 

function clearInput(e) {
  let input = e.target.parentElement.parentElement.nextElementSibling;
  input.value = '';
}

function createSpotList() {
  let options = formsOptions.find(item => item.name === 'spot');
  options.formName = 'navbar'
  options.id = `${options.formName}-${options.name}`;
  let spots = el('div', 'input-group', formSelectInput(options));
  document.querySelector('#navbar-spots-list')
  .replaceChildren(spots);

  document.querySelectorAll('.btn-clear-datalist')
  .forEach(e => e.addEventListener('click', clearInput))
}


async function onSpotChanged(e) {
  let spot = e.target.value;
  let yrId = spotIds[spot].yr.id;
  await updateStationCard(spot);
  updateStatsCard('dmi', spot);
  getYrCoastForecast(yrId);
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