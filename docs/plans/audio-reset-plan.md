# Audio Reset Plan

## Goal

When the hidden reset button is pressed, all active audio must stop immediately before the app returns to the setup screen.

This includes current sounds and future audio additions such as alarm sounds, success music, wrong-code sounds, keypad sounds, and possible ambient background loops.

The implementation must stay modular and follow `AGENTS.md`: keep files small, avoid monoliths, and keep audio concerns in `src/audio/`.

## Product intent

The hidden reset button acts as the game master's emergency reset. It should fully stop the current game moment:

- stop timer
- stop all audio
- clear persisted game state
- return to code setup

This is especially important for the alarm screen, where `alarm.mp3` may still be playing when the game leader resets the app.

## Current behavior

Today, the hidden reset button calls `resetGame()` in `src/app/createApp.js`.

That flow:

- stops the countdown timer
- clears local persisted game state
- resets app state
- renders setup screen

It does not explicitly stop currently playing audio.

`src/audio/soundPlayer.js` already caches `Audio` instances in `soundCache`, so it is a natural place to add a shared stop function.

## Phase 1: Add shared audio stop helper

Update:

```text
src/audio/soundPlayer.js
```

Add:

```js
export function stopAllSounds() {}
```

Responsibilities:

- Iterate over all cached audio elements.
- Pause each audio element.
- Reset `currentTime` to `0`.
- Avoid throwing if a sound cannot be reset.
- Keep fallback tone handling unchanged.

Suggested behavior:

```js
export function stopAllSounds() {
  for (const audio of soundCache.values()) {
    audio.pause();
    audio.currentTime = 0;
  }
}
```

If needed, wrap `currentTime` reset in a small safe helper.

Done when:

- any cached MP3 sound can be stopped through one audio-layer function
- no UI or app-state logic is added to `soundPlayer.js`

## Phase 2: Call audio stop from hidden reset flow

Update:

```text
src/app/createApp.js
```

Import:

```js
stopAllSounds
```

Then call it in `resetGame()`.

Recommended order:

```text
1. timer.stop()
2. stopAllSounds()
3. clearGameState()
4. reset app state
5. render setup
```

Done when:

- pressing the hidden reset button stops alarm/success/error audio immediately
- app still returns to setup
- persisted game state is still cleared

## Phase 3: Manual test update

Update:

```text
docs/testing/alarm-countdown-manual-test.md
```

Add checks:

- trigger wrong-code sound, press hidden reset, confirm sound stops
- trigger success sound, press hidden reset, confirm sound stops
- trigger alarm sound, press hidden reset, confirm alarm stops
- confirm setup screen is shown after reset
- confirm refresh after reset remains on clean setup

Done when:

- the reset behavior is documented in the manual checklist

## Implementation order

1. Add `stopAllSounds()` to `src/audio/soundPlayer.js`.
2. Import and call it from `resetGame()` in `src/app/createApp.js`.
3. Update the manual test checklist.

## Acceptance criteria

This work is complete when:

- hidden reset stops currently playing MP3 audio
- hidden reset still stops the timer
- hidden reset still clears persisted game state
- hidden reset still returns to setup
- no audio-stop logic is duplicated outside `src/audio/soundPlayer.js`
- implementation remains small and focused
