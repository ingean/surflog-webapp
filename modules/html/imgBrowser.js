import { el } from './elements.js';
import { navImages } from '../forecasts/images/forecast.js';

function onImgBrowse(e, navDir) {
  let img = e.target.parentNode.firstChild;
  img = (img.id === '') ? img.parentNode.parentNode.firstChild : img;

  let imgId = img.id;
  let source = imgId.split('-')[1];
  let type = imgId.split('-')[2];
  let time = imgId.split('-')[3];
  navImages(source, type, time, navDir);
}

function navBtn(navDir = 'prev') {
  let dir = (navDir === 'prev') ? 'left' : 'right';
  let navBtn =  el('button', `btn panel-btn-nav ${navDir}`, 
                  el('span', `glyphicon glyphicon-chevron-${dir}`))
  
  navBtn.addEventListener('click', e => {onImgBrowse(e, navDir)})
  return navBtn;
}

export function imgBrowser(id, src, classes) {
  let html = [el('img', {id: id, src: src, class: classes})];
  if (!id.includes('yr')) {
    html.push(navBtn('prev'));
    html.push(navBtn('next'));
  } 
  return html;
}
