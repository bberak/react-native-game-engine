import React, { Component } from "react";
import { StatusBar, View, StyleSheet } from "react-native";
import { ComponentEntitySystem } from "../react-native-game-engine";
import { ParticleSystem } from "./renderers";
import {
  SpawnParticles,
  Gravity,
  Wind,
  Motion,
  DegenerateParticles
} from "./systems";
import Title from "./title";

export default class TableOfContents extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <ComponentEntitySystem
        ref={"engine"}
        systems={[SpawnParticles, Gravity, Wind, Motion, DegenerateParticles]}
        entities={{
          "particle-system-01": {
            origin: [0, -50],
            particles: [],
            renderable: ParticleSystem
          }
        }}
      >

        <StatusBar hidden={false} />

        <View style={css.container}>
          <Title />
        </View>

      </ComponentEntitySystem>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center"
  }
});
