import Map from '../../lib/ol/Map.js'
import View from '../../lib/ol/View.js'
import {get as getProjection} from '../../lib/ol/proj.js'
import {defaults as defaultControls} from '../../lib/ol/control.js';

import { wmsTileLayer, getTimeExtent } from '../../utils/map/wmsLayer.js'
import { el, div } from '../../components/elements.js'
import { mapLock } from '../../utils/map/mapLockControl.js'
import { mapLegend } from '../../utils/map/mapLegend.js'
import { layerList } from '../../utils/map/mapLayerList.js';

var map = null

const addMapElements = () => {
  let section = document.getElementById('dmi-map-section')
  let mapTools = [
      div({id: 'dmi-map', style:'width: 100%; height: 400px; position:relative;'}),
      div({id: 'dmi-map-slider-container', class: 'slidecontainer'}),
      div({id: 'dmi-map-time'}),
      div({id: 'dmi-map-layerlist-container'}, layerList())
    ]
  mapTools.forEach(e => section.appendChild(e))
}

const setLayerTime = (layer, datetime) => {
  layer.getSource().updateParams({'TIME': moment(datetime).toISOString()});
  document.getElementById('dmi-map-time').innerText = moment(datetime).calendar(null, {sameElse: 'DD.MM.YYYY HH:mm'})
}

const initMapControls = (layer, timeExtent) => {
  addMapElements()
  addTimeSlider(layer, timeExtent)
  addMapLegend()
}

const addTimeSlider = (layer, timeExtent) => {
  let max = timeExtent.length - 1
  let slider = el('input', {type:"range", min:0, max, value:0, class:"slider", id:"dmi-map-time-slider"})
  let container = document.getElementById('dmi-map-slider-container')
  container.appendChild(slider)
  
  slider.oninput = function() {
    setLayerTime(layer, timeExtent[slider.value])
  }
}

const addMapLegend = () => {
  let container = document.getElementById('dmi-map')
  container.appendChild(mapLegend('wave_eu'))
}

export const initDMIMap = async () => {
  let timeExtent = await getTimeExtent()
  let wmsLayer = wmsTileLayer('wave_eu', timeExtent[0])
  initMapControls(wmsLayer, timeExtent)
  setLayerTime(wmsLayer, timeExtent[0])
  
  map = new Map({
    target: 'dmi-map',
    controls: defaultControls().extend([new mapLock()]),
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

