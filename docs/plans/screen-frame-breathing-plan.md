# Screen Frame Breathing Effect Plan

## Goal

Add a subtle breathing glow to the active security-lock screen so Kodepanelet feels more alive and atmospheric without making the UI distracting or heavy.

The effect should feel like an active security system: calm, tense, and slightly mysterious. It should not feel like a blinking warning sign unless the app is on the alarm screen.

Follow `AGENTS.md`: keep the implementation small, avoid monolithic CSS, and keep animation styling in focused component CSS.

## Visual intent

The current code panel has a strong secret-agent/security style. A slight animated glow around the panel can make the screen feel more alive while the players are entering the code.

Desired feeling:

- slow system pulse
- subtle yellow/red glow
- no layout movement
- no distracting text/button motion
- no heavy animation
- safe and fun for children

Avoid:

- flashing/strobe effects
- strong scaling of the whole panel
- moving keypad buttons
- changing text position
- loud alarm-style animation on the normal code panel

## Performance direction

Use a pseudo-element and animate `opacity` instead of animating the whole panel layout.

Recommended approach:

```text
.screen-frame gets a modifier class
pseudo-element draws the glow
opacity animation creates the breathing pulse
```

This avoids moving the actual panel contents and keeps text and keypad buttons stable.

## Proposed CSS shape

Add the effect in:

```text
styles/components/screen-frame.css
```

Possible class:

```text
screen-frame--breathing
```

Concept:

```css
.screen-frame--breathing {
  position: relative;
}

.screen-frame--breathing::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0.35;
  box-shadow:
    0 0 1.6rem rgb(250 204 21 / 16%),
    0 0 3rem rgb(239 68 68 / 10%);
  animation: screen-frame-breathe 5.5s ease-in-out infinite;
}

@keyframes screen-frame-breathe {
  0%, 100% {
    opacity: 0.35;
  }

  50% {
    opacity: 0.75;
  }
}
```

Exact values can be tuned during implementation.

## Reduced motion

Respect reduced-motion preferences.

Add:

```css
@media (prefers-reduced-motion: reduce) {
  .screen-frame--breathing::before {
    animation: none;
    opacity: 0.45;
  }
}
```

This keeps the atmospheric look without motion for users who prefer less animation.

## Where to apply it first

Start with the code panel only.

Update:

```text
src/ui/screens/renderCodePanelScreen.js
```

Add:

```js
frame.classList.add('screen-frame--breathing');
```

Do not apply it globally to every screen in the first version.

## Alarm screen relationship

The alarm screen already has stronger red alarm styling. Keep the normal breathing effect separate from alarm styling.

Possible later improvement:

```text
screen-frame--alarm-pulse
```

But only add that if the current alarm styling feels too static after testing.

## Phase 1: Add breathing CSS

Update:

```text
styles/components/screen-frame.css
```

Add:

- `.screen-frame--breathing`
- `.screen-frame--breathing::before`
- `@keyframes screen-frame-breathe`
- `prefers-reduced-motion` fallback

Done when:

- the CSS exists in the screen-frame component CSS
- the animation only changes opacity
- the effect does not require JavaScript timers

## Phase 2: Apply to code panel

Update:

```text
src/ui/screens/renderCodePanelScreen.js
```

Add the modifier class to the code panel frame only.

Done when:

- code panel gets the subtle breathing glow
- setup, success, error, and alarm screens do not accidentally inherit the normal breathing effect

## Phase 3: Manual testing

Update:

```text
docs/testing/alarm-countdown-manual-test.md
```

Add checks:

- code panel has a subtle breathing glow
- keypad buttons do not move
- title and countdown remain readable
- mobile portrait still feels stable
- mobile landscape still feels stable
- reduced-motion disables the animation if possible to test

Done when:

- the effect improves atmosphere without distracting from code entry

## Acceptance criteria

This work is complete when:

- the code panel feels subtly alive
- the effect is calm and not flashy
- no layout shift is introduced
- buttons remain easy to tap
- text remains readable
- reduced-motion users do not get continuous motion
- CSS remains small and focused
