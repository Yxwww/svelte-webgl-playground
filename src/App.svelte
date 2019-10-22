<script>
  import Slider from './components/Slider.svelte';
  import { onMount } from 'svelte';
  import { createPrograms, getGLRenderingContext, drawScene, store, perspective} from './webgl';
  import { writable, get, derived } from 'svelte/store';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  function rand() {
    return Math.random();
  }
  let started;
  let canvasElement;
  const DEFAULT_ROTATION = [0, 0, 0];
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
    const projection = perspective(60 * Math.PI/180, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 2000);
    const draw = drawScene(gl, program, projection);
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

<Slider on:value={handleSlideValueChange} />
<button on:click={handleClick}>rotation</button>
<button on:click={incScale}>scale</button>
<button on:click={reset}>reset</button>
<pre>{JSON.stringify($cameraStore, null, 2)}</pre>
<canvas width="800" height="800" bind:this={canvasElement}></canvas>
