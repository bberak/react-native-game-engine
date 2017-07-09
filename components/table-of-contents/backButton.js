import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import * as Animatable from "react-native-animatable";
import EStyleSheet from "react-native-extended-stylesheet";

export default class BackButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  fadeInLeft = (duration) => {
    return this.refs.back.fadeInLeft(duration);
  };

  fadeOutLeft = (duration) => {
    return this.refs.back.fadeOutLeft(duration);
  };

  fadeInRight = (duration) => {
    return this.refs.back.fadeInRight(duration);
  };

  fadeOutRight = (duration) => {
    return this.refs.back.fadeOutRight(duration);
  };

  render() {
    return (
      <TouchableOpacity key={"back"} onPress={this.props.onPress}>
          <Animatable.View
            ref={"back"}
            animation={this.props.animation}
            style={css.container}
          >
          
          </Animatable.View>
        </TouchableOpacity>
    );
  }
}

const css = EStyleSheet.create({
  $height: "5.5%",
  container: {
    backgroundColor: "#000",
    borderRadius: "$height",
    width: "$height",
    height: "$height",
    marginRight: "$height * 0.45"
  }
});
