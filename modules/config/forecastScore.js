const luScoring = {
  waveheight: [
    {min: 0.5, points: 2},
    {min: 1.0, points: 4},
    {min: 1.4, points: 6},
    {min: 1.6, points: 8},
    {min: 2.0, points: 10},
    {min: 3.0, points: 12}
  ],
  waveperiod: [
    {min: 4.5, points: 4},
    {min: 5.5, points: 6},
    {min: 6.0, points: 8},
    {min: 6.5, points: 10},
    {min: 8.0, points: 12},
    {min: 10.0, points: 14}
  ],
  swellheight: [
    {min: 0.2, points: 4},
    {min: 0.4, points: 6},
    {min: 0.6, points: 8},
    {min: 1.0, points: 10},
    {min: 1.4, points: 12},
    {min: 1.8, points: 14}
  ],
  swellperiod: [
    {min: 5.0, points: 6},
    {min: 5.8, points: 9},
    {min: 6.2, points: 12},
    {min: 7.0, points: 15},
    {min: 8.0, points: 18},
    {min: 10.0, points: 21}
  ],
  wind: [
    {min: 6, points: 0},
    {min: 8, points: 4},
    {min: 10, points: 6},
    {min: 12, points: 8},
    {min: 14, points: 10},
    {min: 16, points: 12}
  ],
  score: [
    {min: 0, points: 0},
    {min: 17, points: 1},
    {min: 26, points: 2},
    {min: 30, points: 3},
    {min: 35, points: 4},
    {min: 46, points: 5}
  ]
}

function getRange(ranges, value) {
  let r = {};
  for (let range of ranges) {
    if (value >= range.min) r = range;
  }
  return r;
}

export function getPoints(param, value) {
  let ranges = luScoring[param];
  let range = getRange(ranges, value);
  return range.points;
}

export function getScore(points) {
  return getPoints('score', points);
}