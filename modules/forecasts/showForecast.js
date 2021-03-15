import { el } from '../utils/html/elements.js';

function navEl(direction) {
  return (
    el('button', 'panel-btn-nav prev', 
      el('span', `glyphicon glyphicon-chevron-${direction}`, ''))
  )
}

function panelNavigation(options) {
  if(options.navigation) {
    return [
      navEl('left'),
      navEl('right')
    ]
  }
}

function panelFooter(options) {
  if(options.provider === 'msw' && options.source === 'surflog') {
    return (
      el('div', 'panel-footer', [
        el('span', 'panel-h dark', options.tite),
        el('span', {
          id: `time-${options.id}`,
          class: 'panel-h dark time-msw-history',
          "data-forecastttime": ''})
      ])
    )
  } else {
    return '';
  }
}

export function showForecastImage(options) {
  return [
  el('div', "panel-body", 
    el('div', {id: options.id}, [
      el('img', {
        id: `img-${options.id}`, 
        class: `img-${options.provider}`,
        src: options.url,
        "data-source": options.source
      }),
      panelNavigation(options)
    ])
  ),
  panelFooter(options)
  ]
}

