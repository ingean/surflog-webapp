import Map from '../../lib/ol/Map.js'
import View from '../../lib/ol/View.js'
import {get as getProjection} from '../../lib/ol/proj.js'
import {defaults as defaultControls} from '../../lib/ol/control.js';

import { wmsTileLayer, getTimeExtent } from '../../utils/map/wmsLayer.js'
import { el, div } from '../../components/elements.js'
import { mapLock } from '../../utils/map/mapLockControl.js'
import { setMapLegend } from '../../utils/map/mapLegend.js'
import { layerList } from '../../utils/map/mapLayerList.js';
import { toggleActiveBtn } from '../../utils/utilities.js';

var map = null
var layers = []

const addMapElements = () => {
  let section = document.getElementById('dmi-map-section')
  let layerListBtn = layerList()
  let mapTools = [
      div({id: 'dmi-map', style:'width: 100%; height: 400px; position:relative;'}),
      div({id: 'dmi-map-slider-container', class: 'slidecontainer'}),
      div({id: 'dmi-map-time'}),
      layerListBtn,
    ]
  mapTools.forEach(e => section.appendChild(e))
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
  setMapLegend('Bølger')
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

export const initDMIMap = async () => {
  let timeExtent = await getTimeExtent()
  layers = [
    wmsTileLayer({
      title: 'Bølger',
      visible: true,
      wmslayers: 'wave_eu',
      wmstime: timeExtent[0]
    }),
    wmsTileLayer({
      title: 'Vind',
      visible: false,
      wmslayers: 'wind_eu',
      wmstime: timeExtent[0]
    }),
    wmsTileLayer({
      title: 'Vindkast',
      visible: false,
      wmslayers: 'windgust_eu',
      wmstime: timeExtent[0]
    }),
    wmsTileLayer({
      title: 'Strøm',
      visible: false,
      wmslayers: 'current_eu',
      wmstime: timeExtent[0]
    })
  ]

  initMapControls(timeExtent)
  setLayerTime(timeExtent[0])
  
  map = new Map({
    target: 'dmi-map',
    controls: defaultControls().extend([new mapLock()]),
    layers,
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
  let btn = e.currentTarget
  toggleActiveBtn(btn)

 layers.forEach(l => {
  let p = l.getProperties()
  if (l.getVisible() === true) l.setVisible(false)
  if (p.title === btn.value) l.setVisible(true)
 })
 setMapLegend(btn.value)
}

