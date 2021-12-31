import Fw from '../../src/Fw';
import ParentComponent from '../components/ParentComponent';
import ChildComponent from '../components/ChildComponent';

export default Fw.createComponent({
  data: {
    homeHello: false,
  },
  methods: {
    handleShowHello (show) {
      this.data.homeHello = show;
    },
  },
  render () {
    return (
      <div>
        <p style={{ display: this.data.homeHello ? 'block' : 'none' }}>Hello From Home</p>
        <ParentComponent homeHello={this.data.homeHello} callback={this.methods.handleShowHello}>
          <ChildComponent />
        </ParentComponent>
      </div>
    );
  },
});
