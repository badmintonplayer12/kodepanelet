import { createElement } from '../dom.js';

export function createScreenFrame(title, subtitle) {
  const frame = createElement('section', { className: 'screen-frame' });
  const heading = createElement('h1', { text: title });
  const lead = createElement('p', { className: 'screen-frame__lead', text: subtitle });

  frame.append(heading, lead);
  return frame;
}
