
const COLORS = ["#EB005A", "#8DE986", "#66E6B2", "#66BCB2"];

const SpawnParticles = (state,  { screen }) => {
	let flowRate = Math.random();
	if (flowRate > 0.2) return state;

	Object.keys(state).filter(key => state[key].particles).forEach(key => {
		let sys = state[key];
		sys.particles.push({
			position: [Math.random() * screen.width, sys.origin[1]],
			velocity: [0, Math.random() * 1],
			mass: Math.random(),
			lifespan: 148,
			size: Math.random() * 10,
			color: COLORS[Math.trunc(Math.random() * (COLORS.length -1))]
		});
	});

	return state;
};

const gravity = [0, 0.05];

const Gravity = (state) => {
	Object.keys(state).filter(key => state[key].particles).forEach(key => {
		let sys = state[key];
		sys.particles.forEach(p => {
			let mass = p.mass;
			let acc = [gravity[0] / mass, gravity[1] / mass];
			let vel = p.velocity;

			p.velocity = [vel[0] + acc[0], vel[1] + acc[1]]
		});
	});

	return state;
};

const Wind = (state) => {
	return state;
};
  
const Motion = (state) => {
	Object.keys(state).filter(key => state[key].particles).forEach(key => {
		let sys = state[key];
		sys.particles.forEach(p => {
			let vel = p.velocity;
			let pos = p.position;

			p.position = [pos[0] + vel[0], pos[1] + vel[1]]
		})
	});

	return state;
};

const DegenerateParticles = (state) => {
	Object.keys(state).filter(key => state[key].particles).forEach(key => {
		let sys = state[key];
		sys.particles = sys.particles.filter(p => p.lifespan > 0);
		sys.particles.forEach(p => p.lifespan--);
	})

	return state;
};

export { SpawnParticles, Gravity, Wind, Motion, DegenerateParticles }
