import { el } from '../components/elements.js';

export function log(error, title, severity = 'error') {
  
  if (severity === 'error') {
    console.error(title);
    //console.error(error.message);
    if (error) {
      console.error(error.stack);
    }
    notify(title, 'alert alert-danger', 'wrench')
  } else {
    console.log(title);
  }
}

export function notify(text, type, icon) {
  $.notify({
      icon: 'glyphicon glyphicon-' + icon,
      message: text 
  },{
      type: type,
      placement: {
          from: "bottom",
          align: "right"
      }
  });
}

export class Loader {
  constructor(parentElementId){
    this.parentElementId = parentElementId;
    this.elementId = `${parentElementId}-loader`;
    this.start();
  }

  start() {
    let loader = 
      el('div', {id: this.elementId, class: 'loader-container'},
        el('img', {class: 'loader-img', src: "images/loader.gif"})
    )
    
    document
    .getElementById(this.parentElementId).appendChild(loader);
  }
  
  stop() {
    let e = document.getElementById(this.elementId);
    if (e) {
      e.parentNode.removeChild(e)
    } else {
      log(null, 'Attempted to remove noexisting loader GIF');
    };
  }
}