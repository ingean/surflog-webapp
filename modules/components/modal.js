import { el, div, span } from './elements.js';

export function modal2(options) {
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

  if (options?.containerId) {
    document.getElementById(options.containerId).appendChild(modal)
  }

  return modal;
}

export function modal(options) {
  //let closeBtn = el('button', 'modal-close', span('', 'x'))
  let closeBtn = div('modal-close align-right','X')
  let modal = 
    div({id: options.id, class: "modal fade", role: "dialog"}, 
      div('modal-dialog',
        div('modal-content', [
          div('modal-header flex-row', [
            div('modal-heading', options.title),
            closeBtn
          ]),
          div('modal-body', options.body),
          div('modal-footer', options.footer),
        ])
      )
    )

  if (options?.containerId) {
    document.getElementById(options.containerId).appendChild(modal)
  }

  closeBtn.addEventListener('click', e => closeModal(modal))
  return modal;
}


export function closeModal(modal) {
  // Get the backdrop so we can remove it from the body
  const backdrop = document.querySelector(".modal-backdrop.fade.in");
  // Remove the `modal-open` class from the body
  document.body.classList.remove("modal-open");
  // Re-hide the modal from screen readers
  //modal.setAttribute("aria-hidden", "true");
  // Remove the `show` class from the backdrop
  backdrop.classList.remove("in");
  // Remove the `show` class from the modal
  modal.classList.remove("in");
  // Change the modal `display` style to `none`
  modal.style.display = "none";
  // Remove the backdrop div from the body
  backdrop.remove();
}

export function openModal(modal) {
  // Create the backdrop div element
  const backdrop = document.createElement("div");
  // Add the required classes to it.
  backdrop.classList.add("modal-backdrop", "fade", "in");
  // Add the `modal-open` class to the body
  document.body.classList.add("modal-open");
  // Append the backdrop div to the body
  document.body.appendChild(backdrop);
  // Set the `display` style of the modal to `block`
  modal.style.display = "block";
  // This is for accessibility tools.  We want to make it no longer hidden to screen readers.
 // modal.setAttribute("aria-hidden", "false", "show");
  // Add the show class to the modal
  modal.classList.add("in");
}