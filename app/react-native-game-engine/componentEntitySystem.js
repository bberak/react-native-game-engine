import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Timer from "./timer";
import Rx from "rx";

export default class ComponentEntitySystem extends Component {
  constructor(props) {
    super(props);
    this.state = props.initState || props.initialState || props.entities || {};
    this.systems = props.systems || [];
    this.timer = new Timer();
    this.timer.subscribe(this.onUpdate);
    this.touches = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;
    this.events = [];
    let push = this.events.push;
    this.events.push = (e) => {
      let res = push.call(this.events, e);
      if (this.props.onEvent) this.props.onEvent(e);
      return res;
    }

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

  onUpdate = currentTime => {
    let args = {
      touches: this.touches,
      screen: this.screen,
      events: this.events,
      time: {
        current: currentTime,
        previous: this.previousTime,
        delta: currentTime - (this.previousTime || currentTime),
        previousDelta: this.previousDelta
      }
    };

    let newState = this.systems.reduce(
      (state, sys) => sys(state, args),
      this.state
    );

    this.touches.length = 0;
    this.events.length = 0;
    this.previousTime = currentTime;
    this.previousDelta = args.time.delta;
    this.setState(newState);
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

  start = () => {
    this.timer.start();
    this.events.push({ type: "started"})
  };

  stop = () => {
    this.timer.stop();
    this.events.push({ type: "stopped"})
  };

  render() {
    return (
      <View style={[css.container, this.props.style]} onLayout={this.onLayout}>

        <View
          style={css.entityContainer}
          onTouchStart={this.onPublishTouchStart}
          onTouchMove={this.onPublishTouchMove}
          onTouchEnd={this.onPublishTouchEnd}
        >
          {Object.keys(this.state)
            .filter(key => this.state[key].renderable)
            .map(key => {
              let entity = this.state[key];
              if (typeof entity.renderable === "object")
                return <entity.renderable.type key={key} {...entity} />;
              else if (typeof entity.renderable === "function")
                return <entity.renderable key={key} {...entity} />;
            })}
        </View>

        <View
          pointerEvents={"box-none"}
          style={[
            css.childrenContainer,
            { width: this.screen.width, height: this.screen.height }
          ]}
        >
          {this.props.children}
        </View>

      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1
  },
  entityContainer: {
    flex: 1,
    //-- Looks like Android requires bg color here
    //-- to register touches. If we didn't worry about
    //-- 'children' (foreground) components capturing events,
    //-- this whole shenanigan could be avoided..
    backgroundColor: "transparent"
  },
  childrenContainer: {
    top: 0,
    left: 0,
    position: "absolute"
  }
});
