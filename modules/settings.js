import { log } from './utils/logger.js';
import { urlAPI } from './config/datasources.js';
import { formsOptions } from './config/forms.js';
import { createForms } from './utils/html/forms.js';

export var settings = [];

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getUnique(objArray, key) {
  let list = objArray.map(a => a[key]);
  return list.filter(onlyUnique);
}

function domain(list, defaultValue) {
  let domain = [];
  for (let item of list) {
    let d = {caption: item};
    if (item === defaultValue) {
      d['default'] = true;
    }
    domain.push(d)
  }
  return domain;
}


export async function getPlacesCreateForms() {
  let response = await fetch(`${urlAPI}places/spots`).catch(e => {
    log(e, 'Klarte ikke hente oversikt over land, områder og surfesteder');
  })

  let places = await response.json();

  let countries = getUnique(places, 'country');
  let locations  = getUnique(places, 'location');
  let spots = getUnique(places, 'spot');

  formsOptions[0].domain = domain(countries, 'Norge');
  formsOptions[1].domain = domain(locations, 'Oslofjorden');
  formsOptions[2].domain = domain(spots, 'Saltstein');
  createForms(['session', 'observation', 'filter']);
}

export async function getSettings(userId) {
  let response = await fetch(`${urlAPI}settings/${userId}`).catch(e => {
    log(e, `Kunne ikke hente brukerinstillinger for bruker-ID: ${userId}`);
  });
  settings = await response.json();
  return settings;
}





