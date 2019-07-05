const fragShaderSrc = `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  varying vec4 v_color;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = v_color;
  }
`;

const vertextShaderSrc = `
  // an attribute will receive data from a buffer
  attribute vec4 a_position;
  attribute vec4 a_color;

  uniform mat4 u_matrix;

  varying vec4 v_color;

  // all shaders have a main function
  void main() {
 
    // gl_Position is a special variable a vertex shader
    // is responsible for setting

    gl_Position = u_matrix * a_position;

    // Pass the color to the fragment shader.
    v_color = a_color;
  }
`;

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  gl.deleteProgram(program);
}

export function getGLRenderingContext(
  canvas: HTMLCanvasElement,
): WebGLRenderingContext {
  return canvas.getContext("webgl");
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function resize(canvas: HTMLCanvasElement) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

export function createPrograms(gl: WebGLRenderingContext) {
  const vertextShader = createShader(gl, gl.VERTEX_SHADER, vertextShaderSrc);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
  const program = createProgram(gl, vertextShader, fragShader);
  return program;
}
