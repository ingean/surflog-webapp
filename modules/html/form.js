import { el } from './elements.js';
import { modal } from './modal.js';
import { formsOptions , tabNames} from '../config/formsOptions.js'; 
import { formGroup, updateLocationDropdown, formSelectInput } from './formGroup.js';
import { postReport} from '../reports/postReport.js';
import { filterReportsList } from '../reports/reportsList.js';

function cancelForm(form) {
  form.reset();
}

function footerBtns(caption, onClick, form) {
  let cancelBtn = el('button', 'btn btn-default', 'Angre');
  let saveBtn = el('button', 'btn btn-success', caption)
  cancelBtn.addEventListener('click', e => cancelForm(form));
  saveBtn.addEventListener('click', e => onClick(form))

  return [
    cancelBtn,
    saveBtn
  ]
}


function createFormModals() {
  let modals = [
    {
      id: 'modal-report-session',
      title: 'Registere ny session', 
      body: formWithTabs('session', tabNames),
      get footer() {return footerBtns('Lagre', postReport, this.body)}
    }, 
    {
      id: 'modal-report-observation',
      title: 'Registrere ny observasjon', 
      body: form('observation', inputEls('observation')),
      get footer() {return footerBtns('Lagre', postReport, this.body)}
    }, 
    {
      id: 'modal-report-filter',
      title: 'Filtrere rapporter',
      body: form('filter', inputEls('filter')), 
      get footer() {return footerBtns('Se resultat', filterReportsList, this.body)}
    }
  ];

  modals.forEach(modal => {
    createFormModal(modal)
  });
   
  document.querySelectorAll('.btn-group a').forEach(item => {
    item.addEventListener('click', onBtnGroupClick)
  })

  //Hide location selector in filter dialog at startup
  document.querySelector('#form-report-filter') 
  .children[1].style.display = 'None';
}

function createFormModal(options) {
  let parent = document.getElementById(`root-${options.id}`);
  parent.appendChild(modal(options))
}

function createSpotList() {
  let options = formsOptions.find(item => item.name === 'spot');
  options.formName = 'navbar'
  options.id = `${options.formName}-${options.name}`;
  let spots = el('div', 'input-group', formSelectInput(options));
  document.querySelector('#navbar-spots-list')
  .replaceChildren(spots);

  document.querySelectorAll('.btn-clear-datalist')
  .forEach(e => e.addEventListener('click', clearInput))
}

function clearInput(e) {
  let input = e.target.parentElement.parentElement.nextElementSibling;
  input.value = '';
}

function form(formName, content) {
  return el('form', {
    id: `form-report-${formName}`,
    class: 'form-horisontal',
    enctype: 'multipart/form-data'}, content);
}

function formWithTabs(formName, tabNames) {
  let listItems = [];
  let pages = [];

  for (let i = 1; i <= tabNames.length; i++) {
    listItems.push(
      el('li', `${(i === 1) ? 'active' : ''}`,
        el('a', {href: `#form-step-${i}`, "data-toggle": "tab"}, tabNames[i - 1]))
    );  
    pages.push(el('div', {
      id: `form-step-${i}`, 
      class: `tab-pane fade ${(i === 1) ? 'active in' : ''}`
    }, inputEls(formName, i)));
  }

  let list = el('ul', 'nav nav-pills nav-justified', listItems);
  let content = el('div', 'tab-content', pages);

  return form(formName, [list, el('hr'), content]);
}

function inputEls(formName, tab) {
  let inputEls = [];
  
  for (let o of formsOptions) {
    let options = JSON.parse(JSON.stringify(o)); // Clone option json object
    options.formName = formName;
    options.id = `${options.formName}-${options.name}`;

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

  if (id === 'filter-loctype')  onLocationTypeChange(value);
}

function onLocationTypeChange(value) {
  let parent = document.querySelector('#form-report-filter');
  let placeDropDown = parent.children[1];
  
  if (value === 'Alle') {  
    placeDropDown.style.display = 'None';
  } else {
    updateLocationDropdown(value);
    placeDropDown.style.display = '';
  }
}

export function createForms() {
  createFormModals();
  createSpotList();
}