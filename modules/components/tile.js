import { div, icon } from './elements.js';

export const tile = (title, frontContent, backContent, footer, iconName = 'stats', size = 'lg') => {
  iconName = (backContent) ? 'transfer' : iconName // Make it obvious that tile has two sides
  
  let content = frontContent
  let header = []
  if (title) header.push(div('tile-title', title))
  header.push(icon(iconName, 'align-right'))

  let body = [div('flex-row', header)]
  body.push(div('tile-content', content))
  if (footer) body.push(div('tile-footer flex-row', footer))

  let tile = div(`tile tile-${size}`, body)

  if (backContent) {
    tile.addEventListener('click', e => {
      content = (content === frontContent) ? backContent : frontContent
      tile.getElementsByClassName('tile-content')[0].replaceChildren(content)
    })
  }

  return tile
}