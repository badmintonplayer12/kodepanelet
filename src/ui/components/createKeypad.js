import { createElement } from '../dom.js';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'enter'];

export function createKeypad(onKeyPress) {
  const keypad = createElement('div', { className: 'keypad' });

  KEYS.forEach((key) => {
    const button = createElement('button', {
      className: `keypad__key keypad__key--${key}`,
      text: getKeyLabel(key),
    });

    button.type = 'button';
    button.addEventListener('click', () => onKeyPress(key));
    keypad.append(button);
  });

  return keypad;
}

function getKeyLabel(key) {
  if (key === 'clear') return 'Slett';
  if (key === 'enter') return 'OK';
  return key;
}
