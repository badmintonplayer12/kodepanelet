# Sounds

Place generated sound files for Kodepanelet in this folder.

Use these filenames so the app can find them automatically:

```text
key-press.mp3
Correct-01.mp3
Wrong-01.mp3
alarm.mp3
ambient-lockdown.mp3
```

## Sound plan

- `key-press.mp3`: very short keypad beep or mechanical button click.
- `Correct-01.mp3`: satisfying door unlock / metal latch / escape success sound.
- `Wrong-01.mp3`: short warning buzz or alarm for wrong code.
- `alarm.mp3`: alarm sound that plays once when the countdown reaches zero.
- `ambient-lockdown.mp3`: optional low looping background ambience, like a locked security room or thief hideout.

Keep sounds short and not too loud. This is for a children's birthday escape room, so the vibe should be spooky and exciting, not genuinely frightening.

The app should still work without these files because it has simple fallback tones.
