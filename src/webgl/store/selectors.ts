import { createSelector, Selector } from "reselect";
import prop from "ramda/es/prop";
import { AppState, CameraState } from ".";

export const camera: Selector<AppState, CameraState> = prop("camera");
export const rotation = createSelector(
  camera,
  prop("rotation"),
);
export const scaleVec = createSelector(
  camera,
  prop("scaleVec"),
);
export const translation = createSelector(
  camera,
  prop("translation"),
);
