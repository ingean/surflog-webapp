import { el } from './elements.js';
import { modal } from './modal.js';
import { formsOptions } from '../../config/forms.js'; 
import { input } from './inputs.js';

function createFormModal(type) {
  let content = null;
  if(type === 'session') {
    content = formWithTabs(type, 6);
  } else {
    content = form(type, inputEls(type));
  }
  
  let parent = document.getElementById(`sl-modal-${type}`);
  parent.appendChild(modal({
    id: `modal-report-${type}`,
    title: `Registrere ny ${type}`,
    body: content
  }));
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

  for (let i = 0; i < steps; i++) {
    listItems.push(el('li', {
      "href": `#form-step-${i}`, 
      "class": `${(i === 0) ? 'active' : ''}`,
      "data-toggle": "tab"}, i));
    pages.push(el('div', {id: `form-step-${i}`, class: 'tab-pane fade'}, inputEls(formName, i)));
  }

  let list = el('ul', 'nav nav-pills nav-justified', listItems);
  let content = el('div', 'tab-content', pages);

  return form(formName, [list, content]);
}

function inputEls(formName, group) {
  let inputEls = [];
  
  for (let options of formsOptions) {
    if (group) {
      if (options.group === group && options.forms[formName]) {
        inputEls.push(input(options))
      }
    } else {
      if (options.forms[formName]) {
        inputEls.push(input(options))
      }
    }
  }
}

export function createForms(formNames) {
  for (let name of formNames) {
    createFormModal(name);
  }
}