import { createElement } from '../dom.js';
import { RESULT_TYPES } from '../../core/resultTypes.js';

export function createLockDisplay(resultType) {
  const lock = createElement('div', {
    className: `lock-display lock-display--${resultType}`,
  });

  const icon = resultType === RESULT_TYPES.success ? '🔓' : '🔒';
  const label = resultType === RESULT_TYPES.success ? 'Låst opp' : 'Låst';

  lock.append(
    createElement('div', { className: 'lock-display__icon', text: icon }),
    createElement('p', { className: 'lock-display__label', text: label }),
  );

  return lock;
}
