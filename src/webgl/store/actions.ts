import { interval } from "rxjs";
import { tap } from "rxjs/operators";
import { CameraState, UPDATE_CAMERA, AppState, UpdateAction } from "./index";
// import { ThunkAction } from "redux-thunk";
import { toRadians, toDegree } from "../math";
import { rotation } from "./selectors";

export function updateCamera(state: Partial<CameraState>) {
  return {
    type: UPDATE_CAMERA,
    state,
  };
}

const TARGET_FPS = 30;
export function startRotation(): any {
  return (dispatch: any, getState: any) => {
    return interval(1000 / TARGET_FPS).pipe(
      tap(_ => {
        const currentRotation = [...rotation(getState())];
        const newYaw = currentRotation[1] + 0.1;
        currentRotation[1] = newYaw;
        // console.log(currentRotation);
        dispatch(
          updateCamera({
            rotation: currentRotation,
          }),
        );
      }),
    );
  };
}
