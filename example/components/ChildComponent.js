import Fw from '../../src/Fw';
import store from '../store/store';
import myStore from '../store/my-store';

export default Fw.createComponent({
  name: 'ChildComponent',
  data: {
    lifecycle: null,
    show: false,
  },
  computed: {
    myNumberFromStore: myStore.bindStore('myNumber'),
  },
  methods: {
    toggleHello () {
      this.data.show = !this.data.show;
      store.changeValue(10);
    },
  },
  created () {
    this.data.lifecycle = 'test';
    console.info('child created');
  },
  updated () {
    this.data.lifecycle = 'updated';
    console.info('child updated');
  },
  destroyed () {
    this.data.lifecycle = 'destroyed';
    console.info('child destroyed');
  },
  render () {
    return (
      <div>
        <p>
          This is child {this.data.lifecycle}
        </p>
        <p>
          my number from store = {this.computed.myNumberFromStore}
        </p>
        <button on={{ click: this.methods.toggleHello }}>
          Toggle Hello
        </button>
        <p style={{ display: this.data.show ? 'block' : 'none' }}>Hello</p>
      </div>
    );
  },
});
