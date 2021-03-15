const classes = { 
  0: {class: "default"},
  1: {class: "danger"},
  2: {class: "warning"},
  3: {class: "info"},
  4: {class: "primary"},
  5: {class: "success"},
  9: {class: "danger"}
}

export function getClass(rating) {
  return classes[rating].class;
}

export const luUnits = {
  waveheight: 'm',
  waveperiod: 's',
  swellheight: 'm',
  swellperiod: 's',
  wind: 'm/s',
  waveheightforecast: 'm',
  waveheightmax: 'm'
};


