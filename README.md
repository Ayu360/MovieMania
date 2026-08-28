# MovieMania

A native iOS/Android movie discovery app built with **Expo (SDK 57)** and **React Native 0.86**. Search millions of titles from OMDB, curate a watchlist, and sign in with Google via a self-hosted Firebase-backed auth service.

> **Status:** actively developed. Runs on iOS today; Android verified via `expo prebuild` but not routinely tested.

---

## Screenshots

_Coming soon — placeholders below will be replaced._

| Sign in | Discover | Detail | Watchlist |
|---|---|---|---|
| _(tbd)_ | _(tbd)_ | _(tbd)_ | _(tbd)_ |

---

## Features

- **Real Google sign-in** — native Google chooser sheet via `@react-native-google-signin`, exchanged for a Firebase credential, exchanged again for an app-issued JWT from our own backend.
- **Persistent session** — `appToken` stored via Zustand + AsyncStorage; users stay signed in across app relaunches.
- **Search** — full-text OMDB search with infinite scroll, backed by TanStack Query.
- **Watchlist** — save titles for later; state persists locally.
- **Movie detail** — Reanimated parallax hero, cast, plot, ratings.
- **Route-level auth gate** — `Stack.Protected` in the root layout locks tabs behind sign-in.
- **Multi-env** — one command to swap between local backend and the deployed one.

---

## Architecture

```
┌─────────────────┐   1. Google sign-in         ┌──────────────┐
│                 │  ─────────────────────────▶ │ Google OAuth │
│                 │                             └──────────────┘
│                 │
│    MovieMania   │   2. Firebase credential    ┌──────────────┐
│   (this repo)   │  ─────────────────────────▶ │   Firebase   │
│                 │  ◀───── Firebase ID token ─ │     Auth     │
│                 │                             └──────────────┘
│                 │
│                 │   3. POST /auth/firebase    ┌──────────────┐
│                 │  ─────────────────────────▶ │  MovieMania  │
│                 │  ◀───── { appUid, appToken, │   Backend    │
│                 │           user }            │  (Node + Mongo)│
└─────────────────┘                             └──────────────┘
```

The backend lives in a separate repo: **[Ayu360/moviemania-backend](https://github.com/Ayu360/moviemania-backend)** (Express + TypeScript + Mongoose + `firebase-admin`, deployed on Render).

---

## Tech stack

**App**
- Expo SDK 57, React Native 0.86, React 19
- expo-router (file-based navigation)
- Zustand + AsyncStorage (state + persistence)
- TanStack Query v5 (server state)
- Reanimated 4 (animations)
- @react-native-firebase (native Firebase SDK, dynamic config plugin)
- @react-native-google-signin (native Google chooser)

**Backend** — see [moviemania-backend](https://github.com/Ayu360/moviemania-backend).

**External services**
- **Firebase Auth** — Google identity provider + ID-token issuer
- **MongoDB Atlas** — user storage
- **OMDB API** — movie metadata

---

## Prerequisites

- Node 20+ and Yarn 1.x (Yarn is the project's package manager — pinned via `packageManager` in `package.json`)
- Xcode 15+ (iOS) and/or Android Studio (Android)
- A Firebase project with Google sign-in enabled and platform apps registered for bundle ID `com.ayush.moviemania`
- A running MovieMania backend (local via `yarn dev`, or the deployed Render URL)

> **This app cannot run in Expo Go.** It uses native modules (`@react-native-firebase`, `@react-native-google-signin`) that require a custom dev build.

---

## Setup

```bash
# 1. Install
yarn install

# 2. Firebase config files
#    Download from Firebase Console → Project Settings → Your apps
#    Drop these at the repo root (both are gitignored):
#      GoogleService-Info.plist    (iOS)
#      google-services.json        (Android)

# 3. Environment
cp .env.example .env
# Populate:
#   EXPO_PUBLIC_OMDB_API_KEY           — from omdbapi.com/apikey.aspx
#   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID   — Firebase Console → Auth → Google → Web SDK
#   EXPO_PUBLIC_BACKEND_URL            — e.g. http://<your-lan-ip>:4000 for local dev

# 4. Prebuild + run
npx expo prebuild --clean       # generates ios/ and android/ (gitignored)
npx expo run:ios                # or run:android
```

---

## Environment switching

The only variable that changes between environments is `EXPO_PUBLIC_BACKEND_URL`. Keep two populated files locally — both gitignored — and swap them into `.env`:

```bash
yarn env:dev    # copies .env.dev  → .env   (local backend on your LAN)
yarn env:prod   # copies .env.prod → .env   (deployed backend on Render)
```

Restart Metro with `--clear` after switching — Expo bakes `EXPO_PUBLIC_*` values into the JS bundle at build time.

```bash
yarn start --clear
```

---

## Development

| Command | Purpose |
|---|---|
| `yarn start` | Metro dev server |
| `yarn ios` | Prebuild + run on iOS simulator |
| `yarn android` | Prebuild + run on Android emulator |
| `yarn test` | Run Jest test suite in watch mode |
| `yarn lint` | ESLint via `expo lint` |
| `yarn env:dev` / `yarn env:prod` | Swap `.env` between backends |

---

## Project structure

```
app/                     File-based routes (expo-router)
  (auth)/                Sign-in screens
  (tabs)/                Discover, Watchlist
  [id].tsx               Movie detail
  _layout.tsx            Root layout + auth gate

api/                     Fetch clients
  fetchData.ts           OMDB
  authApi.ts             MovieMania backend

lib/auth/firebase.ts     Google sign-in + Firebase + backend exchange
store/                   Zustand stores (auth, movies)
components/              Shared UI (CustomButton, FormField, PosterTile, SearchBar)
constants/               Colors, icons, images, poster fallbacks
plugins/                 Expo config plugins
  withDisableRNFirebaseSPM.js   Opts RN Firebase out of SPM to avoid duplicate symbols
```

---

## Related repositories

- **Backend:** [Ayu360/moviemania-backend](https://github.com/Ayu360/moviemania-backend) — Node.js + Express + Mongoose + firebase-admin. Verifies Firebase ID tokens, issues app JWTs, persists users to MongoDB Atlas. Deployed on Render.

---

## License

Personal project. All rights reserved.
