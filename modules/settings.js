import { log } from './utils/logger.js';
import { get } from './utils/api.js';
import { formsOptions } from './config/formsOptions.js';
import { createForms } from './html/form.js';

export var settings = [];
export var statistics = {};
export var user;

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
  let places = await get(`places/spots`);

  let countries = getUnique(places, 'country');
  let locations  = getUnique(places, 'location');
  let spots = getUnique(places, 'spot');

  formsOptions[1].domain = domain(countries, 'Norge');
  formsOptions[2].domain = domain(locations, 'Oslofjorden');
  formsOptions[3].domain = domain(spots, 'Saltstein');
  createForms();
}

export async function getSettings(userId) {
  settings = await get(`settings/${userId}`);
}

export function setUser(loggedInUser) {
  user = loggedInUser;
}

export async function getStatistics(type = 'forecasts') {
  statistics = await get(`statistics/${type}`);
}





