import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import EStyleSheet from "react-native-extended-stylesheet";

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  fadeInLeft = duration => {
    return this.refs.item.fadeInLeft(duration);
  };

  fadeOutLeft = duration => {
    return this.refs.item.fadeOutLeft(duration);
  };

  fadeInRight = duration => {
    return this.refs.item.fadeInRight(duration);
  };

  fadeOutRight = duration => {
    return this.refs.item.fadeOutRight(duration);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Animatable.Text
          delay={this.props.delay}
          animation={this.props.animation}
          style={css.itemText}
          ref={"item"}
        >
          {this.props.value}
        </Animatable.Text>
      </TouchableOpacity>
    );
  }
}

const css = EStyleSheet.create({
  $fontHeight: "3%",
  $lineHeight: "7.5%",
  itemText: {
    backgroundColor: "transparent",
    fontSize: "$fontHeight",
    lineHeight: "$lineHeight",
    color: "#FFF"
  }
});
