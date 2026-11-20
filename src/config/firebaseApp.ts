import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: (process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '').trim(),
  authDomain: (process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '').trim(),
  projectId: (process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '').trim(),
  storageBucket: (process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '').trim(),
  messagingSenderId: (process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '').trim(),
  appId: (process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '').trim(),
};

export const missingFirebaseConfigKeys: Array<keyof typeof firebaseConfig> = (
  Object.keys(firebaseConfig) as Array<keyof typeof firebaseConfig>
).filter((key) => !firebaseConfig[key]);

export const isFirebaseConfigured = missingFirebaseConfigKeys.length === 0;

export function getFirebaseConfigErrorMessage(): string {
  const missingEnvVars = missingFirebaseConfigKeys.map(
    (key) => `EXPO_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`,
  );
  return `Firebase configuration is incomplete. Missing or empty: ${missingEnvVars.join(', ')}. Please update your .env file and restart Expo with --clear.`;
}

function initFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const firebaseApp: FirebaseApp = initFirebaseApp();

export const firestore: Firestore = getFirestore(firebaseApp);

/** Fail early with a helpful message instead of an obscure Firebase error. */
export function assertFirebaseConfigured(): void {
  if (!isFirebaseConfigured) {
    throw new Error(getFirebaseConfigErrorMessage());
  }
}

