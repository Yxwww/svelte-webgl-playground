// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare module '*.glsl' {
	const value: string;
	export default value;
}
declare module '*.vert' {
	const value: string;
	export default value;
}
declare module '*.frag' {
	const value: string;
	export default value;
}

type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
