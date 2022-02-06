import { configureStore } from '../../src/Store';

const defaultState = {
  myNumber: 0,
};

const store = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default configureStore(store);
