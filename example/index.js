import Fw from '../src/Fw';
import { h } from 'snabbdom';

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
    return h('p', [`${this.data.total}`]);
  },
};

const fw = new Fw(component, document.body);
window.fwData = fw;
