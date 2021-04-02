import { log, notify } from './logger.js';
import { urlAPI } from '../config/datasources.js';

function makeUrl(url) {
  return (url.includes('http') ? url : `${urlAPI}${url}`)
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

export async function post(url, data) {
  let response = await fetch(makeUrl(url), {
    body: data,
    method: 'POST'})

  if (response) return getData(response);
}

export async function get(url, returnCount = false) {
  let response = await fetch(makeUrl(url))
  if (response) return getData(response, returnCount);
}

export async function del(url) {
  let response = await fetch(makeUrl(url), {method: 'DELETE'})
  if (response) return getData(response);
}