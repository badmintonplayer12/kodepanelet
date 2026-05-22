import { playKeyTone, playResultTone } from '../audio/soundPlayer.js';
import { isCorrectCode } from '../core/codeValidator.js';
import { createInitialState, withStatePatch } from './appState.js';
import { renderApp } from '../ui/renderApp.js';
import { SCREENS } from './screens.js';

export function createApp(appRoot) {
  let state = createInitialState();

  function update(patch) {
    state = withStatePatch(state, patch);
    renderApp(appRoot, state, actions);
  }

  const actions = {
    setCode(code) {
      update({ correctCode: code, enteredCode: '', screen: SCREENS.codePanel });
    },

    pressKey(key) {
      handleKeyPress(key);
    },

    resetAttempt() {
      update({ enteredCode: '', screen: SCREENS.codePanel });
    },
  };

  function handleKeyPress(key) {
    playKeyTone();
    if (key === 'clear') return update({ enteredCode: '' });
    if (key === 'enter') return submitCode();
    update({ enteredCode: `${state.enteredCode}${key}` });
  }

  function submitCode() {
    const screen = isCorrectCode(state.enteredCode, state.correctCode) ? SCREENS.success : SCREENS.error;
    playResultTone(screen === SCREENS.success ? 'success' : 'error');
    update({ screen });
  }

  return {
    start() {
      renderApp(appRoot, state, actions);
    },
  };
}
