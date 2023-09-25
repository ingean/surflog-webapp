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
  let layerListBtn = div({id: 'dmi-map-layerlist-container input-group'}, layerList())
  let mapTools = [
      div({id: 'dmi-map', style:'width: 100%; height: 400px; position:relative;'}),
      div({id: 'dmi-map-slider-container', class: 'slidecontainer'}),
      div({id: 'dmi-map-time'}),
      layerListBtn,
    ]
  mapTools.forEach(e => section.appendChild(e))

  layerListBtn.addEventListener('click', changeLayerVisibility )
}

const setLayerTime = (datetime) => {
  if (!map) return

  let wmsLayerIndx = [0,1]
  let wmsLayers = wmsLayerIndx.map(i => map.getLayers().item(i))
  wmsLayers.forEach(layer => {
    layer.getSource().updateParams({'TIME': moment(datetime).toISOString()})
  })
  document.getElementById('dmi-map-time').innerText = moment(datetime).calendar(null, {sameElse: 'DD.MM.YYYY HH:mm'})
}

const initMapControls = (timeExtent) => {
  addMapElements()
  addTimeSlider(timeExtent)
  addMapLegend()
}

const addTimeSlider = (timeExtent) => {
  let max = timeExtent.length - 1
  let slider = el('input', {type:"range", min:0, max, value:0, class:"slider", id:"dmi-map-time-slider"})
  let container = document.getElementById('dmi-map-slider-container')
  container.appendChild(slider)
  
  slider.oninput = function() {
    setLayerTime(timeExtent[slider.value])
  }
}

const addMapLegend = () => {
  let container = document.getElementById('dmi-map')
  container.appendChild(mapLegend('wave_eu'))
}

export const initDMIMap = async () => {
  let timeExtent = await getTimeExtent()
  let waveLayer = wmsTileLayer({
    title: 'Bølgehøyde',
    visible: true,
    wmslayers: 'wave_eu',
    wmstime: timeExtent[0]
  })
  let windLayer = wmsTileLayer({
    title: 'Vind',
    visible: false,
    wmslayers: 'wind_eu',
    wmstime: timeExtent[0]
  })

  initMapControls(timeExtent)
  setLayerTime(timeExtent[0])
  
  map = new Map({
    target: 'dmi-map',
    controls: defaultControls().extend([new mapLock()]),
    layers: [waveLayer, windLayer],
    view: new View({
      projection: getProjection("EPSG:3575"),
      center: [-232904, -3591543],
      zoom: 6,
    })
  })

  map.on('pointermove', (e) => {
    let mapContainer = document.getElementById('dmi-map')
    const pixel = map.getEventPixel(e.originalEvent)
    const hit = map.hasFeatureAtPixel(pixel)
    mapContainer.style.cursor = (hit) ? 'pointer' : ''
  })
}

export const addLayerToMap = (layer) => {
  if (!map || !layer) return
  map.addLayer(layer)
}

export const changeLayerVisibility = (e) => {
  let clicked = e.currentTarget.value
  console.log(clicked)
}

