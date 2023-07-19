import { get } from '../utils/api.js';

const url = 'http://8eed09c7286a.sn.mynetname.net:50005/cgi-bin/snapshot.cgi';
const elementId = 'img-webcam-live';

function setUrl(url) {
  document.getElementById(elementId).src = url;  
}

function startPlayWebcam() {
  let btn = document.querySelector('#webcam-btn-play');
  togglePlayback(btn, 'pause', 'play', stopPlayWebcam, startPlayWebcam);
  playWebcam(btn);
}

function playWebcam(btn) {
  if(btn.classList.contains('glyphicon-play')) return;

  refreshWebcam()
  setInterval(() => playWebcam(btn), 3000)
}

function stopPlayWebcam() {
  let btn = document.querySelector('#webcam-btn-play');
  togglePlayback(btn, 'play', 'pause', startPlayWebcam, stopPlayWebcam);
}

function togglePlayback(btn, addIcon, removeIcon, addOnClick, removeOnClick) {
  btn.classList.remove(`glyphicon-${removeIcon}`);
  btn.classList.add(`glyphicon-${addIcon}`);
  btn.removeEventListener('click', removeOnClick)
  btn.addEventListener('click', addOnClick) 
}

function saveWebcam() {
  get(webcam/save);
}

function refreshWebcam() {
  let date = new Date();
  setUrl(`${url}?a=${date.getTime()}`);
}

export function initWebcam() {
  setUrl(url);

  //Set event handlers for webcam tools
  document.querySelector('#webcam-btn-refresh')
  .addEventListener('click', refreshWebcam)

  document.querySelector('#webcam-btn-play')
  .addEventListener('click', startPlayWebcam)

  document.querySelector('#webcam-btn-save')
  .addEventListener('click', saveWebcam)
} 