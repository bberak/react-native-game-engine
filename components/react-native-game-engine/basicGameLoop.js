import React, { Component } from "react";
import { View, PanResponder } from "react-native";
import Timer from "./timer";

export default class BasicGameLoop extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.timer = new Timer();
    this.timer.start();
    this.timer.subscribe(this.update);
    this.gestures = [];
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => { },
      onPanResponderMove: (evt, gestureState) => {  this.gestures.push(gestureState); },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => { },
      onPanResponderTerminate: (evt, gestureState) => { },
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }

  componentWillUnmount() {
    this.timer.stop();
    this.timer.unsubscribe(this.update);
  }

  update = () => {
    if (this.props.onUpdate) 
      this.props.onUpdate(this.gestures);

    this.gestures.length = 0;
  };

  start = () => {
    if (this.timer)
      this.timer.start();
  };

  stop = () => {
    if (this.timer)
      this.timer.stop();
  };

  render() {
    const defaultStyles = {
      flex: 1
    };
    return (
      <View style={[defaultStyles, this.props.style]} {...this.panResponder.panHandlers}>
        {this.props.children}
      </View>
    );
  }
}
