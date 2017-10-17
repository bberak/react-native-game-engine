import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Timer from "./Timer";
import Rx from "rx";

export default class GameEngine extends Component {
  constructor(props) {
    super(props);
    this.state =
      props.initState ||
      props.initialState ||
      props.state ||
      props.initEntities ||
      props.initialEntities ||
      props.entities;
    this.timer = new Timer();
    this.timer.subscribe(this.updateHandler);
    this.touches = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;
    this.events = [];
    let push = this.events.push;
    this.events.push = e => {
      let res = push.call(this.events, e);
      if (this.props.onEvent) this.props.onEvent(e);
      return res;
    };

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
            if (e1.type !== "end" && e2.type === "move") {
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
    this.stop();
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
    this.events.push({ type: "started" });
  };

  stop = () => {
    this.timer.stop();
    this.events.push({ type: "stopped" });
  };

  publish = e => {
    this.events.push(e);
  };

  publishEvent = e => {
    this.events.push(e);
  };

  dispatch = e => {
    this.events.push(e);
  };

  dispatchEvent = e => {
    this.events.push(e);
  };

  updateHandler = currentTime => {
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

    let newState = this.props.systems.reduce(
      (state, sys) => sys(state, args),
      this.state
    );

    this.touches.length = 0;
    this.events.length = 0;
    this.previousTime = currentTime;
    this.previousDelta = args.time.delta;
    this.setState(newState);
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
      >
        <View
          style={css.entityContainer}
          onTouchStart={this.onTouchStartHandler}
          onTouchMove={this.onTouchMoveHandler}
          onTouchEnd={this.onTouchEndHandler}
        >
          {this.props.renderer(this.state, this.screen)}
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

const defaultRenderer = (state, screen) => {
  return Object.keys(state)
    .filter(key => state[key].renderer)
    .map(key => {
      let entity = state[key];
      if (typeof entity.renderer === "object")
        return (
          <entity.renderer.type key={key} {...entity} screen={screen} />
        );
      else if (typeof entity.renderer === "function")
        return <entity.renderer key={key} {...entity} screen={screen} />;
    });
};

GameEngine.defaultProps = {
  systems: [],
  entities: {},
  renderer: defaultRenderer
};

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
