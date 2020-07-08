<script charset="utf-8">
  import {createEntity} from './utils/entity.ts'
  const entity = createEntity({
    rotation: [0,0,0],
    translation: [0, 0, 0],
    scaleVec: [1, 1, 1],
  })
  function updateRotation() {
    entity.update({rotation: [Math.random(), Math.random(), Math.random()]})
  }

</script>

<pre>{JSON.stringify($entity, null, 2)}</pre>
<button on:click={updateRotation}>Update Rotation</button>
