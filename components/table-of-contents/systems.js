import { Particle } from "./renderers";

let particleCount = 0;

const Particles = (state) => {
	Object.keys(state).filter(key => state[key].particleSystem).forEach(key => {
		let sys = state[key];
		state[++particleCount] = {
			position: sys.position,
			velocity: [Math.random() * 8, Math.random() * 2],
			mass: Math.random(),
			lifespan: 128,
			renderable: Particle
		}
	});

	return state;
};

const Gravity = (state) => {
	const gravity = [0, 0.1];

	Object.keys(state).filter(key => state[key].velocity).forEach(key => {
		let entity = state[key];
		let mass = entity.mass;
		let acc = [gravity[0] / mass, gravity[1] / mass];
		let vel = entity.velocity;

		entity.velocity = [vel[0] + acc[0], vel[1] + acc[1]]
	});

	return state;
};

const Wind = (state) => {
	return state;
};
  
const Motion = (state) => {
	Object.keys(state).filter(key => state[key].velocity).forEach(key => {
		let entity = state[key];
		let vel = entity.velocity;
		let pos = entity.position;

		entity.position = [pos[0] + vel[0], pos[1] + vel[1]]
	});

	return state;
};

const Degeneration = (state) => {
	Object.keys(state).filter(key => state[key].lifespan !== undefined).forEach(key => {
		let particle = state[key];
		particle.lifespan -= 2

		if (particle.lifespan <= 0)
			delete state[key];
	})

	return state;
};

export {
	Particles,
	Gravity,
	Wind,
	Motion,
	Degeneration
};
