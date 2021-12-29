import Fw from '../../src/Fw';

export default Fw.createComponent({
  data: {
    lifecycle: null,
    show: false,
  },
  methods: {
    toggleHello () {
      this.data.show = !this.data.show;
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
        <button on={{ click: this.methods.toggleHello }}>
          Toggle Hello
        </button>
        <p style={{ display: this.data.show ? 'block' : 'none' }}>Hello</p>
      </div>
    );
  },
});
