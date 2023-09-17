import Map from '../../lib/ol/Map.js'
import View from '../../lib/ol/View.js'
import {get as getProjection} from '../../lib/ol/proj.js'
import { defaults } from '../../lib/ol/interaction/defaults.js'

import { wmsTileLayer, getTimeExtent } from '../../utils/map/wmsLayer.js'
import { el, div } from '../../components/elements.js'
import { icon } from '../../components/icons.js'

var map = null
var mapLock = false

const setLayerTime = (layer, datetime) => {
  layer.getSource().updateParams({'TIME': moment(datetime).toISOString()});
  document.getElementById('dmi-map-time').innerText = moment(datetime).calendar(null, {sameElse: 'DD.MM.YYYY HH:mm'})
}

const initMapControls = (layer, timeExtent) => {
  addMapElements()
  addLockCtr()
  let max = timeExtent.length - 1
  let slider = el('input', {type:"range", min:0, max, value:0, class:"slider", id:"dmi-map-time-slider"})
  let container = document.getElementById('dmi-map-slider-container')
  container.appendChild(slider)
  
  slider.oninput = function() {
    setLayerTime(layer, timeExtent[slider.value])
  }
}

const addMapElements = () => {
  let container = document.getElementById('dmi-map-section')
  let children = [
    div({id: 'dmi-map', style:'width: 100%; height: 400px'}),
    div({id: 'dmi-map-slider-container', class: 'slidecontainer'}),
    div({id: 'dmi-map-time'})
  ]

  children.forEach(c => container.appendChild(c))
}

const lockedMapOptions = () => {
  return defaults({
      doubleClickZoom: false,
      dragAndDrop: false,
      dragPan: false,
      keyboardPan: false,
      keyboardZoom: false,
      mouseWheelZoom: false,
      pointer: false,
      select: false
    })
}

const toggleMapLock = () => {
  let interactions = map.getInteractions()
  interactions.forEach(i => i.setActive(!mapLock))
  mapLock = !mapLock
}

const addLockCtr = () => {
 let lockIcon = icon('ban-circle', 'tool')
 lockIcon.addEventListener('click', toggleMapLock)
 document.getElementById('dmi-map-section').appendChild(lockIcon)
}


export const initDMIMap = async () => {
  let timeExtent = await getTimeExtent()
  let wmsLayer = wmsTileLayer('wave_eu', timeExtent[0])
  initMapControls(wmsLayer, timeExtent)
  setLayerTime(wmsLayer, timeExtent[0])
  
  map = new Map({
    target: 'dmi-map',
    //interactions: lockedMapOptions(),
    layers: [wmsLayer],
    view: new View({
      projection: getProjection("EPSG:3575"),
      center: [-232904, -3591543],
      zoom: 6,
    })
  })
  
  map.on('pointermove', (e) => {
    const pixel = map.getEventPixel(e.originalEvent)
    const hit = map.hasFeatureAtPixel(pixel)
    map.getTarget().style.cursor = hit ? 'pointer' : ''
  })
}

export const addLayerToMap = (layer) => {
  map.addLayer(layer)
}


