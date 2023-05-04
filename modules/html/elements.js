import { weatherIcons } from '../config/forecasts.js';
import { getRating, getScoreCaption } from '../config/forms.js';

function appendChildren(el, children) {
  if (typeof children === 'string' || typeof children === 'number') {
    el.appendChild(document.createTextNode(children));
  } else if (children instanceof Array) {
        for (let child of children) {
          if (typeof child === 'string' || typeof child === 'number') {
              el.appendChild(document.createTextNode(child));
          } else if (child instanceof Node){
              el.appendChild(child);
          }
      }
  } else if (children instanceof Node){
      el.appendChild(children)
  }
  return el;
} 

export function el(tagName, attributes, children) {
  let el = document.createElement(tagName || 'div');
    
  if (attributes) {
    if (typeof attributes === 'string') {
      el.setAttribute('class', attributes)
    } else {
      for (let name in attributes) {
        el.setAttribute(name, attributes[name]);
      }
    }    
  }
  if (!children) return el;
  return appendChildren(el, children)
}

export const div = (attributes, children) => {
  return el('div', attributes, children)
}

export const span = (attributes, children) => {
  return el('span', attributes, children)
}

export function elFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

export function label(score, caption, classes = '') {
    return span(`label bg-${score} ${classes}`, caption)
}

export function scoreLabel(score, classes = '') {
  let caption = getScoreCaption(score);
  return span(`label bg-${score} ${classes}`, caption)
}

  
export function icon(iconName, classes = '') {
    return span({class: `glyphicon glyphicon-${iconName} ${classes}`})
}

function svgEl(id, height, width, rotation) {
  let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('id', id);
  svg.setAttribute('x', '0px');
  svg.setAttribute('y', '0px');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('height', `${height}px`);
  svg.setAttribute('width', `${width}px`);
  if (rotation) svg.setAttribute('style', `transform: rotate(${rotation}deg)`);
  return svg;
}

function pathEl(d, type = 'fill', color = 'currentColor')  {
  let path = document.createElementNS('http://www.w3.org/2000/svg','path'); 
  path.setAttribute(type, color);
  path.setAttribute('d', d);
  return path;
}

export function arrow(rotation, height = '24', width = '24') {
  if (!rotation) return null;
  let d = 'M11.53 3l-.941 12.857L7 15l5.001 6L17 15l-3.587.857L12.471 3h-.941z'
  let svg = svgEl('arrow', height, width, rotation); 
  let path = pathEl(d)
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('clip-rule', 'evenodd');
  svg.appendChild(path);
  
  return span('', svg) 
}

export function stars(open, filled, max = 5) {
  open = open || 0
  filled = filled || 0
  let stars = []
  let i = 0
  while (i < max) {
    let cls = (i < filled) ? 'star-filled' : (i - filled < open ) ? 'star-open' : 'star';
    stars.push(el('li', `${cls} starrating list-item-h`, el('i', 'glyphicon glyphicon-star starrating', '')))
    i++
  }
  return el('ul', 'starrating-list', stars)
}

export function tideIcon(type, dir, hoverText, height = '24', width = '24') {

  let tidesSVG = {
    low: {
      up: 'M3 18c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M8 7l4-3 4 3m-4 4V4',
      down: 'M3 18c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1m-5-11l-4 3-4-3m4 3V3.5'
    },
    medium: {
      up: 'M3 18c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M3 21c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M8 7l4-3 4 3m-4 4V4',
      down: 'M3 18c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M3 21c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1m-5-11l-4 3-4-3m4 3V3.5'
    },
    high: {
      up: 'M3 18c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M3 15c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M3 21c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M8 7l4-3 4 3m-4 4V4',
      down: 'M3 18c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M3 15c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M3 21c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1m-5-11l-4 3-4-3m4 3V3.5'
    } 
  }

  let d = tidesSVG[type][dir]
  let svg = svgEl('tideIcon', height, width)
  let popover = el('a', {"data-toggle": "popover", "data-container": "body", title: "Tidevann", "data-content":hoverText, "data-placement":"right"}) 
  let path = pathEl(d, 'stroke', '#006EDB');
  path.setAttribute('stroke-width', '1.5');
  
  popover.appendChild(path)
  
  svg.appendChild(popover);
  return span('', svg)
}

export function weatherImg(yrCode) {
  let _pos = yrCode.indexOf('_')
  let firstPart = (_pos > -1) ? yrCode.substring(0, _pos) : yrCode;
  let prefix = weatherIcons[firstPart];
  let suffix = (_pos > -1 ) ? yrCode.substr(_pos + 1, 1) : '';
  let src = `${prefix}${suffix}.svg`;

  return el('img', {src: `images/yr/${src}`, class: 'img-weather'})
}

export function tempTd(temperature) {
  let cls = (temperature < 0) ? 'temp-freeze' : 'temp-warm';
  
  return (
    el('td', '', 
      div(cls, [ 
        span('td-value', String(Math.round(temperature))),
        span('td-unit-temp', '°')
      ])
    )
  )
}

export function hrsTd(date) {
  return el('td', 'td-fixed', 
          el('strong', '', moment(date).format('HH')));
}


