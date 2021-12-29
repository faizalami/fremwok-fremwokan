import Fw from '../../src/Fw';

export default Fw.createComponent({
  props: {
    valueA: 0,
    valueB: 0,
  },
  computed: {
    result () {
      return this.props.valueA + this.props.valueB;
    },
  },
  render () {
    return (
      <div>
        { this.props.valueA } + { this.props.valueB } = { this.computed.result }
      </div>
    );
  },
});
