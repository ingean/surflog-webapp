import { toggleActive } from '../../utils/utilities.js';
import { toLocal } from '../../utils/time.js';
import { dmiForecast } from '../tables/dmi.js';
import { scoreLabel } from '../../html/elements.js';
import { forecastParam } from '../../config/datasources.js';
import { getImgTime, setImgTime } from './forecast.js';

function currentDMITimeStep(imgId = 'img-dmi-waveheight-live') {
  let src = document.querySelector(`#${imgId}`).src;
  return Number(src.match(/\d+/)[0]); //Timestep indicator in DMI url
}

function navDir(e) {
  let el = e.target;
  if (el.classList.contains('glyphicon')) el = el.parentElement;
  return (el.classList.contains('next')) ? 'next' : 'prev';
}

function switchDMIParam(e) {
  let id = e.target.id;
  let param = id.split('-')[2];
  let switchTo = id.split('-')[3];
  let switchFrom = (switchTo === 'height') ? 'period' : 'height';

  let historicImg = document.querySelector(`#img-dmi-${param}height-historic`);
  if (historicImg) historicImg.src = historicImg.src.replace(switchFrom, switchTo)

  switchTo = forecastParam('dmi', param + switchTo).type
  switchFrom = forecastParam('dmi', param + switchFrom).type

  let liveImg = document.querySelector(`#img-dmi-${param}height-live`);
  liveImg.src = liveImg.src.replace(switchFrom, switchTo);
  toggleActive(e.target);
}

function onDMIImageNav(e) {
  let dir = navDir(e)
  navDMIImages(dir)
}

function navDMIImages(dir) {
  let ts = currentDMITimeStep();

  if (dir === 'next') {
    if (ts === 120) return;
    updateDMIImgs(ts, ts + 1);
    setImgTime(moment(getImgTime()).add(1, 'hours'))
  } else {
    if (ts === 1) return;
    updateDMIImgs(ts, ts - 1);
    setImgTime(moment(getImgTime()).subtract(1, 'hours'))
  }
  updateDMIScore();
}

function togglePlaybackIcons(el, from, to) {
  el.classList.remove(`glyphicon-${from}`)
  el.classList.add(`glyphicon-${to}`)
}

function DMIPlayback(e) {
  let btn = e.target
  if (btn.classList.contains('glyphicon-play')) {
    togglePlaybackIcons(btn, 'play', 'pause')
    playDMIImages(btn)
  } else {
    togglePlaybackIcons(btn, 'pause', 'play')
  }
}

function playDMIImages(btn) {
  if (btn.classList.contains('glyphicon-play')) return;

  navDMIImages('next')
  setInterval(() => playDMIImages(btn), 1000)
}

function updateDMIScore() {
  if(dmiForecast.length === 0) return; //If forecast hasnt loaded yet
  let time = getImgTime();
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

export function updateDMIImgs(currentTS, newTS, scope = 'live') {
  let imgs = ['waveheight', 'swellheight', 'wind'];
  imgs.forEach(img => {
    let el = document.getElementById(`img-dmi-${img}-${scope}`);
    el.src = el.src.replace(currentTS, newTS);
  })
}

export function initDMIImages() {
  setImgTime(toLocal(dmiStartTime()));
  document.querySelectorAll('.forecast-nav-dmi')
  .forEach(el => {el.addEventListener('click', onDMIImageNav)});

  //Click event for forecast param switcher
  document.querySelectorAll('.param-switch-dmi')
  .forEach(el => {el.addEventListener('click', switchDMIParam)});

  //Click event for dmi image player
  document.querySelector('#play-dmi-images')
  .addEventListener('click', DMIPlayback)
}

