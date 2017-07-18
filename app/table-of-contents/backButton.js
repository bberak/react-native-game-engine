import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import EStyleSheet from "react-native-extended-stylesheet";
import Back from "./images/back.png";

export default class BackButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  fadeInLeft = duration => {
    return this.refs.back.fadeInLeft(duration);
  };

  fadeOutLeft = duration => {
    return this.refs.back.fadeOutLeft(duration);
  };

  fadeInRight = duration => {
    return this.refs.back.fadeInRight(duration);
  };

  fadeOutRight = duration => {
    return this.refs.back.fadeOutRight(duration);
  };

  onPressIn = () => {
    this.refs.back.transitionTo({
      marginLeft: -40,
      marginRight: 40
    });
  };

  onPressOut = () => {
    this.refs.back.transitionTo({
      marginLeft: -20,
      marginRight: 20
    });
  };

  render() {
    return (
      <TouchableOpacity
        key={"back"}
        activeOpacity={1}
        hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
        onPress={this.props.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
      >
        <Animatable.Image
          ref={"back"}
          animation={this.props.animation}
          style={css.container}
          source={Back}
        />
      </TouchableOpacity>
    );
  }
}

const css = EStyleSheet.create({
  container: {
    marginLeft: -20,
    marginRight: 20
  }
});
