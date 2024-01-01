import React, { Component } from "react";
import type { StyleProp, ViewStyle } from 'react-native';
import { Dimensions, StyleSheet, View } from 'react-native';
import DefaultRenderer from "./DefaultRenderer";
import DefaultTimer from "./DefaultTimer";
import DefaultTouchProcessor from "./DefaultTouchProcessor";
import type { ScaledSize } from 'react-native';

export interface TimeUpdate {
  current: number;
  delta: number;
  previous: number;
  previousDelta: number;
}

export interface GameEngineUpdateEventOptionType {
  dispatch: (event: any) => void;
  events: Array<any>;
  screen: ScaledSize;
  time: TimeUpdate;
  touches: Array<TouchEvent>;
}

export interface GameEngineProperties {
  systems?: any[];
  entities?: {} | Promise<any>;
  renderer?: any;
  touchProcessor?: any;
  timer?: any;
  running?: boolean;
  onEvent?: any;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode | React.ReactNode[] | Element | Element[] | null;
}

const getEntitiesFromProps = (props: {
  initState?: any;
  initialState?: any;
  state?: any;
  initEntities?: any;
  initialEntities?: any;
  entities?: any;
}) =>
  props.initState ||
  props.initialState ||
  props.state ||
  props.initEntities ||
  props.initialEntities ||
  props.entities;

const isPromise = (obj: {
  then?: any;
  constructor?: any;
  call?: any;
  apply?: any;
}) => {
  return !!(
    obj &&
    obj.then &&
    obj.then.constructor &&
    obj.then.call &&
    obj.then.apply
  );
};

export default class GameEngine extends Component<GameEngineProperties> {
  constructor(props: GameEngineProperties) {
    super(props);
    this.state = {
      entities: null
    };
    this.timer = props.timer || new DefaultTimer();
    this.timer.subscribe(this.updateHandler);
    this.touches = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;
    this.events = [];
    this.touchProcessor = props.touchProcessor(this.touches);
    this.layout = null;
  }

  async componentDidMount() {
    let entities = getEntitiesFromProps(this.props);

    if (isPromise(entities)) entities = await entities;

    this.setState(
      {
        entities: entities || {}
      },
      () => {
        if (this.props.running) this.start();
      }
    );
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
    if (this.touchProcessor.end) this.touchProcessor.end();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.running !== this.props.running) {
      if (nextProps.running) this.start();
      else this.stop();
    }
  }

  clear = () => {
    this.touches.length = 0;
    this.events.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
  };

  start = () => {
    this.clear();
    this.timer.start();
    this.dispatch({ type: "started" });
  };

  stop = () => {
    this.timer.stop();
    this.dispatch({ type: "stopped" });
  };

  swap = async newEntities => {
    if (isPromise(newEntities)) newEntities = await newEntities;

    this.setState({ entities: newEntities || {} }, () => {
      this.clear();
      this.dispatch({ type: "swapped" });
    });
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
      layout: this.layout,
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

  onLayoutHandler = e => {
    this.screen = Dimensions.get("window");
    this.layout = e.nativeEvent.layout;
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
          {this.props.renderer(this.state.entities, this.screen, this.layout)}
        </View>

        <View
          pointerEvents={"box-none"}
          style={StyleSheet.absoluteFill}
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
    triggerLongPressEventAfter: 700,
    moveThreshold: 10,
  }),
  running: true,
  children: null
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
  }
});
