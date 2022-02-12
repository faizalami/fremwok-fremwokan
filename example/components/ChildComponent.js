import Fw from '../../src/Fw';
import myStore from '../store/my-store';

export default Fw.createComponent({
  name: 'ChildComponent',
  data: {
    lifecycle: null,
    show: false,
  },
  computed: {
    myNumberFromStore: myStore.bindState('myNumber'),
  },
  methods: {
    toggleHello () {
      this.data.show = !this.data.show;
      myStore.dispatch({
        type: 'ADD',
      });
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
          (click "Toggle Hello" to increase the number)
        </p>
        <button on={{ click: this.methods.toggleHello }}>
          Toggle Hello
        </button>
        <p style={{ display: this.data.show ? 'block' : 'none' }}>Hello</p>
      </div>
    );
  },
});
