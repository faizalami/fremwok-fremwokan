import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
} from 'snabbdom';

export const patchDom = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);

export default {
  patchDom,
};
