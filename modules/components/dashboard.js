import { div, el } from './elements.js';
import { icon } from './icons.js'

export const tile = (title, frontContent, backContent, footer, iconName = 'stats', size = 'md', selectable = false, id,  onSelection) => {
  iconName = (backContent) ? 'transfer' : iconName // Make it obvious that tile has two sides
  
  let content = frontContent
  let header = []

  if (selectable) {
    let radio = el('input', {id, type: 'radio', class: 'tile-radio'})
    radio.addEventListener('click', onSelection)
    header.push(radio)
  }

  if (title) header.push(div('tile-title', title))

  let tileIcon = icon(iconName, 'tile-icon align-right')
  header.push(tileIcon)

  let body = [
    div('tile-header flex-row center-v', header),
    div('tile-content', content),
    div('tile-footer flex-row', footer)
  ]
  //if (footer) body.push(div('tile-footer flex-row', footer))

  let tile = div(`tile tile-${size}`, body)

  if (backContent) {
    tileIcon.addEventListener('click', e => {
      content = (content === frontContent) ? backContent : frontContent
      tile.getElementsByClassName('tile-content')[0].replaceChildren(content)
    })
  }

  return tile
}

export const radioTile = (options) => {
  let header = []

  let radio = el('input', {id: options.id, type: 'radio', class: 'tile-radio'})
  radio.addEventListener('click', onSelection)
  header.push(radio)
}

export const checkTile = (clickedRadio) => {
  let tilecontainer = document.getElementById('buoy-tile-group')
  let tiles = Array.from(tilecontainer.children)
  tiles.forEach(tile => {
    let input = tile.children[0].children[0]
    input.checked = false
  })
  clickedRadio.checked = true
}

export const indicator = (header, content, footer, rating, size = 'lg') => {
  return div(`flex-col center2 indicator indicator-${size}`, [
    div('indicator-header', header),
    div(`indicator-content-${size} txt-rating-${rating}`, content),
    div('indicator-footer', footer)
  ])
}

export const fact = (text) => {
  return div('center-v flex-row db-fact', [
    icon('info-sign'),
    div('db-fact-text', text)
  ])
}