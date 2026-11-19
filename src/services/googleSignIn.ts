import type { UserCredential } from 'firebase/auth';

/**
 * TS entry point. Metro picks `googleSignIn.web.ts` on the browser and
 * `googleSignIn.native.ts` on iOS/Android.
 */
export async function signInWithGoogle(): Promise<UserCredential | null> {
  throw new Error('Google sign-in is unavailable on this platform.');
}

export async function getRedirectCredential(): Promise<UserCredential | null> {
  return null;
}

export async function signOutFromProvider(): Promise<void> {
  return undefined;
}
