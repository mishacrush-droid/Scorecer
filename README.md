# Sc⚽recer — Football That Thinks With You

An AI-native football super-app featuring sub-second live match telemetry, grounded conversational Match AI (RAG), automated 9:16 vertical highlights, multilingual AI audio commentary personas, persistent Squads with live-updating tactical widgets, and O2O supporter pub watch parties.

## Key Features

- **Bilingual Editorial Stadium UI (`EN` / `FR`)**: Full English and French support across every screen, modal, and AI persona.
- **Real Match Data Engine**:
  - Live & date-based European scoreboard sync via the **ESPN Soccer API** (Champions League, Premier League, LaLiga, Serie A, Bundesliga, Ligue 1).
  - Free match highlight video clips integrated via **ScoreBat Video API v3** (`https://www.scorebat.com/video-api/v3/`).
  - Verified Historical Classics archive with full goal timelines, xG curves, and hover-to-play stadium video previews.
- **Native AI Suite (`AI Studio`)**:
  - Grounded Match Assistant powered by live match RAG context (`aiRagEngine.ts`) + optional `VITE_GEMINI_API_KEY` streaming.
  - Automated 9:16 Vertical Highlight Story Cutter with AI beat markers.
  - Multi-persona live audio commentary (`Tactical Analyst`, `Passionate Ultras`, `Neutral Broadcast`) across 6 languages.
- **Squads, FanScore & O2O Pub Watch Parties**:
  - Private Squad rooms with live-updating xG/rating widgets and BroadcastChannel/Supabase cloud sync (`cloudSyncService.ts`).
  - Stoppage-time micro-predictions and verified supporter pub check-ins with QR passes.
- **Web Crypto Authentication & PWA Spoiler Shield**:
  - Client-side `SHA-256` password hashing with optional Supabase Auth (`authService.ts`).
  - Installable Progressive Web App (`manifest.json` + `sw.js`) with configurable Spoiler-Shield stream delay buffer (`pwaSpoilerShieldService.ts`).

## Getting Started

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```
