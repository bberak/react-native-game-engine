import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar } from "react-native";
import ComponentEntitySystem from "../componentEntitySystem";
import { Touch } from "./systems"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default class Scene02 extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <ComponentEntitySystem
        style={styles.container}
        systems={[Touch]}
        entities={{}}>

        <StatusBar hidden={true} />

      </ComponentEntitySystem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }
});
