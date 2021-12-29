import Dependency from './Dependency';
import { patchDom } from './VDom';
import { log } from './Logger';

class Fw {
  constructor (component, el, { logger = [] }) {
    const { props, data, methods, computed } = component;
    this.component = {
      ...component,
      $computed: { ...computed },
      computed: {},
      $methods: { ...methods },
      methods: {},
      el: el || null,
    };

    this.configLogger(logger);

    this.initProps(props);
    this.initState(data);
    this.initComputed(computed);
    this.initMethods(methods);

    this.watch(this.render.bind(this));
  }

  static createComponent (component) {
    return (props) => {
      let validProps = null;
      Object.keys(component.props).forEach(key => {
        validProps = {
          ...validProps,
          [key]: props[key] !== undefined ? props[key] : component.props[key],
        };
      });
      const mountComponent = new Fw({
        ...component,
        props: validProps,
      }, null, {});

      return mountComponent.component.el;
    };
  }

  configLogger (config) {
    config.forEach(key => {
      window.loggerConfig[key] = true;
    });
  }

  initProps (props) {
    if (props) {
      Object.keys(props).forEach(key => {
        const internalValue = props[key];

        Object.defineProperty(props, key, {
          get () {
            log('props', `get value ${key} = ${internalValue}`);
            return internalValue;
          },
          set () {
            throw new Error('Don\'t set props inside the component.');
          },
        });
      });
    }
  }

  initState (data) {
    if (data) {
      Object.keys(data).forEach(key => {
        let internalValue = data[key];

        const dep = new Dependency();

        Object.defineProperty(data, key, {
          get () {
            dep.depend(`state:${key}`);
            log('state', `get value ${key} = ${internalValue}`);
            return internalValue;
          },
          set (newValue) {
            if (internalValue !== newValue) {
              log('state', `set value ${key} = ${newValue}`);
              internalValue = newValue;
              dep.notify(`state:${key}`);
            }
          },
        });
      });
    }
  }

  initComputed (computed) {
    if (computed) {
      Object.keys(computed).forEach(key => {
        const computedFunction = computed[key].bind(this.component);
        let internalValue = null;
        const dep = new Dependency();

        this.watch(() => {
          internalValue = computedFunction();
          log('computed', `value ${key} updated to ${internalValue}`);
          dep.notify(`computed:${key}`);
        });

        Object.defineProperty(this.component.computed, key, {
          get () {
            dep.depend(`computed:${key}`);
            log('computed', `get value ${key} = ${internalValue}`);
            return internalValue;
          },
          set () {
            throw new Error('Don\'t set computed value manually.');
          },
        });
      });
    }
  }

  initMethods (methods) {
    if (methods) {
      Object.keys(methods).forEach(key => {
        const methodFunction = methods[key].bind(this.component);
        let internalValue = null;
        const dep = new Dependency();

        this.watch(() => {
          internalValue = (...args) => {
            return methodFunction(...args);
          };
          log('methods', `value ${key} updated to ${internalValue}`);
          dep.notify(`methods:${key}`);
        });

        Object.defineProperty(this.component.methods, key, {
          get () {
            dep.depend(`methods:${key}`);
            log('methods', `get value ${key} = ${internalValue}`);
            return internalValue;
          },
          set () {
            throw new Error('Don\'t set methods value manually.');
          },
        });
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
