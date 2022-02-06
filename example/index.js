import 'regenerator-runtime';
import './style.css';
import Fw from '../src/Fw';
import Router from '../src/Router';
import { routes } from './routes';
import Page404 from './pages/404';

const Route = new Router(routes, Page404);

const RootComponent = {
  name: 'MyApplication',
  render () {
    return (
      <main>
        <nav>
          <ul>
            <li>
              <a attrs={{
                href: '#',
              }}>Home</a>
            </li>
            <li>
              <a attrs={{
                href: '#/calculator',
              }}>Calculator</a>
            </li>
          </ul>
        </nav>

        <div attrs={{
          class: 'container',
        }}>
          <Route />
        </div>
      </main>
    );
  },
};

new Fw(RootComponent, document.body, {
  logger: ['store'],
});
