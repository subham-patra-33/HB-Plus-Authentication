# HB Plus — Secure Cross-Platform Auth

A single React Native codebase (Expo + expo-router + React Native for Web) that runs on **Web, Android and iOS**. Users sign in with Google, but access is granted **only** to accounts whose email domain is `@hbplus.fit`. Everyone else is signed out immediately and sees:

> Access restricted. Please login using your official domain email.

Includes a protected dashboard, logout, loading and error states, role-based access (Admin / User), Firestore user profiles, and server-side Firestore rules that enforce the same domain restriction.

---

## 1. What's inside

| Feature | Implementation |
| --- | --- |
| Cross-platform UI | Expo SDK 58, React Native 0.88, React Native for Web, expo-router (file-based routes) |
| Authentication | Firebase Authentication (modular SDK v13), Google provider |
| Web Google flow | `signInWithPopup`, with automatic `signInWithRedirect` fallback |
| Native Google flow | `@react-native-google-signin/google-signin` → Firebase `signInWithCredential` |
| Session persistence | Firebase-managed tokens: IndexedDB/localStorage on web, AsyncStorage on native |
| Domain restriction | `isAllowedEmailDomain()` + immediate sign-out + Firestore rules |
| Protected routes | `app/(protected)/_layout.tsx` guard and an admin-only screen guard |
| Roles | `admin` / `user` stored in `users/{uid}` in Firestore; admins come from `EXPO_PUBLIC_ADMIN_EMAILS` |
| Styling | Skia-free RN `StyleSheet`, responsive layout, shared theme |

---

## 2. Project structure

```text
.
├── app/                              # expo-router routes (the only navigation source)
│   ├── _layout.tsx                   # AuthProvider + root stack
│   ├── index.tsx                     # redirects to /dashboard or /login
│   ├── login.tsx                     # Login page
│   ├── +not-found.tsx                # 404 page
│   └── (protected)/
│       ├── _layout.tsx               # route guard (no session -> /login)
│       ├── dashboard.tsx             # protected dashboard + logout
│       └── admin.tsx                 # admin-only screen
├── src/
│   ├── components/                   # reusable, presentational UI pieces
│   ├── config/
│   │   ├── app.ts                    # allowed domain + admin email list
│   │   ├── auth.ts                   # typed entry point (platform resolved)
│   │   ├── auth.web.ts               # Firebase web auth (IndexedDB persistence)
│   │   ├── auth.native.ts            # Firebase native auth (AsyncStorage persistence)
│   │   └── firebaseApp.ts            # Firebase app + Firestore instances
│   ├── context/AuthContext.tsx       # single source of truth for auth state
│   ├── services/
│   │   ├── googleSignIn.web.ts       # Google popup / redirect flow
│   │   ├── googleSignIn.native.ts    # native Google Sign-In -> Firebase credential
│   │   ├── googleSignIn.ts           # typed entry point
│   │   ├── profile.service.ts        # Firestore user profile + role
│   │   └── configCheck.ts            # friendly "missing config" errors
│   ├── theme/theme.ts                # colors, spacing, shadows
│   └── utils/
│       ├── domain.ts                 # domain validation + DomainRestrictionError
│       └── errors.ts                 # user-facing auth error messages
├── assets/                           # app icons / splash placeholders (replace with your brand)
├── .env.example                      # copy to .env and fill in
├── app.config.js                     # Expo config (platform plugins, web output)
├── firestore.rules                   # server-side domain + role enforcement
├── firebase.json                     # Firestore rules + SPA hosting config
└── README.md
```

Platform-specific files (`*.web.ts` / `*.native.ts`) let the same import work everywhere: Metro picks the right implementation for the target platform, TypeScript uses the plain `*.ts` entry point.

---

## 3. Prerequisites

- Node.js 20+ and npm
- Expo CLI (comes via `npx expo`)
- A Firebase project with **Authentication** and **Cloud Firestore** enabled
- For mobile builds: Android Studio / emulator and/or Xcode (macOS). Google Sign-In is a native module, so use a **development build** (`npx expo run:android`, `npx expo run:ios`, or `eas build --profile development`) rather than stock Expo Go. Web works in any browser.

---

## 4. Firebase setup (do this once)

1. Create a project at <https://console.firebase.google.com>.
2. **Authentication → Sign-in method → Google → Enable**. Save the **Web client ID** shown there (also available under *Web SDK configuration*).
3. **Authentication → Settings → Authorized domains**: add every domain that will host the web app (`localhost` is usually present already; add your Firebase Hosting / custom domain).
4. **Project settings → Your apps → Add app → Web**: copy the config values into `.env`.
5. **Firestore Database → Create database**, then publish `firestore.rules`:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```
   (Set your project with `firebase use --add` first.)
6. For **native Google Sign-In**, create OAuth clients in the [Google Cloud console](https://console.cloud.google.com/apis/credentials) for the *same* project:
   - **Web application** client ID → `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (required on all platforms)
   - **iOS** client ID → `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
   - The iOS **URL scheme** (reversed client ID from `GoogleService-Info.plist`, e.g. `com.googleusercontent.apps.123-abc`) → `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME`. This is read by `app.config.js` to register the scheme during prebuild.
   - For Android, add your app's SHA-1 fingerprint to the **Web** OAuth client (google-signin v17 uses the web client ID on Android). You can get the fingerprint from `expo credentials` or your EAS build details.

> Firebase web config values and OAuth client IDs are **public** by design. They are not secrets. Never put private keys, service-account JSON, or the Firebase database secret in `EXPO_PUBLIC_*` variables.

---

## 5. Local setup

```bash
git clone <your-repository-url> hbplus-secure-auth
cd hbplus-secure-auth
npm install
cp .env.example .env      # Windows: copy .env.example .env
```

Fill in `.env`, then start the app:

```bash
npm run web       # browser at http://localhost:8081
npm run android   # Android emulator (native dev build)
npm run ios       # iOS simulator (macOS, native dev build)
```

`npm run android` / `npm run ios` run `expo start --android/--ios`, which creates a development build on first launch if needed. Google Sign-In will not work inside the stock Expo Go app.

After changing `.env`, restart with `npx expo start --clear` so Expo re-inlines the variables.

---

## 6. Authentication flow

```text
User taps "Continue with Google"
        │
        ▼
