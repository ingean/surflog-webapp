import { el, div } from '../elements.js'
import { icon } from '../icons.js'

export const tile = (options) => {
  let o = options
  
  o.size = o.size || 'md'
  o.icon = (o.contents.length > 1) ? 'transfer' : o.icon
  
  let content = o.contents[0]
  let header = []

  if (o.onSelect) {
    let radio = el('input', {id: o.id, type: 'radio', class: 'tile-radio'})
    radio.addEventListener('click', o.onSelect)
    header.push(radio)
  }

  if (o.title) header.push(div('tile-title', o.title))

  let tileIcon = icon(o.icon, 'tile-icon align-right')
  header.push(tileIcon)

  let contentContainer = div({class: 'tile-content', dataContent: 0 }, content)

  let body = [
    div('tile-header flex-row center-v', header),
    contentContainer,
    div('tile-footer flex-row', o.footer)
  ]
 
  let tile = div(`tile tile-${o.size}`, body)

  if (o.contents.length > 1) {
    tileIcon.addEventListener('click', e => {
      let i = contentContainer.dataContent + 1
      i = (i <o.contents.length) ? i : 0
      content = o.contents[i]
      contentContainer.dataContent = i
      tile.getElementsByClassName('tile-content')[0].replaceChildren(content)
    })
  }
  return tile
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







