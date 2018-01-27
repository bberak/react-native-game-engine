import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Timer from "./Timer";
import DefaultRenderer from "./DefaultRenderer";
import DefaultTouchProcessor from "./DefaultTouchProcessor";

const getEntitiesFromProps = props =>
  props.initState ||
  props.initialState ||
  props.state ||
  props.initEntities ||
  props.initialEntities ||
  props.entities;

const copy = entities =>
  Array.isArray(entities) ? [...entities] : { ...entities };

export default class GameEngine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: copy(getEntitiesFromProps(props))
    };
    this.timer = new Timer();
    this.timer.subscribe(this.updateHandler);
    this.touches = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;
    this.events = [];
    this.touchProcessor = props.touchProcessor(this.touches);
  }

  componentDidMount() {
    if (this.props.running) this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
    if (this.touchProcessor.end) this.touchProcessor.end();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.running !== this.props.running) {
      if (nextProps.running) this.start();
      else this.stop();
    }

    let nextEntities = getEntitiesFromProps(nextProps);
    let currentEntities = getEntitiesFromProps(this.props);
    if (nextEntities !== currentEntities)
      this.setState({ entities: copy(nextEntities) });

    if (nextProps.touchProcessor !== this.props.touchProcessor) {
      if (this.touchProcessor.end) this.touchProcessor.end();
      this.touchProcessor = nextProps.touchProcessor(this.touches);
    }
  }

  start = (event = { type: "started" }) => {
    this.touches.length = 0;
    this.events.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
    this.timer.start();
    this.dispatch(event);
  };

  stop = (event = { type: "stopped" }) => {
    this.timer.stop();
    this.dispatch(event);
  };

  restart = (
    entities = getEntitiesFromProps(this.props),
    event = { type: "restarted" }
  ) => {
    this.setState({ entities: copy(entities) });
    this.start(event);
  };

  publish = e => {
    this.dispatch(e);
  };

  publishEvent = e => {
    this.dispatch(e);
  };

  dispatch = e => {
    setTimeout(() => {
      this.events.push(e);
      if (this.props.onEvent) this.props.onEvent(e);
    }, 0);
  };

  dispatchEvent = e => {
    this.dispatch(e);
  };

  updateHandler = currentTime => {
    let args = {
      touches: this.touches,
      screen: this.screen,
      events: this.events,
      dispatch: this.dispatch,
      time: {
        current: currentTime,
        previous: this.previousTime,
        delta: currentTime - (this.previousTime || currentTime),
        previousDelta: this.previousDelta
      }
    };

    let newState = this.props.systems.reduce(
      (state, sys) => sys(state, args),
      this.state.entities
    );

    this.touches.length = 0;
    this.events.length = 0;
    this.previousTime = currentTime;
    this.previousDelta = args.time.delta;
    this.setState({ entities: newState });
  };

  onLayoutHandler = () => {
    this.screen = Dimensions.get("window");
    this.forceUpdate();
  };

  onTouchStartHandler = e => {
    this.touchProcessor.process("start", e.nativeEvent);
  };

  onTouchMoveHandler = e => {
    this.touchProcessor.process("move", e.nativeEvent);
  };

  onTouchEndHandler = e => {
    this.touchProcessor.process("end", e.nativeEvent);
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
          {this.props.renderer(this.state.entities, this.screen)}
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

GameEngine.defaultProps = {
  systems: [],
  entities: {},
  renderer: DefaultRenderer,
  touchProcessor: DefaultTouchProcessor({
    triggerPressEventBefore: 200,
    triggerLongPressEventAfter: 700
  }),
  running: true
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
