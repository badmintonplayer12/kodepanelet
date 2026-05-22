const SOUND_FILES = Object.freeze({
  key: './assets/sounds/key-press.mp3',
  success: './assets/sounds/Correct-01.mp3',
  error: './assets/sounds/Wrong-01.mp3',
});

const soundCache = new Map();

export function preloadResultSounds() {
  preloadSound(SOUND_FILES.success);
  preloadSound(SOUND_FILES.error);
}

export function playKeyTone() {
  playSoundFile(SOUND_FILES.key).catch(() => playFallbackTone(360, 0.06));
}

export function playResultTone(resultType) {
  const filePath = SOUND_FILES[resultType];
  const fallbackFrequency = resultType === 'success' ? 660 : 180;

  playSoundFile(filePath).catch(() => playFallbackTone(fallbackFrequency, 0.25));
}

function preloadSound(filePath) {
  const audio = getCachedAudio(filePath);
  audio.load();
}

function playSoundFile(filePath) {
  const audio = getCachedAudio(filePath);
  audio.currentTime = 0;
  return audio.play();
}

function getCachedAudio(filePath) {
  if (!soundCache.has(filePath)) {
    const audio = new Audio(filePath);
    audio.preload = 'auto';
    audio.volume = 0.8;
    soundCache.set(filePath, audio);
  }

  return soundCache.get(filePath);
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
