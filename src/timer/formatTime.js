export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${padTimePart(minutes)}:${padTimePart(seconds)}`;
}

function padTimePart(value) {
  return String(value).padStart(2, '0');
}
