import { createElement } from '../dom.js';

export function createFullscreenButton(targetElement) {
  const button = createElement('button', {
    className: 'button button--ghost',
    text: 'Fullskjerm',
  });

  button.type = 'button';
  button.addEventListener('click', () => requestFullscreen(targetElement));

  return button;
}

function requestFullscreen(targetElement) {
  if (!targetElement.requestFullscreen) return;
  targetElement.requestFullscreen().catch(() => {});
}
