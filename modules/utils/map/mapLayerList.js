import { inputSelect } from "../../components/formGroup.js"
import { changeLayerVisibility } from "../../forecasts/map/dmi.js"


export const layerList = () => {
  const layers = [
    {caption: 'Bølger', value: 'wave_eu', default: true},
    {caption: 'Vind', value: 'wind_eu'},
    {caption: 'Vindkast', value: 'windgust_eu'},
    {caption: 'Lufttrykk', value: 'precip_eu'},
    {caption: 'Vanntemp.', value: 'seatemp_eu'}
  ]
  
  let options = {
    id: 'dmi-map-layerlist',
    name: 'layers', 
    type: 'btn', 
    caption: 'Kartlag', 
    domain: layers
  }

  //let select = inputSelect(options)
  //select.addEventListener('click', changeLayerVisibility)

  return inputSelect(options)
}