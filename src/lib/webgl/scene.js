import {
	// projection,
	translate
	// xRotate,
	// yRotate,
	// zRotate,
	// scale,
	// makeZToVMatrix,
	// m4,
	// perspective,
} from './math';
import { F_GEOMETRY, F_COLOR } from './data/f';

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram } program
 * @returns
 */
function createGLContext(gl, program) {
	return {
		/**
		 * @param {string} name
		 * @returns number
		 */
		getAttributePosition(name) {
			return gl.getAttribLocation(program, name);
		},
		/**
		 *
		 * @param {string} name
		 * @returns {WebGLUniformLocation | null}
		 */
		getUniformLocation(name) {
			return gl.getUniformLocation(program, name);
		},
		/**
		 * @param {any} array
		 */
		setBufferData(array) {
			gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
		},
		/**
		 * @returns {WebGLBuffer | null}
		 */
		createBuffer() {
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			return buffer;
		}
	};
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @returns
 */
export function createScene(gl, program) {
	const { getAttributePosition, setBufferData, createBuffer, getUniformLocation } = createGLContext(
		gl,
		program
	);

	const positionAttributeLocation = getAttributePosition('a_position');
	const colorUniformLocation = getUniformLocation('u_color');
	const matrixUniformLocation = getUniformLocation('u_matrix');
	const colorLocation = getAttributePosition('a_color');

	const positionBuffer = createBuffer();
	setBufferData(new Float32Array(F_GEOMETRY));

	// Create buffer for colors
	const colorBuffer = createBuffer();
	setBufferData(new Uint8Array(F_COLOR));

	return {
		/**
		 *
		 * @param {any} viewProjectionMatrix
		 */
		draw(viewProjectionMatrix) {
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.CULL_FACE);
			// Enable the depth buffer
			gl.enable(gl.DEPTH_TEST);
			gl.useProgram(program);
			gl.uniform4fv(colorUniformLocation, [0.5, 0.5, 0.5, 1]);
			// send color data
			gl.enableVertexAttribArray(colorLocation);
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			// Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
			var size = 3; // 3 components per iteration
			var type = gl.UNSIGNED_BYTE; // the data is 8bit unsigned values
			var normalize = true; // normalize the data (convert from 0-255 to 0-1)
			var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
			var offset = 0; // start at the beginning of the buffer
			gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

			// send position data
			gl.enableVertexAttribArray(positionAttributeLocation);
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

			// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
			var size = 3; // 3 components per iteration
			var type = gl.FLOAT; // the data is 32bit floats
			var normalize = false; // don't normalize the data
			var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
			var offset = 0; // start at the beginning of the buffer
			gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

			var primitiveType = gl.TRIANGLES;
			var offset = 0;
			var count = 16 * 6;
			gl.drawArrays(primitiveType, offset, count);
			const numFs = 5;
			const radius = 200;
			for (let ii = 0; ii < numFs; ++ii) {
				const angle = (ii * Math.PI * 2) / numFs;
				const x = Math.cos(angle) * radius;
				const y = Math.sin(angle) * radius;

				// starting with the view projection matrix
				// compute a matrix for the F
				const matrix = translate(viewProjectionMatrix, x, 0, y);

				// Set the matrix.
				gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

				// Draw the geometry.
				var primitiveType = gl.TRIANGLES;
				var offset = 0;
				var count = 16 * 6;
				gl.drawArrays(primitiveType, offset, count);
			}
		}
	};
}
