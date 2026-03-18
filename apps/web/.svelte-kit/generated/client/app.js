export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16')
];

export const server_loads = [0,3,5];

export const dictionary = {
		"/(marketing)": [7,[2]],
		"/(public)/auth/log-in": [~15,[6]],
		"/(public)/auth/sign-up": [~16,[6]],
		"/(private)/(app)/dashboard": [9,[3,4]],
		"/(private)/onboarding": [~14,[3]],
		"/(private)/(app)/plans": [10,[3,4]],
		"/(private)/(app)/plans/new": [12,[3,4]],
		"/(private)/(app)/plans/[id]": [11,[3,4]],
		"/(private)/(app)/settings": [13,[3,4]],
		"/(private)/(app)/(admin)/supplements": [8,[3,4,5]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';