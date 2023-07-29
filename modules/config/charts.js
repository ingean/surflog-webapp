import { deepmerge } from "../utils/deepMerge.js"
import { copyObject } from "../utils/utilities.js"

const chartOptions = {
  defaults: {
    colors: ['#409173', '#E1576F', '#F19A37', '#F7CF4C', '#62D37E', '#6452EB', '#5C23C0'], // Rating colors
    backgroundColor:  { fill: 'transparent' },
    legend: {
      textStyle: { color: 'white' }
    },
    vAxis: {
      gridlines: {
          color: 'transparent'
      },
      textStyle: { color: 'white' }
    },
    hAxis: {
      gridlines: {
          color: 'transparent'
      },
      textStyle: { color: 'white' }
    }
  },
  smallColumn: {
    height: 100,
    width: 150,
    legend: {
      position: 'none'
    }
  }
}

export const chartOption = (options) => {
  const defaults = copyObject(chartOptions['defaults'])
  
  if (typeof options  === 'string') options = copyObject(chartOptions[options])
  return deepmerge(options, defaults)
}