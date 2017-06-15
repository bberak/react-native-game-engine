import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar, View, Text } from "react-native";
import ComponentEntitySystem from "../componentEntitySystem";
import { Worm } from "./renderers";
import { Control } from "./systems"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default class Scene02 extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <ComponentEntitySystem
        style={styles.container}
        systems={[Control]}
        entities={{
          worm: {
            renderable: <Worm />,
            position: [WIDTH / 2, HEIGHT / 2]
          }
        }}>

        <StatusBar hidden={true} />

      </ComponentEntitySystem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
