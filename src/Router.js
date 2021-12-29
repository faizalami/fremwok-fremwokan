import { match } from 'path-to-regexp';
import Fw from './Fw';

class Router {
  constructor (routes) {
    this.routes = routes;

    return () => {
      const match = new Fw({
        data: {
          router: null,
          component: () => {},
        },
        render () {
          const MatchComponent = this.data.component;
          return (<MatchComponent />);
        },
      }, null, {});

      window.addEventListener('load', async () => {
        const { router, component } = await this.matchedRoute();
        match.component.data.router = { ...router };
        match.component.data.component = component;
      });

      window.addEventListener('hashchange', async () => {
        const { router, component } = await this.matchedRoute();
        match.component.data.router = { ...router };
        match.component.data.component = component;
      });
      return match.component.el;
    };
  }

  getHashLocation () {
    return window.location.hash.slice(1).toLowerCase() || '/';
  }

  getRoutes () {
    const parsedRoutes = [];
    Object.keys(this.routes).forEach(url => {
      const component = this.routes[url];
      parsedRoutes.push({
        component,
        match: match(url, { decode: decodeURIComponent }),
      });
    });
    return parsedRoutes;
  }

  async matchedRoute () {
    let routeFound = null;
    this.getRoutes().some(route => {
      const result = route.match(this.getHashLocation());
      if (result) {
        routeFound = {
          ...route,
          ...result,
        };
        return true;
      }
      return false;
    });
    const componentFound = await routeFound.component;
    routeFound = {
      router: { ...routeFound },
      component: componentFound,
    };

    return routeFound;
  }
}

export default Router;
