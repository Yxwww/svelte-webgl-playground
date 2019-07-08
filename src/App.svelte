<script>
  import { onMount } from 'svelte';
  import { createPrograms, getGLRenderingContext, drawScene, store, startRotation} from './webgl';
  import { writable, get, derived } from 'svelte/store';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  let started;
  let canvasElement;
  const rotation = writable([0, 0, 0])
  const tweenedRotation = tweened(get(rotation), {easing: cubicOut, duration: 2000})
  onMount(async() => {
    const gl = getGLRenderingContext(canvasElement);
    const program = createPrograms(gl);
    const draw = drawScene(gl, program);
    tweenedRotation.subscribe(v => {
      draw(v);
    })
  })
  function handleClick() {
    tweenedRotation.update(([x, y, z]) => [x, y, z+1])
  }
  
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>{JSON.stringify($tweenedRotation)}</h1>
<button on:click={handleClick}>+</button>
<canvas width="800" height="800" bind:this={canvasElement}></canvas>
