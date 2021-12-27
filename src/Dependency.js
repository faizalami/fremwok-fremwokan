class Dependency {
  constructor () {
    this.subscribers = [];
  }

  depend () {
    if (Dependency.target && !this.subscribers.includes(Dependency.target)) {
      // Only if there is a target & it's not already subscribed
      this.subscribers.push(Dependency.target);
    }
    console.log('dep', this.subscribers);
  }

  notify () {
    console.log('not', this.subscribers);
    this.subscribers.forEach(sub => sub());
  }
}

export default Dependency;
