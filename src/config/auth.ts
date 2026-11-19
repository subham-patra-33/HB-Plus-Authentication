import { getAuth, type Auth } from 'firebase/auth';
import { firebaseApp } from './firebaseApp';

/**
 * TypeScript resolves this file; Metro resolves `auth.web.ts` in browsers and
 * `auth.native.ts` on iOS/Android. Keep the public API of all three identical.
 */
export const auth: Auth = getAuth(firebaseApp);
