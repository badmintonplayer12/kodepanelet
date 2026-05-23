import { TIMER_CONFIG } from '../timer/timerConfig.js';
import { SCREENS } from './screens.js';

export function createInitialState() {
  return {
    screen: SCREENS.setup,
    correctCode: '',
    enteredCode: '',
    remainingSeconds: TIMER_CONFIG.durationSeconds,
    isTimerRunning: false,
    hasTimerStarted: false,
  };
}

export function withStatePatch(state, patch) {
  return {
    ...state,
    ...patch,
  };
}
