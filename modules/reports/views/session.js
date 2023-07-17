import { div, tile, paramLabel, tempSpan } from '../../html/elements.js';
import { tabs } from '../../html/tabs.js';
import { reportHeader, reportFooter, reportCompare } from './report.js';
import { getBoardInfo } from '../../config/forms.js';
import { slWaveheight, slRating, slSwell, slSubswell, slWind } from './slForecast.js';
import { statsDashboard } from './statistics.js';

export async function updateSessionView(report) {
  document.getElementById('report-container').replaceChildren(
    div({class: "report", "data-reportid": report.id}, [
      reportHeader(report), 
      div("report-body",
        tabs(
          'session', 
          ['Dashboard', 'Statistikk'], 
          [sessionDashboard(report), await statsDashboard(report.spot)]
        )),
      reportFooter(report)
    ])
  );
}

function sessionDashboard(report) {
  return div('report-dashboard', [
      div('flex-row', [ 
        waveForecastTile(report),
        tile('Beskrivelse', report.descr),
        boardTile(report)
      ]),
      div('flex-row', [ 
        windForecastTile(report),
        tile('Analyse', report.forecast),
        tile(null, equipmentTileFront(report), equipmentTileBack(report))
      ]),
      div('flex-row', [
        compareTile(report)
      ])
    ])
}

const waveForecastTile = (report) => {
  return  div('tile tile-lg', [
    div('tile-title', 'Varsel'),
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
  return div('tile tile-lg', [
    div('tile-title', 'Kvalitet'),
    slWind(report),
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
  
  return div('tile tile-lg', [
    div('tile-title', 'Brett'),
    div('tile-text', `${report.board} ${board.volume}l`),
    div('tile-text', `${board.length} ${board.width} ${board.thickness}`),
    div('tile-text', `${board.type} ${board.fins}`)
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
  return div('tile tile-lg', [
    div('tile-tile', 'Sammenlikning'),
    await reportCompare(report)
  ])
}

