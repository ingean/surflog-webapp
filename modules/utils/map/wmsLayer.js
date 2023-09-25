import TileWMS from '../../lib/ol/source/TileWMS.js'
import Tile from '../../lib/ol/layer/Tile.js'
import { get as getProjection } from '../../lib/ol/proj.js'

import { createTileGrid } from './projection.js';
import { urlAPI } from '../../config/datasources.js'
import { get } from '../../utils/api.js'

const pixelRatio = parseInt(window.devicePixelRatio) || 1;

export const wmsTileLayer = (options) => {
  return new Tile({
    title: options.title,
    visible: options.visible,
    source: new TileWMS({
        url: `${urlAPI}forecasts/dmi/maps`,
        params: {
            'LAYERS': options.wmslayers,
            'TILED': true,
            'TIME': options.wmstime,
            'VERSION': '1.1.1'
        },
        tileGrid: createTileGrid(),
        tilePixelRatio: pixelRatio,
        projection: getProjection("EPSG:3575")
    })
  })
}

export const getTimeExtent = async () => {
  let result = await get('forecasts/dmi/maps/layers')
  let layer = result.layers.find(l => l.name === 'wave_eu')
  return layer.extents.time
}