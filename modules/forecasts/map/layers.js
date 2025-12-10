import { get } from "../../utils/api.js"
import { valueRating } from "../format.js"
import { paramVal } from "../../config/forecastValues.js"
import { vectorLayer } from "../../utils/map/vectorLayer.js"
import { addDataToMap } from "./arcgis.js"

export const getBSHObservations = async () => {
  let obs = await get('observations/bsh')
  addStationsToMap(obs)
}

export const addStationsToMap = (stations, stats) => {
  let data = stations.map(s => { 
    return {
      lat: s.lat, 
      lon: s.lon, 
      name: s.name,
      value: s.data[0].waveheight, 
      caption: paramVal(s.data[0], 'waveheight'), 
      rotation: s.data[0].wavedir, 
      rating: valueRating(s.data[0], 'waveheight', {stats})
    }
  })

  addDataToMap(data, 'wave', 'BSH Stasjoner')
}