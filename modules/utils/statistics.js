import { selectedSpot } from '../components/spotInput.js';

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