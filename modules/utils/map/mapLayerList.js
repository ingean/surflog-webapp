import { div, el } from "../../components/elements.js"
import { changeLayerVisibility } from "../../forecasts/map/dmi.js"


export const layerList = () => {
  let btnGroup = div('btn-group btn-group-sm dmi-layer-list', [
                  btn('wave_eu', 'Bølger', true),
                  btn('wind_eu', 'Vind'),
                  btn('windgust_eu', 'Vindkast'),
                  btn('airpressure_eu', 'Trykk'),
                  btn('seatemp_eu', 'Vanntemp')
                ])

  return btnGroup               
}

const btn = (id, caption, active = false) => {
  let status = (active) ? 'Active' : 'notActive'
  let btn =  el('button', {
    id: `dmi-map-layer-${id}`,
    value: caption, 
    type: 'button', 
    class: `btn btn-primary btn-sm ${status}`
  }, caption)

  btn.addEventListener('click', changeLayerVisibility)
  return btn
}