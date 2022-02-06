import Fw from '../../src/Fw';
import myStore from '../store/my-store';

export default Fw.createComponent({
  name: 'ParentComponent',
  props: {
    callback: () => {},
    homeHello: false,
  },
  data: {
    showChild: false,
    hello: false,
  },
  computed: {
    myName: myStore.bindStore('myName'),
  },
  methods: {
    toggleChild () {
      this.data.showChild = !this.data.showChild;
    },
    toggleHello () {
      myStore.dispatch({
        type: 'SET_NAME',
        payload: 'Fai',
      });
      this.data.hello = !this.data.hello;
    },
  },
  render () {
    return (
      <div>
        <p>
          This is parent
          <span style={{ display: this.data.hello ? 'block' : 'none' }}>
            Hello my name is {this.computed.myName}
          </span>
        </p>
        <button on={{ click: () => this.methods.toggleHello() }}>
          Toggle Hello
        </button>
        <button on={{ click: this.methods.toggleChild }}>
          Toggle Child
        </button>
        <button on={{ click: () => this.props.callback(!this.props.homeHello) }}>
          Toggle Home Hello
        </button>
        <div style={{ display: this.data.showChild ? 'block' : 'none' }}>
          {this.children}
        </div>
      </div>
    );
  },
});
