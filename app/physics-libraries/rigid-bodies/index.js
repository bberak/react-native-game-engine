import React, { Component } from "react";
import { StatusBar, Dimensions } from "react-native";
import { ComponentEntitySystem } from "../../react-native-game-engine";
import { Physics, SpawnBox, MoveBox, RemoveBox } from "./systems";
import { Box } from "./renderers";
import Matter from "matter-js";

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

export default class RigidBodies extends Component {
  constructor() {
    super();
  }

  render() {
    const { width, height } = Dimensions.get("window");

    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    const body = Matter.Bodies.rectangle(width / 2, -1000, 50, 50, { frictionAir: 0.021 });
    const floor = Matter.Bodies.rectangle(width / 2, height, width, 100, { isStatic: true });

    Matter.World.add(world, [body, floor]);

    return (
      <ComponentEntitySystem
        systems={[Physics, SpawnBox, MoveBox, RemoveBox]}
        entities={{
          engine: { engine: engine },
          world: { world: world },
          box: { body: body, size: [50, 50], renderable: Box  },
          floor: { body: floor, size: [width, 100], color: "blue", renderable: Box }
        }}
      >

        <StatusBar hidden={true} />

      </ComponentEntitySystem>
    );
  }
}
