import { log, notify } from '../utils/logger.js';
import { user } from '../settings.js';
import { post } from '../utils/api.js';
import { getReports } from './read.js';

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

function getFormData(form) {
  let data = new FormData(form); // Gets only form inputs with name attributes!!
  let date = document.querySelector('#application-date').value;
  let reportTime = moment(date).format(`YYYY-MM-DD ${data.get('reporttime')}`);

  data.set('reporttime', reportTime);
  data.append('userid', user.id);
  data.append('surfer', user.name);
  data.append('hasimages', 0); // Updated serverside if upload is successful

  if (data.get('score')) { // Report is a surf session not an observation
    data.set('type', 'Session');
    data.set('issurfable', 1)
    data = formatTide(data); // Concat tide, tidediff and tidetype
  }
  return data;
}

export async function postReport(form) {
  let data = getFormData(form);
  let res = await post('reports', data);

  if (res) {
    notify(res.message, 'success', 'cloud-upload');
    resetForm(form);
  } 
}