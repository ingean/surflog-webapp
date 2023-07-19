import { getReports } from "../read.js"
import { div, ratingLabel } from "../../components/elements.js"
import { tile } from"../../components/tile.js"
import { get } from "../../utils/api.js"
import { slWaveheight, slSwell, slSubswell, slWind } from "./slForecast.js"
import { dmiLogoTitle, slLogoTitle } from "./report.js"

export const statsDashboard =  async (spot) => {
  //let reports = await getReports(null, `&spot=${spot}`)
  let dmiStats = await get(`statistics/forecasts2?forecast=dmi&spot=${spot}`)
  let slStats = await get(`statistics/forecasts2?forecast=msw&spot=${spot}`)
  
  return div('stats-dashboard', [
    div('flex-row', [
      slForecastStats(slStats), 
      dmiForecastStats(dmiStats)
    ]),
    div('flex-row', [ 
    ]),
    div('flex-row', [
    ])
  ])
}

const reportCount = (reports) => {
  return  div('tile tile-lg', [
    div('tile-title', 'Antall økter'),
    div('flex-row', [
      div('', [
        'Totalt:',
        reports.length,
      ]),
      div('', [
      ])  
    ])
  ])
}

const slForecastStats = (stats) => {
  let stat = statToUse(stats)
  return  tile(
    slLogoTitle('Snittvarsel'),
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
    dmiLogoTitle('Snittall'),
    div('', [
      div('flex-row', [
        div(cls, `${v.waveheight.avg}m`),
        div(clsS, `(${v.waveheight.from} - ${v.waveheight.to})`),
        div(cls, `${v.waveperiod.avg}s `),
        div(clsS, `(${v.waveperiod.from} - ${v.waveperiod.to})`), 
      ]),
      div('flex-row', [
        div(cls, `${v.swellheight.avg}m`),
        div(clsS, `(${v.swellheight.from} - ${v.swellheight.to})`),
        div(cls, `${v.swellperiod.avg}s `),
        div(clsS, `(${v.swellperiod.from} - ${v.swellperiod.to})`), 
      ]),
      div('flex-row', [
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

