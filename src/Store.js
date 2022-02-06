import Dependency from './Dependency';
import { log } from './Logger';

class Store {
  constructor () {
    this.storeFunction = null;
    this.store = {};
  }

  configureStore (storeFunction) {
    this.storeFunction = storeFunction.bind(null, undefined, {
      type: null,
    });
    this.initStore();
    return {
      bindStore: this.bindStore.bind(this.store),
      dispatch: this.dispatch.bind(this.store),
    };
  }

  initStore () {
    const data = this.storeFunction();
    if (data) {
      Object.keys(data).forEach(key => {
        let internalValue = data[key];

        const dep = new Dependency();

        Object.defineProperty(this.store, key, {
          get () {
            dep.depend(`state:${key}`, 'any');
            log('store', `get value ${key} = ${internalValue}`);
            return internalValue;
          },
          set (newValue) {
            if (internalValue !== newValue) {
              log('store', `set value ${key} = ${newValue}`);
              internalValue = newValue;
              dep.notify(`state:${key}`);
            }
          },
        });
      });
    }
  }

  bindStore (name) {
    return () => {
      return this[name];
    };
  }

  dispatch (action) {
    this.store = this.storeFunction(this, action);
  }
}

const store = new Store();
window.newStoreData = store;
export const configureStore = store.configureStore.bind(store);
