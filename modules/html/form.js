import { el } from './elements.js';
import { modal } from './modal.js';
import { formsOptions , tabNames} from '../config/formsOptions.js'; 
import { formGroup } from './formGroup.js';
import { postReport} from '../reports/postReport.js';

function createFormModal(type) {
  let content = null;
  if(type === 'session') {
    content = formWithTabs(type, 6);
  } else {
    content = form(type, inputEls(type));
  }

  let saveBtn = el('button', 'btn btn-success', 'Lagre')
  
  let parent = document.getElementById(`sl-modal-${type}`);
  parent.appendChild(modal({
    id: `modal-report-${type}`,
    title: `Registrere ny ${type}`,
    body: content,
    footer: saveBtn
  }));
  saveBtn.addEventListener('click', e => {
    postReport(content)
  });
}

function form(formName, content) {
  return el('form', {
    id: `form-report-${formName}`,
    class: 'form-horisontal',
    enctype: 'multipart/form-data'}, content);
}

function formWithTabs(formName, steps) {
  let listItems = [];
  let pages = [];

  for (let tab = 1; tab <= steps; tab++) {
    listItems.push(
      el('li', `${(tab === 1) ? 'active' : ''}`,
        el('a', {href: `#form-step-${tab}`, "data-toggle": "tab"}, tabNames[tab]))
    );  
    pages.push(el('div', {
      id: `form-step-${tab}`, 
      class: `tab-pane fade ${(tab === 1) ? 'active in' : ''}`
    }, inputEls(formName, tab)));
  }

  let list = el('ul', 'nav nav-pills nav-justified', listItems);
  let content = el('div', 'tab-content', pages);

  return form(formName, [list, el('hr'), content]);
}

function inputEls(formName, tab) {
  let inputEls = [];
  
  for (let options of formsOptions) {
    if (tab) {
      if (options.tab === tab && options.forms[formName]) {
        inputEls.push(formGroup(options))
      }
    } else {
      if (options.forms[formName]) {
        inputEls.push(formGroup(options))
      }
    }
  }
  return inputEls;
}

function onBtnGroupClick(e) {
  let value = e.currentTarget.dataset.title;
  let id = e.currentTarget.dataset.toggle;

  document.querySelector(`#${id}`).value = value; // Update value of hidden element
    
  $(`a[data-toggle="${id}"]`).not(`[data-title="${value}"]`).removeClass('Active').addClass('notActive');
  $(`a[data-toggle="${id}"][data-title="${value}"]`).removeClass('notActive').addClass('Active');
}

export function createForms(formNames) {
  for (let name of formNames) {
    createFormModal(name);
  }
  document.querySelectorAll('.btn-group a').forEach(item => {
    item.addEventListener('click', onBtnGroupClick)
  })
}