import { el, arrow, tempTd, hrsTd } from '../../html/elements.js';
import {getDirFromTxt} from '../../config/forecasts.js';
import { updateForecastTable, display } from './forecast.js';
import { getUKCoast } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';


const headers = ['Tid', 'Temperatur', 'Lufttrykk', 'Vind', 'Bølgehøyde', 'Bølgeperiode', 'Vanntemp'];


function ukForecastToRow(f) {
  let emphasis = (isDayTime(f.time)) ? 'emphasis-row' : '';
  let v = f.stations[0];
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(f.time),
      tempTd(v.temp),
      el('td', 'td-s', display(v, 'pressure')),
      el('td', 'td-l', [ //Wind speed and direction
        el('span', 'td-value', display(v, 'windspeed')),
        el('span', 'td-arrow', arrow(v.winddir)),
      ]),
      el('td', 'td-s', display(v, 'waveheight')),
      el('td', 'td-s', display(v, 'waveperiod')),
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
    let winddir = getDirFromTxt(values.D)
    time = period.value;
    return {
      id: station.i,
      name: station.name,
      temp: Number(values.T) || null,
      pressure: Number(values.P) || null,
      windspeed: convertKnots(values.S) || null,
      winddir: winddir.mid || null,
      waveheight: Number(values.Wh) || null,
      waveperiod: Number(values.Wp) || null,
      watertemp: Number(values.St) || null
    } 
  })
  return {
    time: `${time}00:00:00`,
    stations: stations
  };
}

function convertKnots(kts) {
  return Number(kts) * 0.514444
}

function updateUKTable(forecasts) {
  let forecast = convertData(forecasts)
  updateForecastTable(forecast, getUKTime, ukForecastToRow, 'northsea', headers);
}

function getUKTime(forecast) {
 return forecast.time;
}

export async function getUKForecast() {
  getUKCoast()
  .then(forecasts => updateUKTable(forecasts))
  .catch()
}