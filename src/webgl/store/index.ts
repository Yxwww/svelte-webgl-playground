import { createStore, Action, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const initial = {
  rotation: [1, 0, 1],
  translation: [50, 50, 50],
  scaleVec: [0.51, 0.86, 1],
};
export type CameraState = typeof initial;

export const UPDATE_CAMERA = "camera/update_state";

export interface UpdateAction extends Action {
  type: typeof UPDATE_CAMERA;
  state: typeof initial;
}

function camera(state = initial, action: UpdateAction) {
  switch (action.type) {
    case UPDATE_CAMERA: {
      return {
        ...state,
        ...action.state,
      };
    }
    default: {
      return state;
    }
  }
}

export const store = createStore(
  combineReducers({
    camera,
  }),
  applyMiddleware(thunk),
);

export interface AppState {
  camera: CameraState;
}
