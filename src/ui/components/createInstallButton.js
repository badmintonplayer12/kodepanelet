import { createElement } from '../dom.js';

export function createInstallButton(onInstall) {
  const button = createElement('button', {
    className: 'button button--ghost',
    text: 'Installer appen',
  });

  button.type = 'button';
  button.addEventListener('click', onInstall);
  return button;
}
