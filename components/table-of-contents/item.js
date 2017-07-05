import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";

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

const css = StyleSheet.create({
  itemText: {
    backgroundColor: "transparent",
    fontSize: 20,
    lineHeight: 50,
    color: "#000"
  }
});
