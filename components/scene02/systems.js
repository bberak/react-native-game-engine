const Control = (state, gestures) => {

	if (gestures.length === 0)
		return state;

	let entities = Object.keys(state)
		.filter(id => state[id].position)
		.map(id => state[id]);

	let vx = 0, vy = 0;

    for (let i = 0, len = gestures.length; i < len; i++) {
      vx += gestures[i][1].vx;
      vy += gestures[i][1].vy;
    }

    entities.forEach(x => x.position = [x.position[0] + vx * 20, x.position[1] + vy * 20])

	return state;
};

export { Control };