Google OAuth 2.0 ( popup / redirect on web, native SDK on mobile )
        │
        ▼
Google ID token exchanged for a Firebase credential
        │
        ▼
Firebase Auth creates/updates the session (refresh token persisted by Firebase)
        │
        ▼
email.toLowerCase().split('@')[1] === "hbplus.fit" ?
        │                                   │
      YES                                  NO
        │                                   │
        ▼                                   ▼
Create/update users/{uid}         Firebase + Google sign-out
in Firestore (role assigned)       Error: "Access restricted…"
        │
        ▼
onAuthStateChanged -> AuthContext -> guarded /dashboard
```

- `onAuthStateChanged` is the single source of truth. It also re-checks the domain when an existing session is restored, so a personal Google account left over in the browser can never restore into the dashboard.
- While auth state is initializing or a request is in flight, `loading` is `true` and a full-screen spinner is shown; buttons are disabled to prevent double submissions.
- Errors are normalized in `src/utils/errors.ts` (popup closed, popup blocked, network, unauthorized domain, cancelled, etc.).

### How the domain restriction works

1. `src/config/app.ts` reads `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN` (default `hbplus.fit`).
2. `src/utils/domain.ts` splits the normalized email on `@` and compares the domain **for equality** — not `endsWith` — so `someone@evil-hbplus.fit` or `someone@hbplus.fit.attacker.com` cannot slip through.
3. `AuthContext` calls `assertAllowedEmailDomain()` for popup, redirect **and** restored sessions. On failure it signs out of Firebase and Google, clears user state, and shows the exact required message.
4. `firestore.rules` repeats the check against `request.auth.token.email`. Even a modified client cannot read or write user data with a personal Google account.
5. Firestore rules additionally prevent a user from changing their own `role`.

### Roles (bonus)

- On first login, `ensureUserProfile()` writes `users/{uid}` with `role: 'admin'` if the lower-cased email appears in `EXPO_PUBLIC_ADMIN_EMAILS`, otherwise `'user'`.
- Dashboard shows a role badge and, for admins, a link to `/admin`.
- `/admin` redirects non-admins to `/dashboard`; Firestore rules block self-promotion.

### Token handling

- The app never stores raw ID/access tokens in AsyncStorage, `localStorage`, or state.
- On web, Firebase uses IndexedDB (`localStorage` fallback); on native, Firebase uses AsyncStorage persistence via `getReactNativePersistence`.
- Tokens are exchanged (`signInWithCredential`) or refreshed entirely by the Firebase SDK; sign-out clears them.

---

## 7. Web deployment

```bash
npm run export:web          # writes dist/ (single-page app)
firebase deploy --only hosting
```

`app.config.js` sets `web.output = 'single'` and `firebase.json` rewrites all paths to `/index.html`, so deep links such as `/dashboard` work on refresh and cannot be used to bypass the client-side guard.

---

## 8. Security notes / limitations

- Client-side checks protect the UI; **Firestore rules are the real authorization boundary**. Add equivalent rules/Cloud Functions for any new backend endpoint.
- `EXPO_PUBLIC_*` variables are embedded in the bundle. Only public identifiers belong there.
- For higher assurance, set a Firebase custom claim for allowed domains and check `request.auth.token.hbplus_member == true` in rules instead of (or in addition to) the email match.
- Consider rate limiting / reCAPTCHA for production, and Google Cloud `authorized JavaScript origins` for your deployed domains.
- Replace the generated placeholder icons in `assets/` before release.

---

## 9. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Firebase is not configured…` | Fill in all `EXPO_PUBLIC_FIREBASE_*` values, then `npx expo start --clear`. |
| `Google sign-in is not configured…` | Add `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`. |
| `auth/unauthorized-domain` | Add the current host (and `localhost`) to Firebase **Authorized domains**. |
| Pop-up blocked | Allow pop-ups, or rely on the built-in redirect fallback. |
| Native sign-in fails on iOS | Verify iOS client ID, reversed URL scheme in `app.config.js`, and run `npx expo prebuild` after changing it. |
| Native sign-in fails on Android | Add the app's SHA-1 to the Android OAuth client and use the correct web client ID. |
| Domain error for a valid account | The email must be exactly `@hbplus.fit`; check `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN`. |
| Permission denied in Firestore | Deploy `firestore.rules` and confirm the user's email matches the allowed domain. |

---

## 10. Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Expo dev server (choose web / Android / iOS) |
| `npm run web` | Open web build directly |
| `npm run android` / `npm run ios` | Open native build |
| `npm run typecheck` | TypeScript validation |
| `npm run export:web` | Production SPA export to `dist/` |
