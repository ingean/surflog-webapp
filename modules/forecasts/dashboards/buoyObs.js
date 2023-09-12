import { tile, checkTile, indicator } from "../../components/dashboard.js"
import { div, tempSpan } from "../../components/elements.js"
import { arrow } from '../../components/icons.js';
import { formatValue, valueRating } from '../../forecasts/format.js'
import { toLocal } from "../../utils/time.js";
import { direction } from "../../config/forecasts.js";
import { round } from '../../utils/utilities.js';
import { updateBuoyObsTable, smhiBuoys, ukBuoys } from "../tables/buoyObs.js";

var buoyStats = {}

function rating(obj, param) {
  let options = {stats: buoyStats}
  return valueRating(obj, param, options)
}

function smhiRating(obj, param) {
  let options = {stats: buoyStats}
  return valueRating(obj, param, options)
}

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
      indicator('Bølgehøyde', formatValue(data, 'waveheight'), null, rating(data, 'waveheight'), 'sm'),
      indicator('Periode', formatValue(data, 'waveperiod'), null, rating(data, 'waveperiod'), 'sm'),
      indicator('Vind', formatValue(data, 'windspeed', 'wind'), null, rating(data, 'windspeed'), 'sm'),
      indicator('Vinddir', arrow(data.winddir), `${data.winddir} ${direction(data.winddir).short}`, null, 'sm')
    ]),
    div('flex-row', [
      indicator('Lufttrykk', round(data.airpressure, 0), 'hPa', null, 'sm'),
      indicator('Lufttemp', tempSpan('', data.airtemp), null, null, 'sm')
    ]), 
    `Sist oppdatert ${moment(toLocal(data.utctime)).calendar()}`,
    null,
    'md',
    true,
    obs.id,
    tileSelected)
}

const smhiTile = (obs) => {
  let data = getLastSMHIObs(obs)
  return tile(
    'Väderöerna',
    div('flex-row', [
      indicator('Bølgehøyde', formatValue(data, 'waveheight'), `Max: ${formatValue(data, 'waveheightmax')}`, smhiRating(data, 'waveheight'), 'sm'),
      indicator('Periode', formatValue(data, 'waveperiod'), null, smhiRating(data, 'waveperiod'), 'sm'),
      indicator('Retning', arrow(data.wavedir), `${round(data.wavedir, 0)} ${direction(data.wavedir).short}`, null, 'sm'),
      indicator('Varsel', formatValue(data, 'waveheightforecast'), null, smhiRating(data, 'waveheight'), 'sm')
    ]),
    null,
    `Sist oppdatert ${moment(data.localtime).calendar()}`,
    null,
    'md',
    true,
    'smhi',
    tileSelected)
}

export const updateBuoyDashboard = (stats, ukBuoys, smhiBuoys) => {
  buoyStats = stats
  let tiles = ukBuoys.map(o => ukTile(o))
  tiles.push(smhiTile(smhiBuoys))

  let container = document.getElementById('buoy-db-container')
  container.appendChild(div({id: 'buoy-tile-group', class: 'flex-row'}, tiles))
}

const tileSelected = (e) => {
  let input = e.currentTarget
  checkTile(input)
  
  if (input.id === 'smhi') {
    updateBuoyObsTable(smhiBuoys)
  } else {
    let ukBuoy = ukBuoys.find(b => b.id === input.id)
    if (ukBuoy) {
      updateBuoyObsTable(ukBuoy.data, false)
    } else {
      updateBuoyObsTable(ukBuoys[0].data, false)
    }
  }
}

