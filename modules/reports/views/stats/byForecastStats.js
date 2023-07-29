import { slWaveheight, slSwell, slSubswell, slWind } from "../slForecast.js"
import { iconLogoWithText } from "../../../components/icons.js"
import { ratingLabel } from "../../../components/elements.js"
import { round } from "../../../utils/utilities.js"
import { tile } from "../../../components/dashboard.js"
import { div } from "../../../components/elements.js"

export const bySurflineForecastTile = (stats, score) => {
  let stat = statToUse(stats, score)
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

export const byDmiForecastTile = (stats, score) => {
  if (!stats) return
  let stat = statToUse(stats, score)
  let v = dmiStatValues(stat)
  
  let cls = 'center2 report-forecast-msw-value'
  let clsS = 'center2 report-forecast-msw-value-small'

  
  return tile(
    iconLogoWithText('Snittall', 'dmi'),
    div('', [
      div('flex-row', [
        'Bølger og vind',
        div('flex-col', [
          div(cls, `${v.waveheight.avg}m`),
          div(clsS, `(${v.waveheight.from} - ${v.waveheight.to})`)
        ]),
        div('flex-col', [
          div(cls, `${v.waveperiod.avg}s `),
          div(clsS, `(${v.waveperiod.from} - ${v.waveperiod.to})`)
        ]),
        div('flex-col', [
          div(cls, `${v.wind.avg}m/s`),
          div(clsS, `(${v.wind.from} - ${v.wind.to})`)
        ]) 
      ]),
      div('flex-row', [
        'Dønning',
        div('flex-col', [
          div(cls, `${v.swellheight.avg}m`),
          div(clsS, `(${v.swellheight.from} - ${v.swellheight.to})`)
        ]),
        div('flex-col', [
          div(cls, `${v.swellperiod.avg}s `),
          div(clsS, `(${v.swellperiod.from} - ${v.swellperiod.to})`)
        ]) 
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
      avg: round(avg, 1),
      from: round(avg - std, 1), 
      to: round(avg + std, 1)
    }
  })

  return result
}

const statToUse = (stats, score) => {
  let stat = stats.find(s => s.score === score)
  if (stat) return stat

  stat = stats.reduce(
    (prev, current) => {
      return prev.score > current.score ? prev : current
    }
  )
  return stat
}

