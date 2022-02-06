import { configureStore } from '../../src/Store';

const defaultState = {
  myNumber: 0,
  myName: null,
};

const store = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, myNumber: state.myNumber + 1 };
    case 'SET_NAME':
      return { ...state, myName: action.payload };
    default:
      return state;
  }
};

export default configureStore(store);
