import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  StatusBar
} from "react-native";
import { BasicGameLoop } from "../../react-native-game-engine";
import Worm from "./worm";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default class Scene01 extends Component {
  constructor() {
    super();
    this.state = {
      x: WIDTH / 2,
      y: HEIGHT / 2
    };
  }

  onUpdate = (gestures) => {
    let vx = 0, vy = 0;
    for (let i = 0, len = gestures.length; i < len; i++) {
      vx += gestures[i].vx;
      vy += gestures[i].vy;
    }
    this.setState({
      x: this.state.x + vx * 20,
      y: this.state.y + vy * 20
    });
  };

  render() {
    return (
      <BasicGameLoop style={styles.container} onUpdate={this.onUpdate}>

        <StatusBar hidden={true} />

        <Worm {...this.state} />

      </BasicGameLoop>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }
});
