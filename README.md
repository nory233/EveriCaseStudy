# Everi Labs Case Assignment - Clinical Encounter Assistant

Interactive frontend prototype for an AI-assisted clinical encounter tool aimed at prosthetists and orthotists.

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## User flow

1. Setup - Select fictional patient + encounter type, confirm device/reason, start.
2. Encounter - Simulated recording with timer, quiet capture indicator, collapsible checklist/transcript.
3. Review - Editable draft note, uncertainty warnings, transcript source links, finalize.

Primary demo path: **Alex Morgan → Prosthetic fitting and adjustment**.

## Design decisions

- **Patient-first during the visit:** recording UI is calm; checklist/transcript are secondary and collapsed by default for transcript.
- **Emphasis on post-visit review:** editing, uncertainty handling, and finalization happen after stop.
- **Trust cues:** draft banner, source traceability (“View source”), and explicit missing/ambiguous items instead of invented facts.
- **Everi Labs branding:** official logo in the header; restrained healthcare SaaS palette centered on brand blue `#0062cc`.

## Key files

- `src/App.tsx` - workflow state
- `src/data/mockData.ts` - patients, scenarios, transcript, notes, warnings
- `src/screens/SetupScreen.tsx`
- `src/screens/EncounterScreen.tsx`
- `src/screens/ReviewScreen.tsx`
- `src/index.css` - visual system
