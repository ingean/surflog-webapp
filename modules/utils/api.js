import { log, notify } from './logger.js';
import { urlAPI, urlYr, urlSunTimes } from '../config/datasources.js';

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