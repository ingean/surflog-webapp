import Feature from '../../lib/ol/Feature.js'
import VectorLayer from '../../lib/ol/layer/Vector.js'
import VectorSource from '../../lib/ol/source/Vector.js'
import { Point } from '../../lib/ol/geom.js'

import { pointStyle } from './styles.js'

const point = (lat, lon, targetProjection) => {
  return new Point(projectPoint(lat, lon, targetProjection))
}

const projectPoint = (lat, lon, targetProjection) => {
  return proj4(targetProjection, [lon, lat])
}

export const vectorLayer = (features) => {
  let targetProj = "+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs"
  features = features.map(f => new Feature({
    geometry: point(f.lat, f.lon, targetProj),
    name: f.name,
    size: 8,
    rating: f.rating
  }))

  const vectorSource = new VectorSource({
    features: features,
    wrapX: false,
  })

  return new VectorLayer({
    source: vectorSource,
    style: function (feature) {
      return pointStyle(feature)
    }
  })
}



