const CACHE_NAME = 'kodepanelet-cache-v3';

const APP_SHELL_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './styles/index.css',
  './styles/base.css',
  './styles/layout.css',
  './styles/theme-agent.css',
  './styles/components/alarm-screen.css',
  './styles/components/buttons.css',
  './styles/components/countdown-display.css',
  './styles/components/install-hint.css',
  './styles/components/keypad.css',
  './styles/components/lock-display.css',
  './styles/components/screen-frame.css',
  './src/main.js',
  './src/app/createApp.js',
  './src/app/appState.js',
  './src/app/persistedGameState.js',
  './src/app/restoreGameState.js',
  './src/app/screens.js',
  './src/audio/soundPlayer.js',
  './src/core/codeValidator.js',
  './src/core/codeConfig.js',
  './src/core/resultTypes.js',
  './src/pwa/installHint.js',
  './src/pwa/installPrompt.js',
  './src/pwa/registerServiceWorker.js',
  './src/timer/countdownTimer.js',
  './src/timer/formatTime.js',
  './src/timer/timerConfig.js',
  './src/ui/dom.js',
  './src/ui/renderApp.js',
  './src/ui/components/createCountdownDisplay.js',
  './src/ui/components/createHiddenResetButton.js',
  './src/ui/components/createInstallButton.js',
  './src/ui/components/createInstallHint.js',
  './src/ui/components/createKeypad.js',
  './src/ui/components/createLockDisplay.js',
  './src/ui/components/createScreenFrame.js',
  './src/ui/screens/renderAlarmScreen.js',
  './src/ui/screens/renderCodePanelScreen.js',
  './src/ui/screens/renderResultScreen.js',
  './src/ui/screens/renderSetupScreen.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-1024.png',
  './assets/sounds/Correct-01.mp3',
  './assets/sounds/Wrong-01.mp3',
  './assets/sounds/alarm.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(deleteOldCaches());
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(readThroughCache(event.request));
});

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(APP_SHELL_URLS.map((url) => cacheUrl(cache, url)));
}

async function cacheUrl(cache, url) {
  try {
    const response = await fetch(url, { cache: 'reload' });
    if (response.ok) await cache.put(url, response);
  } catch {
    // Optional files should not block service worker installation.
  }
}

async function deleteOldCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
}

async function readThroughCache(request) {
  const cachedResponse = await caches.match(request, { ignoreSearch: true });
  if (cachedResponse) return cachedResponse;

  try {
    return await fetch(request);
  } catch {
    if (request.mode === 'navigate') return caches.match('./index.html');
    throw new Error('Kodepanelet resource unavailable offline.');
  }
}
