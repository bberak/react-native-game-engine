import React, { Component } from "react";
import { StatusBar, Dimensions } from "react-native";
import { ComponentEntitySystem } from "../../react-native-game-engine";
import { Physics, CreateBox, MoveBox, CleanBoxes } from "./systems";
import { Box } from "./renderers";
import Matter from "matter-js";

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

export default class RigidBodies extends Component {
  constructor() {
    super();
  }

  render() {
    const { width, height } = Dimensions.get("window");
    const boxSize = Math.trunc(Math.max(width, height) * 0.075);

    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    const body = Matter.Bodies.rectangle(width / 2, -1000, boxSize, boxSize, { frictionAir: 0.021 });
    const floor = Matter.Bodies.rectangle(width / 2, height - boxSize / 2, width, boxSize, { isStatic: true });
    const constraint = Matter.Constraint.create({
      label: "Drag Constraint",
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: 0 },
      length: 0.01,
      stiffness: 0.1,
      angularStiffness: 1
    });

    Matter.World.add(world, [body, floor]);
    Matter.World.addConstraint(world, constraint);

    return (
      <ComponentEntitySystem
        systems={[Physics, CreateBox, MoveBox, CleanBoxes]}
        entities={{
          engine: { engine: engine },
          world: { world: world },
          constraint: { constraint: constraint },
          box: { body: body, size: [boxSize, boxSize], color: "pink", renderable: Box },
          floor: { body: floor, size: [width, boxSize], color: "#86E9BE", renderable: Box }
        }}
      >

        <StatusBar hidden={true} />

      </ComponentEntitySystem>
    );
  }
}
