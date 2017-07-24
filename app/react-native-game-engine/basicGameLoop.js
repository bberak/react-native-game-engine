import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Timer from "./timer";
import Rx from "rx";

export default class BasicGameLoop extends Component {
  constructor(props) {
    super(props);

    this.timer = new Timer();
    this.timer.subscribe(this.update);
    this.touches = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;

    this.touchStart = new Rx.Subject();
    this.touchMove = new Rx.Subject();
    this.touchEnd = new Rx.Subject();
    this.touchPress = this.touchStart.flatMap(e =>
      this.touchEnd
        .first(x => x.identifier === e.identifier)
        .timeout(200, Rx.Observable.empty())
    );
    this.longTouch = this.touchStart.flatMap(e =>
      Rx.Observable
        .return(e)
        .delay(700)
        .takeUntil(
          this.touchMove
            .merge(this.touchEnd)
            .first(x => x.identifier === e.identifier)
        )
    );

    this.onTouchStart = new Rx.CompositeDisposable();
    this.onTouchStart.add(
      this.touchStart
        .groupBy(e => e.identifier)
        .map(group => {
          return group.map(e => {
            this.touches.push({ id: group.key, type: "start", event: e });
          });
        })
        .subscribe(group => {
          this.onTouchStart.add(group.subscribe());
        })
    );

    this.onTouchMove = new Rx.CompositeDisposable();
    this.onTouchMove.add(
      this.touchMove
        .groupBy(e => e.identifier)
        .map(group => {
          return group.map(e => {
            this.touches.push({ id: group.key, type: "move", event: e });
          });
        })
        .subscribe(group => {
          this.onTouchMove.add(group.subscribe());
        })
    );

    this.onTouchEnd = new Rx.CompositeDisposable();
    this.onTouchEnd.add(
      this.touchEnd
        .groupBy(e => e.identifier)
        .map(group => {
          return group.map(e => {
            this.touches.push({ id: group.key, type: "end", event: e });
          });
        })
        .subscribe(group => {
          this.onTouchEnd.add(group.subscribe());
        })
    );

    this.onTouchPress = new Rx.CompositeDisposable();
    this.onTouchPress.add(
      this.touchPress
        .groupBy(e => e.identifier)
        .map(group => {
          return group.map(e => {
            this.touches.push({ id: group.key, type: "press", event: e });
          });
        })
        .subscribe(group => {
          this.onTouchPress.add(group.subscribe());
        })
    );

    this.onLongTouch = new Rx.CompositeDisposable();
    this.onLongTouch.add(
      this.longTouch
        .groupBy(e => e.identifier)
        .map(group => {
          return group.map(e => {
            this.touches.push({ id: group.key, type: "long-press", event: e });
          });
        })
        .subscribe(group => {
          this.onLongTouch.add(group.subscribe());
        })
    );
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.timer.stop();
    this.timer.unsubscribe(this.update);

    this.touchStart.dispose();
    this.touchMove.dispose();
    this.touchEnd.dispose();

    this.onTouchStart.dispose();
    this.onTouchMove.dispose();
    this.onTouchEnd.dispose();
    this.onTouchPress.dispose();
    this.onLongTouch.dispose();
  }

  start = () => {
    this.timer.start();
  };

  stop = () => {
    this.timer.stop();
  };

  update = currentTime => {
    let args = {
      touches: this.touches,
      screen: this.screen,
      time: {
        current: currentTime,
        previous: this.previousTime,
        delta: currentTime - (this.previousTime || currentTime),
        previousDelta: this.previousDelta
      }
    };

    if (this.props.onUpdate) this.props.onUpdate(args);

    this.touches.length = 0;
    this.previousTime = currentTime;
    this.previousDelta = args.time.delta;
  };

  onPublishTouchStart = e => {
    this.touchStart.onNext(e.nativeEvent);
  };

  onPublishTouchMove = e => {
    this.touchMove.onNext(e.nativeEvent);
  };

  onPublishTouchEnd = e => {
    this.touchEnd.onNext(e.nativeEvent);
  };

  onLayout = () => {
    this.screen = Dimensions.get("window");
    this.forceUpdate();
  };

  render() {
    return (
      <View
        style={[css.container, this.props.style]}
        onLayout={this.onLayout}
        onTouchStart={this.onPublishTouchStart}
        onTouchMove={this.onPublishTouchMove}
        onTouchEnd={this.onPublishTouchEnd}
      >
        {this.props.children}
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1
  }
});
