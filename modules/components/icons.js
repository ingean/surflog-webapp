import { filenameify, tideParts } from '../utils/utilities.js'
import { el, div, span } from './elements.js'
import { direction } from '../config/forecasts.js'

export const img = (folder, nameWithExt, height, width) => {
  return el('img', {src: `images/${folder}/${nameWithExt}`, height: height, width: width})
}

export const sprite = (folder, file, id, height = 20, width = 20, rotation, title) => {
  let svgNode = document.createElementNS('http://www.w3.org/2000/svg','svg')
  svgNode.setAttribute('height', `${height}px`)
  svgNode.setAttribute('width', `${width}px`)

  let gNode = document.createElementNS('http://www.w3.org/2000/svg','g')
  gNode.setAttribute('pointer-events', 'bounding-box')
  
  if (title) {
    let titleNode = document.createElementNS("http://www.w3.org/2000/svg","title")
    titleNode.textContent = title
    gNode.appendChild(titleNode)
  }
  
  if (rotation) svgNode.setAttribute('style', `transform: rotate(${rotation}deg)`);

  let useNode = document.createElementNS('http://www.w3.org/2000/svg','use')
  useNode.setAttribute('href', `images/${folder}/${file}.svg#${id}`)
  
  gNode.appendChild(useNode)
  svgNode.appendChild(gNode)
  return svgNode
}

export const icon = (iconName, classes = '') => {
  return span({class: `glyphicon glyphicon-${iconName} ${classes}`})
}

export const iconLogo = (brand, color, height = 20, width = 20) => {
  return sprite('logos', 'logos', brand, height, width)
}

export const iconLogoWithText = (title, brand, color, height, width) => {
  return div('flex-row', [
    iconLogo(brand, color, height, width),
    div('tile-logo-text', title)
  ])
}

export const iconReport = (report) => {
  let id = (report.type === 'Session') ? report.type : report.source
  id = filenameify(id)

  return sprite('reports', 'type', id)
}

export const iconTide = (report) => {
  if(report.type !== 'Session') return
  let p = tideParts(report.tide)
  let title = (report.tidestart) ? `${report.tidestart} - ${report.tideend}m` : ''
 
  return sprite('tides', 'tides', p.id, 24, 24, null, title) 
}

export const arrow = (rotation, size = 'md') => {
  if (!rotation) return
  let title = `${rotation}° ${direction(rotation).short.toUpperCase()}`
  let id = (size === 'sm') ? 'arrow2' : 'arrow'
  let height = (size === 'sm') ? 18 : 24
  let width = (size === 'sm') ? 12 : 24
  return sprite('icons', 'icons', id, height, width, rotation, title)
}
