const paramsPoints = {
  waveheight: [
    {min: 0, max: 0.5, points: 0},
    {min: 0.5, max: 1, points: 2},
    {min: 1.0, max: 1.4, points: 4},
    {min: 1.4, max: 1.6, points: 6},
    {min: 1.6, max: 2, points: 8},
    {min: 2.0, max: 3, points: 10},
    {min: 3.0, max: 100, points: 12}
  ],
  waveperiod: [
    {min: 0, max: 4.5, points: 0},
    {min: 4.5, max: 5.5, points: 4},
    {min: 5.5, max: 6, points: 6},
    {min: 6.0, max: 6.5, points: 8},
    {min: 6.5, max: 8, points: 10},
    {min: 8.0, max: 10, points: 12},
    {min: 10.0, max: 100, points: 14}
  ],
  swellheight: [
    {min: 0, max: 0.2, points: 0},
    {min: 0.2, max: 0.4, points: 4},
    {min: 0.4, max: 0.6, points: 6},
    {min: 0.6, max: 1, points: 8},
    {min: 1.0, max: 1.4, points: 10},
    {min: 1.4, max: 1.8, points: 12},
    {min: 1.8, max: 100, points: 14}
  ],
  swellperiod: [
    {min: 0, max: 5, points: 0},
    {min: 5.0, max: 5.8, points: 6},
    {min: 5.8, max: 6.2, points: 9},
    {min: 6.2, max: 7, points: 12},
    {min: 7.0, max: 8, points: 15},
    {min: 8.0, max: 10, points: 18},
    {min: 10.0, max: 100, points: 21}
  ],
  wind: [
    {min: 0, max: 8, points: 0},
    {min: 8, max: 10, points: 4},
    {min: 10, max: 12, points: 6},
    {min: 12, max: 14, points: 8},
    {min: 14, max: 16, points: 10},
    {min: 16, max: 100, points: 12}
  ],
  total: [
    {min: 0, max: 17, points: 0},
    {min: 17, max: 26, points: 1},
    {min: 26, max: 30, points: 2},
    {min: 30, max: 35, points: 3},
    {min: 35, max: 46, points: 4},
    {min: 46, max: 100, points: 5}
  ]
};


const paramsStatPoints = {
  waveheight: [
    {descr: 'Under min', points: 0},
    {descr: 'min to std', points: 4},
    {descr: 'avg min std', points: 8},
    {descr: 'avg plus std', points: 12},
    {descr: 'Over', points: 14}
  ],
  waveperiod: [
    {descr: 'Under min', points: 0},
    {descr: 'min to std', points: 6},
    {descr: 'avg min std', points: 12},
    {descr: 'avg plus std', points: 16},
    {descr: 'Over', points: 18}
  ],
  swellheight: [
    {descr: 'Under min', points: 0},
    {descr: 'min to std', points: 6},
    {descr: 'avg min std', points: 12},
    {descr: 'avg plus std', points: 16},
    {descr: 'Over', points: 18}
  ],
  swellperiod: [
    {descr: 'Under min', points: 0},
    {descr: 'min to std', points: 6},
    {descr: 'avg min std', points: 12},
    {descr: 'avg plus std', points: 16},
    {descr: 'Over', points: 18}
  ],
  wind: [
    {descr: 'Under min', points: 0},
    {descr: 'min to std', points: 2},
    {descr: 'avg min std', points: 4},
    {descr: 'avg plus std', points: 6},
    {descr: 'Over', points: 8}
  ],
  total: [
    {min: 0, max: 17, points: 0},
    {min: 17, max: 26, points: 1},
    {min: 26, max: 30, points: 2},
    {min: 30, max: 35, points: 3},
    {min: 35, max: 46, points: 4},
    {min: 46, max: 100, points: 5}
  ]
};

export function points(value, param) {
  return paramsPoints[param].find(v => value >= v.min && value < v.max).points
}

export function pointsStats(i, param){
  return paramsStatPoints[param][i]
}

export function pointsStatsTotal(value){
  return paramsStatPoints.total.find(v => value >= v.min && value < v.max).points
}