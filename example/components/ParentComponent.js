import Fw from '../../src/Fw';

export default Fw.createComponent({
  props: {
    callback: () => {},
    homeHello: false,
  },
  data: {
    show: false,
  },
  methods: {
    toggleChild () {
      this.data.show = !this.data.show;
    },
  },
  render () {
    return (
      <div>
        <p>
          This is parent
        </p>
        <button on={{ click: this.methods.toggleChild }}>
          Toggle Child
        </button>
        <button on={{ click: () => this.props.callback(!this.props.homeHello) }}>
          Toggle Home Hello
        </button>
        <div style={{ display: this.data.show ? 'block' : 'none' }}>
          {this.children}
        </div>
      </div>
    );
  },
});
