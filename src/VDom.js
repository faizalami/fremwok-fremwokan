import {
  init,
  classModule,
  propsModule,
  attributesModule,
  styleModule,
  eventListenersModule,
  jsx,
} from 'snabbdom';

window.jsx = jsx;

export const patchDom = init([
  classModule,
  propsModule,
  attributesModule,
  styleModule,
  eventListenersModule,
  {
    destroy (vnode) {
      if (vnode.onDestroy) {
        vnode.onDestroy();
      }
    },
  },
]);
