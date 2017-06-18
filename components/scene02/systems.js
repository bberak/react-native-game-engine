import _ from "lodash";
import { Worm } from "./renderers";

let wormIds = 0;

const SpawnWorm = (state, touches) => {
	touches.filter(t => t.type === "press").forEach(t => {
		if (_.size(state) < 5) {
			state[++wormIds] = {
				position: [t.event.pageX, t.event.pageY],
				offset: [0, 0],
				renderable: Worm
			};
		}
	});

	return state;
};

const AssignFingerToWorm = (state, touches) => {
	let worms = Object.keys(state)
		.filter(key => !state[key].touchId)
		.map(key => ({ id: key, components: state[key] }));

	let startTouches = touches.filter(x => x.type === "start");

	if (worms.length === 0 || startTouches.length === 0) return state;

	let distancesToFingers = [];

	//-- Calculate distance between each finger and worm.
	startTouches.forEach((t, i) => {
		let touchOrigin = [t.event.pageX, t.event.pageY];
		distancesToFingers[i] = worms.map(w =>
			distance(touchOrigin, w.components.position)
		);
	});

	let allCells = [];

	//-- Push all finger-to-worm coordinates into a flat list
	for (let i = 0; i < startTouches.length; i++) {
		for (let j = 0; j < worms.length; j++) {
			allCells.push([i, j]);
		}
	}

	let generateCombinations = (numWorms, availableCells) => {
		if (availableCells.length === 0) return [];

		let first = availableCells[0];
		let firstInNextRow = first + numWorms - first % numWorms;
		let siblings = availableCells.filter(
			x => x >= first && x < firstInNextRow
		);

		return _.flatten(
			siblings.map(parent => {
				var children = generateCombinations(
					numWorms,
					availableCells.filter(
						x =>
							x >= firstInNextRow &&
							x % numWorms !== parent % numWorms
					)
				);

				if (children.length > 0) return children.map(c => [parent].concat(c));
				else return [[parent]];
			})
		);
	};

	//-- Generate all valid finger to worm combinations, taking into account
	//-- a 1-to-1 relationship between finger and worm
	let combinations = generateCombinations(
		worms.length,
		_.range(allCells.length)
	);

	//-- Find the most efficient combination - the combination with the shortest
	//-- total summed distance between the various fingers and their respective worms.
	let bestCombo = _.minBy(
		combinations.map(combo => {
			let sum = _.sum(
				combo.map(index => {
					let cell = allCells[index];
					return distancesToFingers[cell[0]][cell[1]];
				})
			);

			return { combo, sum };
		}),
		"sum"
	).combo;

	//-- Take the best combo, and assign each finger/touch to the appropriate worm.
	//-- Also update the worm's positional offset based on the touch coordinates.
	bestCombo.forEach(index => {
		let cell = allCells[index];
		let touch = startTouches[cell[0]];
		let worm = worms[cell[1]];

		worm.components.touchId = touch.id;
		worm.components.offset = [
	        touch.event.pageX - worm.components.position[0],
	        touch.event.pageY - worm.components.position[1]
	      ];

	})

	return state;
};

const MoveWorm = (state, touches) => {
	touches.filter(t => t.type === "move").forEach(t => {
		let wormId = Object.keys(state).find(key => state[key].touchId === t.id);
		let worm = state[wormId];
		if (worm) {
			worm.position = [
				t.event.pageX - worm.offset[0],
				t.event.pageY - worm.offset[1]
			];
		}
	});

	return state;
};

const ReleaseFingerFromWorm = (state, touches) => {
	touches.filter(t => t.type === "end").forEach(t => {
		Object.keys(state)
			.filter(key => state[key].touchId === t.id)
			.forEach(key => delete state[key]["touchId"]);
	});

	return state;
};

const distance = ([x1, y1], [x2, y2]) =>
	Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const RemoveWorm = (state, touches) => {
	touches.filter(t => t.type === "long-press").forEach(t => {
		let touchOrigin = [t.event.pageX, t.event.pageY];
		let closestWorm = _.sortBy(
			Object.keys(state)
				.map(key => ({
					id: key,
					distance: distance(state[key].position, touchOrigin)
				}))
				.filter(x => x.distance < 60),
			["distance"]
		)[0];

		if (closestWorm) delete state[closestWorm.id];
	});

	return state;
};

export {
	SpawnWorm,
	AssignFingerToWorm,
	MoveWorm,
	ReleaseFingerFromWorm,
	RemoveWorm
};
