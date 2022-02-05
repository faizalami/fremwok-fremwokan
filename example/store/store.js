class Store {
  constructor () {
    this.data = 0;
  }

  changeValue (value) {
    this.data = value;
    console.info(this);
  }
}

const store = new Store();
window.storeData = store;
export default store;
