# HB Plus — Organization Workspace

HB Plus is a cross-platform authentication workspace built with **Expo**, **React Native**, **React Native Web**, **Expo Router**, **Firebase Authentication**, and **Cloud Firestore**. The same codebase runs on Android, iOS, and the web.

Access is restricted to exact `@hbplus.fit` Google accounts. Any other domain is signed out of Firebase immediately and receives the required message:

> Access restricted. Please login using your official domain email.

---

## 1. Project Overview

The app provides a single, professional entry point for HB Plus organization members. It keeps Firebase and Google OAuth logic separate from reusable UI components, uses a real auth-state listener, protects direct URL access, and stores profile data in Firestore.

### Features

- Real Google OAuth 2.0 — no mock or fake sign-in.
- Web: Firebase popup with redirect fallback.
- Native: Google Sign-In SDK exchanged for a Firebase credential.
- Exact domain validation in application code **and** Firestore rules.
- Firebase session persistence (browser storage on web, AsyncStorage on native).
- Centralized `onAuthStateChanged` auth state, loading, and error handling.
- Protected route group; direct `/dashboard` and `/admin` access redirects to login.
- Reusable HB Plus UI kit, responsive login and dashboard layouts.
- Role support from trusted Firestore records or Firebase custom claims.
- Profile name, email, Google photo, role, and account creation date on the dashboard.
- Original HB Plus white/blue visual identity — not copied from any existing HB Plus site.

---

## 2. Folder Structure

```text
app/
  (protected)/
    _layout.tsx          # Auth guard for protected routes
    dashboard.tsx        # Protected dashboard route
    admin.tsx            # Admin-only route
  _layout.tsx            # Root provider and stack
  index.tsx              # Initial redirect
  login.tsx              # Login route
  access-denied.tsx      # Optional rejection explanation screen
src/
  components/            # Reusable UI (logo, buttons, banners, badges)
  config/                # Firebase and app configuration
  constants/             # Shared labels and allowed-domain constants
  context/               # AuthContext — single auth source of truth
  hooks/                 # useAuth hook
  navigation/            # Route constants
  screens/               # Login, dashboard and access-denied views
  services/              # Platform Google auth and Firestore profile logic
  styles/                # Design tokens
  theme/                 # Theme re-export
  utils/                 # Domain validation and error formatting
tests/                   # Domain and requirement checks
app.config.js            # Expo identity, scheme and platform config
firestore.rules          # Server-side domain and role authorization
.env.example             # Non-secret configuration template
```

---

## 3. Local Setup

### Prerequisites

- Node.js 20+ (Node 24 recommended)
- npm 10+
- Expo Go or an Android emulator for native testing
- Firebase project with Authentication and Firestore enabled

### Install

```bash
npm install
cp .env.example .env
```

Fill `.env` with the values from **Firebase Console → Project settings → Your apps**. Firebase web config values and OAuth client IDs are public client identifiers, not server secrets.

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN=hbplus.fit
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...apps.googleusercontent.com
```

Do **not** add an admin email list to `.env`. Administrator privileges are not client-configurable.

---

## 4. Firebase and Google Console Setup

### Firebase Authentication

1. Open **Authentication → Sign-in method** and enable **Google**.
2. Under **Authentication → Settings → Authorized domains**, add:
   - `localhost`
   - your deployed web domain
   - any domain used for testing
3. Copy the **Web client ID** from the Google provider into `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.

### Firestore

1. Create a Firestore database.
2. Deploy the provided rules:

```bash
firebase deploy --only firestore:rules
```

The rules require an exact `@hbplus.fit` email and restrict role changes to trusted admins or custom claims.

### Android

1. In Firebase project settings, add an Android app with package `fit.hbplus.secureauth`.
2. Download `google-services.json` and place it in the project root.
3. Ensure the SHA-1 certificate used for development is registered in Firebase.
4. Start Android with:

```bash
npm run android
```

### iOS

1. Add an iOS app in Firebase with bundle ID `fit.hbplus.secureauth`.
2. Add the reversed iOS client ID and URL scheme to `.env`:

```dotenv
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME=com.googleusercontent.apps.YOUR-REVERSED-CLIENT-ID
```

3. Start iOS with:

```bash
npm run ios
```

iOS builds require macOS/Xcode; they cannot be verified from Windows.

---

## 5. Roles and Security Model

- Every new Firestore profile is created with `role: "user"`.
- Admin is granted only by:
  - setting `users/{uid}.role = "admin"` in Firestore as an authorized admin, or
  - setting the Firebase custom claim `admin: true` with the Admin SDK.
- Client code never promotes itself. Firestore rules reject self-promotion.
- Firestore is optional at runtime: if profile storage is unavailable, the session continues with a lowest-privilege fallback profile.
- The UI reads admin state from the trusted profile role or the verified Firebase token claim.
- Native Google Sign-In intentionally does not set `hostedDomain`, so rejected accounts always receive the exact application rejection message rather than a provider-level error.
- Tokens are managed by Firebase. No raw Google ID token is persisted by application code.

---

## 6. Web Deployment

The Expo web build is configured as a single-page app (`web.output = 'single'`) so protected routes work on direct URL access and refresh.

```bash
npm run export:web
```

The static output is written to `dist/`. A Netlify configuration is included with a SPA fallback to `index.html`.

For any host, configure a catch-all rewrite to `/index.html` and add the deployed domain to Firebase's authorized domains.

---

## 7. Testing Report

See [TESTING.md](./TESTING.md) for the complete record of executed checks, results, and items marked `NOT TESTED`.

Summary:

- Domain/role static checks and exact-message unit tests are automated with `npm test`.
- Type checking: `npm run typecheck`.
- Web export: `npm run export:web`.
- Android export: `npx expo export --platform android`.
- Authorized `@hbplus.fit` live sign-in remains `NOT TESTED` because no official account was available in this environment.

---

## 8. Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start Expo development server |
| `npm run web` | Start web app |
| `npm run android` | Start Android app |
| `npm run ios` | Start iOS app |
| `npm run typecheck` | Run TypeScript checks |
| `npm test` | Run domain and requirement tests |
| `npm run export:web` | Build static web output |
| `npm run verify` | Typecheck, test, and web export |
