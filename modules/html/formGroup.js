import { formsOptions } from '../config/forms.js';
import { el, elFromHTML } from './elements.js';


function addAllToDomain(options) {
  if (!options.domain) return;
  options.domain.forEach(item => (item.caption === 'Alle' ? item.default = true : item.default = false));
  let allItem = {caption: 'Alle', default: true}
  options.domain.find(item => item.caption === 'Alle') ? null : options.domain.push(allItem);
}


function formLabel(inputId, caption) {
  return el('label', {for: inputId, class: 'control-label text-left'}, caption);
}

function formGroupSelect(options) {
  return (
    el('div', 'form-group',
      [
        formLabel(options.id, options.caption),
        el('div', 'input-group pull-right', formSelectInput(options)),
      ]
    )
  )
}

export function formSelectInput(options) {
  if (options.type === 'btn') {
    return [
      el('div', 'btn-group', domainItems(options)),
      formHiddenInput(options)
    ]
  } else if (options.type === 'select') {
    return el('select', {id: options.id, name: options.name, class: 'form-input'}, domainItems(options))
  } else {
    return [
      el('span', 'input-group-btn', 
        el('button', {class: 'btn btn-default btn-clear-datalist', type: 'button'}, 
          el('span', 'glyphicon glyphicon-trash'))),
      el('input', {
        id: options.id, 
        name: options.name, 
        list: options.id + '_list',
        class: 'custom-select', 
        value: defaultValue(options)}),
      el('datalist', {id: options.id + '_list'}, domainItems(options))
    ]
  }
}

function domainItems(options) {
  let items = [];
  if (options.formName === 'filter') addAllToDomain(options);
  
  for (let item of options.domain) {
    if (options.type === 'btn') {
      items.push(el('a', {
        "class": `btn btn-primary btn-sm ${isActive(item, 'btn')}`,
        "data-toggle": options.id,
        "data-title": item.value ?? item.caption
      }, item.caption));
    } else {
      items.push(elFromHTML(`<option ${isActive(item)}>${item.caption}<option>`));
    }
  }
  return items;
}

function formHiddenInput(options) {
  return el('input', {
    type: 'hidden', 
    id: options.id,
    name: options.name,
    value: defaultValue(options)});
}

function defaultValue(options) {
  if (!options.domain) return '';
  let defaultItem = options.domain.find(item => item.default);
  return defaultItem.value ?? defaultItem.caption;
}

function isActive(item, type) {
  if (item.default) {
    return (type === 'btn') ? 'Active' : 'selected';  
  } else {
    return (type === 'btn') ? 'notActive' : ''; 
  }
}

function formInput(options) {
  if (options.type === 'textarea') {
    return el('textarea', {id: options.id, name: options.name, class: 'form-control'})
  } else {
    return el('input', {
      type: options.type, 
      id: options.id,
      name: options.name,
      class: 'form-control',
      ...((options.type === 'file') && {multiple: true}),
      value: defaultValue(options)},'')
  } 
}

export function updateLocationDropdown(value) {
  let options = formsOptions.find(item => item.name === value);
  let newPlaceList = formGroup(options);
  let parent = document.querySelector('#form-report-filter');
  let oldPlaceList = parent.children[1];
  parent.replaceChild(newPlaceList, oldPlaceList);
}

export function formGroup(options) {
  if (['btn', 'select', 'datalist'].includes(options.type)) {
    return formGroupSelect(options);
  } else {
    return (
      el('div', 'form-group', 
        [
          formLabel(options.id, options.caption),
          formInput(options)
        ]
      )
    )
  }
}
