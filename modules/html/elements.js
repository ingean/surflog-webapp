import { yrImgs } from '../config/lookups.js';
import { ratingClasses } from '../config/forecastFormat.js';

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

export function elFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

export function label(category, text, classes = '') {
    return el('span', {class: `label label-${category} ${classes}`}, text);
}

export function scoreLabel(score) {
  let rc = ratingClasses[score];
  return label(`label bg-${score}`, rc.score);
}
  
export function icon(iconName, classes = '') {
    return el('span', {class: `glyphicon glyphicon-${iconName} ${classes}`});
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
  
  return el('span', '', svg) 
}

export function tideIcon(type, height = '24', width = '24') {
  let d = (type === 'low') ? 'M3 18c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M3 21c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1m-5-11l-4 3-4-3m4 3V3.5' : 'M3 18c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M3 15c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M3 21c1 0 3-1 3-1s2 1 3 1 3-1 3-1 2 1 3 1 3-1 3-1 2 1 3 1M8 7l4-3 4 3m-4 4V4';
  let svg = svgEl('tideIcon', height, width) 
  let path = pathEl(d, 'stroke', '#006EDB'); 
  path.setAttribute('stroke-width', '1.5');
  svg.appendChild(path);
  return el('span', '', svg)
}

export function weatherImg(yrCode) {
  let _pos = yrCode.indexOf('_')
  let firstPart = (_pos > -1) ? yrCode.substring(0, _pos) : yrCode;
  let prefix = yrImgs[firstPart];
  let suffix = (_pos > -1 ) ? yrCode.substr(_pos + 1, 1) : '';
  let src = `${prefix}${suffix}.svg`;

  return el('img', {src: `images/yr/${src}`, class: 'img-weather'})
}

export function tempTd(temperature) {
  let cls = (temperature < 0) ? 'temp-freeze' : 'temp-warm';
  
  return (
    el('td', 'td-flex', 
      el ('div', cls, [ 
        el('span', 'td-value', String(Math.round(temperature))),
        el('span', 'td-unit-temp', '°')
      ])
    )
  )
}


