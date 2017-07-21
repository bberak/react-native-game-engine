import React, { Component } from "react";
import {
  StatusBar,
  Platform,
  UIManager
} from "react-native";
import { ComponentEntitySystem } from "../../react-native-game-engine";
import {
  SpawnWorm,
  AssignFingerToWorm,
  MoveWorm,
  ReleaseFingerFromWorm,
  RemoveWorm
} from "./systems";

export default class MultiTouch extends Component {
  constructor() {
    super();

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  render() {
    return (
      <ComponentEntitySystem
        systems={[
          SpawnWorm,
          AssignFingerToWorm,
          MoveWorm,
          ReleaseFingerFromWorm,
          RemoveWorm
        ]}
        entities={{}}
      >

        <StatusBar hidden={true} />

      </ComponentEntitySystem>
    );
  }
}
