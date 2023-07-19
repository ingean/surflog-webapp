import { el, tempTd, hrsTd } from '../../components/elements.js';
import { arrow } from '../../components/svg.js';
import { directionFromText } from '../../config/forecasts.js';
import { getUKCoast } from '../../utils/api.js';
import { isDayTime, toLocal, toUTC } from '../../utils/time.js';
import { formatValue } from '../format.js';
import { updateForecastTable } from './table.js';


const headers = ['Tid', 'Temperatur', 'Lufttrykk', 'Vind', 'Bølgehøyde', 'Bølgeperiode', 'Vanntemp'];


function ukForecastToRow(f) {
  let emphasis = (isDayTime(f.localtime)) ? 'tr-scope' : '';
  let v = f.stations[0];
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(f.localtime),
      tempTd(v.temp),
      el('td', 'td-s', formatValue(v, 'pressure')),
      el('td', 'td-l', [ //Wind speed and direction
        el('span', 'td-value', formatValue(v, 'windspeed', false, 'wind')),
        el('span', 'td-arrow', arrow(v.winddir)),
      ]),
      el('td', 'td-s', formatValue(v, 'waveheight')),
      el('td', 'td-s', formatValue(v, 'waveperiod')),
      tempTd(v.watertemp)
    ])
  )
}

function convertData(forecasts) {
  let forecast = [];
  let period = forecasts[0].SiteRep.DV.Location.Period;
  
  for (let i = 0; i < period.length; i++) {
    
    let rep = period[i].Rep;

    if (Array.isArray(rep)) {
      for (let j = 0; j < rep.length; j++) {
        forecast.push(createForecast(forecasts, i, j))
      }
    } else {
      forecast.push(createForecast(forecasts, i))
    }  
  }

  return forecast
}

function createForecast(forecasts, periodInd, repInd = null) {
  let time = '';
  let stations = forecasts.map(f => {
    let station = f.SiteRep.DV.Location
    if (!station) return '';
    let period = station.Period[periodInd]; 
    let values = (repInd == null)? period.Rep : period.Rep[repInd];
    let winddir = directionFromText(values.D)
    time = moment(period.value).add(values['$'], 'minutes')
    return {
      id: station.i,
      name: station.name,
      temp: Number(values.T) || null,
      pressure: Number(values.P) || null,
      windspeed: convertKnots(values.S) || null,
      winddir: winddir || null,
      waveheight: Number(values.Wh) || null,
      waveperiod: Number(values.Wp) || null,
      watertemp: Number(values.St) || null
    } 
  })
  return {
    localtime: time,
    utctime: toUTC(time),
    stations: stations
  };
}

function convertKnots(kts) {
  return Number(kts) * 0.514444
}

function updateUKTable() {
  let forecast = convertData(ukForecast)
  updateForecastTable(forecast, getUKTime, ukForecastToRow, 'northsea', headers);
}

function getUKTime(forecast) {
 return forecast.localtime;
}

export var ukForecast = []

export async function getUKForecast() {
  ukForecast = await getUKCoast()
  updateUKTable()
}