import { log, notify } from '../utils/logger.js';

function reportTime(formData) {
  let date = document.getElementById('datepicker').datepicker('getDate');
  let reportTime = moment(date).format('YYYY-MM-DD');
  return `${reportTime} ${formData.get('reporttime')}`;
}

function clearForm() {
  
}

async function postFiles(formData, date) {
  let url = `${urlAPI}images/${moment(date).format('YYYY-MM-DD')}`;
  let files = formData.get('files');

  if (files) {
    let response = await fetch(url, {
      body: files, 
      method: 'POST'
    }).catch(e => {
      log(e, 'Klarte ikke å laste opp bilder');
    }) 

    if (response) {
      notify('Bilder lastet opp', 'success', 'picture');
      clearForm();
    }
    return 1
  } else {
    return 0;
  }
}

export async function postReport(form) {
  let formData = new FormData(form);
  let reportTime = moment(date).format('YYYY-MM-DD');
  reportTime += " " + formData.get("reporttime");

  formData.set('reporttime', reportTime(formData));
  formData.append('userid', user.id);
  formData.append('surfer', user.name);
  formData.append('hasImages', postFiles(formData));
  formData.delete('files');

  let response = await fetch(`${urlAPI}reports`, {
    body: formData,
    method: 'POST'
  }).catch(e => {
    log(e, 'Klarte ikke å lagre rapporten, sjekk skjema og prøv igjen');
  })
  
  if (response) {
    notify('Rapporten er lagret', 'success', 'cloud-upload');
  }
}