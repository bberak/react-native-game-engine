import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import EStyleSheet from "react-native-extended-stylesheet";

export default class CloseButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <TouchableOpacity style={css.button} onPress={this.props.onPress} />;
  }
}

const css = EStyleSheet.create({
  $height: "5.5%",
  $marginTop: "1.5%",
  button: {
    backgroundColor: "#000",
    borderRadius: "$height",
    width: "$height",
    height: "$height",
    margin: "$marginTop",
    position: "absolute"
  }
});
