import Dependency from './Dependency';
import { log } from './Logger';

class Store {
  constructor () {
    this.storeFunction = null;
    this.store = {};
  }

  /**
   * Configure store.
   *
   * @param {Function} storeFunction - Valid store function.
   * @return {{dispatch: *, bindStore: Function}}
   */
  configureStore (storeFunction) {
    this.storeFunction = storeFunction;
    this.initStore();
    return {
      bindStore: this.bindStore.bind(this.store),
      dispatch: this.dispatch.bind(this),
    };
  }

  initStore () {
    const data = this.storeFunction(undefined, {
      type: null,
    });
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

  /**
   * Bind store to computed.
   *
   * @param {String} name - Store name.
   * @return {function(): *}
   */
  bindStore (name) {
    return () => {
      return this[name];
    };
  }

  /**
   * Change store value based on action.
   *
   * @param {Object} action - Valid action.
   * @param {String} action.type - Action type.
   * @param {*} action.payload - Action payload.
   */
  dispatch (action) {
    const validAction = {
      type: action.type,
      payload: action.payload,
    };
    const newStore = this.storeFunction(this.store, validAction);
    Object.keys(newStore).forEach(key => {
      this.store[key] = newStore[key];
    });
  }
}

const store = new Store();
export const configureStore = store.configureStore.bind(store);
