import vertextShaderSrc from './shaders/f.vert';
import fragShaderSrc from './shaders/f.frag';

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 * @returns
 */
function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	if (!program) {
		throw new Error('Error creating program.');
	}
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}

	gl.deleteProgram(program);
}

/**
 *
 * @param {HTMLCanvasElement} canvas
 * @returns { WebGLRenderingContext | null}
 */
export function getGLRenderingContext(canvas) {
	return canvas.getContext('webgl');
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 * @returns
 */
function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	if (!shader) {
		throw new Error(`Error creation shader: ${type} - ${source}`);
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}

	gl.deleteShader(shader);
}

/**
 *
 * @param {HTMLCanvasElement} canvas
 */
function resize(canvas) {
	// Lookup the size the browser is displaying the canvas.
	const displayWidth = canvas.clientWidth;
	const displayHeight = canvas.clientHeight;

	// Check if the canvas is not the same size.
	if (canvas.width != displayWidth || canvas.height != displayHeight) {
		// Make the canvas the same size
		canvas.width = displayWidth;
		canvas.height = displayHeight;
	}
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @returns {WebGLProgram | undefined}
 */
export function createPrograms(gl) {
	const vertextShader = createShader(gl, gl.VERTEX_SHADER, vertextShaderSrc);
	const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
	if (!vertextShader || !fragShader) {
		return;
	}
	const program = createProgram(gl, vertextShader, fragShader);
	return program;
}
