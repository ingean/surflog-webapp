import { toggleActive } from '../../utils/utilities.js';
import { toLocal } from '../../utils/time.js';
import { yrCoastForecast, yrCoastWaveGroup, yrCoastWindGroup } from '../tables/yrCoast.js';
import { dmiForecast } from '../tables/dmi.js';
import { dmiApiForecast, dmiWaveGroup, dmiSwellGroup, dmiWindGroup } from '../tables/dmiApi.js';
import { smhiBuoys } from '../tables/buoyObs.js';
import { smhiWaveObsGroup, smhiWaveGroup } from '../tables/smhi.js';
import { ratingLabel } from '../../components/elements.js';
import { getImgTime, setImgTime } from './forecast.js';
import { notify } from '../../utils/logger.js';
import { get } from '../../utils/api.js';
import { Loader } from '../../utils/logger.js';
import { div, el, tr, td, hrsTd } from '../../components/elements.js';
import { toUTC } from '../../utils/time.js';

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
  //updateDMIScore();
  updateForecasts()
}

function renderDmiGroupTable(groupFns, fcs) {
  // Ensure both arguments are arrays
  const groupArr = Array.isArray(groupFns) ? groupFns : [groupFns];
  const fcArr = Array.isArray(fcs) ? fcs : [fcs];

  return div('forecast-table-body',
    el('table',
      'table-hover dmi-waveheight-table',
      tr('', [
        // Use the first forecast's utctime for the time cell
        hrsTd(fcArr[0]?.utctime),
        // Render each group function with its corresponding forecast
        ...groupArr.map((fn, i) => td('', fn(fcArr[i])))
      ])
    )
  );
}

const updateForecasts = () => {
  let time = getImgTime();
  let dmiFC = dmiApiForecast.data.find(f => moment(f.utctime).isSame(toUTC(time), 'hour'))
  let yrFC = yrCoastForecast.data.find(f => moment(f.utctime).isSame(toUTC(time), 'hour'))
  let smhiFC = smhiBuoys.data.find(f => moment(f.utctime).isSame(toUTC(time), 'hour'))
  
 
  let waveTable = renderDmiGroupTable([dmiWaveGroup, yrCoastWaveGroup, smhiWaveObsGroup, smhiWaveGroup], [dmiFC,yrFC, smhiFC, smhiFC]);
  let swellTable = renderDmiGroupTable([dmiSwellGroup], [dmiFC]);
  let windTable = renderDmiGroupTable([dmiWindGroup, yrCoastWindGroup], [dmiFC, yrFC]);

  
  document.querySelector('#dmi-waveheight-table').replaceChildren(waveTable);
  document.querySelector('#dmi-swellheight-table').replaceChildren(swellTable);
  document.querySelector('#dmi-wind-table').replaceChildren(windTable);
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

const resetDMITime = async () => { 
  let loader = new Loader('.time-dmi-reset-container', 16)
  let id = currentDMITimeStep()
  let result = await get(`forecasts/dmi/currentdate?id=${id}`)
  if (result?.utctime) {
    setImgTime(toLocal(result.utctime))
  } else {
    notify('Klarte ikke å resette tiden på DMI-bildene', null, 'time')
  }
  loader.stop()
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

  //Click event for forecast param switcher
  document.querySelectorAll('.time-dmi-reset')
  .forEach(el => {el.addEventListener('click', resetDMITime)});
}
