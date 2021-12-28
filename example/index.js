import Fw from '../src/Fw';

const Test = Fw.createComponent({
  data: {
    tax: 5,
  },
  render () {
    return (
      <p>
        Total + tax: <strong>{this.props.total + this.data.tax}</strong>
      </p>
    );
  },
});

const component = {
  data: {
    price: 5,
    quantity: 10,
    total: 0,
  },
  methods: {
    calculate () {
      this.data.total = this.data.quantity * this.data.price;
    },
  },
  render () {
    return (
      <div>
        <p>
          Total: {this.data.total}
        </p>
        <Test total={this.data.total} />
      </div>
    );
  },
};

const fw = new Fw(component, document.body);
window.fwData = fw;
