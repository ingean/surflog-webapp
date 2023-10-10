import { get } from "../../utils/api.js"
import { valueRating } from "../format.js"
import { paramVal } from "../../config/forecastValues.js"
import { vectorLayer } from "../../utils/map/vectorLayer.js"
import { addLayerToMap } from "./dmi.js"

export const getBSHObservations = async () => {
  let obs = await get('observations/bsh')
  addStationsToMap(obs)
}

export const addStationsToMap = (stations, stats) => {
  let features = stations.map(s => { 
    return {
      lat: s.lat, 
      lon: s.lon, 
      name: s.name, 
      value: paramVal(s.data[0], 'waveheight'), 
      dir: s.data[0].wavedir, 
      rating: valueRating(s.data[0], 'waveheight', {stats})
    }
  })

  let layer = vectorLayer(features)
  addLayerToMap(layer)
}