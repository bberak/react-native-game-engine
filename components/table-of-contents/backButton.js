import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import * as Animatable from "react-native-animatable";

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
            style={css.headingContainer}
          >
            <Text style={css.headingText}>
              Back
            </Text>
          </Animatable.View>
        </TouchableOpacity>
    );
  }
}

const css = StyleSheet.create({
  headingContainer: {
    borderBottomWidth: 3,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
    alignSelf: "center"
  },
  headingText: {
    backgroundColor: "transparent",
    letterSpacing: 5,
    color: "#000",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold"
  }
});
