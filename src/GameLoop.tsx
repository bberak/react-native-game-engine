import React, { Component } from "react";
import type { ScaledSize, ViewStyle } from 'react-native';
import { Dimensions, StyleSheet, View } from 'react-native';
import DefaultTimer from "./DefaultTimer";
import DefaultTouchProcessor, { type TouchProcessorOptions } from "./DefaultTouchProcessor";

export interface TimeUpdate {
  current: number;
  delta: number;
  previous: number;
  previousDelta: number;
}

export interface GameLoopUpdateEventOptionType {
  touches: TouchEvent[];
  screen: ScaledSize;
  time: TimeUpdate;
}

export interface GameLoopProperties {
  timer?: DefaultTimer;
  touchProcessor?: TouchProcessorOptions;
  running?: boolean;
  style?: ViewStyle | ViewStyle[] | undefined;
  onUpdate?: (args: GameLoopUpdateEventOptionType) => void;
  children?: React.ReactNode | React.ReactNode[] | Element | Element[] | null;
}

export default class GameLoop extends Component<GameLoopProperties> {
  timer: DefaultTimer;
  touches: never[];
  screen: ScaledSize;
  previousTime: null | number;
  previousDelta: null | number;
  touchProcessor: TouchProcessorOptions;
  layout: null;

  constructor(props: GameLoopProperties) {
    super(props);
    this.timer = props.timer || new DefaultTimer();
    this.timer.subscribe(this.updateHandler);
    this.touches = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;
    this.touchProcessor = typeof props.touchProcessor === 'function' ? props.touchProcessor(this.touches) : props.touchProcessor;
    this.layout = null;
  }

  componentDidMount() {
    if (this.props.running) this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
    if (this.touchProcessor.end) this.touchProcessor.end();
  }

  UNSAFE_componentWillReceiveProps(nextProps: {
    running: boolean;
  }) {
    if (nextProps.running !== this.props.running) {
      if (nextProps.running) this.start();
      else this.stop();
    }
  }

  start = () => {
    this.touches.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
    this.timer.start();
  };

  stop = () => {
    this.timer.stop();
  };

  updateHandler = (currentTime: number) => {
    let args = {
      touches: this.touches,
      screen: this.screen,
      layout: this.layout,
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

  onLayoutHandler = e => {
    this.screen = Dimensions.get("window");
    this.layout = e.nativeEvent.layout;
    this.forceUpdate();
  };

  onTouchStartHandler = e => {
    this.touchProcessor.process?.("start", e.nativeEvent);
  };

  onTouchMoveHandler = e => {
    this.touchProcessor.process?.("move", e.nativeEvent);
  };

  onTouchEndHandler = e => {
    this.touchProcessor.process?.("end", e.nativeEvent);
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

GameLoop.defaultProps = {
  touchProcessor: DefaultTouchProcessor({
    triggerPressEventBefore: 200,
    triggerLongPressEventAfter: 700,
    moveThreshold: 10
  }),
  running: true
};

const css = StyleSheet.create({
  container: {
    flex: 1
  }
});
