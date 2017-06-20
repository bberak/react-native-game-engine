import React, { Component } from "react";
import {
  StatusBar
} from "react-native";
import { ComponentEntitySystem } from "../react-native-game-engine";
import {
  Particles,
  Gravity,
  Wind,
  Motion,
  Degeneration
} from "./systems";

export default class TableOfContents extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <ComponentEntitySystem
        systems={[
          Particles,
          Gravity,
          Wind,
          Motion,
          Degeneration
        ]}
        entities={{ "particle-system-01": { position: [0, 0], particleSystem: true }}}
      >

        <StatusBar hidden={false} />

      </ComponentEntitySystem>
    );
  }
}
