import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { BasicGameLoop } from "../../react-native-game-engine";
import Worm from "./worm";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default class SingleTouch extends Component {
  constructor() {
    super();
    this.state = {
      x: WIDTH / 2,
      y: HEIGHT / 2,
      offsetX: 0,
      offsetY: 0
    };
  }

  onUpdate = ({ touches }) => {
    let start = touches.find(x => x.type === "start");
    if (start) {
      this.setState({
        offsetX: start.event.pageX - this.state.x,
        offsetY: start.event.pageY - this.state.y
      })
    }

    let move = touches.find(x => x.type === "move");
    if (move) {
      this.setState({
        x: move.event.pageX - this.state.offsetX,
        y: move.event.pageY - this.state.offsetY
      });
    }
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
