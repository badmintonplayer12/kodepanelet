const STORAGE_KEY = 'kodepanelet.gameState.v1';

export function saveGameState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGameState() {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (!savedState) return null;

  try {
    const parsedState = JSON.parse(savedState);
    return isValidSavedState(parsedState) ? parsedState : null;
  } catch {
    clearGameState();
    return null;
  }
}

export function clearGameState() {
  localStorage.removeItem(STORAGE_KEY);
}

function isValidSavedState(state) {
  return Boolean(
    state &&
      typeof state.screen === 'string' &&
      typeof state.correctCode === 'string' &&
      typeof state.enteredCode === 'string' &&
      Number.isFinite(state.remainingSeconds) &&
      typeof state.hasTimerStarted === 'boolean' &&
      typeof state.isTimerRunning === 'boolean' &&
      isValidTimerEndsAt(state.timerEndsAt),
  );
}

function isValidTimerEndsAt(timerEndsAt) {
  return timerEndsAt === null || Number.isFinite(timerEndsAt);
}
