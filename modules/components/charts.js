import { scores } from '../config/forms.js'
import { chartOption } from '../config/charts.js'

google.charts.load('current', {'packages':['corechart', 'controls']})

export const scoreColors = (data) => {
  return data.map(d => scores.find(s => d[0] === s.caption).color)
}

const mergeHeaders = (headers, data) => {
  headers = headers.map(h => String(h))
  data.unshift(headers)
  return data
}

const prepareChart = (headers, data, options) => {
  mergeHeaders(headers, data)
  options = chartOption(options)
 
  return {
    table: google.visualization.arrayToDataTable(data),
    options
  }
}

export const drawPieChart = (container, headers, data, options) => {  
  let c = prepareChart(headers, data, options)

  let chart = new google.visualization.PieChart(container)
  chart.draw(c.table, c.options)
}

export const drawColumnChart = (container, headers, data, options) => {
  let c = prepareChart(headers, data, options)

  let chart = new google.visualization.ColumnChart(container)
  chart.draw(c.table, c.options)
}

export const drawLineChart = (container, headers, data, options) => {
  let c = prepareChart(headers, data, options)

  let chart = new google.visualization.LineChart(container)
  chart.draw(c.table, c.options)
}

export const dbChart = (options) => {
  return new google.visualization.ChartWrapper(options)
}

export const dbControl = (options) => {
  return new google.visualization.ControlWrapper(options)
}

export const drawDashboard = (container, dbControl, dbChart, headers, data) => {
  mergeHeaders(headers, data)
  
  let db = new google.visualization.Dashboard(container)
  db.bind(dbControl, dbChart)      
  db.draw(data)
}