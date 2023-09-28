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
  {id: 'utctime', caption: 'Tid', group: 1},
  {id: 'waveheight', caption: 'Høyde', group: 1, unit: unitHeight},
  {id: 'waveheightforecast', caption: 'Varsel', group: 1, unit: unitHeight},
  {id: 'waveheightmax', caption: 'Maxhøyde', group: 1, unit: unitHeight},
  {id: 'waveperiod', caption: 'Periode', group: 1, unit: unitPeriod},
  {id: 'wavedir', caption: 'Retning', group: 1, arrow: 'sm'},
  {id: 'swellheight', caption: 'Høyde', group: 2, unit: unitHeight},
  {id: 'swellperiod', caption: 'Periode', group: 2, unit: unitPeriod},
  {id: 'swelldir', caption: 'Retning', group: 2, arrow: 'sm'},
  {id: 'windspeed', caption: 'Vind', group: 3, unit: unitSpeed},
  {id: 'windgust', caption: 'Byge', group: 3, secondary: true, unit: unitSpeed},
  {id: 'winddir', caption: 'Retning', group: 3, arrow: 'md'},
  {id: 'currentspeed', caption: 'Strøm', group: 4, unit: unitSpeed},
  {id: 'currentdir', caption: 'Retning', group: 4, arrow: 'md'},
  {id: 'airtemp', caption: 'Lufttemp.', group: 5, unit: unitTemp},
  {id: 'watertemp', caption: 'Vanntemp.', group: 5, unit: unitTemp},
  {id: 'airpressure', caption: 'Trykk.', group: 6, unit: unitPressure, min: true}
]

export const paramCaption = (param) => {
 let p =  params.find(p => p.id.includes(param))
 return p.caption
}

export const paramReference = (param) => {
  let p =  params.find(p => p.id.includes(param))
  return p?.min ? 'Min' : 'Max'
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
  return `${round(value)} ${direction(value).short}`
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

  return span(`param-arrow ${cls}`, arrow(obj[param], size))
}

export const paramSpan = (obj, param, options) => {
  let cls = options.valueCls || ''
  
  if (param.includes('dir')) return arrowSpan(obj, param, options)
  if (param.includes('time')) return span(cls, moment(obj[param]).format('HH'))
  
  let rating = valueRating(obj, param, options)
  rating = rating ? ` txt-rating-${rating}` : ''
  let value = paramVal(obj, param)

  return span(`${cls}${rating}`, value)
}


