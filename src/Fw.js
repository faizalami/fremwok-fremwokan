import Dependency from './Dependency';
import { patchDom } from './VDom';

class Fw {
  constructor (component, el) {
    const { props, data, methods, computed } = component;
    this.component = {
      ...component,
      $computed: { ...computed },
      computed: {},
      el: el || null,
    };

    this.initProps(props);
    this.initState(data);
    this.initComputed(computed);
    this.initMethods(methods);

    this.watch(this.render.bind(this));
  }

  static createComponent (component) {
    return (props) => {
      const mountComponent = new Fw({
        ...component,
        props,
      });
      return mountComponent.component.el;
    };
  }

  initState (data) {
    if (data) {
      Object.keys(data).forEach(key => {
        let internalValue = data[key];

        const dep = new Dependency();

        Object.defineProperty(data, key, {
          get () {
            dep.depend('state');
            return internalValue;
          },
          set (newVal) {
            if (internalValue !== newVal) {
              internalValue = newVal;
              dep.notify('state');
            }
          },
        });
      });
    }
  }

  initProps (props) {
    if (props) {
      Object.keys(props).forEach(key => {
        const internalValue = props[key];

        Object.defineProperty(props, key, {
          get () {
            return internalValue;
          },
          set () {
            throw new Error('Don\'t set props inside the component');
          },
        });
      });
    }
  }

  initComputed (computed) {
    if (computed) {
      Object.keys(computed).forEach(key => {
        let internalValue = null;
        const dep = new Dependency();

        this.watch(() => {
          const computedFunction = computed[key].bind(this.component);
          internalValue = computedFunction();
          dep.notify('computed');
        });

        Object.defineProperty(this.component.computed, key, {
          get () {
            dep.depend('computed');
            return internalValue;
          },
          set () {
            throw new Error('Don\'t set props inside the component');
          },
        });
      });
    }
  }

  initMethods (methods) {
    if (methods) {
      Object.keys(methods).forEach(key => {
        this.watch(methods[key]);
      });
    }
  }

  watch (func) {
    Dependency.target = func.bind(this.component);
    Dependency.target();
    Dependency.target = null;
  }

  render () {
    if (this.component.render) {
      const vnode = this.component.render();
      if (this.component.el) {
        patchDom(this.component.el, vnode);
      }
      this.component.el = vnode;
    }
  }
}

export default Fw;
