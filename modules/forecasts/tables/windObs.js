import { div } from '../../components/elements.js';
import { arrow } from '../../components/icons.js';
import { get, queryTimespan } from '../../utils/api.js';
import { stationsCols, updateForecastTable, addObsToMap } from './table.js';
import { toLocal } from '../../utils/time.js'
import { mergeTimeseries } from '../../utils/utilities.js';

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
  //addObsToDash(frostStations)
}

const addObsToDash = (obs) => {
  let container = document.getElementById('buoy-db-container')
  
  let chartContainer = div('tile-chart-line')
  let chartData = obs.data.filter(o => o.stations["SN76920:0"].waveheight).map(o => {
    let wh = o.waveheight
    if (wh) return [o.localtime, wh, whf]
  })
  drawLineChart(chartContainer, ['Tid', 'Høyde (m)'], chartData, chartOption('mdTile'))

  let data = getLastSMHIObs(obs)
  return tile({
    title: 'Ekofisk',
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
    footer: `Sist oppdatert ${moment(data.localtime).calendar()}`,
    id: 'smhi',
    onSelect: tileSelected})
  
}