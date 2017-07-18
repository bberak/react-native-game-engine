import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import EStyleSheet from "react-native-extended-stylesheet";
import Close from "./images/close.png";

export default class CloseButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPress = async () => {
    await this.refs.close.bounceOut(300);

    if (this.props.onPress)
      this.props.onPress();
  };

  render() {
    return (
      <TouchableOpacity
        style={css.button}
        hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
        activeOpacity={1}
        onPress={this.onPress}
      >
        <Animatable.Image
          ref={"close"}
          delay={500}
          animation={"bounceIn"}
          source={Close}
        />
      </TouchableOpacity>
    );
  }
}

const css = EStyleSheet.create({
  $marginTop: "1.5%",
  button: {
    margin: "$marginTop",
    position: "absolute"
  }
});
