# Alarm Countdown Plan

## Goal

Add a 15-minute countdown that starts when the players begin interacting with the code panel. When the countdown reaches zero, the app should move to an alarm screen and play `assets/sounds/alarm.mp3`.

The implementation must stay modular and follow `AGENTS.md`: small focused files, no monoliths, and clear separation between timer logic, app state, UI, audio, and styling.

## Product intent

The timer should make the code panel feel like an active security system inside the thief's house. It should create tension without becoming too scary for a children's birthday escape-room game.

Recommended first version:

- Show a clear countdown on the code panel.
- Start the countdown on the first keypad press.
- Stop the countdown when the correct code is entered.
- Reset the countdown when the hidden reset button returns to code setup.
- Move to an alarm screen when time runs out.
- Play `alarm.mp3` on the alarm screen.
- Keep the start trigger configurable for later changes.

## Adjustable timer behavior

Create timer configuration in a small dedicated module:

```text
src/timer/timerConfig.js
```

Suggested config shape:

```js
export const TIMER_CONFIG = Object.freeze({
  durationSeconds: 15 * 60,
  startMode: 'first-keypress',
});
```

Supported start modes to design for:

- `first-keypress`: timer starts when the first keypad button is pressed.
- `after-code-set`: timer starts as soon as the game leader sets the code.
- `first-wrong-code`: timer starts after the first wrong submitted code.

The first implementation should use `first-keypress`, but the surrounding code should make this easy to change later.

## Proposed file structure

Add these files:

```text
src/timer/
  timerConfig.js
  countdownTimer.js
  formatTime.js

src/ui/components/
  createCountdownDisplay.js

src/ui/screens/
  renderAlarmScreen.js

styles/components/
  countdown-display.css
```

Update these existing files:

```text
src/app/screens.js
src/app/appState.js
src/app/createApp.js
src/audio/soundPlayer.js
src/ui/renderApp.js
src/ui/screens/renderCodePanelScreen.js
src/ui/screens/renderResultScreen.js
styles/index.css
assets/sounds/README.md
```

Keep each file narrow. If any file starts growing too much, split helpers early.

## Phase 1: Timer model and formatting

Add pure timer utilities first.

Files:

```text
src/timer/timerConfig.js
src/timer/formatTime.js
```

Responsibilities:

- Store `durationSeconds` and `startMode` in config.
- Format seconds as `MM:SS`.
- Avoid DOM, audio, and app state imports in timer utility files.

Done when:

- `formatTime(900)` returns `15:00`.
- `formatTime(59)` returns `00:59`.
- Timer duration can be changed in one config file.

## Phase 2: Countdown runtime

Add a small countdown runtime module.

File:

```text
src/timer/countdownTimer.js
```

Responsibilities:

- Start countdown from a provided number of seconds.
- Tick once per second.
- Call an `onTick` callback with remaining seconds.
- Call an `onComplete` callback at zero.
- Stop and clear its interval safely.
- Avoid DOM and audio work.

Suggested API:

```js
export function createCountdownTimer({ durationSeconds, onTick, onComplete }) {
  return {
    start,
    stop,
    reset,
  };
}
```

Done when:

- App orchestration can start/stop/reset the timer without knowing interval details.
- The timer does not keep ticking after success, alarm, or reset.

## Phase 3: App state and screen flow

Extend app state with timer fields and alarm screen support.

Files:

```text
src/app/screens.js
src/app/appState.js
src/app/createApp.js
```

State additions:

```js
remainingSeconds
isTimerRunning
hasTimerStarted
```

Screen addition:

```js
alarm: 'alarm'
```

Behavior:

- Initial state starts with full duration and timer stopped.
- Entering the code panel keeps timer ready but not running.
- First keypad press starts the timer when `startMode` is `first-keypress`.
- Correct code stops the timer and moves to success.
- Wrong code still moves to error but should not reset the timer unless the hidden reset is used.
- Hidden reset returns to setup and resets timer state.
- Timer completion moves to alarm screen.

Done when:

