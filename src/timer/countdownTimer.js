export function createCountdownTimer({ durationSeconds, onTick, onComplete }) {
  let remainingSeconds = durationSeconds;
  let intervalId = null;

  function start() {
    if (intervalId) return;
    onTick(remainingSeconds);
    intervalId = window.setInterval(tick, 1000);
  }

  function stop() {
    if (!intervalId) return;
    window.clearInterval(intervalId);
    intervalId = null;
  }

  function reset(nextDurationSeconds = durationSeconds) {
    stop();
    remainingSeconds = nextDurationSeconds;
    onTick(remainingSeconds);
  }

  function tick() {
    remainingSeconds = Math.max(0, remainingSeconds - 1);
    onTick(remainingSeconds);

    if (remainingSeconds === 0) {
      stop();
      onComplete();
    }
  }

  return {
    start,
    stop,
    reset,
  };
}
