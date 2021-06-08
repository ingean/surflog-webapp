import { points } from '../config/scoreModel.js';
import { windspeed } from '../config/forecasts.js';
import { getStats } from '../settings.js';



export function scoreWindValue(speed, type = 'fetch') {
  let wind = windspeed(speed)
  return (speed) ? speed[type] : null
}

export function scoreValue(value, param, forecast, points = false) {
  let s = getStats(forecast, param);
  let score = (value >= (s.avg + s.std)) ? 5: (value >= s.avg) ? 4 : (value >= (s.avg - s.std) ? 3 : (value >= s.min) ? 2 : 0);
  let i = (value >= (s.avg + s.std)) ? 4: (value >= s.avg) ? 3 : (value >= (s.avg - s.std) ? 2 : (value >= s.min) ? 1 : 0);
  return (points) ? pointsStat(i) : score;
}

export function scoreForecast(fc, forecast) {
  let pts = 0
  let stations = Object.keys(fc.stations);
  let params = Object.keys(fc.stations[stations[0]]);
  let i = (forecast === 'dmi') ? 1 : 0; // Use DMI-values for Skagerak
  params.forEach(param => { 
    if (param !== 'wind') {
      pts += points(fc.stations[stations[i]][param], param)
    } else {
      pts -= points(fc.stations[stations[0]][param], param)
    }   
  });
  return points(pts, 'total');
}