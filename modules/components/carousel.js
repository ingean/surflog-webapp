import { el, div, span } from './elements.js';

function indicators(options) {
  let indList = el('ol', {class: `carousel-indicators report-${options.id}-indicators`});

  for (let i = 0; i < options.items.length; i++) {
    let ind = el('li', {
      "data-target": `#carousel-${options.id}`, 
      "data-slide-to": i, 
      "class": (i === 0) ? "active" : ""
    });
    indList.appendChild(ind);
  }
  return indList;
}

function pages(options) {
  let pages = div('carousel-inner')

  for (let i = 0; i < options.items.length; i++) {
    let page = div({
      "class": (i === 0) ? "item carousel-item active" : "item carousel-item"
    }, options.items[i]);
    pages.appendChild(page);
  }
  return pages;
}

function control(options, direction) {
  return ( 
    el('a', {
      "class": `${direction} carousel-control report-${options.id}-control`, 
      "href": `#carousel-${options.id}`, 
      "data-slide": (direction === 'left') ? "prev" : "next"},
      span(`glyphicon glyphicon-chevron-${direction} report-${options.id}-control-icon`) 
    )
  );
}

export function carousel(options) {
  return ( 
    div({
      id: `carousel-${options.id}`, 
      class: 'carousel slide', 
      "data-ride": "carousel",
      "data-interval": "false"}, [
        indicators(options),
        pages(options),
        control(options, 'left'),
        control(options, 'right')
    ])
  );
}

