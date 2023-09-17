import { indicator } from "../../../components/dashboard.js"
import { drawPieChart,} from "../../../components/charts.js"
import { div } from '../../../components/elements.js'
import { prepPieChartData } from "./statistics.js"

export const bySpotTileBackContent = (report, stats) => {
  let results = prepPieChartData('spot', stats.bySpot)
  let ind = indicator('Antall økter', results.total, report.location)
  let pieContainer = div({id: 'spot-count-pie', class: 'tile-chart-pie'})
  drawPieChart(pieContainer, results.headers, results.data, results.options)

  return div('flex-row center2', [ind, pieContainer])
}