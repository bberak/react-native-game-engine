import React, { Component } from "react";
import { StatusBar, View, Text, TouchableOpacity } from "react-native";
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

        
          <View pointerEvents={"box-none"} style={{ flex: 1, alignItems: "center", justifyContent: "center", alignSelf: "center"}}>
            <TouchableOpacity onPress={_ => this.refs.engine.stop()}>
            <Text style={{backgroundColor: "transparent"}}>The nature of</Text>
            </TouchableOpacity>
              <TouchableOpacity onPress={_ => this.refs.engine.start()}>
             <Text style={{backgroundColor: "transparent"}}>code</Text>
             </TouchableOpacity>
          </View>


      </ComponentEntitySystem>
    );
  }
}
