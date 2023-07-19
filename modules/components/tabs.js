import { el, div } from './elements.js';

export function tabs(id, tabNames, tabPages) {
  let listItems = [];
  let pages = [];

  for (let i = 1; i <= tabNames.length; i++) {
    listItems.push(
      el('li', `${(i === 1) ? 'active' : ''}`,
        el('a', {href: `#${id}-step-${i}`, "data-toggle": "tab"}, tabNames[i - 1]))
    );  
    pages.push(el('div', {
      id: `${id}-step-${i}`, 
      class: `tab-pane fade ${(i === 1) ? 'active in' : ''}`
    }, tabPages[i - 1]));
  }

  let list = el('ul', 'nav nav-pills nav-justified', listItems);
  let content = div('tab-content', pages)

  return div('', [list, content])
}



