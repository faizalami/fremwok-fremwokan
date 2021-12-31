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
    if (Dependency.targetName && !this.subscribersName.includes(Dependency.targetName)) {
      this.subscribersName.push(Dependency.targetName);
      this.subscribers.push(Dependency.target);
      log('dependency', `depend from ${source} = ${this.subscribersName.join(', ')}`);
    }
  }

  notify (source) {
    log('dependency', `${source} notify changes to ${this.subscribersName.join(', ')}`);
    this.subscribers.forEach(sub => sub());
  }
}

export default Dependency;
