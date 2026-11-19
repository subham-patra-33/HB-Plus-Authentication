import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);

/** Fail early with a helpful message instead of an obscure Firebase error. */
export function assertFirebaseConfigured(): void {
  const missing = (Object.keys(firebaseConfig) as Array<keyof typeof firebaseConfig>).filter(
    (key) => !firebaseConfig[key],
  );

  if (missing.length > 0) {
    throw new Error(
      `Firebase is not configured. Add ${missing
        .map((key) => `EXPO_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`)
        .join(', ')} to your .env file and restart Expo with --clear-cache.`,
    );
  }
}
