import { div, span } from './elements.js';
import { icon } from './icons.js'
import { modal, openModal } from './modal.js';

export const indicator = (header, content, footer, rating, size = 'lg') => {
  return div(`flex-col center2 indicator indicator-${size}`, [
    div('indicator-header', header),
    div(`indicator-content-${size} txt-rating-${rating}`, content),
    div('indicator-footer', footer)
  ])
}

export const fact = (text) => {
  return div('center-v flex-row db-fact', [
    icon('info-sign'),
    div('db-fact-text', text)
  ])
}

export const txtArea = (text, attributes = null, maxLength = 240) => {
  if (text.length <= maxLength) return text
  
  let txtPreview = text.substring(0, maxLength - 3)

  attributes = attributes || 'txtArea-preview'

  let preview = div(attributes, [
    span(attributes, txtPreview),
    span('txtArea-link', '...')
  ]) 
  
  let fullview = div('txtArea-fulltext', text)

  let options = {
    id: 'txt-area-random',
    title: '',
    body: fullview,
    containerId: 'root-modal-txtArea'
  }

  let txtModal = modal(options)

  preview.addEventListener('click', e => {
    openModal(txtModal)
  })
  return preview
}