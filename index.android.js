import React, { Component } from "react";
import { AppRegistry } from "react-native";
import Scene01 from "./components/scene01";
import Scene02 from "./components/scene02";

export default class NatureOfCodeApp extends Component {
  render() {
    return <Scene02 />;
  }
}

AppRegistry.registerComponent("NatureOfCodeApp", () => NatureOfCodeApp);
