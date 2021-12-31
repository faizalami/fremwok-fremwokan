import { log } from './Logger';

class Dependency {
  /**
   * Create an observer storage to store functions that depend on a reactive object.
   */
  constructor () {
    this.subscribers = [];
    this.subscribersName = [];
  }

  depend (source) {
    if (Dependency.target && !this.subscribers.includes(Dependency.target)) {
      this.subscribers.push(Dependency.target);
      this.subscribersName.push(Dependency.targetName);
      Dependency.target = null;
      Dependency.targetName = null;
      log('dependency', `depend from ${source} = ${this.subscribersName.join(', ')}`);
    }
  }

  notify (source) {
    log('dependency', `${source} notify changes to ${this.subscribersName.join(', ')}`);
    this.subscribers.forEach(sub => sub());
  }
}

export default Dependency;
