import { get } from "../utils/api.js"
import { selectedSpot } from "../components/spotInput.js"
import { emptyObj } from "./utilities.js"

var STATS = {}

export function getStatsForParam(statistics, param, score = 4, station = null) {
  let stats = {
    min: 0,
    avg: 0,
    max: 0,
    std: 0
  }

  for (let key in stats) {
    if (station) {
      stats[key] = statistics[score][station][`${param}_${key}`]
    } else {
      stats[key] = statistics[score][`${param}_${key}`]
    }
  }

  return stats
}


export const paramStats = (param, options) => {
  let stats = options.stats
  if (!stats) return 

  param = param.includes('forecast') ? 'waveheight' : param  
  param = (options?.alias) ? options.alias : param
  
  let result = {min: 0, avg: 0, max: 0, std:0}

  for (let stat in result) {
    let key = `${param}_${stat}`
    result[stat] = (options?.station) ? stats[options.station][key] : stats[key]
  }
  return result

}

const statsToUse = (stats) => {
  let scores = [4,3,2]
  let stat = null
  scores.every(score => {
    stat = stats.filter(s => s.score === score)
    return (stat) ? false : true
  })
  return stat
}

const buoyStats = () => {
  return {
    spot: 'Saltstein',
    score: 4,
    count: 1,
    waveheight_min: 1,
    waveheight_avg: 2.5,
    waveheight_max: 5,
    waveheight_std: 0.5, 
    waveperiod_min: 4,
    waveperiod_avg: 6,
    waveperiod_max: 12,
    waveperiod_std: 1, 
    windspeed_min: 5,
    windspeed_avg: 12,
    windspeed_max: 25,
    windspeed_std: 5, 
  }
}

export const getStats = async(source, spot) => {
  spot = spot || selectedSpot()
  source = source || 'dmi'

  if (STATS?.[source]?.[spot] && !emptyObj(STATS[source][spot])) return STATS[source][spot]
  if (!STATS?.[source]) STATS[source] = {}
  if (!STATS[source]?.[spot]) STATS[source][spot] = {}

  if (source === 'buoy') {
    STATS[source][spot] = buoyStats()
    return STATS[source][spot]
  }

  let stats = await get(`statistics/forecasts2?forecast=${source}&spot=${spot}`)
  stats = statsToUse(stats)

  stats.forEach(s => {
    if (s.station) {
      STATS[source][spot][s.station] = s
    } else {
      STATS[source][spot] = s
    }
  })  
  return STATS[source][spot]
}
  