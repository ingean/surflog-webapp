import { indicator, tile, fact } from "../../../components/dashboard.js"
import { drawPieChart,} from "../../../components/charts.js"
import { div } from '../../../components/elements.js'
import { prepPieChartData } from "./statistics.js"
import { bySpotTileBackContent } from "./bySpotStats.js"
import { round } from "../../../utils/utilities.js"

export const byScoreTile = (report, stats, allStats) => {
  let spotResult = prepPieChartData('score', stats.byScore)
  let allResult = prepPieChartData('score', allStats.byScore)

  spotResult.totalAll = allResult.total
  let footer = fact(byScoreCompare(spotResult, allResult))
  
  let frontContent = byScoreTileFrontContent(report, spotResult)
  let backContent = bySpotTileBackContent(report, stats)

  return tile(`Score og spots i nærheten`, frontContent, backContent, footer, 'transfer', 'lg')
}

const byScoreTileFrontContent = (report, results) => {
  let ind = indicator(report.spot, results.total, `økter av totalt ${results.totalAll}`)
  let pieContainer = div({id: 'score-count-pie', class: 'tile-chart-pie'})
  drawPieChart(pieContainer, results.headers, results.data, results.options)

  return div('flex-row center2', [ind, pieContainer])
}

const byScoreTileBackContent = (results, allResults) => {
  let compareResult = byScoreCompare(results, allResults)
  let ind = indicator('Antall økter totalt', allResults.total)
  let pieContainer = div({id: 'score-count-pie', class: 'tile-chart-pie'})
  drawPieChart(pieContainer, allResults.headers, allResults.data, allResults.options)

  return div('flex-row center2', [ind, pieContainer])
}

const byScoreCompare2 = (rSpot, rAll) => {
  let mfSpot = mostFrequent(rSpot.data)
  let spotP = round((mfSpot[1] / rSpot.total) * 100)
  let all = rAll.data.find(a => a[0] === mfSpot[0])
  let allP = round((all[1] / rAll.total) * 100)
  let c = (spotP > allP) ? 'Flere' : 'Færre'
  return `${c} ${mfSpot[0].toLowerCase()} økter enn snittet på ${allP}%`
}

const mostFrequent = (data) => {
  return data.reduce((a, b) => (a[1] > b[1]) ? a : b)
}

const byScoreCompare = (rSpot, rAll) => {
  let f = rSpot.data[0]
  let r = {score: f[0], value: calcP(f, rSpot), diff: 0} 

  rSpot.data.forEach(d => {
    let sp = calcP(d, rSpot)
    let a = rAll.data.find(a => a[0] === d[0])
    let ap = calcP(a, rAll)
    let diff = Math.abs(sp - ap)
    if (diff > r.diff) {
      r.score = d[0]
      r.spot = sp
      r.all = ap
      r.diff = diff
      r.caption = (sp > ap) ? 'Flere' : 'Færre'
    }
  })
  return `${r.caption} økter med ${r.score.toLowerCase()} score enn snittet på ${r.all}%`
}

const calcP = (d, r) => {
  return round((d[1] / r.total) * 100)
}