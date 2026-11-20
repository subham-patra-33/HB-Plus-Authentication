import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  signInWithCredential,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '@/config/auth';
import { assertFirebaseConfigured } from '@/config/firebaseApp';
import { assertGoogleClientConfigured } from './configCheck';

let isConfigured = false;

function configureGoogleSignIn(): void {
  if (isConfigured) return;

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    scopes: ['email', 'profile'],
    offlineAccess: true,
    // No provider-level domain pre-filter: the app validates the returned email
    // so every rejected account receives the exact ACCESS_RESTRICTED_MESSAGE.
  });
  isConfigured = true;
}

export async function signInWithGoogle(): Promise<UserCredential> {
  assertFirebaseConfigured();
  assertGoogleClientConfigured();
  configureGoogleSignIn();

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (response.type !== 'success') {
    throw new Error('Sign-in was cancelled. Please try again.');
  }

  const { idToken, accessToken } = await GoogleSignin.getTokens();
  if (!idToken) {
    throw new Error('Google did not return an ID token. Please try again.');
  }

  // Exchange the Google ID token for a Firebase credential. Firebase owns the
  // resulting session tokens; the raw Google token is never persisted here.
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  return signInWithCredential(auth, credential);
}

export async function getRedirectCredential(): Promise<UserCredential | null> {
  return null; // Web-only flow.
}

export async function signOutFromProvider(): Promise<void> {
  try {
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
  } catch {
    // Firebase sign-out is still performed by the caller.
  }
}
