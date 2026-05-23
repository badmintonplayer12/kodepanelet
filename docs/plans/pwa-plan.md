# PWA Implementation Plan

## Goal

Make Kodepanelet installable as a Progressive Web App from the setup screen where the game leader chooses the code.

The app must still work normally in a browser if installation is not available or is declined.

This work must stay separate from game, timer, alarm, audio, and refresh-persistence logic. Follow `AGENTS.md`: keep files small, avoid monoliths, and keep each file focused on one responsibility.

## Current assets

The icon assets are already available in:

```text
assets/icons/icon-192.png
assets/icons/icon-512.png
assets/icons/icon-1024.png
```

Use `icon-192.png` and `icon-512.png` in the first manifest version.

A dedicated `maskable-512.png` and `apple-touch-icon.png` can be added later if needed.

## Product intent

Kodepanelet is used in a birthday escape-room setting. Installing it should make the app easier to launch quickly and reduce browser distractions during the game.

The install path should feel optional and safe:

- The code setup screen should remain the main action.
- Installation must never block the game.
- Unsupported browsers should simply continue without install UI.
- Installed mode must preserve the existing game behavior, including refresh persistence and hidden reset.

## Phase 1: Web app manifest

Add:

```text
manifest.webmanifest
```

Suggested values:

```json
{
  "name": "Kodepanelet",
  "short_name": "Kodepanelet",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#05070d",
  "theme_color": "#05070d",
  "icons": [
    {
      "src": "./assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "./assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Recommendation:

- Start with `display: standalone`.
- Do not lock orientation yet. The app should continue supporting portrait and landscape.
- Do not use `fullscreen` in the first version unless testing shows `standalone` is not immersive enough.

Done when:

- `manifest.webmanifest` exists at the repository root.
- It references existing icon assets.
- It uses the same dark theme color as the app.

## Phase 2: Link manifest and icons in HTML

Update:

```text
index.html
```

Add:

```html
<link rel="manifest" href="./manifest.webmanifest" />
<link rel="apple-touch-icon" href="./assets/icons/icon-192.png" />
<meta name="theme-color" content="#05070d" />
```

Notes:

- `theme-color` already exists today, but verify the value remains consistent.
- `icon-192.png` can be used as the Apple touch icon first.
- A dedicated 180x180 Apple icon can be added later.

Done when:

- Browsers can discover the manifest.
- Mobile browsers have a touch icon to use.
- `index.html` remains mostly structural and small.

## Phase 3: Simple service worker

Add:

```text
sw.js
```

Start with a conservative app-shell cache.

Cache candidates:

```text
./
./index.html
./manifest.webmanifest
./styles/index.css
./styles/base.css
./styles/layout.css
./styles/theme-agent.css
./styles/components/alarm-screen.css
./styles/components/buttons.css
./styles/components/countdown-display.css
./styles/components/keypad.css
./styles/components/lock-display.css
./styles/components/screen-frame.css
./src/main.js
./src/app/createApp.js
./src/app/appState.js
./src/app/persistedGameState.js
./src/app/restoreGameState.js
./src/app/screens.js
./src/audio/soundPlayer.js
./src/core/codeValidator.js
./src/core/codeConfig.js
./src/core/resultTypes.js
./src/timer/countdownTimer.js
./src/timer/formatTime.js
./src/timer/timerConfig.js
./src/ui/dom.js
./src/ui/renderApp.js
./src/ui/components/createCountdownDisplay.js
./src/ui/components/createHiddenResetButton.js
./src/ui/components/createKeypad.js
./src/ui/components/createLockDisplay.js
./src/ui/components/createScreenFrame.js
./src/ui/screens/renderAlarmScreen.js
./src/ui/screens/renderCodePanelScreen.js
./src/ui/screens/renderResultScreen.js
./src/ui/screens/renderSetupScreen.js
./assets/icons/icon-192.png
./assets/icons/icon-512.png
./assets/icons/icon-1024.png
./assets/sounds/Correct-01.mp3
./assets/sounds/Wrong-01.mp3
./assets/sounds/alarm.mp3
```

Use an explicit cache version, for example:

```js
const CACHE_NAME = 'kodepanelet-cache-v1';
```

Important cache rules:

- Keep the service worker simple.
- Delete old caches on activation.
- Do not add complex runtime caching in the first version.
- Bump the cache name when cached files change in a way that must be forced onto devices.

Done when:

- App shell files are available offline after first load.
- Old cache versions are cleaned up.
- The app still works if service worker registration fails.

## Phase 4: Register service worker

Add or update:

```text
src/pwa/registerServiceWorker.js
```

Then call it from:

```text
src/main.js
```

Responsibilities:

- Check `navigator.serviceWorker` support.
- Register `./sw.js`.
- Fail silently or log lightly without blocking the app.
- Avoid UI work in the service worker registration helper.

Done when:

- Service worker registration is isolated in `src/pwa/`.
- `main.js` remains a small bootstrap file.
- The app works even if registration is denied or unsupported.

## Phase 5: Install prompt helper

Add:

```text
src/pwa/installPrompt.js
```

Responsibilities:

- Listen for the browser `beforeinstallprompt` event.
- Store the deferred install prompt.
- Expose a small API so UI can know whether install is available.
- Trigger the prompt from a user action.
- Clear the prompt after use.

Suggested API:

```js
export function createInstallPromptController({ onAvailabilityChange }) {
  return {
    isInstallAvailable,
    promptInstall,
  };
}
```

Notes:

- Android/Chrome is the main target for a real install prompt.
- Unsupported browsers should simply not show the install button.
- Do not make install required for using the app.

Done when:

- The install prompt is handled outside UI rendering.
- UI can show an install button only when install is actually available.

## Phase 6: Install button on setup screen

Add:

```text
src/ui/components/createInstallButton.js
```

Update:

```text
src/ui/screens/renderSetupScreen.js
src/ui/renderApp.js
src/app/createApp.js
```

Button text recommendation:

```text
Installer appen
```

Behavior:

- Show the install button only on the setup screen.
- Show it only when install is available.
- Do not show it after the app is already installed, if the browser exposes enough information.
- Pressing it should trigger the browser install prompt.
- If the prompt is unavailable, the game should continue unaffected.

Done when:

- Setup screen can offer install without distracting from code setup.
- The install UI is optional and does not affect the game state.
- Component and PWA logic remain separate.

## Phase 7: iPhone/iPad fallback

Safari/iOS install behavior differs from Android/Chrome. The first implementation can be Android-focused, but plan for a simple fallback later.

Possible fallback text:

```text
På iPhone: Trykk delingsknappen og velg “Legg til på Hjem-skjerm”.
```

Recommendation:

- Do not add a large iOS help panel in the first version.
- Add a small optional hint only if testing shows it is needed.
- Keep the setup screen calm and simple.

Done when:

- The app has a clear path for iOS guidance without blocking initial PWA work.

## Phase 8: Manual testing

Update:

```text
docs/testing/alarm-countdown-manual-test.md
```

Add PWA tests:

- Manifest is reachable.
- Icons load correctly.
- Install prompt appears where supported.
- Install button appears only when install is available.
- Installed app opens at the correct start URL.
- Installed app keeps refresh persistence behavior.
- Installed app keeps alarm countdown behavior.
- Installed app plays success, wrong-code, and alarm sounds after interaction.
- Installed app works in portrait.
- Installed app works in landscape.
- Service worker updates do not trap the app on an old broken version.

Done when:

- Android/Chrome install works.
- Normal browser usage still works.
- App remains usable offline after first load.
- Refresh persistence still works in installed mode.

## Cache risk and update strategy

Service workers can make the browser keep older files longer than expected. Because this app has already had browser-cache confusion, keep the strategy deliberately simple.

Rules:

- Use a visible cache version string.
- Bump the cache version when app-shell files change.
- Delete old caches in the `activate` event.
- Avoid clever runtime caching until the basic PWA works.
- Keep a manual test step for verifying a new version actually loads.

## Proposed implementation order

1. Add `manifest.webmanifest`.
2. Link manifest and icons in `index.html`.
3. Add simple `sw.js` app-shell cache.
4. Add `src/pwa/registerServiceWorker.js`.
5. Call service worker registration from `src/main.js`.
6. Add `src/pwa/installPrompt.js`.
7. Add `src/ui/components/createInstallButton.js`.
8. Render install button on setup screen when available.
9. Update manual test checklist.

## Acceptance criteria

PWA work is complete when:

- the manifest is valid and references existing icons
- the app can be installed on supported mobile browsers
- the install option appears only when supported
- the app opens in standalone installed mode
- the app still works in normal browser mode
- basic offline reload works after first load
- hidden reset still clears game state
- refresh persistence still works
- alarm countdown still works
- implementation remains modular and within `AGENTS.md` file-size guardrails
