# Kodepanelet

Kodepanelet er en enkel nettapp for en agent-/escape-room-bursdag. Appen skal fungere som et hemmelig kodepanel der barna først velger hvilken kode som skal være riktig, og deretter prøver å låse opp panelet.

Målet er at løsningen skal være enkel å kjøre i nettleseren med vanlig HTML, CSS og JavaScript. Senere kan den utvides slik at den kan installeres som en PWA på mobil eller nettbrett.

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

## Første tekniske retning

Vi starter enkelt med statiske filer:

```text
index.html
styles.css
script.js
assets/
  images/
  sounds/
```

Planen er å bygge dette uten tungt rammeverk i starten:

- `index.html` inneholder app-strukturen.
- `styles.css` styrer fullskjerm, agent-stil, farger, knapper og animasjoner.
- `script.js` styrer valgt kode, inntasting, riktig/feil resultat og lyd.
- `assets/images/` kan inneholde hengelås-bilder og bakgrunnsgrafikk.
- `assets/sounds/` kan inneholde opplåsingslyd, feillyd og eventuell musikk.

## Fullskjerm

Appen skal designes for å fylle hele skjermen. Den bør fungere godt på mobil, nettbrett og PC.

Senere kan vi legge til en knapp som ber nettleseren gå i fullskjermmodus, slik at det føles mer som en ekte escape-room-app.

## PWA senere

Når grunnversjonen fungerer, kan vi gjøre appen installerbar som PWA ved å legge til:

- `manifest.webmanifest`
- app-ikon
- service worker
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
