import {Control, defaults as defaultControls} from '../../lib/ol/control.js';

import { sprite } from '../../components/icons.js'

export class mapLock extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};
   
    const button = document.createElement('button');
    //button.innerHTML = 'O';
    button.appendChild(sprite('icons','icons', 'lock', 24, 24))

    const element = document.createElement('div');
    element.className = 'map-lock-control ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.lockMap.bind(this), false);
    
    this.isOpen = true
    this.button = button
  }

  lockMap() {
    if (!this.getMap()) return
    let interactions = this.getMap().getInteractions()
    interactions.forEach(i => i.setActive(!this.isOpen))
    
    let iconId = (this.isOpen) ? 'lock' : 'unlock'
    this.button.replaceChildren(sprite('icons','icons', iconId, 24, 24))
    
    this.isOpen = !this.isOpen
  }
}