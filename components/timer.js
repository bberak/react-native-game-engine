//-- With thanks, https://github.com/FormidableLabs/react-game-kit/blob/master/src/native/utils/game-loop.js

export default class Timer {
  constructor() {
    this.subscribers = [];
    this.loopId = null;
  }

  loop = () => {
    this.subscribers.forEach(callback => {
      callback.call();
    });

    this.loopId = requestAnimationFrame(this.loop);
  };

  start() {
    if (!this.loopId) {
      this.loop();
    }
  }

  stop() {
    cancelAnimationFrame(this.loop);
  }

  subscribe(callback) {
    return this.subscribers.push(callback);
  }

  unsubscribe(id) {
    delete this.subscribers[id - 1];
  }
}
