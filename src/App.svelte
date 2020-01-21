<script>
  import { onMount } from 'svelte';
  import { createPrograms, getGLRenderingContext, drawScene, store, perspective, inverse, m4, translate, degToRad} from './webgl';
  import { writable, get, derived } from 'svelte/store';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  function rand() {
    return Math.random();
  }
  let started;
  let canvasElement;
  const DEFAULT_ROTATION = [degToRad(190), degToRad(40), degToRad(320)] //[0, 0, 0];
  const DEFAULT_TRANSLATION = [-150, 0, -360]
  const SCALE_VEC = [1, 1, 1]

  const rotation = tweened(DEFAULT_ROTATION, {easing: cubicOut, duration: 2000});
  const translation = tweened(DEFAULT_TRANSLATION, {easing: cubicOut});
  const scaleVec = tweened(SCALE_VEC, {easing: cubicOut, duration: 1000});
  const cameraStore = derived([rotation, translation, scaleVec], ([$rotation, $transition, $scaleVec]) => ({
    rotation: $rotation, translation: $transition, scaleVec: $scaleVec
  }))

  onMount(async() => {
    const gl = getGLRenderingContext(canvasElement);
    const program = createPrograms(gl);
    const projectionMatrix = perspective(60 * Math.PI/180, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 2000);
    const radius = 200;
    var cameraMatrix = m4.yRotation(30);
    cameraMatrix = translate(cameraMatrix, 0, 0, radius * 1.5);
    const viewMatrix = inverse(cameraMatrix);
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    const draw = drawScene(gl, program, viewProjectionMatrix);
    cameraStore.subscribe(({rotation, translation, scaleVec}) => {
      draw(rotation, translation, scaleVec);
    })
  })

  function handleClick() {
    rotation.update(([x, y, z]) => [x+rand(), y+rand(), z+rand()])
  }
  function incScale() {
    scaleVec.update(([x, y, z]) => [x+rand(), y+rand(), z+rand()])
  }
  function reset() {
    rotation.set(DEFAULT_ROTATION)
    translation.set(DEFAULT_TRANSLATION)
    scaleVec.set(SCALE_VEC)
  }
  function handleSlideValueChange(e) {
  }
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<button on:click={handleClick}>rotation</button>
<button on:click={incScale}>scale</button>
<button on:click={reset}>reset</button>
<pre>{JSON.stringify($cameraStore, null, 2)}</pre>
<canvas width="800" height="800" bind:this={canvasElement}></canvas>
