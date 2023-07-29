import { formatValue } from '../../forecasts/format.js'
import { stars, div } from '../../components/elements.js'
import { arrow } from '../../components/icons.js';
import { slRatingClass } from '../../config/forecasts.js';
import { round } from '../../utils/utilities.js'

export const slWaveheight = (report, stat = '') => {
  let p1 = (stat) ? `waveheight_from_${stat}` : 'waveheight_from'
  let p2 = (stat) ? `waveheight_to_${stat}` : 'waveheight_to'
  return div('report-forecast-msw-waveheight', [
          div('center2 report-forecast-msw-value', formatValue(report, p1, false, 'waveheight')),
          div('center2 report-forecast-msw-value-xsmall', '-' ),
          div('center2 report-forecast-msw-value', formatValue(report, p2, false, 'waveheight'))
        ])
}

export const slRating = (report) => {
  if (report['stars_open']) {
    return div('center2 report-forecast-msw-starrating', stars(report['stars_open'], report['stars_filled']))
  } else {
    let cls = slRatingClass[report['rating']]
    return div(`center2 report-forecast-sl-rating txt-rating-${cls}`, report['rating'])
  }
}

export const slSwell = (report, stat = '') => {
  let p1 = (stat) ? `swellheight_${stat}` : 'swellheight'
  let p2 = (stat) ? `swellperiod_${stat}` : 'swellperiod'
  let p3 = (stat) ? `swelldir_${stat}` : 'swelldir'

  return div('report-forecast-msw-swell', [
    div('center2 report-forecast-msw-value', formatValue(report, p1, false, 'swellheight')),
    div('center2 report-forecast-msw-value', formatValue(report, p2, false, 'swellperiod')),
    div('center2 report-forecast-msw-value-narrow', arrow(report[p3], 'sm'))
  ])
}

export const slSubswell = (report, stat = '') => {
  let p1 = (stat) ? `subswellheight_${stat}` : 'subswellheight'
  let p2 = (stat) ? `subswellperiod_${stat}` : 'subswellperiod'
  let p3 = (stat) ? `subswelldir_${stat}` : 'subswelldir'

  return div('report-forecast-msw-subswell', [
    div('center2 report-forecast-msw-value-small', formatValue(report, p1, false, 'swellheight')),
    div('center2 report-forecast-msw-value-small', formatValue(report, p2, false, 'swellperiod')),
    div('center2 report-forecast-msw-value-narrow', arrow(report[p3], 'sm'))
  ])
}

export const slWind = (report, stat = '') => {
  let p1 = (stat) ? `windspeed_${stat}` : 'windspeed'
  let p2 = (stat) ? `windgust_${stat}` : 'windgust'
  let p3 = (stat) ? `winddir_${stat}` : 'winddir'
  
  return (
    div('report-forecast-msw-wind', [
      div('center2 report-forecast-msw-value-narrow', `${round(report[p1])}`),
      div('report-forecast-msw-windgust', [
        div('report-forecast-msw-value-short', `(${round(report[p2])})`),
        div('report-forecast-msw-value-short', 'km/t'),
      ]),
      div(`report-forecast-msw-value-narrow bg-muted-${report['windscore']}`, arrow(report[p3]))
    ])
  )
}

export const slEnergy = (report) => {
  let content = (report.energy) ? `${report.energy} kJ` : ''
  return div('center2 report-forecast-msw-value',  content)

}