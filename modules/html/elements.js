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
  
export function icon(iconName, classes = '') {
    return el('span', {class: `glyphicon glyphicon-${iconName} ${classes}`});
}

export function arrow(rotation, height = '24px', width = '24px') {
  
  let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('id', 'arrow');
  svg.setAttribute('x', '0px');
  svg.setAttribute('y', '0px');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('height', height);
  svg.setAttribute('width', width);
  svg.setAttribute('style', `transform: rotate(${rotation}deg)`);
  
  let path = document.createElementNS('http://www.w3.org/2000/svg','path'); 
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('d', 'M11.53 3l-.941 12.857L7 15l5.001 6L17 15l-3.587.857L12.471 3h-.941z');
  path.setAttribute('clip-rule', 'evenodd');
  svg.appendChild(path);
  
  return el('span', '', svg) 
}



