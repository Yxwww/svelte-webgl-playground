<script>
  import {createEventDispatcher, onMount, onDestroy} from 'svelte';
  const dispatch = createEventDispatcher();
  let value = 0;
  function handleClick(e) {
    dispatch('value', {value})
  }

  let dragging = false;
  let element;
  function mousedown() {
    dragging = true;
  }
  function onmousemove(e) {
    if (!dragging) {
      return;
    }
    console.log(e.offsetX, e.offsetY);
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
</style>

<button bind:this={element} on:mousedown={mousedown}>Slider</button>
