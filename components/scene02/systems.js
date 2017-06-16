import _ from "lodash";
import { Worm } from "./renderers";

let wormCount = 0;

const Spawn = (state, touches) => {
	touches.filter(t => t.type === "start").forEach(t => {
		let worm = state[t.id];
		if (!worm) {
			state[t.id] = {
				position: [t.event.locationX, t.event.locationY],
				offset: [0, 0],
				renderable: Worm
			};
		} else {
			worm.offset = [
				t.event.locationX - worm.position[0],
				t.event.locationY - worm.position[1]
			];
		}
	});

	return state;
};

const Movement = (state, touches) => {
	touches.filter(t => t.type === "move").forEach(t => {
		let worm = state[t.id];
		if (worm) {
			worm.position = [
				t.event.locationX - worm.offset[0],
				t.event.locationY - worm.offset[1]
			];
		}
	});

	return state;
};

export { Touch, Spawn, Movement };
