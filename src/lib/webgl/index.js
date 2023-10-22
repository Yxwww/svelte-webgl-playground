export { createPrograms, getGLRenderingContext } from './program';
export { createScene } from './scene';
export * from './math';

/**
 *
 * @returns {HTMLCanvasElement}
 */
export function createCanvas() {
	const canvas = document.createElement('canvas');
	canvas.width = 800;
	canvas.height = 800;
	canvas.style.border = '1px solid grey';

	return canvas;
}

// let canvas = createCanvas(); // Store the element to re-render on print.js changes
// document.body.appendChild(canvas);
