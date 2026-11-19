import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { firebaseApp } from './firebaseApp';

function createAuth(): Auth {
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
