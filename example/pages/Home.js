import Fw from '../../src/Fw';
import ParentComponent from '../components/ParentComponent';
import ChildComponent from '../components/ChildComponent';

export default Fw.createComponent({
  render () {
    return (
      <div>
        <ParentComponent>
          <ChildComponent />
        </ParentComponent>
      </div>
    );
  },
});
