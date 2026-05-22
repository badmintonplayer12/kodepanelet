# AGENTS.md

## Project

Kodepanelet is a small vanilla HTML/CSS/JavaScript web app for a secret-agent escape-room birthday game.

The app lets a game leader choose the correct code, then shows a code panel. A correct code shows a full-screen unlocked padlock and plays a success sound. A wrong code shows a red locked padlock and plays an error sound.

The visual style should feel like secret agent / escape room / mysterious / exciting, but still safe and fun for children.

## Non-negotiable architecture rules

- Keep files small and focused.
- Do not create monolithic files.
- Do not put most app logic in `main.js`.
- Do not put most styling in one giant CSS file.
- Prefer many small modules over one large module.
- Every file must have one clear responsibility.
- Split a file before it becomes hard to scan.

## File size limits

These limits are architectural guardrails:

- JavaScript files should normally stay under 120 lines.
- JavaScript files over 180 lines must be split unless there is a very clear reason.
- CSS files should normally stay under 150 lines.
- CSS files over 220 lines must be split unless there is a very clear reason.
- `index.html` should stay mostly structural and should normally stay under 120 lines.
- `main.js` should only bootstrap the app and should normally stay under 60 lines.

If a change would break these limits, create a smaller helper/module instead.

## Folder structure

Use this structure:

```text
index.html

src/
  main.js

  app/
    createApp.js
    appState.js
    screens.js

  core/
    codeValidator.js
    codeConfig.js
    resultTypes.js

  ui/
    dom.js
    renderApp.js

    screens/
      renderSetupScreen.js
      renderCodePanelScreen.js
      renderResultScreen.js

    components/
      createKeypad.js
      createLockDisplay.js
      createFullscreenButton.js
      createScreenFrame.js

  audio/
    soundPlayer.js
    soundConfig.js

  pwa/
    registerServiceWorker.js

styles/
  index.css
  base.css
  layout.css
  theme-agent.css

  components/
    keypad.css
    lock-display.css
    buttons.css
    screen-frame.css

assets/
  images/
  sounds/
  icons/

tools/
```

## Dependency direction

Follow this dependency direction:

```text
main.js -> app -> ui/audio/core
ui -> core only when needed
audio -> no ui imports
core -> imports no ui, no audio, no DOM
```

Rules:

- `core/` must contain pure logic.
- `core/` must not read or write DOM.
- `core/` must not play audio.
- `ui/` may render DOM but should not contain game rules.
- `audio/` may handle sounds but should not contain game rules.
- `app/` coordinates modules but should stay thin.
- No file should import from `main.js`.

## JavaScript rules

- Use browser-native ES modules.
- Use `type="module"` in `index.html`.
- Prefer named exports.
- Avoid global variables.
- Avoid large classes.
- Prefer small functions with clear names.
- Keep DOM queries inside `ui/` modules.
- Keep state transitions in `app/`.
- Keep validation rules in `core/`.

Good example:

```js
export function isCorrectCode(inputCode, correctCode) {
  return inputCode === correctCode;
}
```

Bad example:

```js
// Bad: validation, DOM updates, audio, and screen changes in one function.
function handleEverything() {}
```

## CSS rules

- `styles/index.css` only imports other CSS files.
- `base.css` is for reset/base element styling.
- `layout.css` is for app layout and full-screen structure.
- `theme-agent.css` is for colors, atmosphere, shadows, and secret-agent mood.
- Component CSS belongs in `styles/components/`.
- Do not create one huge stylesheet.
- Do not use inline styles unless there is a specific reason.
- Prefer reusable classes over styling individual IDs.

## HTML rules

- Keep `index.html` minimal.
- Do not hardcode every screen in HTML.
- Use one app root, for example:

```html
<div id="app"></div>
```

- Screens should be rendered by small UI modules.

## PWA rules

PWA support is planned but should be added after the first working app.

When PWA work starts:

- Add `manifest.webmanifest` at the repository root.
- Add `sw.js` at the repository root.
- Register the service worker from `src/pwa/registerServiceWorker.js`.
- Do not add complex caching before the basic app works.
- Keep PWA code separate from game logic.

## Fullscreen rules

- Fullscreen must be triggered from a user action, such as a button.
- Fullscreen code belongs in a small helper or component.
- The app must still work when fullscreen is denied or unsupported.
- Do not make fullscreen required for testing the app.

## Audio rules

- Sounds must be triggered by user interaction or after user interaction.
- Audio logic belongs in `src/audio/`.
- UI modules can request a sound, but should not directly manage audio elements if this becomes complex.
- Keep sound filenames descriptive.

## Asset rules

- Put images in `assets/images/`.
- Put sounds in `assets/sounds/`.
- Put app icons in `assets/icons/`.
- Do not commit huge media files unless they are actually needed.
- Prefer placeholder files first, then replace with final assets later.

## Product rules

- This is a game app, not a real security system.
- Do not describe the code panel as secure authentication.
- Do not add login, backend, tracking, analytics, or accounts unless explicitly requested.
- Keep the app local and simple.

## Change rules for agents

Before changing files:

1. Read the relevant existing file first.
2. Make the smallest useful change.
3. Preserve the existing structure unless the task is specifically to restructure.
4. Do not rewrite whole files unnecessarily.
5. Do not introduce a framework or build tool without explicit approval.
6. If a file is getting too large, split it as part of the change.
7. Update README.md if the public project structure changes.

## First implementation goal

Build the first version in this order:

1. Minimal `index.html` with app root and module script.
2. CSS foundation with full-screen layout and agent theme.
3. Setup screen where the game leader chooses the correct code.
4. Code panel screen with number buttons.
5. Pure code validation helper in `src/core/`.
6. Result screen for success/error.
7. Simple audio helper.
8. Fullscreen button.
9. PWA files later.
