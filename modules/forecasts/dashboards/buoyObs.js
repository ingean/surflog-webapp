import { updateBuoyObsTable, smhiBuoys, ukBuoys } from "../tables/buoyObs.js";
import { checkTile, stationTile } from "../../components/dashboard/tile.js"

var buoyStats = {}
var smhibuoyStats = {}

export const getLastSMHIObs = (obs) => {
  let lastObs = null
  obs.data.forEach(o => {
    let wh = o.waveheight
    if (wh) lastObs = o
  })
  return lastObs
}

const ukTile = (obs) => {
  return stationTile(obs, {
    id: obs.id,
    onSelect: tileSelected,
    chartParams: ['waveheight'],
    stats: buoyStats
  })
}

const smhiTile = (obs) => {
  return stationTile(obs, {
    id: 'smhi',
    onSelect: tileSelected,
    chartParams: ['waveheight', 'waveheightforecast'],
    stats: smhibuoyStats
  })
}

export const updateBuoyDashboard = (stats, smhiStats, ukBuoys, smhiBuoys) => {
  buoyStats = stats
  smhibuoyStats = smhiStats

  let tileGroup = document.getElementById('buoy-tile-group')
  let firstNode = tileGroup.firstChild

  ukBuoys.forEach(o => {
    if (firstNode) tileGroup.insertBefore(ukTile(o), firstNode)
    else tileGroup.appendChild(ukTile(o))
  })
  tileGroup.appendChild(smhiTile(smhiBuoys))
}

const tileSelected = (e) => {
  let input = e.currentTarget
  checkTile(input)
  
  if (input.id === 'smhi') {
    updateBuoyObsTable(smhiBuoys)
  } else {
    let ukBuoy = ukBuoys.find(b => b.id === input.id)
    if (ukBuoy) {
      updateBuoyObsTable(ukBuoy.data, false)
    } else {
      updateBuoyObsTable(ukBuoys[0].data, false)
    }
  }
}

