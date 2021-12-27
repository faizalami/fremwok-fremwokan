import Fw from '../src/Fw';

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
    return `
      <p>${this.data.total}</p>
    `;
  },
};

const fw = new Fw(component, document.body);
window.fwData = fw;
