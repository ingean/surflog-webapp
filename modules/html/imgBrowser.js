import { el } from './elements.js';

function onImgBrowse(e, navDir) {
  let imgId = e.target.previousElementSibling.id;
  let source = imgId.split('-')[1];
  let type = imgId.split('-')[2];
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
