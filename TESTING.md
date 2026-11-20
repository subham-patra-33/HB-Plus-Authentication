# HB Plus Testing Report

**Date:** 2026-11-20  
**Environment:** Windows, Node.js 24.17.0, npm 11.13.0, Expo SDK 58  
**Scope:** Static/unit verification and platform export checks for the HB Plus authentication workspace.

> No live Firebase/Google OAuth sign-in was executed in this environment. Results below distinguish executed checks from items that remain `NOT TESTED`.

## Executed Checks

| Check | Command | Result |
| --- | --- | --- |
| TypeScript type check | `npm run typecheck` | **PASSED** |
| Domain validation and requirement tests | `npm test` | **PASSED** — 11/11 tests |
| Web static export | `npm run export:web` | **PASSED** — exported `dist/` |
| Android static export | `npx expo export --platform android` | **PASSED** — exported `dist/` |
| Combined verification | `npm run verify` | **PASSED** |

## Domain Restriction Tests

The automated domain tests execute the real `isAllowedEmailDomain` and `assertAllowedEmailDomain` functions from `src/utils/domainValidation.ts`.

| Scenario | Expected | Result |
| --- | --- | --- |
| `member@hbplus.fit` | Accepted | **PASSED** |
| `MEMBER@HBPLUS.FIT` with surrounding whitespace | Accepted after normalization | **PASSED** |
| `member@gmail.com` | Rejected with exact message | **PASSED** |
| `user@evil-hbplus.fit` | Rejected | **PASSED** |
| `user@hbplus.fit.attacker.com` | Rejected | **PASSED** |
| `user@hbplus.fit@evil.com` | Rejected | **PASSED** |
| Malformed email / empty value | Rejected | **PASSED** |

The exact rejected message asserted by the test is:

> Access restricted. Please login using your official domain email.

## Requirement Checks

| Requirement | Result |
| --- | --- |
| App identity is HB Plus in config, package and docs | **PASSED** |
| Exact login heading and subtitle constants | **PASSED** |
| Google button label is `Sign in with Google` | **PASSED** |
| Unauthorized Firebase sign-out and cleared state are implemented | **PASSED** |
| Protected layout redirects unauthenticated users to `/login` | **PASSED** |
| Admin role is not sourced from a client env list | **PASSED** |
| Lowest-privilege fallback profile keeps Firestore optional | **PASSED** |
| Firestore rules require new profiles to start as `role: "user"` | **PASSED** |
| Native Google sign-in has no provider-level domain pre-filter that would hide the exact message | **PASSED** |
| README and testing report are present | **PASSED** |

## Live OAuth Checks

| Scenario | Status | Notes |
| --- | --- | --- |
| Unauthorized personal Gmail via live Google popup | `NOT TESTED` | Requires an interactive Google account in a browser/emulator. The rejection logic is covered by the unit test above. |
| Authorized `@hbplus.fit` Google login | `NOT TESTED` | No official HB Plus account was available. |
| Firebase session persistence after refresh | `NOT TESTED` | Requires a live authenticated session. |
| Protected direct URL while signed in | `NOT TESTED` | Requires a live authenticated session. |
| Logout clears Firebase and provider session | `NOT TESTED` | Requires a live authenticated session. |
| iOS build/simulator | `NOT TESTED` | Windows environment cannot run Xcode. |

## Notes

- The domain restriction was not weakened or modified for testing.
- No mock authentication, fake Firebase user, or bypass route was added.
- Firestore rules mirror the client-side exact-domain check.
- Admin roles are assigned only from trusted Firestore records or Firebase custom claims.
- The Node module-type warning in `npm test` is informational; all tests pass.
