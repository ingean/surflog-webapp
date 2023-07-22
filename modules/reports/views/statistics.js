import { div, ratingLabel } from "../../components/elements.js"
import { tile, indicator } from "../../components/dashboard.js"
import { get } from "../../utils/api.js"
import { slWaveheight, slSwell, slSubswell, slWind } from "./slForecast.js"
import { iconLogoWithText } from "../../components/icons.js"
import { getScoreCaption } from "../../config/forms.js"
import { scoreColors, drawPieChart, drawColumnChart, dbChart, dbControl, drawDashboard } from "../../components/charts.js"
import { monthAsText, thisMonth, thisYear } from "../../utils/time.js"
import { round } from '../../utils/utilities.js'

const reportStats = await get(`statistics/reports`)


export const statsDashboard =  async (spot) => {
  let dmiStats = await get(`statistics/forecasts2?forecast=dmi&spot=${spot}`)
  let slStats = await get(`statistics/forecasts2?forecast=msw&spot=${spot}`)
  let spotReportStats = await get(`statistics/reports?spot=${spot}`)
  let allReportStats = await get(`statistics/reports`)
  
  return div('stats-dashboard', [
    div('flex-row', [
      countByScore(spot, spotReportStats, reportStats), 
      countByMonth(spot, spotReportStats),
      div('flex-col', [
        slForecastStats(slStats),
        dmiForecastStats(dmiStats)
      ])   
    ])
  ])
}

const slForecastStats = (stats) => {
  let stat = statToUse(stats)
  return  tile(
    iconLogoWithText('Snittvarsel', 'surfline'),
    div('flex-row', [
      div('', [
        slWaveheight(stat, 'avg'),
        slSwell(stat, 'avg')
      ]),
      div('', [
        slSubswell(stat, 'avg'),
        slWind(stat, 'avg')
      ])  
    ]),
    null,
    ratingLabel(stat.score, 'sm', 'align-right')
  )
}

const statToUse = (stats) => {
  let stat = stats.find(s => s.score === 4)
  if (stat) return stat

  stat = stats.reduce(
    (prev, current) => {
      return prev.score > current.score ? prev : current
    }
  )
  return stat
}

const dmiForecastStats = (stats) => {
  if (!stats) return
  let stat = statToUse(stats)
  let v = dmiStatValues(stat)
  
  let cls = 'center2 report-forecast-msw-value'
  let clsS = 'center2 report-forecast-msw-value-small'

  
  return  tile(
    iconLogoWithText('Snittall', 'dmi'),
    div('', [
      div('flex-row', [
        'Bølger',
        div(cls, `${v.waveheight.avg}m`),
        div(clsS, `(${v.waveheight.from} - ${v.waveheight.to})`),
        div(cls, `${v.waveperiod.avg}s `),
        div(clsS, `(${v.waveperiod.from} - ${v.waveperiod.to})`), 
      ]),
      div('flex-row', [
        'Dønning',
        div(cls, `${v.swellheight.avg}m`),
        div(clsS, `(${v.swellheight.from} - ${v.swellheight.to})`),
        div(cls, `${v.swellperiod.avg}s `),
        div(clsS, `(${v.swellperiod.from} - ${v.swellperiod.to})`), 
      ]),
      div('flex-row', [
        'Vind',
        div(cls, `${v.wind.avg}m/s`),
        div(clsS, `(${v.wind.from} - ${v.wind.to})`)
      ])
    ]),
    null,
    ratingLabel(stat.score, 'sm', 'align-right')
  )
}

const dmiStatValues = (stat) => {
  const params = ['waveheight', 'waveperiod', 'swellheight', 'swellperiod', 'wind']
  let result = {}
  params.forEach(p => {
    const avg = stat[`${p}_avg`]
    const std = stat[`${p}_std`]
    result[p] = {
      avg: Math.round(avg, 2),
      from: Math.round(avg - std, 2), 
      to: Math.round(avg + std, 2)
    }
  })

  return result
}

const countByScore = (spot, stats, allStats) => {
  
  let scores = stats.scorecount
  let headers = ['Score', 'Antall']
  let data = scores.map(s => [getScoreCaption(s.score), s['count(*)']])
  let total = totalCount(scores)
  let totalAll = totalCount(allStats.scorecount)
 
  let options = {
    colors: scoreColors(data),
    height: 250,
    width: 300
  }

  let ind = indicator('Antall økter her', total, `av totalt ${totalAll}`)
  let pieContainer = div({id: 'score-count-pie', class: 'tile-chart-pie'})
  drawPieChart(pieContainer, headers, data, options)

  let content = div('flex-row center2', [ind, pieContainer])

  return tile(`Økter på ${spot}`, content, null, null, 'stats', 'lg')
}

const countByMonth = (spot, stats) => {
  let byMonth = stats.monthcount
  let spotBgContent = null
  let headers = yearsWithStats(byMonth)
  if (headers.length > 1) spotBgContent = ytdCompare(byMonth)
  
  let data = Array.from({ length: 12 }, (_, i) => {
    const month = byMonth.filter(s => s['MONTH(reporttime)'] === i + 1)
    return headers.map(h => (month.find(m => m['YEAR(reporttime)'] === h) || {})['count(*)'] || null)
  })

  let t = data.map((d,i) => d.unshift(monthAsText(i + 1)))
  headers.unshift('Måned')

  let options = {
    backgroundColor:  { fill: 'transparent' },
    hAxis: {
      textPosition: 'out',
      textStyle: {color: 'white'}
    },
    theme: 'material'
  }

  let chartContainer = div({id: 'month-chart', class: 'tile-chart-histogram'})
  let controlContainer = div({id: 'month-control', class: 'tile-chart-control'})
  let dbContainer = div('tile-db', [
    controlContainer,
    chartContainer
  ])

  let chart = dbChart({
    chartType: 'ColumnChart',
    containerId: 'month-chart',
    options
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

  return tile(`Økter pr måned på ${spot}`, dbContainer, spotBgContent, null, 'stats', 'lg')
}

const ytdCompare = (countByMonth) => {
  let stats = ytdStats(countByMonth)
  let y = thisYear()
  let m = monthAsText(thisMonth())
  let years = yearsWithStats(countByMonth)

  let rating = (stats[y] > stats.avg) ? '4' : '2'

  let indY = indicator('Så langt i år', stats[y], `Snittet er ${round(stats.avg,0)} økter`, rating)
  let indMax = indicator(`Beste år ${stats.max.year}`, stats.max.count, `Til og med ${m}`, '4')
  let chartContainer = div('tile-chart-line')
  let data = years.map(y => [y, stats[y]])
  drawColumnChart(chartContainer, ['År', `Antall til og med ${m}`], data, {height: 100, width: 150})

  return div('flex-row center2', [indY, indMax, chartContainer])
}

const yearsWithStats = (stats) => {
  let years = [...new Set(stats.map(item => item['YEAR(reporttime)']))]
  years.sort()
  return years
}

const totalCount = (scores) => {
  return scores.reduce((total, s) => total + s['count(*)'], 0)
}

const ytdStats = (byMonth) => {
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
  stats.avg = stats.total / (years.length - 1)

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