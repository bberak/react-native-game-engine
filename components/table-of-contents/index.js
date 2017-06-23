import React, { Component } from "react";
import { StatusBar } from "react-native";
import { ComponentEntitySystem } from "../react-native-game-engine";
import {
  ParticleSystem,
  ParticleSystemReactNativeART,
  ParticleSystemReactNativeSvg
} from "./renderers";
import {
  SpawnParticles,
  Gravity,
  Wind,
  Motion,
  DegenerateParticles
} from "./systems";

export default class TableOfContents extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <ComponentEntitySystem
        systems={[SpawnParticles, Gravity, Wind, Motion, DegenerateParticles]}
        entities={{
          "particle-system-01": {
            origin: [0, 0],
            particles: [],
            renderable: ParticleSystem
          }
        }}
      >

        <StatusBar hidden={false} />

      </ComponentEntitySystem>
    );
  }
}
