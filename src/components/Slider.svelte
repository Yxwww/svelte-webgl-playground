<script>
  import {createEventDispatcher, onMount, onDestroy} from 'svelte';
  import clipping from 'wyx-utils/src/number/clipping'
  const dispatch = createEventDispatcher();
  let value = 0;

  let dragging = false;
  const currentPos = {
    x: 0,
    y: 0
  }
  let element, container;
  function mousedown(e) {
    dragging = true;
  }
  function onmousemove(e) {
    if (!dragging) {
      return;
    }
    const {pageX} = e;
    currentPos.x = clipping(0, 200, pageX);
    dispatch('value', {value: currentPos.x / 200})

    element.style.left = `${currentPos.x}px`;
    element.style.top = `${currentPos.y}px`;
  }

  function onmouseup(e) {
    if (!dragging) {
      return;
    }
    dragging = false;
  }
  onMount(() => {
    document.body.addEventListener('mousemove', onmousemove);
    document.body.addEventListener('mouseup', onmouseup)
  })
  onDestroy(() => {
    document.body.removeEventListener('mousemove', onmousemove)
    document.body.removeEventListener('mouseup', onmouseup)
  });
</script>

<style>
  button {
    position: absolute;
  }
</style>

<div>
  <div bind:this={container} style="position: relative; width: 200px; border: 1px solid black; margin: 20px 0;">
    <button bind:this={element} on:mousedown={mousedown}>Slider</button>
  </div>
</div>
