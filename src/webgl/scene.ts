import {
  projection,
  translate,
  xRotate,
  yRotate,
  zRotate,
  scale,
  makeZToVMatrix,
  m4,
} from "./math";
import { geometry, color } from "./data/f";
import { store } from "./store";
import { camera } from "./store/selectors";
import { startRotation } from "./store/actions";

function setColors(gl: WebGLRenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(color), gl.STATIC_DRAW);
}

function setGeometry(gl: WebGLRenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);
}

export function drawScene(gl: WebGLRenderingContext, program: WebGLProgram) {
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorUniformLocation = gl.getUniformLocation(program, "u_color");
  const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");
  const colorLocation = gl.getAttribLocation(program, "a_color");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  // Create buffer for colors
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  return function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program);

    const state = store.getState();
    const { rotation, translation, scaleVec } = camera(state);

    gl.uniform4fv(colorUniformLocation, [0.5, 0.5, 0.5, 1]);

    let matrix = makeZToVMatrix(1);
    matrix = m4.multiply(
      matrix,
      projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400),
    );
    matrix = translate(matrix, translation[0], translation[1], translation[2]);
    matrix = xRotate(matrix, rotation[0]);
    matrix = yRotate(matrix, rotation[1]);
    matrix = zRotate(matrix, rotation[2]);
    matrix = scale(matrix, scaleVec[0], scaleVec[1], scaleVec[2]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

    // send color data
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration
    var type = gl.UNSIGNED_BYTE; // the data is 8bit unsigned values
    var normalize = true; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      colorLocation,
      size,
      type,
      normalize,
      stride,
      offset,
    );

    // send position data
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset,
    );

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 16 * 6;
    gl.drawArrays(primitiveType, offset, count);
  };
}