- Timer state transitions are centralized in `createApp.js` or small app helpers.
- UI renderers receive timer state through props and do not own countdown logic.

## Phase 4: Countdown display UI

Add a reusable countdown display component.

File:

```text
src/ui/components/createCountdownDisplay.js
```

Display idea:

```text
ALARM OM 15:00
```

Props:

```js
remainingSeconds
phase
```

Phases:

```text
calm      15:00-10:01
guard     10:00-05:01
warning   05:00-01:01
critical  01:00-00:00
```

Possible text by phase:

- Calm: `ALARM OM 14:58`
- Guard: `SYSTEM AKTIVT 09:59`
- Warning: `ADVARSEL 04:59`
- Critical: `ALARM SNART 00:59`

Keep the first version simple. It is acceptable to always show `ALARM OM MM:SS` and only change colors by phase.

Done when:

- Code panel shows the countdown.
- The countdown is visually centered and works in portrait and landscape mobile layouts.
- Display code stays separate from timer logic.

## Phase 5: Alarm screen and alarm audio

Add alarm screen support.

Files:

```text
src/ui/screens/renderAlarmScreen.js
src/audio/soundPlayer.js
assets/sounds/README.md
```

Alarm screen copy:

```text
ALARM AKTIVERT
TYVENS HUS ER LÅST
```

Audio behavior:

- Add `assets/sounds/alarm.mp3` to the sound config in `soundPlayer.js`.
- Preload alarm sound with the existing result sounds.
- Play alarm sound when timer reaches zero and the app moves to alarm screen.
- Keep fallback tone if `alarm.mp3` is missing or cannot play.

Done when:

- Timer reaching zero shows alarm screen.
- `alarm.mp3` plays once on alarm.
- Hidden reset can return from alarm screen to setup.

## Phase 6: Visual tension styling

Add small, separate CSS for the countdown.

File:

```text
styles/components/countdown-display.css
```

Update:

```text
styles/index.css
```

Style goals:

- Countdown should feel like part of a security panel.
- Use yellow/orange/red phases.
- Add subtle pulsing only in warning/critical phases.
- Keep motion limited and not too scary.
- Make sure portrait and landscape layouts still fit edge-to-edge on mobile.

Suggested class names:

```text
.countdown-display
.countdown-display--calm
.countdown-display--guard
.countdown-display--warning
.countdown-display--critical
```

Done when:

- Countdown is readable on mobile.
- Critical phase feels tense but not overwhelming.
- CSS remains in a focused component file.

## Phase 7: Manual test checklist

Test on desktop, mobile portrait, and mobile landscape.

Checklist:

- Set code and reach code panel.
- Timer is visible before input.
- First keypad press starts countdown.
- Number input still works.
- Wrong code shows error screen.
- Returning from error keeps or resets timer according to chosen behavior.
- Correct code stops timer and plays success sound.
- Hidden reset from any screen returns to code setup and resets timer.
- Let timer reach zero and confirm alarm screen appears.
- Confirm `alarm.mp3` plays on alarm screen.
- Confirm layout still fills mobile portrait and landscape screens.

## Open decisions before implementation

1. Should wrong-code retry keep the timer running or pause while the error screen is shown?

Recommended: keep timer running in the background or return quickly to code panel. For a first version, it may be simpler to keep the current visible error screen and pause no timer only if the screen changes. This should be decided before coding.

2. Should the timer be visible on the error screen?

Recommended: not in the first version. Keep error screen simple, then return to code panel with `Prøv igjen`.

3. Should alarm sound loop?

Recommended: play once in the first version. Looping can become annoying in a birthday setting.

4. Should the timer begin from first keypad press or first wrong code?

Recommended: start on first keypad press. Keep `startMode` configurable.

## Implementation order

1. Add timer config and formatting.
2. Add countdown runtime.
3. Extend app state and screens with alarm/timer state.
4. Add countdown display component.
5. Render countdown on code panel.
6. Add alarm screen.
7. Wire `alarm.mp3` into audio helper.
8. Add countdown CSS and responsive checks.
9. Run manual test checklist.
