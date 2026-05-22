import { SCREENS } from './screens.js';

export function createInitialState() {
  return {
    screen: SCREENS.setup,
    correctCode: '',
    enteredCode: '',
  };
}

export function withStatePatch(state, patch) {
  return {
    ...state,
    ...patch,
  };
}
