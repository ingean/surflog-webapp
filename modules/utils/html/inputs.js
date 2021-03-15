import { el, elFromHTML } from './elements.js';

function formGroup(element) {
  return el('div', 'form-group', element);
}

function formLabel(inputId, caption) {
  return el('label', {for: inputId, class: 'control-label text-left'}, caption);
}

function formSelect(options) {
  return [
    el('div', 'input-group pull-right', selectList(options)),
    setDefault(options)
  ]
}

function selectList(options) {
  if (options.type === 'btn') {
    return el('div', {id: 'radioBtn', class: 'btn-group'}, domainItems(options));
  } else if (options.type === 'select') {
    return el('select', {id: options.id, class: 'form-input'}, domainItems(options))
  } else {
    return el('datalist', {id: options.id}, domainItems(options))
  }
}

function domainItems(options) {
  let items = [];
  for (let item of options.domain) {
    if (options.type === 'btn') {
      items.push(el('a', {
        "class": `btn btn-primary btn-sm ${isDefault(item, 'btn')}`,
        "data-toggle": options.id,
        "data-title": item.value
      }, item.caption));
    } else {
      items.push(elFromHTML(`<option ${isDefault(item)}>${item.caption}<option>`));
    }
  }
  return items;
}

function setDefault(options) {
  if(options.type === 'btn') {
    return el('input', {
      "type": 'hidden', 
      "id": options.id,
      "data-title": defaultValue(options),
      "value": defaultValue(options)}, '');
  } else {
    return '';
  }
}

function defaultValue(options, value = false) {
  if (options.domain) {
    let defaultItem = options.domain.find(item => item.default);
    return value ? defaultItem.value : defaultItem.caption;
  } else {
    return '';
  }
}

function isDefault(item, type) {
  if (item.default) {
    return (type === 'btn') ? 'Active' : 'selected';  
  } else {
    return (type === 'btn') ? 'notActive' : ''; 
  }
}

export function input(options) {
  let t = options.type;
  if (t === 'btn' || t === 'select' || t === 'datalist') {
    return formSelect(options);
  } else {
    return el(t, {id: options.id, class: 'form-input', value: defaultValue(options)},'');
  }
}