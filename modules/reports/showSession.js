import { el } from '../utils/html/elements.js';
import { carousel } from '../utils/html/carousel.js';
import { reportHeader, reportText, reportPage, reportFooter } from './showReport.js';
import { settings } from '../settings.js';
import { getForecastTime } from '../utils/time.js';

export var twin = '';

export function showSession(report) {
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
            reportPage('Tvillinginfo', sessionCompare(twin))
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
      el('img', {id: "img-board", src: `images/${board.thumburl}`}),
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

function sessionCompare(report) { 
  if (twin && report.reporttime === twin.reporttime) {  
    return [
      el('div', "txt-report-title", "Sammenlikning"),
      el('p', "txt-report",
        `${moment(getForecastTime('time-dmi-today')).calendar()} er
        det sannsynligvis ${twin.wavesize} bølger og ${twin.windspeed}
        vind enn denne økta.`),
      el('div', "report-subtitle", "Detaljer"),
      el('div', "report-twin-txt", `Bølgehøyde: ${twin.waveheight}m`),
      el('div', "report-twin-txt", `Bølgeperiode: ${twin.waveperiod}s`),
      el('div', "report-twin-txt", `Dønning: ${twin.swellheight}m`),
      el('div', "report-twin-txt", `Periode: ${twin.swellperiod}s`),
      el('div', "report-twin-txt", `Lokal vind: ${twin.wind}m/s`),
      el('div', "report-twin-txt", `Vind: ${twin.swind}m/s`)
    ]
  } else {
    el('div', {id: 'report-twin-info'},
      el('div', 'report-text', 'Her vises kun info hvis rapporten er tvilling til valgt tidspunkt'));
  }
}