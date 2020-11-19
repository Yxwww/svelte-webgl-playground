<script lang="ts">
  import { onMount } from 'svelte'
  import {
    createPrograms,
    getGLRenderingContext,
    createScene,
    perspective,
    inverse,
    m4,
    translate,
    degToRad,
} from './webgl'
  import { derived } from 'svelte/store'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  function rand() {
    return Math.random()
  }
  let canvasElement
  let container
  let drag = false
  let dragState = {
    start: [0, 0],
  }
  const DEFAULT_ROTATION = [degToRad(190), degToRad(40), degToRad(320)] //[0, 0, 0];
  const DEFAULT_TRANSLATION = [-150, 0, -360]
  const SCALE_VEC = [1, 1, 1]

  const rotation = tweened(DEFAULT_ROTATION, { easing: cubicOut, duration: 2000 })
  const translation = tweened(DEFAULT_TRANSLATION, { easing: cubicOut })
  const scaleVec = tweened(SCALE_VEC, { easing: cubicOut, duration: 1000 })
  const cameraStore = derived(
    [rotation, translation, scaleVec],
    ([$rotation, $transition, $scaleVec]) => ({
      rotation: $rotation,
      translation: $transition,
      scaleVec: $scaleVec,
    })
  )

  function clicked(e) {
    console.log('clicked', e)
  }
  function dragging(e) {
    console.log('dragging', e.vecFromStart)
  }
  function mouseup(e) {
    if (!drag) {
      clicked(e)
    }
    drag = false
    container.removeEventListener('mouseup', mouseup)
    container.removeEventListener('mousemove', mousemove)
  }
  function mousemove(e) {
    if (!drag) {
      drag = true
    }
    dragging({ vecFromStart: subVec2(toXy(e), dragState.start) })
  }
  function mousedown(e) {
    dragState.start = toXy(e)
    container.addEventListener('mouseup', mouseup)
    container.addEventListener('mousemove', mousemove)
  }

  onMount(async () => {
    container.addEventListener('mousedown', mousedown)
    const gl = getGLRenderingContext(canvasElement)
    const program = createPrograms(gl)
    if (!program) {
      alert('Error creating program')
      return
    }
    const projectionMatrix = perspective(
      (60 * Math.PI) / 180,
      gl.canvas.clientWidth / gl.canvas.clientHeight,
      1,
      2000
    )
    const radius = 200
    const draw = createScene(gl, program)
    cameraStore.subscribe(({ rotation, translation, scaleVec }) => {
      const rotationMatrix = m4.multiply(
        m4.multiply(
          m4.multiply(m4.xRotation(rotation[0]), m4.yRotation(rotation[1])),
          m4.zRotation(rotation[2])
        ),
        m4.scaling(...scaleVec)
      )
      var cameraMatrix = translate(rotationMatrix, 0, 0, radius * 1.5)
      const viewMatrix = inverse(cameraMatrix)
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)
      draw(viewProjectionMatrix)
    })
  })

  function subVec2([x1, y1], [x2, y2]) {
    return [x1 - x2, y1 - y2]
  }
  function toXy(e) {
    return [e.pageX, e.pageY]
  }

  function handleClick() {
    rotation.update(([x, y, z]) => [x + rand(), y + rand(), z + rand()])
  }
  function incScale() {
    scaleVec.update(([x, y, z]) => [x + rand(), y + rand(), z + rand()])
  }
  function reset() {
    rotation.set(DEFAULT_ROTATION)
    translation.set(DEFAULT_TRANSLATION)
    scaleVec.set(SCALE_VEC)
  }
  function radiusChanged(e) {
    rotation.update(([x, y, z]) => [x + rand(), e.srcElement.value, z + rand()])
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

<input type="number" on:change={radiusChanged} min="0" max="180" value="30">

<div>
<pre>{JSON.stringify($cameraStore, null, 2)}</pre>
</div>
<div bind:this={container}>
  <canvas width="800" height="800" bind:this={canvasElement}></canvas>
</div>
