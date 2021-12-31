// import 'regenerator-runtime';
// import './style.css';
// import Fw from '../src/Fw';
// import Router from '../src/Router';
// import { routes } from './routes';
//
// const Route = new Router(routes);
//
// const component = {
//   render () {
//     return (
//       <main>
//         <nav>
//           <ul>
//             <li>
//               <a attrs={{
//                 href: '#',
//               }}>Home</a>
//             </li>
//             <li>
//               <a attrs={{
//                 href: '#/calculator',
//               }}>Calculator</a>
//             </li>
//           </ul>
//         </nav>
//
//         <div attrs={{
//           class: 'container',
//         }}>
//           <Route />
//         </div>
//       </main>
//     );
//   },
// };
//
// new Fw(component, document.body, {
//   logger: ['dependency'],
// });

import Fw from '../src/Fw';

const component = {
  data: {
    quantity: 10,
  },
  methods: {
    lebihKurang (brp) {
      return this.data.quantity > brp ? 'Lebih' : 'Kurang';
    },
  },
  render () {
    return (
      <div>
        <p>
          Total: {this.methods.lebihKurang(10)}
        </p>
      </div>
    );
  },
};

const fw = new Fw(component, document.body, {
  logger: ['dependency'],
});
window.fwData = fw;
