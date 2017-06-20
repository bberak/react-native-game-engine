
const SpawnParticles = (state) => {
	Object.keys(state).filter(key => state[key].particles).forEach(key => {
		let sys = state[key];
		sys.particles = sys.particles.concat([{
			position: sys.origin,
			velocity: [Math.random() * 8, Math.random() * 1],
			mass: Math.random(),
			lifespan: 128
		}]);
	});

	return state;
};

const Gravity = (state) => {
	const gravity = [0, 0.05];

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
