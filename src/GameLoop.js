import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Timer from "./Timer";
import Rx from "rx";

export default class GameLoop extends Component {
  constructor(props) {
    super(props);

    this.timer = new Timer();
    this.timer.subscribe(this.updateHandler);
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
      Rx.Observable
        .merge(
          this.touchStart.map(x => Object.assign(x, { type: "start" })),
          this.touchMove.map(x => Object.assign(x, { type: "move" })),
          this.touchEnd.map(x => Object.assign(x, { type: "end" }))
        )
        .groupBy(e => e.identifier)
        .map(group => {
          return group.pairwise().map(([e1, e2]) => {
            if (e1.type !== "end") {
              this.touches.push({
                id: group.key,
                type: "move",
                event: e2,
                delta: {
                  locationX: e2.locationX - e1.locationX,
                  locationY: e2.locationY - e1.locationY,
                  pageX: e2.pageX - e1.pageX,
                  pageY: e2.pageY - e1.pageY,
                  timestamp: e2.timestamp - e1.timestamp
                }
              });
            }
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
    this.timer.unsubscribe(this.updateHandler);

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

  updateHandler = currentTime => {
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

  onLayoutHandler = () => {
    this.screen = Dimensions.get("window");
    this.forceUpdate();
  };

  onTouchStartHandler = e => {
    this.touchStart.onNext(e.nativeEvent);
  };

  onTouchMoveHandler = e => {
    this.touchMove.onNext(e.nativeEvent);
  };

  onTouchEndHandler = e => {
    this.touchEnd.onNext(e.nativeEvent);
  };

  render() {
    return (
      <View
        style={[css.container, this.props.style]}
        onLayout={this.onLayoutHandler}
        onTouchStart={this.onTouchStartHandler}
        onTouchMove={this.onTouchMoveHandler}
        onTouchEnd={this.onTouchEndHandler}
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
