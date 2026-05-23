import { RESULT_TYPES } from '../../core/resultTypes.js';
import { createLockDisplay } from '../components/createLockDisplay.js';
import { createScreenFrame } from '../components/createScreenFrame.js';

export function renderAlarmScreen() {
  const frame = createScreenFrame('Alarm aktivert', 'Tyvens hus er låst.');

  frame.classList.add('screen-frame--alarm');
  frame.append(createLockDisplay(RESULT_TYPES.error));
  return frame;
}
