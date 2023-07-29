import { formsOptions } from '../config/forms.js';
import { el, div, span, elFromHTML } from './elements.js';
import { formSuggestFromImg } from './formSuggest.js';
import { arrow } from './icons.js';
import { direction } from '../config/forecasts.js';

export function inputGroup(options) {
  if (options.type === 'imgToTxt')  return formSuggestFromImg(options)
  let size = options.size || 12

  let content = []
  if (options.units)  {
    if (options.units === 'arrow') {
      content.push(input(options, updateInputAddOn))
      content.push(span('input-group-addon', arrow(0, 'sm')))
    } else {
      content.push(input(options))
      content.push(span('input-group-addon', options.units))
    }
  } else {
    content.push(input(options))
  }

  if (['btn', 'select', 'datalist'].includes(options.type)) {
    return div(`form-input form-input-${size}`, inputGroupSelect(options))
  } else {
    return div(`form-input form-input-${size}`, [
      inputLabel(options.id, options.caption),
      div('input-group', content)
    ])
  }
}

function inputGroupSelect(options) {
  return div('input-group', [
            inputLabel(options.id, options.caption),
            div('input-group', inputSelect(options))
          ])
}

export function inputLabel(inputId, caption) {
  return el('label', {for: inputId, class: 'control-label text-left'}, caption);
}

function input(options, callback) {
  if (options.type === 'textarea') {
    return el('textarea', {id: options.id, name: options.name, class: 'form-control'})
  } else {
    let input =  el('input', {
      type: options.type, 
      id: options.id,
      name: options.name,
      class: 'form-control',
      ...((options.type === 'file') && {multiple: true}),
      value: defaultValue(options)},'')
    
    if (callback) input.addEventListener('input', callback)
    return input
  } 
}

export function inputSelect(options) {
  if (options.type === 'btn') {
    return [
      div('btn-group align-right', domainItems(options)),
      inputHidden(options)
    ]
  } else if (options.type === 'select') {
    return el('select', {id: options.id, name: options.name, class: 'form-input form-control'}, domainItems(options))
  } else {
    return [
      span('input-group-btn', 
      el('button', {class: 'btn btn-default btn-clear-datalist', type: 'button'}, 
      span('glyphicon glyphicon-trash'))),
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

function inputHidden(options) {
  return el('input', {
    type: 'hidden', 
    id: options.id,
    name: options.name,
    value: defaultValue(options)});
}

function updateInputAddOn(e) {
  let rotation = e.target.value
  let title = `${rotation}° ${direction(rotation).short.toUpperCase()}`
  let svg = e.target.parentNode.children[1].children[0]
  svg.setAttribute('style', `transform: rotate(${rotation}deg)`)

  let titleNode = svg.children[0].children[0]
  titleNode.innerText = title
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

function addAllToDomain(options) {
  if (!options.domain) return;
  options.domain.forEach(item => (item.caption === 'Alle' ? item.default = true : item.default = false));
  let allItem = {caption: 'Alle', default: true}
  options.domain.find(item => item.caption === 'Alle') ? null : options.domain.push(allItem);
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

export function updateLocationDropdown(value) {
  let options = formsOptions.find(item => item.name === value);
  let newPlaceList = inputGroup(options);
  let parent = document.querySelector('#form-report-filter');
  let oldPlaceList = parent.children[1];
  parent.replaceChild(newPlaceList, oldPlaceList);
}
