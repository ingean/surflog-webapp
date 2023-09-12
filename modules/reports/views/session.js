import { div, image, paramLabel, tempSpan, ratingLabel } from '../../components/elements.js';
import { tile, indicator } from '../../components/dashboard.js';
import { tabs } from '../../components/tabs.js';
import { reportHeader, reportFooter, reportCompare } from './report.js';
import { getBoardInfo } from '../../config/forms.js';
import { slWaveheight, slRating, slSwell, slSubswell, slWind, slEnergy } from './slForecast.js';
import { statsDashboard } from './stats/statistics.js';
import { iconLogoWithText } from '../../components/icons.js';
import { tideTile } from './stats/otherStats.js';
import { get } from '../../utils/api.js'
import { getRating } from '../../config/forms.js';

export async function updateSessionView(report) {
  let spotReportStats = await get(`statistics/reports?spot=${report.spot}&location=${report.location}`)

  document.getElementById('report-container').replaceChildren(
    div({class: "report", "data-reportid": report.id}, [
      reportHeader(report), 
      div("report-body",
        tabs(
          'report', 
          ['Om økta', 'Statistikk'], 
          [sessionDashboard(report, spotReportStats), await statsDashboard(report, spotReportStats)]
        )),
      reportFooter(report)
    ])
  );
}

function sessionDashboard(report, spotReportStats) {
  return div('report-dashboard flex-col', [
      div('flex-row', [ 
        waveForecastTile(report),
        tile('Beskrivelse', report.descr),
        boardTile(report),
        tideTile(report, spotReportStats)
      ]),
      div('flex-row', [ 
        windForecastTile(report),
        tile('Analyse', report.forecast),
        tile(null, equipmentTileFront(report), equipmentTileBack(report)),
        scoreTile(report)
      ]),
      div('flex-row', [
        compareTile(report)
      ])
    ])
}

const waveForecastTile = (report) => {
  return  tile(iconLogoWithText('Bølger', 'surfline'), [
    div('flex-row', [
      div('', [
        slWaveheight(report),
        slRating(report)
      ]),
    div('', [
      slSwell(report),
      slSubswell(report),
    ])  
  ]),  
  div('flex-row', [
    paramLabel('waveheight', report.waveheightObs, 'høyt'),
    paramLabel('size', report.size, 'størrelse'),
    paramLabel('waveperiod', report.waveperiodObs, 'periode'),
    paramLabel('push', report.push, 'push')
  ])
  ])
}

const windForecastTile = (report) => {
  return tile(iconLogoWithText('Vind', 'surfline'), [
    div('flex-row', [
      slWind(report),
      slEnergy(report)
    ]),
    div('flex-row', [
      paramLabel('winddir', report.winddirObs, `${report.windspeedObs.toLowerCase()}`),
      paramLabel('shape', report.shape, 'shape'),
      paramLabel('closeout', report.closeout, 'closeouts')
    ]),
    div('flex-row', [
      paramLabel('consistency', report.consistency, 'mellom settene'),
      paramLabel('wavecount', report.wavecount, 'wavecount'),
    ])   
  ])
}

const boardTile = (report) => {
  let board = getBoardInfo(report.board)
  
  return tile('Brett', [
    div('flex-row center2', [
      image(`images/boards/${report.board}.png`, {height: '90px'}),
      div('flex-col', [
        div('tile-text', `${report.board} ${board.volume}l`),
        div('tile-text', `${board.length} ${board.width} ${board.thickness}`),
        div('tile-text', `${board.type} ${board.fins}`)
      ])
    ])   
  ])
}

const equipmentTileFront = (report) => {
  let equipment = [
    div('tile-title', 'Utstyr'),
  ]

  let suit = (report.hood == '1') ? `${report.suit} drakt med hette` : `${report.suit} drakt`
  equipment.push(div('tile-text', suit))

  if (report.boots != 'Nei') equipment.push(div('tile-text', `${report.boots} sko`))
  if (report.gloves != 'Nei') equipment.push(div('tile-text', `${report.gloves} hansker`))

  let weather = [
    div('tile-title', 'Vær'),
    div('tile-text', [tempSpan('', report.airtemp), ' i lufta']),
    div('tile-text', [tempSpan('', report.watertemp), ' i vannet']),
  ]

  if (report.iscold === 1) weather.push(div('tile-text', 'Kald'))

  return div('tile-content flex-row', [
    div('tile-column', equipment),
    div('tile-column', weather)
  ])
}

const equipmentTileBack = report => {
  return div('', [
    div('tile-tile', 'Opplevelse'),
    div('tile.text', report.temp)
  ])
}

const compareTile = async (report) => {
  let compare = await reportCompare(report)
  return tile('Sammenlikning', 
    compare,
    null, null, null, 'md')
}
const scoreTile = (report) => {
  let score = calcScore(report)
  return tile(
    'Score',
    div('flex-row center2', [
      indicator('Beregnet score', score, 'Snitt av merker', Math.round(score), 'wide'),
      div('flex-col', [
        ratingLabel(report.score, 'lg'),
        slRating(report)
      ])
    ]), 
    null,
    null,
    null,
    'md'
  )
}


const calcScore = (report) => {
  let total = 0
  let count = 0

  let params = ['waveheight', 'windspeed', 'winddir', 'shape', 'push', 'closeout', 'consistency']
  params.forEach(p => {
    let rating = getRating(p, report[p])
    if (rating) {
      total += rating
      count ++
    }
  })
  return total / count
}

