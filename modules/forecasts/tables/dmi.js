import { hrsTd, td, tr, span } from '../../components/elements.js';
import { get, queryTimespan } from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { updateForecastTable } from './table.js';
import { getStats } from '../../utils/statistics.js';
import { paramSpan } from '../../config/forecastValues.js';
import { mergeTimeseries } from '../../utils/utilities.js';

const headers = ['Tid','Skagerak','Saltstein']
var stats = {}

function dmiForecastToRow(forecast) {
  const options = {stats: stats}
  const emphasis = (isDayTime(getDMITime(forecast))) ? 'tr-scope' : 'tr-outofscope';
  return (
    tr(`forecast-table-row ${emphasis}`, [
      hrsTd(getDMITime(forecast)),
      td( '', [
        span('params-group params-group-waves', [
          paramSpan(forecast.Skagerak, 'waveheight', options),
          paramSpan(forecast.Skagerak, 'waveperiod', options),
        ]),
        span('params-group', [  
          paramSpan(forecast.Skagerak, 'swellheight', options),
          paramSpan(forecast.Skagerak, 'swellperiod', options)
        ]),
        span('params-group', [  
          paramSpan(forecast.Skagerak, 'wind', options)
        ])
      ]),
      td( '', [
        span('params-group params-group-waves', [
          paramSpan(forecast.Saltstein, 'waveheight', options),
          paramSpan(forecast.Saltstein, 'waveperiod', options),
        ]),
        span('params-group', [  
          paramSpan(forecast.Saltstein, 'swellheight', options),
          paramSpan(forecast.Saltstein, 'swellperiod', options)
        ]),
        span('params-group', [  
          paramSpan(forecast.Saltstein, 'wind', options)
        ])
      ])
    ])
  )
}

export async function updateDMITable() {
  stats = await getStats('dmi')
  let timeseries = mergeTimeseries(dmiForecast)
  updateForecastTable(timeseries, getDMITime, dmiForecastToRow, 'dmi', headers);
}

function getDMITime(forecast) {
  return forecast['Saltstein'].utctime;
}

export var dmiForecast = [];

export async function getDMIForecast(start, end) {
  const query = queryTimespan(start, end);
  dmiForecast = await get(`forecasts/dmi${query}`);
  updateDMITable();
}