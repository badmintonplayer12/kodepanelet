import { isCodeLengthAllowed } from '../../core/codeConfig.js';
import { createElement } from '../dom.js';
import { createFullscreenButton } from '../components/createFullscreenButton.js';
import { createScreenFrame } from '../components/createScreenFrame.js';

export function renderSetupScreen({ appRoot, onCodeSet }) {
  const frame = createScreenFrame('Kodepanelet', 'Velg spillkoden før agentene starter.');
  const form = createElement('form', { className: 'setup-form' });
  const input = createElement('input', { className: 'setup-form__input' });
  const button = createElement('button', { className: 'button', text: 'Start oppdraget' });

  input.type = 'tel';
  input.inputMode = 'numeric';
  input.placeholder = 'Spillkode';
  button.type = 'submit';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const code = input.value.trim();
    if (isCodeLengthAllowed(code)) onCodeSet(code);
  });

  form.append(input, button, createFullscreenButton(appRoot));
  frame.append(form);
  return frame;
}
