import { tile, indicator } from "../../components/dashboard.js"
import { div, tempSpan } from "../../components/elements.js"
import { arrow } from '../../components/icons.js';
import { formatValue } from '../../forecasts/format.js'
import { toLocal } from "../../utils/time.js";
import { direction } from "../../config/forecasts.js";
import { round } from '../../utils/utilities.js';

const getLastObs = (obs) => {
  return obs.find(o => o.waveheight)
}

const getLastSMHIObs = (obs) => {
  let lastObs = null
  obs.forEach(o => {
    let wh = o.stations['Väderöerna'].waveheight
    if (wh) lastObs = o
  })
  return lastObs.stations['Väderöerna']
}

const ukTile = (obs) => {
  let data = getLastObs(obs.data)
  return tile(
    obs.name, 
    div('flex-row', [
      indicator('Bølgehøyde', formatValue(data, 'waveheight'), null, null, 'sm'),
      indicator('Periode', formatValue(data, 'waveperiod'), null, null, 'sm'),
      indicator('Vind', formatValue(data, 'windspeed', 'wind'), null, null, 'sm'),
      indicator('Vinddir', arrow(data.winddir), `${data.winddir} ${direction(data.winddir).short}`, null, 'sm')
    ]),
    div('flex-row', [
      indicator('Lufttrykk', round(data.airpressure, 0), 'hPa', null, 'sm'),
      indicator('Lufttemp', tempSpan('', data.airtemp), null, null, 'sm')
    ]), 
    `Sist oppdatert ${moment(toLocal(data.utctime)).calendar()}`)
}

const smhiTile = (obs) => {
  let data = getLastSMHIObs(obs)
  return tile(
    'Väderöerna',
    div('flex-row', [
      indicator('Bølgehøyde', formatValue(data, 'waveheight'), `Max: ${formatValue(data, 'waveheightmax')}`, null, 'sm'),
      indicator('Periode', formatValue(data, 'waveperiod'), null, null, 'sm'),
      indicator('Retning', arrow(data.wavedir), `${round(data.wavedir, 0)} ${direction(data.wavedir).short}`, null, 'sm'),
      indicator('Varsel', formatValue(data, 'waveheightforecast'), null, null, 'sm')
    ]),
    null,
    `Sist oppdatert ${moment(data.localtime).calendar()}`)
}

export const updateBuoyDashboard = (ukBuoys, smhiBuoys) => {
  let tiles = ukBuoys.map(o => ukTile(o))
  tiles.push(smhiTile(smhiBuoys))

  let container = document.getElementById('buoy-db-container')
  container.appendChild(div('flex-row', tiles))
}