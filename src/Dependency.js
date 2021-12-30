import { log } from './Logger';

class Dependency {
  /**
   * Create an observer storage to store functions that depend on a reactive object.
   */
  constructor () {
    this.subscribers = [];
  }

  depend (source) {
    if (Dependency.target && !this.subscribers.includes(Dependency.target)) {
      this.subscribers.push(Dependency.target);
      log('dependency', `depend from ${source}`, this.subscribers);
    }
  }

  notify (source) {
    log('dependency', `${source} notify changes`, this.subscribers);
    this.subscribers.forEach(sub => sub());
  }
}

export default Dependency;
