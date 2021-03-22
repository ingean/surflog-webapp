import { log, notify } from './logger.js';
import { urlAPI } from '../config/datasources.js';

async function getData(response, returnCount = false) {
  let data = await response.json()
  
  if (response.ok && response.status >= 200 && response.status < 300) {
    if (returnCount) {
      return {data: data, count: response.headers.get('X-Total-Count')};
    } else{
      return data
    } 
  } else {
    log(data.error, data.message);
    return null;
  }
} 

export async function post(url, data) {
  let response = await fetch(`${urlAPI}${url}`, {
    body: data,
    method: 'POST'})

  if (response) return getData(response);
}

export async function get(url, returnCount = false) {
  let response = await fetch(`${urlAPI}${url}`)
  if (response) return getData(response, returnCount);
}

export async function del(url) {
  let response = await fetch(`${urlAPI}${url}`, {method: 'DELETE'})
  if (response) return getData(response);
}