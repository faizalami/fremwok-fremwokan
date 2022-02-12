import Dependency from './Dependency';
import { log } from './Logger';

class Store {
  constructor () {
    this.storeFunction = null;
  }

  /**
   * Configure store.
   *
   * @param {Function} storeFunction - Valid store function.
   * @return {{dispatch: *, bindState: Function}}
   */
  configureStore (storeFunction) {
    this.storeFunction = storeFunction;
    this.initStore();
    return {
      bindState: this.bindState.bind(this.store),
      dispatch: this.dispatch.bind(this),
    };
  }

  initStore () {
    const data = this.getStoreData();
    if (data && !this.store) {
      this.store = {};
      Object.keys(data).forEach(key => {
        let internalValue = data[key];

        const dep = new Dependency();

        Object.defineProperty(this.store, key, {
          get () {
            dep.depend(`store:${key}`, 'any');
            log('store', `get value ${key} = ${internalValue}`);
            return internalValue;
          },
          set (newValue) {
            if (internalValue !== newValue) {
              log('store', `set value ${key} = ${newValue}`);
              internalValue = newValue;
              dep.notify(`store:${key}`);
            }
          },
        });
      });
    }
  }

  /**
   * Get store data from store function.
   *
   * @param {Object} action - Valid action.
   * @param {String} action.type - Action type.
   * @param {*} action.payload - Action payload.
   */
  getStoreData (action = {}) {
    const validAction = {
      type: action.type,
      payload: action.payload,
    };
    return this.storeFunction(this.store, validAction);
  }

  /**
   * Bind store to computed.
   *
   * @param {String} name - Store name.
   * @return {function(): *}
   */
  bindState (name) {
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
    const newStore = this.getStoreData(action);
    Object.keys(newStore).forEach(key => {
      this.store[key] = newStore[key];
    });
  }
}

const store = new Store();
export const configureStore = store.configureStore.bind(store);
