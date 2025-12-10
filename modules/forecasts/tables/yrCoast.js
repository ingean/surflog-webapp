import { el, span, weatherImg, tempTd, hrsTd } from '../../components/elements.js';
import { getYrCoast } from '../../utils/api.js';
import { isDayTime, toLocal } from '../../utils/time.js';
import { updateForecastTable } from './table.js';
import { getStats } from '../../utils/statistics.js';
import { paramSpan } from '../../config/forecastValues.js';

const headers = ['Tid', 'Vær', 'Temp', 'Høyde', 'Vind (byge)', 'Strøm', 'Vanntemp.'];
var stats = {}

const value = (f, param) => {
  let options = {
    stats, 
    station: 'Saltstein',
    wind: 'local'
  }

  return paramSpan(f, param, options)
}

function yrCoastForecastToRow(f) {
  let emphasis = (isDayTime(f.utctime)) ? 'tr-scope' : 'tr-outofscope';
  return (
    el('tr', `forecast-table-row ${emphasis}`, [
      hrsTd(f.utctime),
      el('td', '', weatherImg(f.weathersymbol)),
      tempTd(f.airtemp),
      el('td', '', yrCoastWaveGroup(f)),
      el('td', '', yrCoastWindGroup(f)),
      el('td', 'hidden-xs', [ //Current speed and direction
        value(f, 'currentspeed'),
        value(f, 'currentdir')
      ]),
      tempTd(f.watertemp),
    ])
  )
}

export var yrCoastForecast = []

export function yrCoastWaveGroup(forecast) {
  return span('params-group params-group-waves', [
    value(forecast, 'waveheight'),
    value(forecast, 'wavedir')
  ]);
}

export function yrCoastWindGroup(forecast) {
  return span('params-group', [
    value(forecast, 'windspeed'),
    value(forecast, 'windgust'),
    value(forecast, 'winddir')
  ]);
}


export async function updateYrCoastTable(spot = 'Saltstein') {
  stats = await getStats('yr')
  updateForecastTable(yrCoastForecast.data, getYrCoastTime, yrCoastForecastToRow, 'yrCoast', headers);
}

function getYrCoastTime(forecast) {
  return toLocal(forecast.utctime)
}

export async function getYrCoastForecast(yrId) {
  yrCoastForecast = await getYrCoast(yrId);
  updateYrCoastTable();
}