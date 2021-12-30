import Fw from '../../src/Fw';
import ParentComponent from '../components/ParentComponent';
import ChildComponent from '../components/ChildComponent';

export default Fw.createComponent({
  data: {
    show: false,
  },
  methods: {
    handleShowHello (show) {
      this.data.show = show;
    },
  },
  render () {
    return (
      <div>
        <p style={{ display: this.data.show ? 'block' : 'none' }}>Hello From Home</p>
        <ParentComponent homeHello={this.data.show} callback={this.methods.handleShowHello}>
          <ChildComponent />
        </ParentComponent>
      </div>
    );
  },
});
