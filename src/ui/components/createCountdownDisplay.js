import { formatTime } from '../../timer/formatTime.js';
import { createElement } from '../dom.js';

export function createCountdownDisplay(remainingSeconds) {
  const phase = getCountdownPhase(remainingSeconds);
  const display = createElement('p', {
    className: `countdown-display countdown-display--${phase}`,
    text: `ALARM OM ${formatTime(remainingSeconds)}`,
  });

  display.setAttribute('aria-label', `Alarm om ${formatTime(remainingSeconds)}`);
  return display;
}

function getCountdownPhase(remainingSeconds) {
  if (remainingSeconds <= 60) return 'critical';
  if (remainingSeconds <= 5 * 60) return 'warning';
  if (remainingSeconds <= 10 * 60) return 'guard';
  return 'calm';
}
