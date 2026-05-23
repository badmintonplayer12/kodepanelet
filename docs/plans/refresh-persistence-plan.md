# Refresh Persistence Plan

## Goal

Refresh should not reset the game. The game should continue after a browser refresh, accidental reload, phone sleep, or app reopen. Only the hidden reset button should clear the active game and return to code setup.

This plan should be implemented after the alarm countdown foundation, because it touches app state, timer behavior, reset behavior, and alarm flow.

The implementation must stay modular and follow `AGENTS.md`: small focused files, no monoliths, and clear separation between persistence, app state, timer logic, UI, and audio.

## Product intent

Kodepanelet is used during a birthday escape-room game. A normal refresh should not become a way to cheat, restart the timer, or accidentally break the game.

Expected player-facing behavior:

- If the page refreshes, the mission continues.
- If the phone sleeps and wakes, the mission continues.
- If the timer would have expired while the page was closed, the app opens on the alarm screen.
- Only the hidden top-right reset button starts over from the code setup screen.

## Desired behavior by screen

### Setup screen

If refresh happens before a code is set:

- stay on setup
- keep no active game state
- timer remains at the configured duration

### Code panel before timer start

If refresh happens after a code is set but before the timer starts:

- return to the code panel
- keep the correct code
- keep the entered code if any
- timer remains ready at the configured duration

### Code panel after timer start

If refresh happens after the timer starts:

- return to the code panel
- keep the correct code
- keep the entered code if appropriate
- calculate remaining time from real clock time
- do not give extra time
- continue countdown automatically

### Error screen

If refresh happens on the error screen:

- return to the error screen or code panel according to final UX decision
- do not clear the chosen code
- do not reset the timer
- hidden reset remains available

Recommended first version: preserve the current screen exactly, including the error screen.

### Success screen

If refresh happens on success:

- return to success screen
- timer stays stopped
- hidden reset remains available

### Alarm screen

If refresh happens on alarm:

- return to alarm screen
- do not restart countdown
- hidden reset remains available

## Important timing model

Do not rely only on `remainingSeconds` for persistence.

The app should persist an absolute timer end timestamp:

```text
timerEndsAt
```

Example meaning:

```text
The alarm should trigger at 18:42:10.
```

On reload, the app calculates:

```text
remainingSeconds = timerEndsAt - Date.now()
```

This prevents refresh, phone sleep, or backgrounding from giving extra time.

## Proposed file structure

Add:

```text
src/app/persistedGameState.js
```

Possible future split if the file grows:

```text
src/app/persistedGameState.js
src/app/restoreGameState.js
```

Start with one small persistence helper. Split only if restoration logic becomes too large.

## State to persist

Persist the minimum state needed to restore the mission:

```js
{
  screen,
  correctCode,
  enteredCode,
  remainingSeconds,
  hasTimerStarted,
  isTimerRunning,
  timerEndsAt
}
```

Notes:

- `correctCode` is only a game code, not secure authentication.
- This is local browser storage for a birthday game.
- `isTimerRunning` may be recalculated on restore instead of trusted directly.
- `timerEndsAt` is the important source of truth for active countdown time.

## Phase 1: Persistence helper

Add:

```text
src/app/persistedGameState.js
```

Responsibilities:

- save active game state to `localStorage`
- load active game state from `localStorage`
- clear active game state from `localStorage`
- safely handle invalid JSON or old saved data
- avoid DOM, UI rendering, audio, and timer interval logic

Suggested API:

```js
export function saveGameState(state) {}
export function loadGameState() {}
export function clearGameState() {}
```

Implementation notes:

- Use one storage key, for example `kodepanelet.gameState.v1`.
- Return `null` if saved state is missing or invalid.
- Keep validation simple but explicit.

Done when:

- app code can call save/load/clear without knowing localStorage details
- invalid saved data does not crash the app

## Phase 2: Extend app state

Update:

```text
src/app/appState.js
```

Add:

```js
timerEndsAt: null
```

Initial state should still use:

```js
remainingSeconds: TIMER_CONFIG.durationSeconds
isTimerRunning: false
hasTimerStarted: false
timerEndsAt: null
```

Done when:

- a fresh app start still behaves as before
- the app has a place to store the absolute end time once the timer starts

## Phase 3: Save state automatically

Update:

```text
src/app/createApp.js
```

Behavior:

