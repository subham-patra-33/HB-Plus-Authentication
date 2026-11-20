import { getAuth, type Auth } from 'firebase/auth';
import { firebaseApp, isFirebaseConfigured, getFirebaseConfigErrorMessage } from './firebaseApp';

// On the web, Firebase Auth persists the session in IndexedDB by default
// (falls back to localStorage). No tokens are stored in our own code.
function createWebAuth(): Auth {
  if (!isFirebaseConfigured) {
    const errorMsg = getFirebaseConfigErrorMessage();
    console.error(`[Firebase Configuration Error] ${errorMsg}`);
    // If config is missing, return a dummy/fallback Auth proxy or attempt getAuth inside try-catch
    // to avoid unhandled crash during import evaluation, surfacing meaningful error in UI.
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
  return getAuth(firebaseApp);
}

export const auth: Auth = createWebAuth();

