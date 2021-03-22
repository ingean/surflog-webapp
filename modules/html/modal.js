import { el } from './elements.js';

export function modal(options) {
  let modal = 
    el('div', {id: options.id, class: "modal fade", role: "dialog"}, 
      el('div', "modal-dialog",
        el('div', "modal-content", [
          el('div', "modal-header", [
            el('button', {class: "close", "data-dismiss": "modal"}, 
              el('span', {'aria-hidden': 'true'}, 'x')),
            el('span', "modal-heading", options.title)
          ]),
          el('div', "modal-body", options.body),
          el('div', "modal-footer", options.footer),
        ])
      )
    );
  return modal;
}