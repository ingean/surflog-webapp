import { round, minMaxValues } from "../../../utils/utilities.js"
import { tile, indicator } from "../../../components/dashboard.js"
import { div } from "../../../components/elements.js"
import { tideText } from "../report.js"
import { arrow, icon, iconReport, iconTide } from '../../../components/icons.js'

export const tideTile = (report, stats) => {
  let x = minMaxValues(stats.tides[0])
  let footer = `${x.min.value} - ${x.max.value} m`
  
  let frontContent = div('flex-row', [
    indicator(report.spot, iconTide(report, 48, 48), tideText(report), null, 'wide'),
    indicator('Snitthøyde', `${round(stats.tides[0].avgtide, 1)} m`, footer, 4, 'sm')
  ])
  
  return tile(`Tidevann`, frontContent, null, null, 'stats', 'md')
}