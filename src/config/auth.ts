import { getAuth, type Auth } from 'firebase/auth';
import { firebaseApp, isFirebaseConfigured, getFirebaseConfigErrorMessage } from './firebaseApp';

/**
 * TypeScript resolves this file; Metro resolves `auth.web.ts` in browsers and
 * `auth.native.ts` on iOS/Android. Keep the public API of all three identical.
 */
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
  return getAuth(firebaseApp);
}

export const auth: Auth = createAuth();

