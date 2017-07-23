
const COLORS = ["#FFF"];
const GRAVITY = [-0.035, 0.05];

const random = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
};

const SpawnParticles = (state,  { screen }) => {
	let flowRate = Math.random();
	if (flowRate > 0.2) return state;

	Object.keys(state).filter(key => state[key].particles).forEach(key => {
		let sys = state[key];
		sys.particles.push({
			position: [random(screen.width / 2, screen.width * 1.5), -50],
			velocity: GRAVITY,
			mass: random(),
			lifespan: 148,
			size: random(0, 10),
			color: COLORS[Math.trunc(random(0, COLORS.length))]
		});
	});

	return state;
};

const Gravity = (state) => {
	Object.keys(state).filter(key => state[key].particles).forEach(key => {
		let sys = state[key];
		sys.particles.forEach(p => {
			let mass = p.mass;
			let acc = [GRAVITY[0] / mass, GRAVITY[1] / mass];
			let vel = p.velocity;

			p.velocity = [vel[0] + acc[0], vel[1] + acc[1]]
		});
	});

	return state;
};

const Wind = (state) => {
	return state;
};

const Sprinkles = (state, { events }) => {
	let sysId = Object.keys(state).find(key => state[key].particles);
	let sys = state[sysId];
	if (sys) {
		events.filter(e => e.type === "back-pressed").forEach(e => {
			for (let i = 0; i < 8; i++) {
				sys.particles.push({
					position: [e.x, e.y],
					velocity: [random(-2, 2), random(-4, 1)],
					mass: random(),
					lifespan: 148,
					size: random(0, 10),
					color: COLORS[Math.trunc(random(0, COLORS.length))]
				});
			}
		})
	}

	return state;
}
  
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

export { SpawnParticles, Gravity, Wind, Sprinkles, Motion, DegenerateParticles }
