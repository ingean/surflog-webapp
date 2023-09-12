import { get, getStatistics } from "../utils/api.js"
import { selectedSpot } from "../components/spotInput.js"

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
  param = (options?.alias) ? options.alias : param
  let stats = options.stats
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
    waveheight_avg: 2,
    waveheight_max: 4,
    waveheight_std: 0.5, 
    waveperiod_min: 3,
    waveperiod_avg: 5,
    waveperiod_max: 10,
    waveperiod_std: 1, 
    windspeed_min: 5,
    wavespeed_avg: 12,
    wavespeed_max: 25,
    wavespeed_std: 5, 
  }
}

export const getStats = async(source, spot) => {
  spot = spot || selectedSpot()
  source = source || 'dmi'

  if (STATS?.[source]?.[spot]) return STATS[source][spot] // If stat is previously fetched return
  if (!STATS?.[source]) STATS[source] = {}
  if (!STATS[source]?.[spot]) STATS[source][spot] = {}

  if (source === 'buoy') {
    STATS[source][spot] = buoyStats()
    return STATS[source][spot]
  }

  let stats = await get(`statistics/forecasts2?forecast=${source}&spot=${spot}`)
  stats = statsToUse(stats)

  stats.forEach(s => {
    //if (!STATS?.[source]) STATS[source] = {}
    //if (!STATS[source]?.[spot]) STATS[source][spot] = {}

    if (s.station) {
      STATS[source][spot][s.station] = s
    } else {
      STATS[source][spot] = s
    }
  })  
  return STATS[source][spot]
}