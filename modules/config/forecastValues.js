import { arrow } from "../components/icons.js"
import { span } from "../components/elements.js" 
import { valueRating } from "../forecasts/format.js"
import { minObj, maxObj, round } from "../utils/utilities.js"
import { direction } from "./forecasts.js"

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
  unit: '',
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
  {id: 'airpressure', caption: 'Trykk.', unit: unitPressure, min: true}
]

export const paramCaption = (param) => {
 let p =  params.find(p => p.id.includes(param))
 return p.caption
}

export const paramReference = (param) => {
  let p =  params.find(p => p.id.includes(param))
  return p.min ? 'Min' : 'Max'
 }

export const paramVal = (obj, param) => {
  let prefix = ''
  let suffix = ''
  let options = params.find(p => p.id.includes(param))
  if (!options) return obj[param]
  if (options.arrow) return arrow(obj[param], options.arrow)
  if (options.secondary) {
    prefix = ' (' 
    suffix = ')'
  }
  let unit = (options.unit.unit) ? ` ${options.unit.unit}` : ''
  return `${prefix}${round(obj[param], options.unit.precision)}${unit}${suffix}`
}

export const paramDir = (value) => {
  return `${value} ${direction(value).short}`
}

export const paramMin = (obj, param) => {
  let min = minObj(obj, param)
  return paramVal(min, param)
}

export const paramMax = (obj, param) => {
  let max = maxObj(obj, param)
  return paramVal(max, param)
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
  let value = paramVal(obj, param)


  return span(`${cls} txt-rating-${rating}`, value)
}


