import { TIMER_CONFIG } from '../timer/timerConfig.js';
import { createInitialState, withStatePatch } from './appState.js';
import { SCREENS } from './screens.js';

const STOPPED_SCREENS = new Set([SCREENS.setup, SCREENS.success, SCREENS.alarm]);

export function restoreGameState(savedState) {
  if (!savedState) return createInitialState();
  if (!savedState.timerEndsAt || STOPPED_SCREENS.has(savedState.screen)) {
    return savedState;
  }

  const remainingSeconds = getRemainingSeconds(savedState.timerEndsAt);

  if (remainingSeconds <= 0) {
    return withStatePatch(savedState, {
      screen: SCREENS.alarm,
      remainingSeconds: 0,
      isTimerRunning: false,
      hasTimerStarted: true,
    });
  }

  return withStatePatch(savedState, {
    remainingSeconds,
    isTimerRunning: savedState.hasTimerStarted,
  });
}

function getRemainingSeconds(timerEndsAt) {
  const millisecondsLeft = timerEndsAt - Date.now();
  const secondsLeft = Math.ceil(millisecondsLeft / 1000);
  return Math.min(TIMER_CONFIG.durationSeconds, Math.max(0, secondsLeft));
}
