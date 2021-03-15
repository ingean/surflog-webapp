import { notify } from './utils/logger.js';

const url = 'http://8eed09c7286a.sn.mynetname.net:50005/cgi-bin/snapshot.cgi';
const elementId = 'img-webcam-live';

function setUrl(url) {
  document.getElementById(elementId).src = url;  
}

export function refreshWebcam() {
  let date = new Date();
  setUrl(`${url}?a=${date.getTime()}`);
}

export function loadWebcam() {
  setUrl(url);
} 