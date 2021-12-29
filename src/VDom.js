import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  jsx,
} from 'snabbdom';
import { log } from './Logger';

window.jsx = jsx;

export const patchDom = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
  {
    destroy (vnode) {
      if (vnode.onDestroy) {
        vnode.onDestroy();
      }
      log('lifecycle', 'destroy', vnode);
    },
  },
]);
