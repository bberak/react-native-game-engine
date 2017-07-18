import _ from "lodash";
import { Box } from "./renderers";
import Matter from "matter-js";

let boxIds = 0;

const distance = ([x1, y1], [x2, y2]) =>
	Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const Physics = (state, { touches }) => {
	let engineId = Object.keys(state).find(key => state[key].engine);
	let engine = state[engineId].engine;

	Matter.Engine.update(engine);

	return state;
};

const SpawnBox = (state,  { touches }) => {
	let worldId = Object.keys(state).find(key => state[key].world);
	let world = state[worldId].world;

	touches.filter(t => t.type === "press").forEach(t => {
	    const body = Matter.Bodies.rectangle(t.event.pageX, t.event.pageY, 50, 50, { frictionAir: 0.021 });
    	Matter.World.add(world, [body]);

		state[++boxIds] = {
			body: body,
			width: 50,
			height: 50,
			renderable: Box
		};
	});

	return state;
};

const MoveBox = (state, { touches }) => {
	return state;
};

const RemoveBox = (state, { touches }) => {
	return state;
};

export {
  Physics,
  SpawnBox,
  MoveBox,
  RemoveBox
};
