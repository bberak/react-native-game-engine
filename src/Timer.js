//-- With thanks, https://github.com/FormidableLabs/react-game-kit/blob/master/src/native/utils/game-loop.js

export default class Timer {
  constructor() {
    this.subscribers = [];
    this.loopId = null;
  }

  loop = (time) => {
    this.subscribers.forEach(callback => {
      callback(time);
    });

    this.loopId = requestAnimationFrame(this.loop);
  };

  start() {
    if (!this.loopId) {
      this.loop();
    }
  }

  stop() {
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }
  }

  subscribe(callback) {
    return this.subscribers.push(callback);
  }

  unsubscribe(id) {
    delete this.subscribers[id - 1];
  }
}