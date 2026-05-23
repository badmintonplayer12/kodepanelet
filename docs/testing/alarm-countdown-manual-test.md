# Alarm Countdown Manual Test Checklist

Use this checklist after changes to the alarm countdown, code panel, sounds, fullscreen behavior, refresh persistence, or mobile layout.

The app should be tested on:

- desktop browser
- mobile portrait
- mobile landscape
- mobile fullscreen mode, when available

## Setup

1. Open the app.
2. Confirm the setup screen appears.
3. Enter a short test code, for example `1234`.
4. Press `Start oppdraget`.
5. Confirm the app moves to the code panel.

Expected result:

- The code panel title is visible.
- The countdown is visible.
- The code display and keypad are centered.
- The layout uses most of the screen without overflowing.

## Countdown start

1. Reach the code panel.
2. Do not press any keypad button yet.
3. Confirm the countdown shows the full configured time.
4. Press the first number button.

Expected result:

- The countdown starts on first keypad press when `startMode` is `first-keypress`.
- The typed number is visible in the code display.
- The app remains responsive.

## Number input

1. Type several numbers.
2. Press `Slett`.
3. Type the correct code.

Expected result:

- Typed numbers are shown as visible digits.
- `Slett` clears the entered code.
- The keypad stays centered in portrait and landscape.

## Wrong code flow

1. Enter a wrong code.
2. Press `OK`.
3. Confirm the wrong-code sound plays.
4. Confirm the error screen appears.
5. Press `Prøv igjen`.

Expected result:

- The error screen appears for wrong code.
- `Prøv igjen` returns to the code panel.
- The timer does not reset from normal wrong-code retry.
- The hidden reset button is still available in the top-right corner.

## Correct code flow

1. Enter the correct code.
2. Press `OK`.

Expected result:

- The success sound plays.
- The success screen appears.
- The visible `Prøv igjen` button is not shown.
- The timer stops.
- The hidden reset button in the top-right corner returns to setup.

## Alarm timeout flow

For easier manual testing, temporarily lower `durationSeconds` in `src/timer/timerConfig.js`, for example:

```js
export const TIMER_CONFIG = Object.freeze({
  durationSeconds: 10,
  startMode: TIMER_START_MODES.firstKeypress,
});
```

Then:

1. Reach the code panel.
2. Press a keypad number to start the countdown.
3. Wait until the countdown reaches zero.

Expected result:

- The alarm screen appears.
- `assets/sounds/alarm.mp3` plays once.
- The hidden reset button in the top-right corner returns to setup.

Remember to set the timer back to 15 minutes after testing.

## Refresh persistence

Use a short temporary countdown, such as 30 seconds, while testing refresh behavior.

### Refresh before timer starts

1. Open the app.
2. Set code `1234`.
3. Confirm the code panel appears.
4. Refresh the browser before pressing any keypad button.

Expected result:

- The app returns to the code panel, not setup.
- The chosen code is still active.
- The countdown is still at the configured duration.

### Refresh during active countdown

1. Reach the code panel.
2. Press a keypad number to start the countdown.
3. Wait about 10 seconds.
4. Refresh the browser.

Expected result:

- The app returns to the active game.
- The countdown does not reset to the full duration.
- The remaining time is calculated from real elapsed time.
- The countdown continues automatically.

### Refresh on error screen

1. Enter a wrong code.
2. Confirm the error screen appears.
3. Refresh the browser.

Expected result:

- The game is still active after refresh.
- The chosen code is not cleared.
- The timer is not reset by refresh.
- The hidden reset button remains available.

### Refresh on success screen

1. Enter the correct code.
2. Confirm the success screen appears.
3. Refresh the browser.

Expected result:

- The app returns to the success screen.
- The timer does not restart.
- The hidden reset button remains available.

### Refresh after alarm

1. Let the countdown reach zero.
2. Confirm the alarm screen appears.
3. Refresh the browser.

Expected result:

- The app returns to the alarm screen.
- The countdown does not restart.
- The hidden reset button remains available.

### Close and reopen during countdown

1. Start the countdown.
2. Close the browser tab or leave the app for at least 10 seconds.
3. Reopen the app if possible.

Expected result:

- The countdown reflects real elapsed time.
- The app does not give extra time.
- If the timer expired while closed, the alarm screen appears.

## Hidden reset button

Test the hidden top-right reset button from each screen:

- setup screen
- code panel
- error screen
- success screen
- alarm screen

Expected result:

- Tapping the top-right hidden reset area returns to setup.
- The entered code is cleared.
- The chosen correct code is cleared.
- The timer resets to the configured duration.
- Refresh after hidden reset stays on clean setup.

## Mobile portrait layout

1. Open the app on a phone in portrait mode.
2. Test setup, code panel, error, success, and alarm screens.

Expected result:

- The app is centered.
- The panel uses most of the available width.
- Nothing important is cut off.
- The keypad is easy to tap.
- The countdown remains readable.

## Mobile landscape layout

1. Rotate the phone to landscape.
2. Test setup, code panel, error, success, and alarm screens.

Expected result:

- The panel stretches close to the screen edges.
- The keypad is centered and wide.
- The countdown is readable.
- The title stays inside the panel.
- The layout does not feel like a tiny box in the middle.

## Fullscreen mode

1. Open the app on mobile.
2. Use the fullscreen button if available.
3. Test both portrait and landscape.

Expected result:

- Fullscreen mode does not break centering.
- The hidden reset button still works.
- The countdown and keypad remain easy to use.

## Final acceptance

The alarm countdown feature is acceptable when:

- the countdown starts at the intended trigger
- the countdown is readable on all target screens
- the alarm screen appears at zero
- `alarm.mp3` plays once
- success stops the timer
- hidden reset works from all screens
- refresh does not reset active games
- refresh during countdown does not give extra time
- refresh after timeout opens the alarm screen
- refresh after success stays on the success screen
- mobile portrait and landscape layouts use the screen well
