import { createElement } from '../dom.js';
import { createCountdownDisplay } from '../components/createCountdownDisplay.js';
import { createKeypad } from '../components/createKeypad.js';
import { createScreenFrame } from '../components/createScreenFrame.js';

export function renderCodePanelScreen({ enteredCode, remainingSeconds, onKeyPress }) {
  const frame = createScreenFrame('Sikkerhetslås');
  const display = createElement('output', {
    className: 'code-display',
    text: formatCode(enteredCode),
  });

  frame.append(createCountdownDisplay(remainingSeconds), display, createKeypad(onKeyPress));
  return frame;
}

function formatCode(code) {
  return code || 'KODE';
}
