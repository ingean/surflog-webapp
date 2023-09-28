import { log, notify } from './logger.js';
import { urlAPI, urlYr, urlSunTimes, forecasts } from '../config/datasources.js';
import { selectedSpot } from '../components/spotInput.js';
import { getImgTime } from '../forecasts/images/forecast.js';

export function makeUrl(url) {
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
      log(null, 'API-forespørselen feilet uten å gi noe feilmelding');
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
  let fin = 'hh:mm:ss a'
  let fout = 'HH:mm'
  let url = `${urlSunTimes}?lat=${lat}&lng=${lon}&date=today`
  let result = await get(url)
  
  if (!result) return

  let r = result.results

  return {
    sunrise: moment(r.sunrise, fin).format(fout),
    sunset: moment(r.sunset, fin).format(fout),
    firstLight: moment(r.dawn, fin).format(fout),
    lastLight: moment(r.dusk, fin).format(fout)
  }
}

export async function getYrLocation(yrId) {
  return get(`forecasts/yr/${yrId}`)
}

export async function getYrTides(yrId) {
  return get(`forecasts/yr/${yrId}`)
}

export async function getYrCoast(yrId) {
  return get(`forecasts/yr/${yrId}`)
}

export function getMetForecast() {
  let requests = [];
  let baseUrl = forecasts.met.url;
  let locations = forecasts.met.locations;
 
  locations.forEach(l => {
    requests.push(get(`${baseUrl}?lat=${l.lat}&lon=${l.lon}`));
  })
  return Promise.all(requests);
}

export function getTwin() {
  let time = moment(getImgTime()).format('YYYY-MM-DDTHH:mm:ss');
  return get(`${urlAPI}forecasts/dmi/${time}/twin?spot=${selectedSpot()}`);
}

export function getComparison(date) {
  let time = moment(getImgTime()).format('YYYY-MM-DDTHH:mm:ss');
  return get(`${urlAPI}forecasts/dmi/${time}/compare?timestamp=${moment(date).format('YYYY-MM-DDTHH:00:00')}`);
}

export async function getStatistics(forecast = 'msw', spot = 'Saltstein') {
  let stats = await get(`${urlAPI}statistics/forecasts2?forecast=${forecast}&spot=${spot}`);
  let result = {}
  stats.forEach(stat => {
    if (stat.score >= 0) {
      if (forecast == 'yr') {
        if (stat.station) {
          if (result[stat.score]) {
            result[stat.score][stat.station] = stat
          } else {
            result[stat.score] = {}
            result[stat.score][stat.station] = stat
          }
        }
      } else {
        result[stat.score] = stat
      }
    }
  })
  return result
}