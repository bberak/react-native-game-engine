import React, { PureComponent } from "react";
import { StyleSheet, View, LayoutAnimation } from "react-native";

class Particle extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const x = this.props.position[0] - 10 / 2;
    const y = this.props.position[1] - 10 / 2;
    return (
      <View style={[css.particle, { left: x, top: y }]}>

      </View>
    );
  }
}

const css = StyleSheet.create({
  particle: {
    width: 10,
    height: 10,
    borderRadius: 10 * 2,
    backgroundColor: "pink",
    position: "absolute"
  }
});

export { Particle };
