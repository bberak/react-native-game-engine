import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Timer from "./Timer";
import DefaultTouchProcessor from "./DefaultTouchProcessor";

export default class GameLoop extends Component {
  constructor(props) {
    super(props);

    this.timer = new Timer();
    this.timer.subscribe(this.updateHandler);
    this.touches = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;
    this.touchProcessor = props.touchProcessor(this.touches);
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
    this.touchProcessor.end();
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
  touchProcessor: DefaultTouchProcessor({ triggerPressEventBefore: 200, triggerLongPressAfter: 700 })
};

const css = StyleSheet.create({
  container: {
    flex: 1
  }
});
