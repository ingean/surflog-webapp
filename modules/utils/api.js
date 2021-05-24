import { log, notify } from './logger.js';
import { urlAPI, urlYr, urlSunTimes, forecastSources } from '../config/datasources.js';
import { selectedSpot } from '../html/spotInput.js';
import { getDMITime } from '../forecasts/dmiImages.js';

function makeUrl(url) {
  return (url.includes('http') ? url : `${urlAPI}${url}`)
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DDTHH:mm:ss');
}

async function getData(response, returnCount = false) {
  if (response.status === 204) return; //Request successful, but no data found on server
  
  let data = await response.json()
  if (response.ok && response.status >= 200 && response.status < 300) {
    if (returnCount) {
      return {data: data, count: response.headers.get('X-Total-Count')};
    } else{
      return data
    } 
  } else {
    if (data) {
      log(data.error, data.message);
      return null;
    } else {
      log(null, 'API-forespørselen feilet uten å gi noe feil');
    }
  }
}

export function queryTimespan(start, end) {
  if (!start) return '';
  let endpart = (end) ? `&endtime=${formatDate(end)}` : '';
  return `?starttime=${formatDate(start)}${endpart}`;
}


export async function post(url, data) {
  let response = await fetch(makeUrl(url), {
    body: data,
    method: 'POST'})

  if (response) return getData(response);
}

export async function get(url, returnCount = false) {
  let response = await fetch(makeUrl(url));
  if (response) return getData(response, returnCount);
}

export async function del(url) {
  let response = await fetch(makeUrl(url), {method: 'DELETE'})
  if (response) return getData(response);
}

export async function getSunTimes(lat, lon) {
  let ds = moment().format('YYYY-MM-DD');
  let url = `${urlSunTimes}?lat=${lat}&lng=${lon}&date=${ds}`;
  return get(url);
}

export async function getYrLocation(yrId) {
  return get(`${urlAPI}proxy/yr?id=${yrId}`) // CORS on Yr endpoint, hence surflog as proxy
}

export async function getYrTides(yrId) {
  return get(`${urlAPI}proxy/yr?id=${yrId}&endpoint=tide`) // CORS on Yr endpoint, hence surflog as proxy
}

export async function getYrCoast(yrId) {
  return get(`${urlYr}${yrId}/forecast/coast`);
}

export async function getUKCoast() {
  let requests = [];
  let baseUrl = forecastSources.uk.url;
  let key = forecastSources.uk.apiKey;
  let locations = forecastSources.uk.locations;
  locations.forEach(l => {
    requests.push(get(`${baseUrl}${l.id}?res=3hourly&key=${key}`));
  })
  return Promise.all(requests);
}

export function getTwin() {
  let time = moment(getDMITime()).format('YYYY-MM-DDTHH:mm:ss');
  return get(`${urlAPI}forecasts/dmi/${time}/twin?spot=${selectedSpot()}`);
}

export function getComparison(date) {
  let time = moment(getDMITime()).format('YYYY-MM-DDTHH:mm:ss');
  return get(`${urlAPI}forecasts/dmi/${time}/compare?timestamp=${moment(date).format('YYYY-MM-DDTHH:00:00')}`);
}