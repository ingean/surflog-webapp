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
    button.appendChild(sprite('icons','icons', 'unlock', 16, 16))

    const element = document.createElement('div');
    element.className = 'map-lock-control ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.lockMap.bind(this), false);
    
    this.isLocked = false
    this.button = button
  }

  lockMap() {
    if (!this.getMap()) return
    let interactions = this.getMap().getInteractions()
    interactions.forEach(i => i.setActive(!this.isLocked))
    
    let iconId = (this.isLocked) ? 'unlock' : 'lock'
    this.button.replaceChildren(sprite('icons','icons', iconId, 16, 16))
    
    this.isLocked = !this.isLocked
  }
}