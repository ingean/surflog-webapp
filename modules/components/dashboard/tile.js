import { el, div } from '../elements.js'
import { icon } from '../icons.js'
import { indicator } from "../dashboard.js"
import { paramCaption, paramVal, paramMin, paramMax, paramReference, paramDir } from "../../config/forecastValues.js"
import { valueRating } from "../../forecasts/format.js"
import { toChunks } from '../../utils/utilities.js'
import { drawLineChart } from '../charts.js'
import { chartOption } from '../../config/charts.js'

export const tile = (options) => {
  let o = options
  
  o.size = o.size || 'md'
  o.icon = (o.contents.length > 1) ? 'transfer' : o.icon
  
  let content = o.contents[0]
  let header = []

  if (o.onSelect) {
    let radio = el('input', {id: o.id, type: 'radio', class: 'tile-radio'})
    radio.addEventListener('click', o.onSelect)
    header.push(radio)
  }

  if (o.title) header.push(div('tile-title', o.title))

  let tileIcon = icon(o.icon, 'tile-icon align-right')
  header.push(tileIcon)

  let contentContainer = div({class: 'tile-content', dataContent: 0 }, content)

  let body = [
    div('tile-header flex-row center-v', header),
    contentContainer,
    div('tile-footer flex-row', o.footer)
  ]
 
  let tile = div(`tile tile-${o.size}`, body)

  if (o.contents.length > 1) {
    tileIcon.addEventListener('click', e => {
      let i = contentContainer.dataContent + 1
      i = (i <o.contents.length) ? i : 0
      content = o.contents[i]
      contentContainer.dataContent = i
      tile.getElementsByClassName('tile-content')[0].replaceChildren(content)
    })
  }
  return tile
}

export const checkTile = (clickedRadio) => {
  let tilecontainer = document.getElementById('buoy-tile-group')
  let tiles = Array.from(tilecontainer.children)
  tiles.forEach(tile => {
    let input = tile.children[0].children[0]
    input.checked = false
  })
  clickedRadio.checked = true
}

export const stationTile = (obj, options) => {
  let params = options.params || Object.keys(obj.data[0]).slice(1)
  let indicators = []
  let lastUpdated = null

  params.forEach(param => {
    let data = getLastDataPoint(obj, param)
    let ref = paramReference(param)
    let footer = null

    if (param.includes('dir')) {
      footer = paramDir(data[param])
    } else {
      footer = (ref === 'Max') ? `Max: ${paramMax(obj.data, param)}` : `Min: ${paramMin(obj.data, param)}`
    }

    indicators.push(indicator(
      paramCaption(param),
      paramVal(data, param),
      footer,
      null,
      'sm'
    ))
    lastUpdated = data.utctime
  })

  let contents = toChunks(indicators, 4)
  contents = contents.map(c => div('flex-row', c))
  
  if (options.chartParam) contents.push(stationChart(obj, options.chartParam))

  return tile({
    title: obj.name,
    contents,
    footer: `Sist oppdatert ${moment(lastUpdated).calendar()}`,
    id: options.id,
    onSelect: options.onSelect
  })
}

const stationChart = (obs, param) => {
  let chartContainer = div('tile-chart-line')
  let chartData = obs.data.filter(o => o[param]).map(o => {
    let p = o[param]
    if (p) return [o.utctime, p]
  })
  drawLineChart(chartContainer, ['Tid', paramCaption(param)], chartData, chartOption('mdTile'))
  return chartContainer
}

const getLastDataPoint = (obj, param) => {
  let last = obj.data[0]
  obj.data.forEach(dp => {
    if (dp[param] && dp.utctime > last.utctime) last = dp
  })
  return last
}







