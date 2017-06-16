import _ from "lodash";
import { Worm } from "./renderers";

let wormCount = 0;

const Spawn = (state, touches) => {
	touches.filter(t => t.type === "start").forEach(t => {
		let worm = state[t.id];
		if (!worm) {
			state[t.id] = {
				position: [t.event.pageX, t.event.pageY],
				offset: [0, 0],
				renderable: Worm,
				protected: true
			};
		} else {
			worm.offset = [
				t.event.pageX - worm.position[0],
				t.event.pageY - worm.position[1]
			];
		}
	});

	return state;
};

const Move = (state, touches) => {
	touches.filter(t => t.type === "move").forEach(t => {
		let worm = state[t.id];
		if (worm) {
			worm.position = [
				t.event.pageX - worm.offset[0],
				t.event.pageY - worm.offset[1]
			];
		}
	});

	return state;
};

const Release = (state, touches) => {
	touches.filter(t => t.type === "end").forEach(t => {
		let worm = state[t.id];
		if (worm) worm.protected = false;
	});

	return state;
};

const distance = ([x1, y1], [x2, y2]) =>
	Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const Remove = (state, touches) => {
	touches.filter(t => t.type === "long-press").forEach(t => {
		let touchOrigin = [t.event.pageX, t.event.pageY];
		let closest = Object.keys(state)
			.map(key => ({ id: key, components: state[key] }))
			.find(
				w =>
					distance(w.components.position, touchOrigin) < 30 &&
					w.components.protected === false
			);

		if (closest) delete state[closest.id];
	});

	return state;
};

export { Spawn, Move, Release, Remove };
