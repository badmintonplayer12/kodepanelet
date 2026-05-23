import { createElement } from '../dom.js';

export function createInstallHint() {
  return createElement('p', {
    className: 'install-hint',
    text: 'På iPhone: Trykk delingsknappen og velg “Legg til på Hjem-skjerm”.',
  });
}
