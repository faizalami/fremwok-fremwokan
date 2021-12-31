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
  methods: {
    higherThan (targetNumber) {
      if (targetNumber < this.computed.result) {
        return 'Yes';
      }
      return 'No';
    },
  },
  render () {
    return (
      <div>
        <p>
          { this.props.valueA } + { this.props.valueB } = { this.computed.result }
        </p>
        <p>
          Total is higher than 10 = {this.methods.higherThan(10)}
        </p>
      </div>
    );
  },
});
