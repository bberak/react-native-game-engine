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
    await this.refs.close.bounceOut(250);

    if (this.props.onPress)
      this.props.onPress();
  };

  render() {
    return (
      <TouchableOpacity
        style={css.button}
        activeOpacity={1}
        onPress={this.onPress}
      >
        <Animatable.Image
          ref={"close"}
          delay={300}
          animation={"bounceIn"}
          source={Close}
        />
      </TouchableOpacity>
    );
  }
}

const css = EStyleSheet.create({
  $height: "5.5%",
  $marginTop: "1.5%",
  button: {
    margin: "$marginTop",
    position: "absolute"
  }
});
