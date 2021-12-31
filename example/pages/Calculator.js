import Fw from '../../src/Fw';
import Total from '../components/Total';

export default Fw.createComponent({
  data: {
    valueA: 0,
    valueB: 0,
  },
  computed: {
    result () {
      return this.data.valueA + this.data.valueB;
    },
  },
  methods: {
    handleInputA (event) {
      this.data.valueA = Number(event.target.value);
    },
    handleInputB (event) {
      this.data.valueB = Number(event.target.value);
    },
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
        <div attrs={{ class: 'input-group' }}>
          <label
            attrs={{
              for: 'valueA',
            }}
          >
            Value A
          </label>
          <input
            attrs={{
              id: 'valueA',
            }}
            on={{
              keyup: this.methods.handleInputA,
            }}
          />
        </div>
        <div attrs={{ class: 'input-group' }}>
          <label
            attrs={{
              for: 'valueB',
            }}
          >
            Value B
          </label>
          <input
            attrs={{
              id: 'valueB',
            }}
            on={{
              keyup: event => this.methods.handleInputB(event),
            }}
          />
        </div>
        <Total valueA={this.data.valueA} valueB={this.data.valueB} />
        <p>
          Total is higher than 10 = {this.methods.higherThan(10)}
        </p>
      </div>
    );
  },
});
