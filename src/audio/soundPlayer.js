const SOUND_FILES = Object.freeze({
  key: './assets/sounds/key-press.mp3',
  success: './assets/sounds/success-unlock.mp3',
  error: './assets/sounds/error-alarm.mp3',
});

export function playKeyTone() {
  playSoundFile(SOUND_FILES.key).catch(() => playFallbackTone(360, 0.06));
}

export function playResultTone(resultType) {
  const filePath = SOUND_FILES[resultType];
  const fallbackFrequency = resultType === 'success' ? 660 : 180;

  playSoundFile(filePath).catch(() => playFallbackTone(fallbackFrequency, 0.25));
}

function playSoundFile(filePath) {
  const audio = new Audio(filePath);
  audio.volume = 0.8;
  return audio.play();
}

function playFallbackTone(frequency, durationSeconds) {
  const context = createAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.frequency.value = frequency;
  gain.gain.value = 0.08;

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + durationSeconds);
}

function createAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
}
