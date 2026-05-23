import { playAlarmTone, playKeyTone, playResultTone, preloadAppSounds } from '../audio/soundPlayer.js';
import { isCorrectCode } from '../core/codeValidator.js';
import { createCountdownTimer } from '../timer/countdownTimer.js';
import { TIMER_CONFIG, TIMER_START_MODES } from '../timer/timerConfig.js';
import { createInitialState, withStatePatch } from './appState.js';
import { clearGameState, loadGameState, saveGameState } from './persistedGameState.js';
import { restoreGameState } from './restoreGameState.js';
import { renderApp } from '../ui/renderApp.js';
import { SCREENS } from './screens.js';

export function createApp(appRoot) {
  let state = restoreGameState(loadGameState());
  const timer = createCountdownTimer({
    durationSeconds: state.remainingSeconds,
    getRemainingSeconds: getClockBasedRemainingSeconds,
    onTick: handleTimerTick,
    onComplete: handleTimerComplete,
  });

  function update(patch) {
    state = withStatePatch(state, patch);
    saveGameState(state);
    renderApp(appRoot, state, actions);
  }

  const actions = {
    setCode(code) {
      resetTimerState();
      update({ correctCode: code, enteredCode: '', screen: SCREENS.codePanel });
      if (TIMER_CONFIG.startMode === TIMER_START_MODES.afterCodeSet) startTimer();
    },

    pressKey(key) {
      handleKeyPress(key);
    },

    resetAttempt() {
      update({ enteredCode: '', screen: SCREENS.codePanel });
    },

    resetGame() {
      timer.stop();
      clearGameState();
      state = createInitialState();
      renderApp(appRoot, state, actions);
    },
  };

  function handleKeyPress(key) {
    maybeStartTimer(TIMER_START_MODES.firstKeypress);
    playKeyTone();
    if (key === 'clear') return update({ enteredCode: '' });
    if (key === 'enter') return submitCode();
    update({ enteredCode: `${state.enteredCode}${key}` });
  }

  function submitCode() {
    const isSuccess = isCorrectCode(state.enteredCode, state.correctCode);
    const screen = isSuccess ? SCREENS.success : SCREENS.error;

    if (isSuccess) timer.stop();
    if (!isSuccess) maybeStartTimer(TIMER_START_MODES.firstWrongCode);

    playResultTone(isSuccess ? 'success' : 'error');
    update({ screen, isTimerRunning: !isSuccess && state.isTimerRunning });
  }

  function maybeStartTimer(startMode) {
    if (TIMER_CONFIG.startMode !== startMode || state.hasTimerStarted) return;
    startTimer();
  }

  function startTimer() {
    update({
      hasTimerStarted: true,
      isTimerRunning: true,
      timerEndsAt: Date.now() + state.remainingSeconds * 1000,
    });
    timer.start();
  }

  function resetTimerState() {
    timer.reset(TIMER_CONFIG.durationSeconds);
    state = withStatePatch(state, {
      remainingSeconds: TIMER_CONFIG.durationSeconds,
      isTimerRunning: false,
      hasTimerStarted: false,
      timerEndsAt: null,
    });
  }

  function getClockBasedRemainingSeconds() {
    if (!state.timerEndsAt) return state.remainingSeconds;
    return Math.ceil((state.timerEndsAt - Date.now()) / 1000);
  }

  function handleTimerTick(remainingSeconds) {
    update({ remainingSeconds });
  }

  function handleTimerComplete() {
    playAlarmTone();
    update({ screen: SCREENS.alarm, isTimerRunning: false });
  }

  return {
    start() {
      preloadAppSounds();
      if (state.isTimerRunning) timer.start();
      renderApp(appRoot, state, actions);
    },
  };
}
