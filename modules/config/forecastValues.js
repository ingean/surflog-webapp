import { arrow } from "../components/icons.js"
import { span } from "../components/elements.js" 
import { valueRating } from "../forecasts/format.js"
import { round } from "../utils/utilities.js"

const unitHeight = {
  unit: 'm',
  precision: 1,
  up: 'større',
  down: 'mindre'
}

const unitPeriod = {
  unit: 's',
  precision: 0,
  up: 'lengre',
  down: 'kortere'
}

const unitSpeed = {
  unit: 'm/s',
  precision: 0,
  up: 'mer',
  down: 'mindre'
}

const unitPressure = {
  unit: 'hpa',
  precision: 0,
  up: 'høyere',
  down: 'lavere'
}

const unitDir = {
  unit: '',
  precision: 0,
  up: '',
  down: ''
}

const unitTemp = {
  unit: '°',
  precision: 0,
  up: 'varmere',
  down: 'kaldere'
}

const params = [
  {id: 'waveheight', caption: 'Høyde', unit: unitHeight},
  {id: 'waveperiod', caption: 'Periode', unit: unitPeriod},
  {id: 'wavedir', caption: 'Retning', arrow: 'sm'},
  {id: 'swellheight', caption: 'Høyde', unit: unitHeight},
  {id: 'swellperiod', caption: 'Periode', unit: unitPeriod},
  {id: 'swelldir', caption: 'Retning', arrow: 'sm'},
  {id: 'windspeed', caption: 'Vind', unit: unitSpeed},
  {id: 'windgust', caption: 'Byge', secondary: true, unit: unitSpeed},
  {id: 'winddir', caption: 'Retning', arrow: 'md'},
  {id: 'currentspeed', caption: 'Strøm', unit: unitSpeed},
  {id: 'currentdir', caption: 'Retning', arrow: 'md'},
  {id: 'airtemp', caption: 'Lufttemp.', unit: unitTemp},
  {id: 'watertemp', caption: 'Vanntemp.', unit: unitTemp},
  {id: 'airpressure', caption: 'Trykk.', unit: unitPressure}
]

const getVal = (obj, key) => {
  let prefix = ''
  let suffix = ''
  let param = params.find(p => p.id.includes(key))
  if (!param) return obj[key]
  if (param.arrow) return arrow(obj[key], param.arrow)
  if (param.secondary) {
    prefix = ' (' 
    suffix = ')'
  }
  return `${prefix}${round(obj[key], param.unit.precision)} ${param.unit.unit}${suffix}`
}

const arrowSpan = (obj, param, options ) => {
  let size =  (param.includes('wave') || param.includes('swell')) ? 'sm' : 'md'
  let cls = options.arrowCls || ''

  return span(cls, arrow(obj[param], size))
}

export const paramSpan = (obj, param, options) => {
  if (param.includes('dir')) return arrowSpan(obj, param, options)
  
  let cls = options.valueCls || ''
  let rating = valueRating(obj, param, options)
  let value = getVal(obj, param)


  return span(`${cls} txt-rating-${rating}`, value)
}


