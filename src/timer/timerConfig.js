export const TIMER_START_MODES = Object.freeze({
  firstKeypress: 'first-keypress',
  afterCodeSet: 'after-code-set',
  firstWrongCode: 'first-wrong-code',
});

export const TIMER_CONFIG = Object.freeze({
  durationSeconds: 15 * 60,
  startMode: TIMER_START_MODES.firstKeypress,
});
