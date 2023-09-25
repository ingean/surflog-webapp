import { indicator } from "../../components/dashboard.js"
import { chartOption } from "../../config/charts.js"
import { drawLineChart } from "../../components/charts.js";
import { div, tempSpan } from "../../components/elements.js"
import { arrow } from '../../components/icons.js';
import { valueRating, formatWH, formatWHF, formatWP, formatW } from '../../forecasts/format.js'
import { toLocal } from "../../utils/time.js";
import { direction } from "../../config/forecasts.js";
import { round } from '../../utils/utilities.js';
import { updateBuoyObsTable, smhiBuoys, ukBuoys } from "../tables/buoyObs.js";
import { getSMHIStats } from "../tables/smhi.js";
import { minObj, maxObj } from "../../utils/utilities.js";
import { tile, checkTile } from "../../components/dashboard/tile.js"

var buoyStats = {}
var smhibuoyStats = {}

function rating(obj, param) {
  let options = {stats: buoyStats}
  return valueRating(obj, param, options)
}

function smhiRating(obj, param) {
  let options = {stats: smhibuoyStats}
  return valueRating(obj, param, options)
}

const getLastObs = (obs) => {
  return obs.find(o => o.waveheight)
}

export const getLastSMHIObs = (obs) => {
  let lastObs = null
  obs.data.forEach(o => {
    let wh = o.waveheight
    if (wh) lastObs = o
  })
  return lastObs
}

export function ukWH(o) { return o.waveheight}
export function smhiWH(o) { return o.waveheight }
export function ukWP(o) { return o.waveperiod}
export function smhiWP(o) { return o.waveperiod }
export function ukW(o) { return o.windspeed}
export function smhiW(o) { return o.windspeed }
export function ukP(o) { return o.airpressure}
export function ukAT(o) { return o.airtemp}
export function smhiWHF(o) { return o.waveheightforecast }

const ukTile = (obs) => {
  let obsData = obs.data.toReversed()
  let chartContainer = div('tile-chart-line')
  let chartData = obsData.map(o => [o.utctime, o.waveheight])
  drawLineChart(chartContainer, ['Tid', `Høyde (m)`], chartData, chartOption('mdTile'))
  
  let data = getLastObs(obs.data)

  return tile({
    title: obs.name, 
    contents: [div('flex-row', [
      indicator(
        'Bølgehøyde', 
        formatWH(data), 
        `Max: ${formatWH(maxObj(obs.data, ukWH))}`, 
        rating(data, 'waveheight'), 'sm'),
      indicator(
        'Periode', 
        formatWP(data), 
        `Max: ${formatWP(maxObj(obs.data, ukWP))}`,  
        rating(data, 'waveperiod'), 'sm'),
      indicator(
        'Vind', 
        formatW(data, 'windspeed'), 
        `Max: ${formatW(maxObj(obs.data, ukW), 'windspeed')}`, 
        rating(data, 'windspeed'), 'sm'),
      indicator('Vinddir', arrow(data.winddir), `${data.winddir} ${direction(data.winddir).short}`, null, 'sm')
    ]),
    div('flex-row', [
      indicator(
        'Lufttrykk', 
        round(data.airpressure, 0), 
        `Min: ${round(minObj(obs.data, ukP))}`, 
        rating(data, 'airpressure'), 'sm'),
      indicator(
        'Lufttemp', 
        tempSpan('', data.airtemp), 
        `Min: ${round(minObj(obs.data, ukAT).airtemp)}°`,  
        null, 'sm'),
      ]),
      div('flex-row center2', chartContainer)
    ], 
    footer: `Sist oppdatert ${moment(data.utctime).calendar()}`,
    id: obs.id,
    onSelect: tileSelected})
}

const smhiTile = (obs) => {
  let chartContainer = div('tile-chart-line')
  let chartData = obs.data.filter(o => o.waveheight).map(o => {
    let wh = o.waveheight
    let whf = o.waveheightforecast
    if (whf) return [o.utctime, wh, whf]
  })
  drawLineChart(chartContainer, ['Tid', 'Høyde (m)', 'Varsel (m)'], chartData, chartOption('mdTile'))

  let data = getLastSMHIObs(obs)
  return tile({
    title: 'Väderöerna',
    contents: [div('flex-row', [
      indicator(
        'Bølgehøyde', 
        formatWH(data), 
         `Max: ${formatWH(maxObj(obs.data, smhiWH))}`,
        smhiRating(data, 'waveheight'), 'sm'),
      indicator(
        'Periode', 
        formatWP(data),
        `Max: ${formatWP(maxObj(obs.data, smhiWP))}`, 
        smhiRating(data, 'waveperiod'), 'sm'),
      indicator('Retning', arrow(data.wavedir), `${round(data.wavedir, 0)} ${direction(data.wavedir).short}`, null, 'sm'),
      indicator(
        'Varsel', 
        formatWHF(data), 
        `Max: ${formatWHF(maxObj(obs.data, smhiWHF))}`, 
        smhiRating(data, 'waveheight'), 'sm')
    ]),
    div('flex-row center2', chartContainer)],
    footer: `Sist oppdatert ${moment(data.utctime).calendar()}`,
    id: 'smhi',
    onSelect: tileSelected})
}

export const updateBuoyDashboard = (stats, smhiStats, ukBuoys, smhiBuoys) => {
  buoyStats = stats
  smhibuoyStats = smhiStats
  let tiles = ukBuoys.map(o => ukTile(o))
  tiles.push(smhiTile(smhiBuoys))
  let container = document.getElementById('buoy-db-container')
  container.appendChild(div({id: 'buoy-tile-group', class: 'flex-row center-h'}, tiles))
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

