import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";

export default class CloseButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <TouchableOpacity style={css.button} onPress={this.props.onPress} />;
  }
}

const css = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    borderRadius: 100,
    width: 40,
    height: 40,
    margin: 10,
    position: "absolute"
  }
});
