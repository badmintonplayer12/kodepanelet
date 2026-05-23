import { SCREENS } from '../app/screens.js';
import { RESULT_TYPES } from '../core/resultTypes.js';
import { createHiddenResetButton } from './components/createHiddenResetButton.js';
import { clearElement } from './dom.js';
import { renderAlarmScreen } from './screens/renderAlarmScreen.js';
import { renderCodePanelScreen } from './screens/renderCodePanelScreen.js';
import { renderResultScreen } from './screens/renderResultScreen.js';
import { renderSetupScreen } from './screens/renderSetupScreen.js';

export function renderApp(appRoot, state, actions) {
  clearElement(appRoot);
  appRoot.append(createScreenWithHiddenReset(appRoot, state, actions));
}

function createScreenWithHiddenReset(appRoot, state, actions) {
  const screen = createScreen(appRoot, state, actions);
  screen.append(createHiddenResetButton(actions.resetGame));
  return screen;
}

function createScreen(appRoot, state, actions) {
  if (state.screen === SCREENS.setup) {
    return renderSetupScreen({
      appRoot,
      canInstallApp: state.canInstallApp,
      onCodeSet: actions.setCode,
      onInstallApp: actions.installApp,
    });
  }

  if (state.screen === SCREENS.codePanel) {
    return renderCodePanelScreen({
      enteredCode: state.enteredCode,
      remainingSeconds: state.remainingSeconds,
      onKeyPress: actions.pressKey,
    });
  }

  if (state.screen === SCREENS.alarm) {
    return renderAlarmScreen();
  }

  const resultType = state.screen === SCREENS.success ? RESULT_TYPES.success : RESULT_TYPES.error;
  return renderResultScreen({ resultType, onResetAttempt: actions.resetAttempt });
}
