import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '@/config/auth';
import { assertFirebaseConfigured } from '@/config/firebaseApp';
import { assertGoogleClientConfigured } from './configCheck';

function createProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

function requiresRedirect(error: unknown): boolean {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String((error as { code?: string }).code ?? '')
      : '';
  return (
    code === 'auth/popup-blocked' ||
    code === 'auth/operation-not-supported-in-this-environment'
  );
}

/**
 * Returns a credential for the popup flow, or `null` when the browser must
 * navigate away for a redirect flow (the result is picked up on remount).
 */
export async function signInWithGoogle(): Promise<UserCredential | null> {
  assertFirebaseConfigured();
  assertGoogleClientConfigured();

  try {
    return await signInWithPopup(auth, createProvider());
  } catch (error) {
    if (!requiresRedirect(error)) throw error;
    await signInWithRedirect(auth, createProvider());
    return null;
  }
}

/** Called once on app start to finish a redirect-based sign-in. */
export async function getRedirectCredential(): Promise<UserCredential | null> {
  return getRedirectResult(auth);
}

/** Firebase sign-out is enough on web; there is no separate Google session. */
export async function signOutFromProvider(): Promise<void> {
  return undefined;
}
