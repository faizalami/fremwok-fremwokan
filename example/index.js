import Fw from '../src/Fw';

const Test = Fw.createComponent({
  data: {
    tax: 5,
    money: 100,
  },
  props: {
    total: 0,
  },
  computed: {
    getTotalWithTax () {
      return this.props.total + this.data.tax;
    },
  },
  methods: {
    purchase (paid) {
      const moneyReturn = paid - this.computed.getTotalWithTax;

      if (moneyReturn > 0) {
        return `return ${moneyReturn}`;
      }
      return 'not enough money';
    },
  },
  render () {
    return (
      <div>
        <p>
          Total + tax: <strong>{this.computed.getTotalWithTax}</strong>
        </p>
        <p>
          payment = {this.data.money}
        </p>
        <p>
          {this.methods.purchase(this.data.money)}
        </p>
      </div>
    );
  },
});

const component = {
  data: {
    price: 5,
    quantity: 10,
  },
  computed: {
    total () {
      return this.data.quantity * this.data.price;
    },
  },
  render () {
    return (
      <div>
        <p>
          Total: {this.computed.total}
        </p>
        <Test total={this.computed.total} />
      </div>
    );
  },
};

const fw = new Fw(component, document.body, {
  logger: [],
});
window.fwData = fw;
