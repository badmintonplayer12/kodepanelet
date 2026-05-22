import { RESULT_TYPES } from '../../core/resultTypes.js';
import { createElement } from '../dom.js';
import { createLockDisplay } from '../components/createLockDisplay.js';
import { createScreenFrame } from '../components/createScreenFrame.js';

export function renderResultScreen({ resultType, onResetAttempt, onResetGame }) {
  const isSuccess = resultType === RESULT_TYPES.success;
  const title = isSuccess ? 'Låsen er åpen!' : 'Feil kode!';
  const text = isSuccess ? 'Agentene klarte oppdraget.' : 'Låsen er fortsatt stengt.';
  const frame = createScreenFrame(title, text);
  const resetButton = createResetButton(isSuccess, onResetAttempt, onResetGame);

  frame.classList.add(`screen-frame--${resultType}`);
  frame.append(createLockDisplay(resultType), resetButton);
  return frame;
}

function createResetButton(isSuccess, onResetAttempt, onResetGame) {
  const className = isSuccess ? 'button button--hidden-reset' : 'button';
  const text = isSuccess ? 'Tilbake til kodevalg' : 'Prøv igjen';
  const action = isSuccess ? onResetGame : onResetAttempt;
  const button = createElement('button', { className, text });

  button.type = 'button';
  button.addEventListener('click', action);
  return button;
}
