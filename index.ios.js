import React, { Component } from "react";
import { AppRegistry } from "react-native";
import Scene01 from "./components/extras/scene-01";
import Scene02 from "./components/extras/scene-02";
import TableOfContents from "./components/table-of-contents"

export default class NatureOfCodeApp extends Component {
  render() {
    return <TableOfContents />;
  }
}

AppRegistry.registerComponent("NatureOfCodeApp", () => NatureOfCodeApp);
