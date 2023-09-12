import { div } from './elements.js';
import { icon } from './icons.js'

export const tile = (title, frontContent, backContent, footer, iconName = 'stats', size = 'md') => {
  iconName = (backContent) ? 'transfer' : iconName // Make it obvious that tile has two sides
  
  let content = frontContent
  let header = []
  if (title) header.push(div('tile-title', title))
  header.push(icon(iconName, 'align-right'))

  let body = [
    div('tile-header flex-row', header),
    div('tile-content', content),
    div('tile-footer flex-row', footer)
  ]
  //if (footer) body.push(div('tile-footer flex-row', footer))

  let tile = div(`tile tile-${size}`, body)

  if (backContent) {
    tile.addEventListener('click', e => {
      content = (content === frontContent) ? backContent : frontContent
      tile.getElementsByClassName('tile-content')[0].replaceChildren(content)
    })
  }

  return tile
}

export const indicator = (header, content, footer, rating, size = 'lg') => {
  return div(`flex-col center2 indicator indicator-${size}`, [
    div('indicator-header', header),
    div(`indicator-content-${size} txt-${rating}`, content),
    div('indicator-footer', footer)
  ])
}

export const fact = (text) => {
  return div('center-v flex-row db-fact', [
    icon('info-sign'),
    div('db-fact-text', text)
  ])
}