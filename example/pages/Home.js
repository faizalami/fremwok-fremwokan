import Fw from '../../src/Fw';
import ParentComponent from '../components/ParentComponent';
import ChildComponent from '../components/ChildComponent';
import myStore from '../store/my-store';

export default Fw.createComponent({
  name: 'Home',
  data: {
    homeHello: false,
  },
  computed: {
    thisIsMyNumber: myStore.bindState('myNumber'),
  },
  methods: {
    handleShowHello (show) {
      this.data.homeHello = show;
    },
  },
  render () {
    return (
      <div>
        <p>This number ({this.computed.thisIsMyNumber}) only modified in Child Component</p>
        <p style={{ display: this.data.homeHello ? 'block' : 'none' }}>Hello From Home</p>
        <ParentComponent homeHello={this.data.homeHello} callback={this.methods.handleShowHello}>
          <ChildComponent />
        </ParentComponent>
      </div>
    );
  },
});
