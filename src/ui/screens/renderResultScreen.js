import { RESULT_TYPES } from '../../core/resultTypes.js';
import { createElement } from '../dom.js';
import { createLockDisplay } from '../components/createLockDisplay.js';
import { createScreenFrame } from '../components/createScreenFrame.js';

export function renderResultScreen({ resultType, onReset }) {
  const isSuccess = resultType === RESULT_TYPES.success;
  const title = isSuccess ? 'Låsen er åpen!' : 'Feil kode!';
  const text = isSuccess ? 'Agentene klarte oppdraget.' : 'Låsen er fortsatt stengt.';
  const frame = createScreenFrame(title, text);
  const resetButton = createElement('button', { className: 'button', text: 'Prøv igjen' });

  resetButton.type = 'button';
  resetButton.addEventListener('click', onReset);

  frame.classList.add(`screen-frame--${resultType}`);
  frame.append(createLockDisplay(resultType), resetButton);
  return frame;
}
