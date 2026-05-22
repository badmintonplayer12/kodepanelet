import { createElement } from '../dom.js';

export function createHiddenResetButton(onResetGame) {
  const button = createElement('button', {
    className: 'button button--hidden-reset',
    text: 'Tilbake til kodevalg',
  });

  button.type = 'button';
  button.addEventListener('click', onResetGame);
  return button;
}
