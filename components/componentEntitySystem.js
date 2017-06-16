import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Timer from "./timer";
import Rx from "rx";

export default class ComponentEntitySystem extends Component {
  constructor(props) {
    super(props);
    this.state = props.initState || props.initialState || props.entities || {};
    this.systems = props.systems || [];
  }

  componentWillMount() {
    this.timer = new Timer();
    this.timer.start();
    this.timer.subscribe(this.onUpdate);
    this.touches = [];

    this.touchStart = new Rx.Subject();
    this.touchMove = new Rx.Subject();
    this.touchEnd = new Rx.Subject();
    this.touchPress = this.touchStart.flatMap(e =>
      this.touchEnd.timeout(200, Rx.Observable.empty())
    );
    this.longTouch = this.touchStart.flatMap(e =>
      Rx.Observable
        .return(e)
        .delay(700)
        .takeUntil(this.touchMove.merge(this.touchEnd))
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

  onUpdate = () => {
    let newState = this.state;

    for (let i = 0, len = this.systems.length; i < len; i++) {
      newState = this.systems[i](newState, this.touches);
    }

    this.touches.length = 0;
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

  render() {
    return (
      <View style={[css.container, this.props.style]}>

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

        <View style={css.childrenContainer}>
          {this.props.children}
        </View>

      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
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
