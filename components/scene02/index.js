import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  UIManager
} from "react-native";
import ComponentEntitySystem from "../componentEntitySystem";
import {
  SpawnWorm,
  AssignFingerToWorm,
  MoveWorm,
  ReleaseFingerFromWorm,
  RemoveWorm
} from "./systems";

export default class Scene02 extends Component {
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
