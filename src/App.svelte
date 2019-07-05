<script>
  import { onMount } from 'svelte';
  import { createPrograms, getGLRenderingContext, drawScene, store, startRotation} from './webgl';
  let started;
  let canvasElement;
  onMount(async() => {
    const gl = getGLRenderingContext(canvasElement);
    const program = createPrograms(gl);
    const draw = drawScene(gl, program);

    store.dispatch(startRotation()).subscribe(draw);
  })
</script>

<style>
	h1 {
		color: purple;
	}
</style>


<canvas width="800" height="800" bind:this={canvasElement}></canvas>
