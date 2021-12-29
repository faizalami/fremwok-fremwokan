import Fw from '../src/Fw';

const Test = Fw.createComponent({
  data: {
    tax: 5,
  },
  props: {
    total: 0,
  },
  computed: {
    getTotalWithTax () {
      return this.props.total + this.data.tax;
    },
  },
  render () {
    return (
      <p>
        Total + tax: <strong>{this.computed.getTotalWithTax}</strong>
      </p>
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

const fw = new Fw(component, document.body);
window.fwData = fw;
