import { hrsTd, td, tr } from '../../components/elements.js';
import { get} from '../../utils/api.js';
import { isDayTime } from '../../utils/time.js';
import { updateForecastTable } from './table.js';
import { getStats } from '../../utils/statistics.js';
import { paramSpan } from '../../config/forecastValues.js';

const model = 'wam_dw'; // Model name for DMI API forecast
const headers = ['Tid', 'Bølger', 'Dønning', 'Vind'];
var stats = {}

function dmiAPIForecastToRow(forecast) {
  let options = {stats: stats}
  let emphasis = (isDayTime(getDMIAPITime(forecast))) ? 'tr-scope' : 'tr-outofscope';
  return (
    tr(`forecast-table-row ${emphasis}`, [
      hrsTd(getDMIAPITime(forecast)),
      td( '', [
            paramSpan(forecast, 'waveheight', options),
            paramSpan(forecast, 'waveperiod', options),
            paramSpan(forecast, 'wavedir', options)
          ]),
      td( '', [
            paramSpan(forecast, 'swellheight', options),
            paramSpan(forecast, 'swellperiod', options),
            paramSpan(forecast, 'swelldir', options)
          ]),
      td( '', [
            paramSpan(forecast, 'windspeed', options),
            paramSpan(forecast, 'winddir', options)
          ])
    ])
  )
}

export async function updateDMIAPITable() {
  stats = await getStats('dmi')
  updateForecastTable(dmiApiForecast.data, getDMIAPITime, dmiAPIForecastToRow, 'dmiApi', headers);
}

function getDMIAPITime(forecast) {
  return forecast.utctime;
}

export var dmiApiForecast = [];

export async function getDMIAPIForecast() {
  dmiApiForecast = await get(`forecasts/dmi_api/${model}`);
  updateDMIAPITable();
}