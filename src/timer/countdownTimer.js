export function createCountdownTimer({ durationSeconds, onTick, onComplete, getRemainingSeconds }) {
  let remainingSeconds = durationSeconds;
  let intervalId = null;

  function start() {
    if (intervalId) return;
    tick();
    if (remainingSeconds === 0) return;
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
    remainingSeconds = readRemainingSeconds();
    onTick(remainingSeconds);

    if (remainingSeconds === 0) {
      stop();
      onComplete();
    }
  }

  function readRemainingSeconds() {
    if (getRemainingSeconds) {
      return Math.max(0, getRemainingSeconds());
    }

    return Math.max(0, remainingSeconds - 1);
  }

  return {
    start,
    stop,
    reset,
  };
}
