import vertextShaderSrc from './shaders/f.vert'
import fragShaderSrc from './shaders/f.frag'

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  gl.deleteProgram(program)
}

export function getGLRenderingContext(
  canvas: HTMLCanvasElement
): WebGLRenderingContext {
  return canvas.getContext('webgl')
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

function resize(canvas: HTMLCanvasElement) {
  // Lookup the size the browser is displaying the canvas.
  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth
    canvas.height = displayHeight
  }
}

export function createPrograms(gl: WebGLRenderingContext) {
  const vertextShader = createShader(gl, gl.VERTEX_SHADER, vertextShaderSrc)
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc)
  const program = createProgram(gl, vertextShader, fragShader)
  return program
}
