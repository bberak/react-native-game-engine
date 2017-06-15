import _ from "lodash";
import { Worm } from "./renderers";

let wormCount = 0;

const Touch = (state, gestures) => {

	let touches = _.uniqBy(
		_.flatten(gestures.map(g => g[0].nativeEvent.touches)),
		"identifier"
	);

	let touchIds = touches.map(t => t.identifier)

	let worms = Object.keys(state)
		.filter(id => state[id].touchId)
		.map(id =>  ({id: id, components: state[id]}));

	let wormsToBeRemoved = worms.filter(w => touchIds.includes(w.components.touchId) === false);

	let wormsToBeUpdated = worms.filter(w => touchIds.includes(w.components.touchId));

	let touchesThatNeedWorms = touches.filter(t => worms.map(w => w.components.touchId).includes(t.identifier) === false);

	//wormsToBeRemoved.forEach(w => delete state[w.id])

	wormsToBeUpdated.forEach(w => {
		let touch = touches.find(t => t.identifier === w.components.touchId)
		w.components.position = [touch.locationX, touch.locationY - 80]
	});

	touchesThatNeedWorms.forEach(t => {
		let entityId = "worm-" + wormCount++
		console.log(entityId)
		state[entityId] = { position: [t.locationX, t.locationY - 80], touchId: t.identifier, renderable: Worm }
	})

	return state;
};

export { Touch };
