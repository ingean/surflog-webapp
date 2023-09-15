import { el, div, image } from '../components/elements.js';

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
  constructor(containerQuery, size = 40){
    this.containers = document.querySelectorAll(containerQuery)
    this.loaders = []
    this.contents = []
    this.size = size
    this.start()
  }

  _create() {
    let l = div('loader-container',
              image('images/loader.gif', {class: 'loader-img', height: `${this.size}px`, width: `${this.size}px`}))
    
              this.loaders.push(l)
    return l
  }

  start() {
    this.containers.forEach(c => {
      let clone = c.cloneNode(true)
      this.contents.push(clone.childNodes)
      c.replaceChildren(this._create())
    })
  }
  
  stop() {
    this.containers.forEach((c, idx) => {
      if (this.containers[idx]) {
        c.replaceChildren(...this.contents[idx])
      } else {
        c.removeChild(this.loaders[idx])
      }
       
    })
  }
}