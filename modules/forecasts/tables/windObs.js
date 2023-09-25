import { div } from '../../components/elements.js';
import { arrow } from '../../components/icons.js';
import { get, queryTimespan } from '../../utils/api.js';
import { stationsCols, updateForecastTable, addObsToMap } from './table.js';
import { toLocal } from '../../utils/time.js'
import { mergeTimeseries, round } from '../../utils/utilities.js';
import { tile } from '../../components/dashboard/tile.js'
import { indicator } from '../../components/dashboard.js'
import { getVal } from '../../config/forecastValues.js';
import { direction } from '../../config/forecasts.js';
import { drawLineChart } from '../../components/charts.js';
import { chartOption } from "../../config/charts.js"

const windObsToRow = (f) => {
  return stationsCols(f, {
    wind: 'fetch', 
    paramNames: ['windspeed', 'winddir']
  })
}

function updateWindObsTable(frostStations) {
  let headers = frostStations.map(station => station.name)
  let timeserie = mergeTimeseries(frostStations)
  updateForecastTable(timeserie, getWindObsTime, windObsToRow, 'windObs', ['Tid', ...headers])
}

function getWindObsTime(forecast) {
  return toLocal(forecast.utctime)
}

export async function getWindObs(start, end) {
  let query = queryTimespan(start, end)
  let frostStations = await get(`observations/frost${query}`)
  addObsToMap(frostStations)
  updateWindObsTable(frostStations);
  addObsToDash(frostStations[0])
}

const addObsToDash = (obs) => {
  let container = document.getElementById('buoy-tile-group')
  
  let chartContainer = div('tile-chart-line')
  let chartData = obs.data.map(o => {
    let wh = o.waveheight
    if (wh) return [o.utctime, wh]
  })
  chartData = chartData.filter( Boolean )

  drawLineChart(chartContainer, ['Tid', 'Høyde (m)'], chartData, chartOption('mdTile'))

  let data = obs.data.findLast(o => o.waveheight)
  let frostTile = tile({
    title: data.name,
    contents: [div('flex-row', [
      indicator(
        'Bølgehøyde', 
        getVal(data, 'waveheight'), 
        null,
        null, 'sm'),
      indicator(
        'Periode', 
        getVal(data, 'waveperiod'), 
        null, 
        null, 'sm'),
      indicator(
        'Vind', 
        getVal(data, 'windspeed'), 
        null, 
        null, 'sm'),
      indicator('Retning', arrow(data.winddir), `${round(data.winddir, 0)} ${direction(data.winddir).short}`, null, 'sm'),
    ]),
    div('flex-row center2', chartContainer)],
    footer: `Sist oppdatert ${moment(data.utctime).calendar()}`,
    id: 'frost',
    onSelect: tileSelected})

  container.insertBefore(frostTile, container.childNodes[6])
}

const tileSelected = () => {
  console.log('TODO: Frost Ekofisk tile selected')
}