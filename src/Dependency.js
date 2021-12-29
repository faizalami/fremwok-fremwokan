class Dependency {
  constructor () {
    this.subscribers = [];
  }

  depend (source) {
    if (Dependency.target && !this.subscribers.includes(Dependency.target)) {
      this.subscribers.push(Dependency.target);
      console.log(`depend from ${source}`, this.subscribers);
    }
  }

  notify (source) {
    console.log(`${source} notify changes`, this.subscribers);
    this.subscribers.forEach(sub => sub());
  }
}

export default Dependency;
