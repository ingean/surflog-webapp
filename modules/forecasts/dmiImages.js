import { toLocal } from "../utils/time.js";
import { dmiForecast } from './dmiTable.js';
import { scoreLabel } from '../html/elements.js';

function updateDMIImgs(currentTS, newTS) {
  let imgs = ['wave', 'swell', 'wind'];
  imgs.forEach(img => {
    let el = document.getElementById(`img-dmi-${img}-live`);
    el.src = el.src.replace(currentTS, newTS);
  })
}

function currentDMITimeStep(imgId = 'img-dmi-wave-live') {
  let src = document.querySelector(`#${imgId}`).src;
  return Number(src.match(/\d+/)[0]); //Timestep indicator in DMI url
}

function navDir(e) {
  let el = e.target;
  if (el.classList.contains('glyphicon')) el = el.parentElement;
  return (el.classList.contains('next')) ? 'next' : 'prev';
}

function navDMIImages(e) {
  let ts = currentDMITimeStep();
  let dir = navDir(e);
  if (dir === 'next') {
    if (ts === 120) return;
    updateDMIImgs(ts, ts + 1);
    setDMITime(moment(getDMITime()).add(1, 'hours'))
  } else {
    if (ts === 1) return;
    updateDMIImgs(ts, ts - 1);
    setDMITime(moment(getDMITime()).subtract(1, 'hours'))
  }
  updateDMIScore();
}

function updateDMIScore() {
  if(dmiForecast.length === 0) return; //If forecast hasnt loaded yet
  let time = getDMITime();
  let fc = dmiForecast.find(f => moment(f.localtime).isSame(time, 'hour'))
  let lbl = scoreLabel(fc.score.score);
  document.querySelectorAll('.score-dmi')
  .forEach(el => {el.replaceChildren(lbl)});
}

function dmiStartTime(){ //Estimates the start time for forecast coming live from DMI
  let date = moment().subtract(7, 'hours');
  let hr = moment(date).hour();
  hr = (hr < 6) ? '00' : (hr < 12 ) ? '06' : (hr < 18) ? '12' : '18';
  return moment(date).format(`YYYY-MM-DDT${hr}:00:00`);
}

export function setDMITime(date) {
  document.querySelectorAll('.time-dmi')
  .forEach(el => {
    el.textContent = moment(date).calendar(null, {sameElse: 'DD.MM.YYYY HH:mm'});
    el.dataset.forecastTime = moment(date).format('YYYY-MM-DDTHH:mm');
  })
}

export function getDMITime() {
  let el = document.querySelector('.time-dmi')
  return moment(el.dataset.forecastTime).toDate();
}

export function initDMIImages() {
  setDMITime(toLocal(dmiStartTime()));
  document.querySelectorAll('.forecast-nav-dmi')
  .forEach(el => {el.addEventListener('click', navDMIImages)});
}

