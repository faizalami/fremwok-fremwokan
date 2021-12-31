import Fw from '../../src/Fw';

export default Fw.createComponent({
  props: {
    callback: () => {},
    homeHello: false,
  },
  data: {
    showChild: false,
    hello: false,
  },
  methods: {
    toggleChild () {
      this.data.showChild = !this.data.showChild;
      console.log(this.data.showChild ? 'child' : 'no child');
    },
    toggleHello () {
      this.data.hello = !this.data.hello;
      console.log(this.data.hello ? 'hello' : 'no');
    },
  },
  render () {
    return (
      <div>
        <p>
          This is parent
          <span style={{ display: this.data.hello ? 'block' : 'none' }}>Hello</span>
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
