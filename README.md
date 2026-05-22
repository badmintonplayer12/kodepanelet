# Kodepanelet

Kodepanelet er en enkel nettapp for en agent-/escape-room-bursdag. Appen fungerer som et hemmelig kodepanel der barna først finner en kode i en escape-room-løype og deretter prøver å låse opp panelet.

Målet er å bygge løsningen som en liten statisk app med vanlig HTML, CSS og JavaScript. Den skal kunne kjøres i nettleseren, designes for fullskjerm, og senere kunne utvides til en installerbar PWA.

## Produktidé

Når man åpner nettsiden/appen:

1. En voksen eller spill-leder velger først hvilken kode som skal være riktig kode.
2. Man går videre til selve kodepanelet.
3. Barna taster inn koden de har funnet i escape-room-løypen.
4. Hvis koden er riktig:
   - Hele skjermen viser en opplåst hengelås.
   - En valgt seierslyd eller musikk spilles av.
5. Hvis koden er feil:
   - Skjermen viser en rød, låst hengelås.
   - En feillyd spilles av.

Stilen skal være hemmelig agent, mystisk, spennende og litt skummel, men fortsatt gøy og trygg for barn.

## Teknisk retning

Vi starter uten tungt rammeverk og uten build-system. Appen bygges med:

- HTML
- CSS
- browser-native JavaScript-moduler
- lokale bilder og lyder

Prosjektet skal bevisst bygges med små, smale filer. Se `AGENTS.md` for arkitekturregler som skal hindre store monolittfiler.

## Planlagt startstruktur

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

## Arkitekturprinsipp

Appen bør bygges som en enkel flyt:

```text
setup -> code-panel -> success
                    -> error
```

Mappene har tydelige roller:

- `src/core/` inneholder ren spill-logikk, for eksempel kodevalidering.
- `src/ui/` inneholder DOM-rendering og visuelle komponenter.
- `src/audio/` håndterer lyder.
- `src/app/` binder sammen state, UI, regler og lyd.
- `src/main.js` starter appen, men skal ikke inneholde mye logikk.
- `styles/` deles opp i base, layout, theme og komponent-CSS.

## Fullskjerm

Appen skal designes for å fylle hele skjermen og fungere godt på mobil, nettbrett og PC.

Senere kan vi legge til en knapp som ber nettleseren gå i fullskjermmodus. Appen skal fortsatt fungere dersom fullskjerm ikke støttes eller blir avvist.

## PWA senere

Når grunnversjonen fungerer, kan vi gjøre appen installerbar som PWA ved å legge til:

- `manifest.webmanifest`
- app-ikon i `assets/icons/`
- `sw.js`
- enkel offline-støtte

Dette venter vi med til selve kodepanelet fungerer godt.

## Første milepæl

Første versjon bør ha:

- skjerm for å velge riktig kode
- kodepanel med tallknapper
- riktig/feil sjekk
- fullskjerm-vennlig layout
- enkel agent-/escape-room-stil
- plass for bilder og lyder
