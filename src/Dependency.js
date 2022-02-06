import { log } from './Logger';

class Dependency {
  /**
   * Create an observer storage to store functions that depend on a reactive object.
   */
  constructor () {
    this.subscribers = [];
    this.subscribersName = [];
  }

  depend (source, accept) {
    const acceptedSource = accept === 'any' || Dependency.target.source === accept;
    const targetIsValid = Dependency.target.name &&
      !this.subscribersName.includes(Dependency.target.name) &&
      acceptedSource;
    if (targetIsValid) {
      this.subscribersName.push(Dependency.target.name);
      this.subscribers.push(Dependency.target.func);
      log('dependency', `depend from ${source} = ${this.subscribersName.join(', ')}`);
    }
  }

  notify (source) {
    log('dependency', `${source} notify changes to ${this.subscribersName.join(', ')}`);
    this.subscribers.forEach(sub => sub());
  }
}
Dependency.target = {
  source: null,
  name: null,
  func: null,
};

export default Dependency;
