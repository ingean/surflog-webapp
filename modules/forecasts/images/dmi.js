import { toggleActive } from '../../utils/utilities.js';
import { toLocal } from '../../utils/time.js';
import { dmiForecast } from '../tables/dmi.js';
import { ratingLabel } from '../../components/elements.js';
import { getImgTime, setImgTime } from './forecast.js';

function currentDMITimeStep(imgId = 'img-dmi-waveheight-live') {
  let src = document.querySelector(`#${imgId}`).src;
  return Number(src.substring(src.lastIndexOf('/') + 1))
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

  let liveImg = document.querySelector(`#img-dmi-${param}height-live`);
  liveImg.src = liveImg.src.replace(switchFrom, switchTo);
  toggleActive(e.target);
}

function onDMIImageNav(e) {
  let dir = navDir(e)
  let interval = Number(document.getElementById("dmi-chart-timestep").value)

  navDMIImages(dir, interval)
}

function navDMIImages(dir, interval) {
  let ts = currentDMITimeStep();

  if (dir === 'next') {
    if (ts + interval > 121) return
    updateDMIImgs(ts, ts + interval);
    setImgTime(moment(getImgTime()).add(interval, 'hours'))
  } else {
    if (ts - interval < 1) return
    updateDMIImgs(ts, ts - interval);
    setImgTime(moment(getImgTime()).subtract(interval, 'hours'))
  }
  updateDMIScore();
}

function updateDMIScore() {
  if(dmiForecast.length === 0) return; //If forecast hasnt loaded yet
  let time = getImgTime();
  let fc = dmiForecast.find(f => moment(f.localtime).isSame(time, 'hour'))
  let lbl = ratingLabel(fc.score.score);
  let scores = document.querySelectorAll('.score-dmi')
  scores = Array.from(scores)
  scores.forEach(el => {el.replaceChildren(lbl)});

  let headings = document.querySelectorAll('.dmi-heading')
  headings = Array.from(headings)
  headings.forEach(el => {
    let scores = [0,1,2,3,4,5,6,7]
    let prevscore = null
    scores.every(s => {
      prevscore = el.classList.contains(`bg-${s}`) ? s : null
      return (prevscore != null) ? false : true
    })
    el.classList.remove(`bg-${prevscore}`)
    el.classList.add(`bg-${fc.score.score}`)      
  });
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
    el.src = el.src.substring(0, el.src.lastIndexOf('/') + 1) + newTS 
  })
}

export function initDMIImages() {
  setImgTime(toLocal(dmiStartTime()));
  document.querySelectorAll('.forecast-nav-dmi')
  .forEach(el => {el.addEventListener('click', onDMIImageNav)});

  //Click event for forecast param switcher
  document.querySelectorAll('.param-switch-dmi')
  .forEach(el => {el.addEventListener('click', switchDMIParam)});
}

