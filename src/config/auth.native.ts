import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { firebaseApp, isFirebaseConfigured, getFirebaseConfigErrorMessage } from './firebaseApp';

function createAuth(): Auth {
  if (!isFirebaseConfigured) {
    const errorMsg = getFirebaseConfigErrorMessage();
    console.error(`[Firebase Configuration Error] ${errorMsg}`);
    try {
      return getAuth(firebaseApp);
    } catch {
      return new Proxy({} as Auth, {
        get(_, prop) {
          if (prop === 'name') return '[DEFAULT]';
          if (prop === 'config') return {};
          return () => {
            throw new Error(errorMsg);
          };
        },
      });
    }
  }

  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth throws on hot reloads when Auth was already initialized
    // for this app instance. Reuse the existing instance in that case.
    return getAuth(firebaseApp);
  }
}

// Refresh tokens are persisted securely by Firebase through AsyncStorage.
export const auth: Auth = createAuth();

