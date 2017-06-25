import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";

export default class Title extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={css.container}>
        <Text style={css.titleText}>
          THE <Text style={css.bold}>NATURE</Text> OF
        </Text>
        <Text style={[css.titleText, css.small]}>— CODE —</Text>
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    paddingTop: 70,
    alignItems: "center"
  },
  titleText: {
    fontSize: 25,
    backgroundColor: "transparent",
    letterSpacing: 5,
    color: "#000"
  },
  bold: {
    fontWeight: "900"
  },
  small: {
    fontSize: 15,
    lineHeight: 45
  }
});
