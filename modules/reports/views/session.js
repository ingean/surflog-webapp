import { el, div, span } from '../../html/elements.js';
import { tabs } from '../../html/tabs.js';
import { reportHeader, reportFooter, reportCompare } from './report.js';
import { getRating } from '../../config/forms.js';
import { settings } from '../../settings.js';


export async function updateSessionView(report) {
  document.getElementById('report-container').replaceChildren(
    el('div', {class: "report", "data-reportid": report.id}, [
      reportHeader(report), 
      el('div', {class: "report-body"},
        tabs(
          'session', 
          ['Beskrivelse', 'Kommentar', 'Merker', 'Vær', 'Brett', 'Sammenlikning'], 
          [report.descr, report.forecast, sessionTags(report), sessionWeather(report), sessionBoard(report), await reportCompare(report)]
        )),
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

function sessionTags(report) {
  return div('', [
    div('', [
      "Størrelse:",
      span(`label bg-${getRating('size', report.size)} report-condition`, report.size)  
    ]),
    div('', [
      "Push:",
      span(`label bg-${getRating('push', report.push)} report-condition`, report.push)  
    ]),
    div('', [
      "Shape:",
      span(`label bg-${getRating('shape', report.shape)} report-condition`, report.shape)  
    ]),
    div('', [
      "Closeout:",
      span(`label bg-${getRating('closeout', report.closeout)} report-condition`, report.closeout)  
    ]),
    div('', [
      "Consistency:",
      span(`label bg-${getRating('consistency', report.consistency)} report-condition`, report.consistency)  
    ]),
    div('', [
      "Wavecount:",
      span(`label bg-${getRating('wavecount', report.wavecount)} report-condition`, report.wavecount)  
    ]) 
  ])
}

function sessionBoard(report) {
  //let board = settings.boards.find(b => b.model === report.board);
  let board

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