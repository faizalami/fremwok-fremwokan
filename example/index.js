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

const NestedChild = Fw.createComponent({
  render () {
    return (
      <div>
        <p>
          This is child
        </p>
      </div>
    );
  },
});

const NestedParent = Fw.createComponent({
  render () {
    return (
      <div>
        <p>
          This is parent
        </p>
        {this.children}
      </div>
    );
  },
});

const component = {
  data: {
    price: 5,
    quantity: 0,
  },
  computed: {
    total () {
      return this.data.quantity * this.data.price;
    },
  },
  methods: {
    handleQuantity (event) {
      this.data.quantity = Number(event.target.value);
    },
  },
  render () {
    return (
      <div>
        <p>
          Price: {this.data.price}
        </p>
        <p>
          QTY:
          <br/>
          <input type='text' on={{ keyup: this.methods.handleQuantity }}/>
        </p>
        <p>
          Total: {this.computed.total}
        </p>
        <Test total={this.computed.total} />
        <NestedParent>
          <NestedChild />
        </NestedParent>
      </div>
    );
  },
};

const fw = new Fw(component, document.body, {
  logger: [],
});
window.fwData = fw;
