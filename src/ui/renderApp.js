import { SCREENS } from '../app/screens.js';
import { RESULT_TYPES } from '../core/resultTypes.js';
import { clearElement } from './dom.js';
import { renderCodePanelScreen } from './screens/renderCodePanelScreen.js';
import { renderResultScreen } from './screens/renderResultScreen.js';
import { renderSetupScreen } from './screens/renderSetupScreen.js';

export function renderApp(appRoot, state, actions) {
  clearElement(appRoot);
  appRoot.append(createScreen(appRoot, state, actions));
}

function createScreen(appRoot, state, actions) {
  if (state.screen === SCREENS.setup) {
    return renderSetupScreen({ appRoot, onCodeSet: actions.setCode });
  }

  if (state.screen === SCREENS.codePanel) {
    return renderCodePanelScreen({ enteredCode: state.enteredCode, onKeyPress: actions.pressKey });
  }

  const resultType = state.screen === SCREENS.success ? RESULT_TYPES.success : RESULT_TYPES.error;
  return renderResultScreen({
    resultType,
    onResetAttempt: actions.resetAttempt,
    onResetGame: actions.resetGame,
  });
}
