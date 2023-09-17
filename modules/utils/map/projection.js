import TileGrid from '../../lib/ol/tilegrid/TileGrid.js'
import {get as getProjection} from '../../lib/ol/proj.js'
import { register } from '../../lib/ol/proj/proj4.js'

// Default values
const tileSize = 512
const maxZoom = 16
const pixelRatio = parseInt(window.devicePixelRatio) || 1;

export const createProjection = () => {
  proj4.defs("EPSG:3575","+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs")
  register(proj4)
  let halfWidth = Math.sqrt(2) * 6371007.2;
  let extent = [-halfWidth, -halfWidth, halfWidth, halfWidth]
  getProjection("EPSG:3575").setExtent(extent)
  return halfWidth
}

export const getResolutions = (halfWidth, max_zoom, tile_size) => {
  tile_size = tile_size || tileSize
  max_zoom = max_zoom || maxZoom
  return Array.from(new Array(max_zoom), (x,i) => (halfWidth/(tile_size*Math.pow(2,i-1))))
}

export const createTileGrid = () => {
  let halfWidth = createProjection()
  return new TileGrid({
    extent: getProjection('EPSG:3575').getExtent(),
    origin: [-halfWidth,halfWidth],
    minZoom: 0,
    maxZoom: maxZoom,
    resolutions: getResolutions(halfWidth),
    tileSize: tileSize,
  })
}



