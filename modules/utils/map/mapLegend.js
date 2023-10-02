import { div, el } from '../../components/elements.js'

const layerScales = {
  'Bølger': [20, 12, 10, 8, 6, 5, 4, 3.5, 3, 2.4, 1.9, 1.4, 1, 0.7, 0.5, 0.2, null],
  'Vind': [50, 32, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, null],
  'Vindkast': [50, 32, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, null],
  'Vanntemp.': [30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0, null],
  'Strøm': [5.0, 4.8, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.2, 1.0, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1, null]
}

export const scaleColors = [
  'rgb(92, 0, 51);', 'rgb(128, 0, 0);', 'rgb(204, 31, 31);', 'rgb(230, 57, 57);', 'rgb(255, 82, 82);', 
  'rgb(255, 124, 124);', 'rgb(255, 181, 181);', 'rgb(255, 142, 82);', 'rgb(255, 178, 0);', 'rgb(255, 217, 0);', 
  'rgb(0, 143, 233);', 'rgb(61, 171, 238);', 'rgb(109, 191, 242);', 'rgb(22, 225, 204);', 'rgb(125, 238, 226);', 
  'rgb(158, 242, 233);', 'rgb(220, 250, 247);'
]

export const setMapLegend = (layerName) => {
  let values = layerScales[layerName]
  let colors = values.map((value, idx) => div({style: `width: 24px; height: 20px; line-height: 40px; background-color: ${scaleColors[idx]}`}, value))
  let legend = div({id: 'dmi-map-legend', class: 'map-legend'}, el('ul', 'map-legend-list', colors))
  
  let oldLegend = document.getElementById('dmi-map-legend')
  let map = document.getElementById('dmi-map')
  if (oldLegend) map.replaceChild(legend, oldLegend)
  else map.appendChild(legend)
}
