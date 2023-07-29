import { chartOption } from "../../../config/charts.js"
import { tile, indicator, fact } from "../../../components/dashboard.js"
import { div } from "../../../components/elements.js"
import { drawColumnChart, dbChart, dbControl, drawDashboard } from "../../../components/charts.js"
import { monthAsText, thisMonth, thisYear } from "../../../utils/time.js"
import { round } from '../../../utils/utilities.js'

export const byMonthTile = (spot, stats, allStats) => {
  let byMonth = stats.byMonth
  let headers = yearsWithStats(byMonth)
  let footer = null

  if (headers.length < 2) { //  Just stats for this year for this spot, use for all spots
    byMonth = allStats.byMonth
    headers = yearsWithStats(byMonth)
    footer = fact(`Bare surfet ${spot} i år, så viser statistikk for alle spots`)
    spot = 'alle spots'
  }

  let frontContent = byMonthTileFrontContent(byMonth, headers)
  let backContent = byMonthTileBackContent(byMonth, headers)

  return tile(`Så langt i år på ${spot}`, frontContent, backContent, footer, 'stats', 'lg')
}

const byMonthTileFrontContent = (byMonth) => {
  let stats = byMonthStats(byMonth)
  let y = thisYear()
  let m = monthAsText(thisMonth())
  let years = yearsWithStats(byMonth)

  let rating = (stats[y] > stats.avg) ? '4' : (stats[y] == stats.avg) ? '3' : '2'
  let indY = indicator('Så langt i år', stats[y], `Snittet er ${round(stats.avg,0)} økter`, rating)
  let indMax = indicator(`Beste år ${stats.max.year}`, stats.max.count, `Til og med ${m}`, '4')
  let chartContainer = div('tile-chart-line')
  let data = years.map(y => [y, stats[y]])
  drawColumnChart(chartContainer, ['År', `Antall til og med ${m}`], data, chartOption('smallColumn'))
  return div('flex-row center2', [indY, indMax, chartContainer])
}

const byMonthTileBackContent = (byMonth, headers) => {
  let data = Array.from({ length: 12 }, (_, i) => {
    const month = byMonth.filter(s => s['MONTH(reporttime)'] === i + 1)
    return headers.map(h => (month.find(m => m['YEAR(reporttime)'] === h) || {})['count(*)'] || null)
  })

  let t = data.map((d,i) => d.unshift(monthAsText(i + 1)))
  headers.unshift('Måned')

  let chartContainer = div({id: 'month-chart', class: 'tile-chart-histogram'})
  let controlContainer = div({id: 'month-control', class: 'tile-chart-control'})
  let dbContainer = div('tile-db', [
    controlContainer,
    chartContainer
  ])

  let chart = dbChart({
    chartType: 'ColumnChart',
    containerId: 'month-chart',
    options: {
      backgroundColor:  { fill: 'transparent' },
      hAxis: {
        textPosition: 'out',
        textStyle: {color: 'white'}
      },
      theme: 'material'
    }
  })

  let control = dbControl({
    controlType: 'CategoryFilter',
    containerId: 'month-control',
    options: {
      filterColumnLabel: 'Måned',
      ui: {
        caption: 'Velg måned...'
      }
    }
  })

  drawDashboard(dbContainer, control, chart, headers, data)
  return dbContainer
}

const yearsWithStats = (stats) => {
  let years = [...new Set(stats.map(item => item['YEAR(reporttime)']))]
  years.sort()
  return years
}

const byMonthStats = (byMonth) => {
  let cm = thisMonth()
  let cy = thisYear()

  let stats = {max: {count: 0}, min: {count: 1000}, avg: 0, total: 0 }

  byMonth.forEach(s => {
    let m = s['MONTH(reporttime)']
    let y = s['YEAR(reporttime)']
    let c = s['count(*)']
    if (m <= cm) {
      stats[y] = c + (stats[y] || 0)
      if (y < cy) stats.total = c + stats.total
    }
  })

  let years = yearsWithStats(byMonth)
  stats.avg = (years.length > 1) ? stats.total / (years.length - 1) : stats[cy]

  years.forEach(y => {
    if (stats[y] > stats.max.count ) {
      stats.max.count = stats[y]
      stats.max.year = y
    }
    if (stats[y] < stats.min.count ) {
      stats.min.count = stats[y]
      stats.min.year = y
    }
  })
  return stats
}