import Dependency from './Dependency';
import { patchDom } from './VDom';
import { log } from './Logger';

class Fw {
  /**
   * Create a component instance
   *
   * @param {Object} component
   * @param {Object=} component.props - Props definition using name and default value as initial value.
   * @param {Object=} component.data - Component internal state.
   * @param {Object=} component.computed - Functions that each must have return value and don't have parameters/arguments.
   * @param {Object=} component.methods - A regular function that can have some parameters/arguments.
   * @param {Function=} component.created - Component created lifecycle hook.
   * @param {Function=} component.updated - Component updated lifecycle hook.
   * @param {Function=} component.destroyed - Component destroyed lifecycle hook.
   * @param {Function=} component.render - Render function that return jsx.
   * @param {Element=} el - HTML element to mount component.
   * @param {String[]} logger - Loggers to be enabled.
   */
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

    this.lifecycleCreated();

    this.watch('render', this.render.bind(this));
  }

  lifecycleCreated () {
    const onCreate = this.component.created ? this.component.created.bind(this.component) : null;
    if (onCreate) {
      onCreate();
    }
    log('lifecycle', 'create');
  }

  lifecycleUpdated () {
    const onUpdate = this.component.updated ? this.component.updated.bind(this.component) : null;
    if (onUpdate) {
      onUpdate();
    }
    log('lifecycle', 'update');
  }

  lifecycleDestroyed () {
    const onDestroy = this.component.destroyed ? this.component.destroyed.bind(this.component) : null;
    if (onDestroy) {
      onDestroy();
    }
    log('lifecycle', 'destroy');
  }

  static createComponent (component) {
    return (props, children) => {
      let validProps = null;
      Object.keys({ ...component.props }).forEach(key => {
        validProps = {
          ...validProps,
          [key]: props[key] !== undefined ? props[key] : component.props[key],
        };
      });

      const mountComponent = new Fw({
        ...component,
        props: validProps,
        children,
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

        this.watch(`computed:${key}`, () => {
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
        let prevValue = null;
        let firstRender = true;
        const dep = new Dependency();

        const initGetter = (...args) => {
          dep.depend(`methods:${key}`);

          const changeValue = () => {
            internalValue = methodFunction(...args);
            if (prevValue !== null && prevValue !== internalValue) {
              prevValue = internalValue;
              dep.notify(`methods:${key}`);
            }
            prevValue = internalValue;
          };

          if (firstRender) {
            this.watch(`methods:${key}`, changeValue);
            firstRender = false;
          }

          return internalValue;
        };

        Object.defineProperty(this.component.methods, key, {
          get () {
            return initGetter;
          },
          set () {
            throw new Error('Don\'t set methods value manually.');
          },
        });
      });
    }
  }

  watch (name, func) {
    Dependency.targetName = name;
    Dependency.target = func.bind(this.component);
    Dependency.target();
  }

  render () {
    if (this.component.render) {
      const vnode = this.component.render();
      if (this.component.el) {
        patchDom(this.component.el, vnode);
        this.lifecycleUpdated();
      }
      this.component.el = {
        ...vnode,
        onDestroy: this.lifecycleDestroyed.bind(this),
      };
    }
  }
}

export default Fw;
