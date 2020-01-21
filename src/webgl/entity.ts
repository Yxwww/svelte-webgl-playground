import { tweened } from 'svelte/motion'
import { writable, get } from 'svelte/store'
import map from 'ramda/es/map'

export function createPointsViewEntityPlus({
  opacity,
  color,
  size,
  id,
  __class__,
}: any) {
  const staticStates = { id, __class__ }
  const writableStates = {
    opacity: writable(opacity),
  }
  const tweenedStates = {
    color: tweened(color),
    size: tweened(size),
  }
  return {
    staticStates,
    storeStates: {
      ...tweenedStates,
      ...writableStates,
    },
    dirtyState: {},
  }
}

export function updateEntity(entity, state) {
  return {}
}

const getAllStoreState = map(get)

export function getEntityState({ staticStates, tweenedStates }: any) {
  return {
    ...staticStates,
    ...getAllStoreState(tweenedStates),
  }
}

export function getDirtyState() {}
