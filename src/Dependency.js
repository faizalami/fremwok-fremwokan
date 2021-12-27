class Dependency {
  constructor () {
    this.subscribers = [];
  }

  depend () {
    if (Dependency.target && !this.subscribers.includes(Dependency.target)) {
      // Only if there is a target & it's not already subscribed
      this.subscribers.push(Dependency.target);
    }
  }

  notify () {
    this.subscribers.forEach(sub => sub());
  }
}

export default Dependency;
