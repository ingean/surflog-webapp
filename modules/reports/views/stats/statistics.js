import { div } from "../../../components/elements.js"
import { bySurflineForecastTile, byDmiForecastTile } from "./byForecastStats.js"
import { byScoreTile } from "./byScoreStats.js"
import { byMonthTile } from "./byTimeStats.js"
import { get } from "../../../utils/api.js"
import { UFirst } from "../../../utils/parseString.js"
import { scoreColors } from "../../../components/charts.js"
import { getScoreCaption } from "../../../config/forms.js"


const reportStats = await get(`statistics/reports`)

export const statsDashboard =  async (report, spotReportStats) => {
  let spot = report.spot
  let slStats = await get(`statistics/forecasts2?forecast=msw&spot=${spot}`)
  let forecastStats = [bySurflineForecastTile(slStats, report.score)]

  if (report.location === 'Oslofjorden') {
    let dmiStats = await get(`statistics/forecasts2?forecast=dmi&spot=${spot}`)
    //let smhiStats = await get(`statistics/forecasts2?forecast=smhi&spot=${spot}`)
    forecastStats.push(byDmiForecastTile(dmiStats, report.score))
    //forecastStats.push(bySmhiForecastTile(smhiStats, report.score))
  }
   
  return div('stats-dashboard', [
    div('flex-row', [
      byScoreTile(report, spotReportStats, reportStats), 
      byMonthTile(spot, spotReportStats, reportStats),
      div('flex-col', forecastStats)   
    ])
  ])
}

export const prepPieChartData = (param, stats) => {
  let headers = [UFirst(param), 'Antall']
  let data = stats.map(s => {
    let caption = (param === 'score') ? getScoreCaption(s[param]) : s[param]
    return [caption, s['count(*)']]
  })
  let total = totalCount(stats)

  let options = {
    height: 250,
    width: 300
  }

  if (param === 'score')  options.colors =  scoreColors(data)
  return {total, headers, data, options}
}

const totalCount = (scores) => {
  return scores.reduce((total, s) => total + s['count(*)'], 0)
}



