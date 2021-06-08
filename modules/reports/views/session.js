import { el } from '../../html/elements.js';
import { carousel } from '../../html/carousel.js';
import { reportHeader, reportText, reportPage, reportFooter } from './report.js';
import { settings } from '../../settings.js';
import { forecastParamAll } from '../../config/datasources.js';
import { comparisonReport } from '../compare.js';

export async function updateSessionView(report) {
  document.getElementById('report-container').replaceChildren(
    el('div', {class: "report", "data-reportid": report.id}, [
      reportHeader(report), 
      el('div', {class: "report-body"},
        carousel({
          id: "session",
          items: [
            reportText('Beskrivelse', report.descr),
            reportText('Kommentar', report.forecast),
            reportPage('Værforhold', sessionWeather(report)),
            reportPage('Brett', sessionBoard(report)),
            reportPage('Sammenlikning', await sessionCompare(report))
          ]
      })),
      reportFooter(report)
    ])
  );
}

function sessionWeather(report) {
  return [
    el('img', {id: "report-wetsuit-img", src: "images/wetsuit_full_markers.png"}),
    el('div', {id: "report-hood-txt"}, (report.hood === 1)? 'Ja' : 'Nei'),
    el('div', {id: "report-suit-txt"}, report.suit),
    el('div', {id: "report-gloves-txt"}, report.gloves),
    el('div', {id: "report-boots-txt"}, report.boots),
    el('div', 'report-temp', [
      el('div', {id: "report-temp-air-txt"}, `Luft: ${report.airtemp}&deg;`),
      el('div', {id: "report-temp-water-txt"}, `Vann: ${report.watertemp}&deg;`),
      el('div', {id: "report-temp-descr-txt"}, `Opplevelse: ${report.temp}`)
    ])
  ]; 
}
 
function sessionBoard(report) {
  let board = settings.boards.find(b => b.model === report.board);

  if (board) {
    return [
      el('img', {id: "img-board", src: `images/boards/${board.thumburl}`}),
      el('div', {id: "report-board-model-txt"}, board.model),
      el('div', {id: "report-board-volume-txt"}, `Volum: ${board.volume}l`),
      el('div', {id: "report-board-length-txt"}, `Lengde: ${board.length}`),
      el('div', {id: "report-board-width-txt"}, `Bredde: ${board.width}`),
      el('div', {id: "report-board-thickness-txt"}, `Tykkelse: ${board.thickness}`),
    ]      
  } else {
    return el('div', {class: "report-title"}, report.board);
  }
}

async function sessionCompare(report) {
  let compare = await comparisonReport(report.reporttime);
  if (compare) {
    let params = ['waveheight', 'waveperiod', 'swellheight', 'swellperiod', 'wind', 'swind'];
    let elements = [
      el('div', "txt-report-title", "Sammenlikning"),
      el('p', "txt-report",
        `For denne økta var det varslet ${compare.wavesize} bølger og ${compare.windspeed} vind enn ${moment(compare.forecasttime).calendar()}.`),
      el('div', "report-subtitle", "Detaljer"),
    ];

    for (let param of params) {
      let txt = format(compare, param);
      if (txt) elements.push(el('div', 'report-twin-txt', txt)) 
    }
    return elements;
  } else {
    el('div', {id: 'report-twin-info'},
      el('div', 'report-text', 'Klarte ikke å sammenlikne varsel for denne rapporten med valgt tidspunkt (tidspunkt satt for DMI-bilder)'));
  }
}

function format(comparisonReport, param) {
  let value = comparisonReport[param].diff;
  if (value === 0) return;

  param = (param === 'swind') ? 'wind' : param
  let p = forecastParamAll(param)
  
  let s = (value > 0) ? 'up' : 'down';
  return `${p.caption} var ${value}${p.unit.unit} ${p.unit[s]}.`
}