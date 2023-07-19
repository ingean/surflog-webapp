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

export function ratingLabel(score, size = 'md', classes = '') {
  let caption = getScoreCaption(score);
  return span(`label score-label score-label-${size} bg-${score} ${classes}`, caption)
}

export function paramLabel(param, value, caption = '', cls = '') {
  caption = (caption) ? `${value} ${caption}` : value
  return span(`label bg-${getRating(param, value)} ${cls} report-condition`, caption)
}

export function icon(iconName, classes = '') {
    return span({class: `glyphicon glyphicon-${iconName} ${classes}`})
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

export function weatherImg(yrCode) {
  let _pos = yrCode.indexOf('_')
  let firstPart = (_pos > -1) ? yrCode.substring(0, _pos) : yrCode;
  let prefix = weatherIcons[firstPart];
  let suffix = (_pos > -1 ) ? yrCode.substr(_pos + 1, 1) : '';
  let src = `${prefix}${suffix}.svg`;

  return el('img', {src: `images/yr/${src}`, class: 'img-weather'})
}

export function tempTd(temp) {
  return el('td', '', tempSpan('td-value', temp))
}

export function tempSpan(cls, temp) {
  let tmpCls = (temp < 0) ? 'temp-freeze' : 'temp-warm';
  
  return span(`${tmpCls} ${cls}`, `${String(Math.round(temp))}°`)
}

export function hrsTd(date) {
  return el('td', 'td-fixed', 
          el('strong', '', moment(date).format('HH')));
}




