function nester(el, n) {
  if (typeof n === "string") {
    var t = document.createTextNode(n);
    el.appendChild(t);
  } else if (n instanceof Array) {
        for(var i = 0; i < n.length; i++) {
          if (typeof n[i] === "string") {
              var t = document.createTextNode(n[i]);
              el.appendChild(t);
          } else if (n[i] instanceof Node){
              el.appendChild(n[i]);
          }
      }
  } else if (n instanceof Node){
      el.appendChild(n)
  }
  return el;
}

export function el(tagName, props, nest) {
    var el = document.createElement(tagName || 'div');
    
    if(props) {
        if(typeof props === "string") {
            el.setAttribute("class", props)
        } else {
            for(let name in props) {
              if(name.indexOf("on") === 0) {
                el.addEventListener(name.substr(2).toLowerCase(), props[name], false)
            } else {
              el.setAttribute(name, props[name]);
            }
            }
        }    
    }
    if (!nest) return el;
    return nester(el, nest)
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



