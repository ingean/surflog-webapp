import { log, notify } from '../utils/logger.js';
import { user } from '../settings.js';
import { post } from '../utils/api.js';
import { getReports } from './read.js';
import { formsOptions, slRating } from '../config/forms.js';
import { setActiveById } from '../utils/utilities.js';
import { getFirstFloatFromString, getFirstIntFromString, getStrPart } from '../utils/parseString.js';
import { find, resetLatestIndex } from '../utils/imageToText.js'

function resetForm(form) {
  let modalId = form.id.replace('form', 'modal');
  form.reset();
    $(`#${modalId}`).modal('hide');
    getReports();
}

function formatTide(data) {
  let tide = data.get('tide');
  let diff = data.get('tidediff');
  let type = data.get('tidetype');
  
  (diff === '0') ? diff = '' : diff = ` ${diff}`;
  data.set('tide', `${tide}${diff} (${type})`);
  data.delete('tidediff');
  data.delete('tidetype');
  return data;
}

function getReportData(form) {
  let reportData = new FormData(form); // Gets only form inputs with name attributes!!
  removeData(reportData)

  let date = document.querySelector('#application-date').value
  let reportTime = moment(date).format(`YYYY-MM-DD ${reportData.get('reporttime')}`)
  
  reportData.set('reporttime', reportTime)
  reportData.append('userid', user.id)
  reportData.append('surfer', user.name)
  reportData.append('hasimages', 0) // Updated serverside if upload is successful

  if (reportData.get('score')) { // Report is a surf session not an observation
    reportData.set('type', 'Session')
    reportData.set('issurfable', 1)
    reportData = formatTide(reportData) // Concat tide, tidediff and tidetype
  }
  return reportData
}

function getForecastData(form) {
  let forecastData = new FormData(form) // Gets only form inputs with name attributes!!

  removeData(forecastData, false)

  let date = document.querySelector('#application-date').value
  let forecastTime = moment(date).format(`YYYY-MM-DD ${forecastData.get('forecasttime')}`)
  forecastData.set('forecasttime', forecastTime)

  return forecastData
}

function removeData(data, removeForecast = true) {
  let forecastFields = formsOptions.filter(o => o.tab == 6).map(o => o.name)
  let reportsFields = formsOptions.filter(o => o.tab < 6).map(o => o.name)

  let fieldsToRemove = (removeForecast) ? forecastFields : reportsFields

  fieldsToRemove.forEach(field => data.delete(field))

  data.delete('forecastimage') // Remove forecast image
}

function fieldsToStore(){
  return formsOptions
         .filter(option => option.save === true)
         .map(option => option.name)
}

function writeToLocalStorage(data) {
  let storeFields = fieldsToStore()
  storeFields.forEach(fieldName => {
    if (data.get(fieldName)) {
      localStorage.setItem(fieldName, data.get(fieldName))
    }
  })
}

export function setStoredValues() {
  let storedFields = fieldsToStore()
  storedFields.forEach(fieldName => {
    let id = `session-${fieldName}`
    let input = document.getElementById(id)
    let storedValue = localStorage.getItem(fieldName)
    if (storedValue) {
      input.value = storedValue
      setActiveById(id, storedValue)  // If button group, set stored value as active
    }
  })
}

export async function postReport(form) { 
  let reportData = getReportData(form)
  let res = await post('reports', reportData)

  if (res) {
    writeToLocalStorage(reportData)
    notify(res.message, 'success', 'cloud-upload');
    postForecast(form, res.id, reportData.get('reporttime'))
    resetForm(form);
  } 
}

async function postForecast(form, id, reporttime) {
  let forecastData = getForecastData(form)
  forecastData.set('report_id', id)
  forecastData.set('reporttime', reporttime)

  // windspeed and winddir is columns in both reports and mv_msw tables
  forecastData.set('windspeed', forecastData.get('slwindspeed'))
  forecastData.set('winddir', forecastData.get('slwinddir'))
  forecastData.delete('slwinddir')
  forecastData.delete('slwindspeed')
  
  let res = await post('surfline', forecastData)

  if (res) {
    notify(res.message, 'success', 'cloud-upload')
  }
}

export const slForecastFromImage = (result) => {
  let r = result.text.split(/\r?\n/)
  let ratings = slRating.map(r => r.caption)
  resetLatestIndex()

  return [
    { id: 'forecasttime', value: suggestDateTime(find(r,['am', 'pm']))},
    { id: 'waveheight_from', value: suggestFloat(find(r,['-']), '-', 0)},
    { id: 'waveheight_to', value: suggestFloat(find(r,['-']), '-', 1)}, 
    { id: 'rating', value: find(r, ratings, 2)},
    { id: 'swellheight', value: suggestFloat(find(r,['m']))},
    { id: 'swellperiod', value: suggestInt(find(r,['s']))},
    { id: 'subswellheight', value: suggestFloat(find(r,['m']))},
    { id: 'subswellperiod', value: suggestInt(find(r,['s']))},
    { id: 'slwindspeed', value: suggestInt(find(r))},
    { id: 'windgust', value: suggestInt(find(r))},
    { id: 'energy', value: suggestInt(find(r,['kJ']))}
  ]
}

const suggestDateTime = (str, separator, i) => {
  let hour = suggestInt(str, separator, i)
  let a = (str.includes('am')) ? 'am' : 'pm'
  return moment(`${hour} ${a}`, 'h a').format('HH:mm')
}

const suggestFloat = (str, separator, i) => {
  str = getStrPart(str, separator, i)
  return getFirstFloatFromString(str)
}

const suggestInt = (str, separator, i) => {
  str = getStrPart(str, separator, i)
  return getFirstIntFromString(str)
}