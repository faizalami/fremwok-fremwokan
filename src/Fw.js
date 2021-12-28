import Dependency from './Dependency';
import { patchDom } from './VDom';

class Fw {
  constructor (component, el) {
    const { data, methods } = component;
    this.component = {
      ...component,
      el: el || null,
    };

    this.initState(data);
    this.initMethods(methods);

    this.watchMethod(this.render.bind(this));
  }

  static createComponent (component) {
    return (props) => {
      const config = {
        ...component,
        props,
      };
      const mountComponent = new Fw(config);
      return mountComponent.component.el;
    };
  }

  initState (data) {
    if (data) {
      // Go through each of our data properties
      Object.keys(data).forEach(key => {
        let internalValue = data[key];

        // Each property gets a dependency instance
        const dep = new Dependency();

        Object.defineProperty(data, key, {
          get () {
            // console.log(`${key} get ${internalValue}`);
            dep.depend(); // <-- Remember the target we're running
            return internalValue;
          },
          set (newVal) {
            if (internalValue !== newVal) {
              internalValue = newVal;
              dep.notify(); // <-- Re-run stored functions
            }
            // console.log(`${key} set ${newVal}`);
          },
        });
      });
    }
  }

  watchMethod (method) {
    Dependency.target = method.bind(this.component);
    Dependency.target();
    Dependency.target = null;
  }

  initMethods (methods) {
    if (methods) {
      Object.keys(methods).forEach(key => {
        this.watchMethod(methods[key]);
      });
    }
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
