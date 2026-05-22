import { createElement } from '../dom.js';

export function createScreenFrame(title, subtitle = '') {
  const frame = createElement('section', { className: 'screen-frame' });
  const heading = createElement('h1', { text: title });

  frame.append(heading);

  if (subtitle) {
    frame.append(createElement('p', { className: 'screen-frame__lead', text: subtitle }));
  }

  return frame;
}