- Load saved state when app starts.
- Save state after normal app updates.
- Do not save transient broken/intermediate state if avoidable.
- Clear saved state only from the hidden reset flow.

Important rule:

```text
resetGame() is the only normal user action that clears persisted state.
```

Done when:

- setting code writes active state
- keypad input writes active state
- wrong code writes active state
- success writes active state
- alarm writes active state
- hidden reset clears active state

## Phase 4: Store timer end timestamp

When the timer starts, set:

```js
timerEndsAt = Date.now() + remainingSeconds * 1000
```

When the timer stops because of success:

- keep or clear `timerEndsAt` based on final preference
- recommended first version: keep it for debugging/context, but set `isTimerRunning: false`

When hidden reset is used:

- clear `timerEndsAt`
- reset remaining seconds to configured duration

Done when:

- active timer has a real end timestamp
- refresh can calculate correct remaining time

## Phase 5: Restore state on app start

When the app starts:

1. Try `loadGameState()`.
2. If there is no saved state, use `createInitialState()`.
3. If saved state has `timerEndsAt` and the mission is still active:
   - calculate remaining seconds from `timerEndsAt`
   - if remaining seconds is greater than zero, restore countdown
   - if remaining seconds is zero or less, open alarm screen
4. If saved state is success or alarm:
   - restore that screen without restarting timer

Suggested helper, if `createApp.js` starts growing:

```text
src/app/restoreGameState.js
```

Done when:

- refresh on code panel keeps timer honest
- refresh after timer expiry opens alarm screen
- refresh on success stays success
- refresh on alarm stays alarm

## Phase 6: Timer runtime adjustment

The current countdown runtime counts down internally once started. For robust refresh behavior, app orchestration should use `timerEndsAt` as the source of truth.

Two possible approaches:

### Simple approach

On restore, calculate `remainingSeconds` once, then start the existing countdown timer from that value.

Pros:

- smaller change
- probably good enough for first implementation

Cons:

- if the phone sleeps while the page remains open, the internal interval may drift

### Robust approach

Let timer ticks calculate remaining time from `timerEndsAt` on every tick.

Pros:

- refresh-safe
- sleep/background-safe
- harder to gain extra time accidentally

Cons:

- slightly more changes to timer/app coordination

Recommended first implementation: robust approach if it can be done without making `createApp.js` large. If it starts getting messy, use the simple approach first and add a follow-up improvement.

## Phase 7: Manual testing

Update:

```text
docs/testing/alarm-countdown-manual-test.md
```

Add refresh persistence tests:

- set code, refresh, confirm code panel returns
- start timer, wait 10 seconds, refresh, confirm time did not reset
- enter wrong code, refresh, confirm game is still active
- enter correct code, refresh, confirm success remains
- let timer expire, refresh, confirm alarm remains
- press hidden reset, refresh, confirm setup remains clean
- close browser tab during countdown, reopen if possible, confirm time is calculated correctly

Done when:

- refresh does not reset active games
- hidden reset is the only normal reset path
- timer does not give extra time after refresh

## Open decisions before implementation

1. Should refresh on the error screen restore the error screen or jump back to the code panel?

Recommended first version: restore exactly where the player was. This is easiest to understand and test.

2. Should the entered code be preserved on refresh?

Recommended first version: yes, preserve it. Hidden reset is the intentional clear.

3. Should `timerEndsAt` remain in state after success?

Recommended first version: keep it but mark timer as not running. This makes persistence simple and harmless.

4. Should localStorage be cleared automatically after success or alarm?

Recommended: no. Keep success/alarm after refresh until hidden reset is used.

## Implementation order

1. Add `src/app/persistedGameState.js`.
2. Add `timerEndsAt` to app state.
3. Load saved state on app startup.
4. Save state after app updates.
5. Clear saved state only from hidden reset.
6. Set `timerEndsAt` when countdown starts.
7. Restore remaining time from `timerEndsAt` on refresh.
8. Route to alarm if the saved timer has expired.
9. Update manual test checklist with refresh tests.

## Acceptance criteria

This feature is complete when:

- refresh on an active code panel does not return to setup
- refresh during countdown does not reset to 15:00
- refresh after timeout opens alarm screen
- refresh after success stays success
- hidden reset clears persisted state and returns to setup
- the implementation stays modular and file sizes remain within `AGENTS.md` guardrails
