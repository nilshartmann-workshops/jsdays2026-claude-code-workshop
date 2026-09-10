# Plantify 🌱

Owner registrieren Pflanzen. Das Backend legt dafür Pflegeaufgaben an, zählt erledigte Aufgaben als Nutzung und erzeugt daraus Rechnungen für einen Monat.

## Aufbau

Plantify ist ein npm-Workspace mit drei Paketen:

| Paket | Inhalt | Port |
|---|---|---|
| `backend/` | Express 5, Daten im Speicher | **3380** |
| `frontend/` | React 19 mit TanStack Router und TanStack Query, Vite | **3300** |
| `packages/contracts/` | zod-Schemas der API, die Backend und Frontend gemeinsam benutzen | ohne |

Die Ports sind fest eingestellt. Das Frontend leitet `/api` an das Backend weiter.

## Voraussetzungen

| | Version | Prüfen mit |
|---|---|---|
| Node.js | 24 | `node --version` |
| npm | 11 | `npm --version` |

npm 11 kommt mit Node.js 24 mit.

## Installieren

```bash
npm ci
```

Damit sind genau die Versionen aus der `package-lock.json` installiert, und die Datei bleibt unverändert.

## Tests und Prüfung

```bash
npm test
npm run check
```

`npm test` führt die Tests von Backend und Frontend aus, `npm run check` prüft Formatierung, Lint und Typen. Beides muss grün sein. `npm run audit` prüft die Abhängigkeiten auf bekannte Schwachstellen.

## Starten

Starte Backend und Frontend in zwei Terminals:

```bash
npm run dev -w plantify-backend
```

```bash
npm run dev -w plantify-frontend
```

Öffne dann http://localhost:3300. Beide Server übernehmen Änderungen am Code von selbst.

## Gut zu wissen

- Die `.npmrc` enthält Sicherheitseinstellungen: Eine neue Paketversion wird erst nach einer Woche installiert, und Install-Skripte laufen nicht. `npm install` lehnt deshalb ein sehr frisch veröffentlichtes Paket ab.
- `frontend/src/routeTree.gen.ts` wird aus den Dateien unter `frontend/src/routes/` erzeugt. Bearbeite sie nicht von Hand.

## Wenn etwas nicht klappt

| Symptom | Ursache |
|---|---|
| `npm test` oder der Start bricht mit unverständlichen Fehlern ab | Node.js ist älter als 24. Prüfe `node --version`. |
| Der Browser zeigt „Fehler beim Laden" | Das Backend läuft nicht. Prüfe das zweite Terminal und http://localhost:3380/api/owners. |
| Port 3300 oder 3380 ist belegt | Beende den Prozess, der den Port hält. |
