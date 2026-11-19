import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  signInWithCredential,
  type UserCredential,
} from 'firebase/auth';
import { ALLOWED_EMAIL_DOMAIN } from '@/config/app';
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
    // Extra native-layer filter for Google Workspace domains. The JS domain
    // check + Firestore rules still apply as independent layers.
    hostedDomain: ALLOWED_EMAIL_DOMAIN,
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

  // Exchange Google's ID token for a Firebase credential. Firebase then issues
  // and manages its own tokens; no raw Google token is stored by this app.
  const { idToken, accessToken } = await GoogleSignin.getTokens();
  if (!idToken) throw new Error('Google did not return an ID token. Please try again.');

  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  return signInWithCredential(auth, credential);
}

export async function getRedirectCredential(): Promise<UserCredential | null> {
  // Redirect flows are web-only.
  return null;
}

export async function signOutFromProvider(): Promise<void> {
  try {
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
  } catch {
    // The Firebase session is still cleared by the caller.
  }
}
